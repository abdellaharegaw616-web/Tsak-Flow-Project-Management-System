import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus,
  Folder,
  Download,
  Share,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Upload,
  Grid,
  List,
  Star,
  Clock,
  Image,
  Archive,
  User
} from 'lucide-react';
import ThreeDotMenu from '../../components/common/ThreeDotMenu';
import toast from 'react-hot-toast';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid'); // grid, list
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, date, size
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { api } = useAuth();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      // Documents will be fetched from real API endpoints
      // For now, initialize with empty arrays
      setDocuments([]);
      setFolders([]);
    } catch (error) {
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getFileIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (['pdf', 'txt'].includes(t)) return <FileText className="h-8 w-8 text-primary-600" />;
    if (['doc', 'docx'].includes(t)) return <FileText className="h-8 w-8 text-primary-600" />;
    if (['xls', 'xlsx'].includes(t)) return <FileText className="h-8 w-8 text-emerald-600" />;
    if (['ppt', 'pptx'].includes(t)) return <FileText className="h-8 w-8 text-amber-600" />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(t)) return <Image className="h-8 w-8 text-indigo-500" />;
    if (['zip', 'rar'].includes(t)) return <Archive className="h-8 w-8 text-gray-500" />;
    return <FileText className="h-8 w-8 text-gray-400" />;
  };

  const handleUpload = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;
    
    const file = files[0];
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);
      
      // Simulate upload completion
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        const newDoc = {
          _id: documents.length + 1,
          name: file.name,
          type: file.name.split('.').pop() || 'file',
          size: file.size,
          updatedAt: new Date().toISOString(),
          updatedBy: { name: 'Abushe', email: 'abushe@25gmail.com' }
        };
        
        setDocuments([newDoc, ...documents]);
        toast.success(`${file.name} uploaded successfully!`);
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      toast.error('Upload failed');
      setUploadProgress(0);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      case 'size':
        return b.size - a.size;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1">Documents</h1>
          <p className="text-gray-600 mt-1">Manage and share your team documents</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-md transition-colors ${
                view === 'grid' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md transition-colors ${
                view === 'list' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button className="btn-primary inline-flex items-center gap-2 relative">
            <input
              type="file"
              multiple
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Plus className="h-4 w-4" />
            Upload
            {uploadProgress > 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                  </div>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input w-auto"
        >
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
          <option value="size">Sort by Size</option>
        </select>
        <button className="btn-outline inline-flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Folders */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {folders.map((folder) => (
          <div key={folder._id} className="card p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center mb-3">
                <Folder className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center">{folder.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{folder.count} files</p>
            </div>
          </div>
        ))}
      </div>

      {/* Documents Grid/List */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sortedDocuments.map((doc) => (
            <div key={doc._id} className="card p-4 group">
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-3">{getFileIcon(doc.type)}</div>
                <h3 className="text-sm font-medium text-gray-900 text-center truncate w-full">{doc.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{formatFileSize(doc.size)}</p>
                <p className="text-xs text-gray-400">{formatDate(doc.updatedAt)}</p>
              </div>
              
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ThreeDotMenu items={[
                  { label: 'View', onClick: () => toast('Open document') },
                  { label: 'Download', onClick: () => toast('Download started') },
                  { label: 'Delete', onClick: () => { if (confirm('Delete this document?')) { setDocuments(prev => prev.filter(d => d._id !== doc._id)); toast('Document deleted'); } } }
                ]} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedDocuments.map((doc) => (
            <div key={doc._id} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">{getFileIcon(doc.type)}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>{formatDate(doc.updatedAt)}</span>
                      <span>by {doc.updatedBy?.name || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded hover:bg-gray-100">
                    <Eye className="h-4 w-4 text-gray-500" />
                  </button>
                  <button className="p-2 rounded hover:bg-gray-100">
                    <Download className="h-4 w-4 text-gray-500" />
                  </button>
                  <button className="p-2 rounded hover:bg-gray-100">
                    <Share className="h-4 w-4 text-gray-500" />
                  </button>
                  <ThreeDotMenu items={[
                    { label: 'View', onClick: () => toast('Open document') },
                    { label: 'Download', onClick: () => toast('Download started') },
                    { label: 'Rename', onClick: () => toast('Rename not implemented') },
                    { label: 'Delete', onClick: () => { if (confirm('Delete this document?')) { setDocuments(prev => prev.filter(d => d._id !== doc._id)); toast('Document deleted'); } } }
                  ]} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedDocuments.length === 0 && folders.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No documents yet</h3>
          <p className="text-gray-500 mt-1">Upload your first document to get started</p>
        </div>
      )}
    </div>
  );
}

