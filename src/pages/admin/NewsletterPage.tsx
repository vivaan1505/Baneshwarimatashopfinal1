import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, Users, Filter, Search, Trash, Edit, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  subscribed_at: string;
  status: 'active' | 'unsubscribed';
  user_id: string | null;
  tags: string[];
}

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  sent_at: string | null;
  status: 'draft' | 'sent' | 'scheduled';
  scheduled_for: string | null;
  recipient_count: number;
  open_count: number;
  click_count: number;
  created_at: string;
  updated_at: string;
}

interface Template {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

const NewsletterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns' | 'templates'>('subscribers');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [newsletterContent, setNewsletterContent] = useState('');
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (activeTab === 'subscribers') {
      fetchSubscribers();
    } else if (activeTab === 'campaigns') {
      fetchNewsletters();
    } else if (activeTab === 'templates') {
      fetchTemplates();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        setNewsletterContent(template.content);
      }
    }
  }, [selectedTemplate, templates]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsletters(data || []);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      toast.error('Failed to load newsletters');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('newsletter_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Subscriber deleted successfully');
      fetchSubscribers();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Failed to delete subscriber');
    }
  };

  const handleSaveNewsletter = async () => {
    if (!newsletterSubject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    if (!newsletterContent.trim()) {
      toast.error('Please enter content');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('newsletters')
        .insert([{
          subject: newsletterSubject,
          content: newsletterContent,
          status: 'draft',
          recipient_count: 0,
          open_count: 0,
          click_count: 0
        }])
        .select()
        .single();

      if (error) throw error;
      toast.success('Newsletter saved as draft');
      setNewsletterSubject('');
      setNewsletterContent('');
      setSelectedTemplate('');
      fetchNewsletters();
      setActiveTab('campaigns');
    } catch (error) {
      console.error('Error saving newsletter:', error);
      toast.error('Failed to save newsletter');
    }
  };

  const handleSendNewsletter = async (id: string) => {
    if (!confirm('Are you sure you want to send this newsletter to all active subscribers?')) return;

    try {
      // Get count of active subscribers
      const { count, error: countError } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (countError) throw countError;

      // Update newsletter status and recipient count
      const { error } = await supabase
        .from('newsletters')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          recipient_count: count || 0
        })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Newsletter sent to ${count} subscribers`);
      fetchNewsletters();
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast.error('Failed to send newsletter');
    }
  };

  const handleSaveTemplate = async () => {
    const name = prompt('Enter a name for this template:');
    if (!name) return;

    if (!newsletterContent.trim()) {
      toast.error('Please enter content');
      return;
    }

    try {
      const { error } = await supabase
        .from('newsletter_templates')
        .insert([{
          name,
          content: newsletterContent
        }]);

      if (error) throw error;
      toast.success('Template saved successfully');
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('newsletter_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Template deleted successfully');
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const handleViewNewsletter = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter);
    setPreviewMode(true);
  };

  const handleDeleteNewsletter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this newsletter?')) return;

    try {
      const { error } = await supabase
        .from('newsletters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Newsletter deleted successfully');
      fetchNewsletters();
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      toast.error('Failed to delete newsletter');
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = 
      subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (subscriber.first_name && subscriber.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (subscriber.last_name && subscriber.last_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Newsletter Management</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'subscribers'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="inline-block w-5 h-5 mr-2" />
              Subscribers
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'campaigns'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Send className="inline-block w-5 h-5 mr-2" />
              Campaigns
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'templates'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Edit className="inline-block w-5 h-5 mr-2" />
              Templates
            </button>
          </nav>
        </div>
      </div>

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div>
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[240px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search subscribers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed On
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
                    </tr>
                  ) : filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">No subscribers found</td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {subscriber.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subscriber.first_name && subscriber.last_name
                            ? `${subscriber.first_name} ${subscriber.last_name}`
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            subscriber.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {subscriber.tags && subscriber.tags.length > 0 ? (
                              subscriber.tags.map((tag, index) => (
                                <span 
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400">No tags</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(subscriber.subscribed_at), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteSubscriber(subscriber.id)}
                            className="text-gray-600 hover:text-red-600"
                            title="Delete subscriber"
                          >
                            <Trash size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div>
          {previewMode && selectedNewsletter ? (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">{selectedNewsletter.subject}</h2>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="border p-4 rounded-md bg-gray-50">
                <div dangerouslySetInnerHTML={{ __html: selectedNewsletter.content }} />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                {selectedNewsletter.status === 'sent' ? (
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <p>Sent on: {format(new Date(selectedNewsletter.sent_at!), 'MMM d, yyyy')}</p>
                    <div className="flex gap-4 mt-2 sm:mt-0">
                      <p>Recipients: {selectedNewsletter.recipient_count}</p>
                      <p>Opens: {selectedNewsletter.open_count}</p>
                      <p>Clicks: {selectedNewsletter.click_count}</p>
                    </div>
                  </div>
                ) : (
                  <p>Status: {selectedNewsletter.status.charAt(0).toUpperCase() + selectedNewsletter.status.slice(1)}</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium mb-4">Create New Campaign</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={newsletterSubject}
                      onChange={(e) => setNewsletterSubject(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Enter newsletter subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template
                    </label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Select a template (optional)</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>{template.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={newsletterContent}
                      onChange={setNewsletterContent}
                      className="h-64 mb-12"
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          [{ 'indent': '-1'}, { 'indent': '+1' }],
                          ['link', 'image'],
                          [{ 'color': [] }, { 'background': [] }],
                          ['clean']
                        ],
                      }}
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handleSaveTemplate}
                      className="btn-outline"
                    >
                      Save as Template
                    </button>
                    <button
                      onClick={handleSaveNewsletter}
                      className="btn-primary"
                    >
                      Save as Draft
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-medium">All Campaigns</h2>
                </div>
                {loading ? (
                  <div className="p-6 text-center">Loading...</div>
                ) : newsletters.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No newsletters found. Create your first campaign.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stats
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {newsletters.map((newsletter) => (
                          <tr key={newsletter.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{newsletter.subject}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                newsletter.status === 'sent' ? 'bg-green-100 text-green-800' :
                                newsletter.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {newsletter.status.charAt(0).toUpperCase() + newsletter.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {newsletter.sent_at 
                                ? format(new Date(newsletter.sent_at), 'MMM d, yyyy')
                                : format(new Date(newsletter.created_at), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {newsletter.status === 'sent' ? (
                                <div>
                                  <span className="mr-2">Recipients: {newsletter.recipient_count}</span>
                                  <span className="mr-2">Opens: {newsletter.open_count}</span>
                                  <span>Clicks: {newsletter.click_count}</span>
                                </div>
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleViewNewsletter(newsletter)}
                                  className="text-gray-600 hover:text-primary-600"
                                  title="View newsletter"
                                >
                                  <Eye size={18} />
                                </button>
                                {newsletter.status === 'draft' && (
                                  <button
                                    onClick={() => handleSendNewsletter(newsletter.id)}
                                    className="text-gray-600 hover:text-primary-600"
                                    title="Send newsletter"
                                  >
                                    <Send size={18} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteNewsletter(newsletter.id)}
                                  className="text-gray-600 hover:text-red-600"
                                  title="Delete newsletter"
                                >
                                  <Trash size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">Loading...</div>
          ) : templates.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
              <Edit className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No templates</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create templates to reuse in your newsletters
              </p>
            </div>
          ) : (
            templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{template.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setNewsletterContent(template.content);
                          setActiveTab('campaigns');
                        }}
                        className="text-gray-600 hover:text-primary-600"
                        title="Use template"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-gray-600 hover:text-red-600"
                        title="Delete template"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4 max-h-64 overflow-auto">
                  <div dangerouslySetInnerHTML={{ __html: template.content }} />
                </div>
                <div className="p-4 border-t text-xs text-gray-500">
                  Created: {format(new Date(template.created_at), 'MMM d, yyyy')}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NewsletterPage;