import React from 'react';
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone,
  ExternalLink,
  Search,
  FileText,
  Video,
  Users
} from 'lucide-react';

export default function Help() {
  const faqItems = [
    {
      question: 'How do I create a new project?',
      answer: 'Navigate to the Projects page and click the "New Project" button. Fill in the project details and click "Create Project".'
    },
    {
      question: 'How do I invite team members?',
      answer: 'Go to the Team page and click "Invite Members". Enter their email address and role, then send the invitation.'
    },
    {
      question: 'How do I track time on tasks?',
      answer: 'Navigate to the Time Tracking section and use the manual entry option or start a timer for your current task.'
    },
    {
      question: 'How do I generate reports?',
      answer: 'Go to the Reports page and select the type of report you want to generate. You can export reports in various formats.'
    },
    {
      question: 'How do I customize my dashboard?',
      answer: 'Go to Settings and navigate to Dashboard preferences. You can customize widgets, layout, and data display options.'
    }
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: 'Start Chat',
      available: '24/7'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      action: 'Send Email',
      available: 'Business hours'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      action: 'Call Now',
      available: 'Mon-Fri 9am-5pm'
    }
  ];

  const resources = [
    {
      icon: Book,
      title: 'Documentation',
      description: 'Comprehensive guides and tutorials',
      link: '#'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      link: '#'
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with other users',
      link: '#'
    },
    {
      icon: FileText,
      title: 'API Documentation',
      description: 'Developer resources and API reference',
      link: '#'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1">Help & Support</h1>
          <p className="text-gray-600 mt-1">Find answers and get help when you need it</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search help articles..."
            className="input pl-9 w-full sm:w-80"
          />
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Book className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
          <p className="text-sm text-gray-600">Learn the basics and get up and running quickly</p>
        </div>

        <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Video className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
          <p className="text-sm text-gray-600">Watch step-by-step guides for common tasks</p>
        </div>

        <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
          <p className="text-sm text-gray-600">Detailed documentation for all features</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="h-6 w-6 text-brand-600" />
          <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
              <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
              <p className="text-sm text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Channels */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="h-6 w-6 text-brand-600" />
          <h2 className="text-lg font-semibold text-gray-900">Contact Support</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportChannels.map((channel, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-brand-300 transition-colors">
              <channel.icon className="h-8 w-8 text-brand-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{channel.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{channel.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{channel.available}</span>
                <button className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                  {channel.action}
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Book className="h-6 w-6 text-brand-600" />
          <h2 className="text-lg font-semibold text-gray-900">Additional Resources</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <resource.icon className="h-5 w-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-900 text-sm">{resource.title}</h3>
                <p className="text-xs text-gray-500">{resource.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="h-6 w-6 text-brand-600" />
          <h2 className="text-lg font-semibold text-gray-900">Send us a message</h2>
        </div>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" className="input" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="input" placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input type="text" className="input" placeholder="How can we help?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea rows={4} className="input resize-none" placeholder="Describe your issue or question..." />
          </div>
          <button type="submit" className="btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
