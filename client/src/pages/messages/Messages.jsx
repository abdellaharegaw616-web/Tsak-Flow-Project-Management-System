import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Send, 
  Search, 
  Users, 
  MessageCircle,
  Check,
  CheckCheck,
  Paperclip,
} from 'lucide-react';
import ThreeDotMenu from '../../components/common/ThreeDotMenu';
import toast from 'react-hot-toast';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const { api, user } = useAuth();

  useEffect(() => {
    if (user) fetchTeamMembers();
    fetchConversations();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const fetchTeamMembers = async () => {
    try {
      const { data } = await api.get('/team/members');
      setTeamMembers(data.filter(m => m._id !== user._id));
    } catch (error) {
      console.error('Failed to fetch team members');
    }
  };

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/messages/conversations');
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const { data } = await api.get(`/messages/${conversationId}`);
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages');
      setMessages([]);
    }
  };

  const [attachments, setAttachments] = useState([]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && attachments.length === 0) || !selectedConversation) return;

    const tempMessage = {
      _id: Date.now(),
      sender: { _id: user._id, name: user.name },
      text: newMessage,
      createdAt: new Date(),
      read: false,
      attachments: attachments.map(f => ({ filename: f.name, url: URL.createObjectURL(f) }))
    };

    setMessages([...messages, tempMessage]);
    setNewMessage('');
    setAttachments([]);

    try {
      const form = new FormData();
      form.append('text', newMessage);
      attachments.forEach((f) => form.append('files', f));
      await api.post(`/messages/${selectedConversation._id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch (error) {
      console.error('Failed to send message', error);
      toast.error('Failed to send message');
    }
  };

  const startNewConversation = (member) => {
    const newConv = {
      _id: member._id,
      participant: member,
      lastMessage: '',
      lastMessageTime: new Date(),
      unread: 0
    };
    setSelectedConversation(newConv);
    setMessages([]);
  };

  const formatTime = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? ''
      : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)]">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-9 text-sm"
              />
            </div>
          </div>

          {/* Start New Chat */}
          {searchTerm && filteredMembers.length > 0 && (
            <div className="p-3 border-b border-gray-200">
              <p className="text-xs text-gray-500 mb-2">START NEW CHAT</p>
              <div className="space-y-2">
                {filteredMembers.map(member => (
                  <button
                    key={member._id}
                    onClick={() => startNewConversation(member)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 w-full text-left"
                  >
                    <div className="avatar bg-brand-100 text-brand-600 dark:bg-brand-600 dark:text-white">
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => {
                  setSelectedConversation(conv);
                  fetchMessages(conv._id);
                }}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedConversation?._id === conv._id ? 'bg-brand-50' : ''
                }`}
              >
                  <div className="relative">
                  <div className="avatar bg-brand-600 text-white">
                    {getInitials(conv.participant.name)}
                  </div>
                  {conv.participant.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {conv.participant.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(conv.lastMessageTime)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="bg-brand-600 text-white text-xs rounded-full px-2 py-0.5">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}

            {filteredConversations.length === 0 && !searchTerm && (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No conversations yet</p>
                <p className="text-sm text-gray-400 mt-1">Start a new chat with a team member</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="avatar bg-brand-600 text-white">
                    {getInitials(selectedConversation.participant.name)}
                  </div>
                  {selectedConversation.participant.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedConversation.participant.name}</h3>
                  <p className="text-xs text-gray-500 capitalize">
                    {selectedConversation.participant.online ? 'Online' : 'Offline'} â€¢ {selectedConversation.participant.role}
                  </p>
                </div>
              </div>
              <ThreeDotMenu
                items={[
                  { label: 'Mute notifications', onClick: () => toast('Muted conversation') },
                  { label: 'Archive', onClick: () => toast('Conversation archived') },
                  { label: 'Delete', onClick: () => toast('Conversation deleted') }
                ]}
              />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${msg.sender._id === user._id ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        msg.sender._id === user._id
                          ? 'bg-brand-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {msg.sender._id === user._id && (
                        msg.read ? (
                          <CheckCheck className="h-3 w-3 text-brand-500" />
                        ) : (
                          <Check className="h-3 w-3 text-gray-400" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <label className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <Paperclip className="h-5 w-5 text-gray-500" />
                    <input type="file" multiple onChange={(e) => setAttachments([...attachments, ...Array.from(e.target.files)])} className="hidden" />
                  </label>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="input flex-1"
                  />
                  <button type="submit" className="btn-primary px-4">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                {attachments.length > 0 && (
                  <div className="p-2 flex gap-2">
                    {attachments.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="M21.44 11.05L12.37 20.12a5 5 0 01-7.07 0 5 5 0 010-7.07L13.05 5.4a3.5 3.5 0 014.95 0 3.5 3.5 0 010 4.95L11 17.36a2 2 0 01-2.83 0 2 2 0 010-2.83l7.07-7.07" />
                        </svg>
                        <span className="text-sm text-gray-700">{f.name}</span>
                      </div>
                    ))}
                  </div>
                )}
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No conversation selected</h3>
              <p className="text-gray-500 mt-1">Choose a conversation or start a new chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

