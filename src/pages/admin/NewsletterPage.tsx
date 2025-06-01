import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, Users, Filter, Search, Trash, Edit, Eye, Download, Upload, Plus, Check, X, Mail, Calendar, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Papa from 'papaparse';

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
  const [tagFilter, setTagFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [newsletterContent, setNewsletterContent] = useState('');
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [isAddingSubscriber, setIsAddingSubscriber] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({
    email: '',
    first_name: '',
    last_name: '',
    tags: [] as string[]
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: ''
  });
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  useEffect(() => {
    if (activeTab === 'subscribers') {
      fetchSubscribers();
      fetchAvailableTags();
    } else if (activeTab === 'campaigns') {
      fetchNewsletters();
      fetchTemplates();
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

  const fetchAvailableTags = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('tags');

      if (error) throw error;
      
      // Extract all tags from all subscribers
      const allTags = data?.flatMap(subscriber => subscriber.tags || []) || [];
      
      // Remove duplicates
      const uniqueTags = [...new Set(allTags)];
      
      setAvailableTags(uniqueTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
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

  const handleDeleteSelected = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedSubscribers.length} subscribers?`)) return;

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .in('id', selectedSubscribers);

      if (error) throw error;
      toast.success(`${selectedSubscribers.length} subscribers deleted successfully`);
      setSelectedSubscribers([]);
      fetchSubscribers();
    } catch (error) {
      console.error('Error deleting subscribers:', error);
      toast.error('Failed to delete subscribers');
    }
  };

  const handleToggleSubscriberStatus = async (id: string, currentStatus: 'active' | 'unsubscribed') => {
    try {
      const newStatus = currentStatus === 'active' ? 'unsubscribed' : 'active';
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Subscriber ${newStatus === 'active' ? 'activated' : 'unsubscribed'}`);
      fetchSubscribers();
    } catch (error) {
      console.error('Error updating subscriber status:', error);
      toast.error('Failed to update subscriber status');
    }
  };

  const handleAddSubscriber = async () => {
    if (!newSubscriber.email) {
      toast.error('Email is required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newSubscriber.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      // Check if subscriber already exists
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', newSubscriber.email)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingSubscriber) {
        toast.error('This email is already subscribed');
        return;
      }

      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{
          email: newSubscriber.email,
          first_name: newSubscriber.first_name || null,
          last_name: newSubscriber.last_name || null,
          tags: newSubscriber.tags,
          status: 'active',
          subscribed_at: new Date().toISOString()
        }]);

      if (error) throw error;
      toast.success('Subscriber added successfully');
      setIsAddingSubscriber(false);
      setNewSubscriber({
        email: '',
        first_name: '',
        last_name: '',
        tags: []
      });
      fetchSubscribers();
    } catch (error) {
      console.error('Error adding subscriber:', error);
      toast.error('Failed to add subscriber');
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

  const handleScheduleNewsletter = async (id: string) => {
    if (!scheduledDate || !scheduledTime) {
      toast.error('Please select both date and time');
      return;
    }

    try {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      
      // Check if the scheduled time is in the future
      if (scheduledDateTime <= new Date()) {
        toast.error('Please select a future date and time');
        return;
      }

      const { error } = await supabase
        .from('newsletters')
        .update({
          status: 'scheduled',
          scheduled_for: scheduledDateTime.toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('Newsletter scheduled successfully');
      setIsScheduling(false);
      setScheduledDate('');
      setScheduledTime('');
      fetchNewsletters();
    } catch (error) {
      console.error('Error scheduling newsletter:', error);
      toast.error('Failed to schedule newsletter');
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
    if (!newTemplate.name.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    if (!newTemplate.content.trim()) {
      toast.error('Please enter template content');
      return;
    }

    try {
      const { error } = await supabase
        .from('newsletter_templates')
        .insert([{
          name: newTemplate.name,
          content: newTemplate.content
        }]);

      if (error) throw error;
      toast.success('Template saved successfully');
      setIsAddingTemplate(false);
      setNewTemplate({
        name: '',
        content: ''
      });
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

  const handleExportSubscribers = () => {
    // Filter subscribers based on current filters
    const filteredSubscribers = subscribers.filter(subscriber => {
      const matchesSearch = searchQuery === '' || 
        subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (subscriber.first_name && subscriber.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (subscriber.last_name && subscriber.last_name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter;
      
      const matchesTag = tagFilter === 'all' || 
        (subscriber.tags && subscriber.tags.includes(tagFilter));
      
      return matchesSearch && matchesStatus && matchesTag;
    });

    // Convert to CSV
    const csv = Papa.unparse({
      fields: ['email', 'first_name', 'last_name', 'status', 'tags', 'subscribed_at'],
      data: filteredSubscribers.map(s => [
        s.email,
        s.first_name || '',
        s.last_name || '',
        s.status,
        (s.tags || []).join(', '),
        new Date(s.subscribed_at).toISOString().split('T')[0]
      ])
    });
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${filteredSubscribers.length} subscribers`);
  };

  const handleImportSubscribers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (file.type !== 'text/csv' && !file.type.includes('excel')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvData = e.target?.result;
      if (typeof csvData !== 'string') return;

      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const subscribers = results.data.map((row: any) => ({
              email: row.email,
              first_name: row.first_name || null,
              last_name: row.last_name || null,
              status: row.status === 'unsubscribed' ? 'unsubscribed' : 'active',
              tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
              subscribed_at: new Date().toISOString()
            }));

            // Validate emails
            const invalidEmails = subscribers.filter(s => !s.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email));
            if (invalidEmails.length > 0) {
              toast.error(`Found ${invalidEmails.length} invalid email addresses`);
              return;
            }

            // Insert subscribers
            const { error } = await supabase
              .from('newsletter_subscribers')
              .upsert(subscribers, {
                onConflict: 'email',
                ignoreDuplicates: false
              });

            if (error) throw error;
            toast.success(`Imported ${subscribers.length} subscribers`);
            fetchSubscribers();
            fetchAvailableTags();
          } catch (error) {
            console.error('Error importing subscribers:', error);
            toast.error('Failed to import subscribers');
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast.error('Failed to parse CSV file');
        }
      });
    };
    reader.readAsText(file);
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = searchQuery === '' || 
      subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (subscriber.first_name && subscriber.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (subscriber.last_name && subscriber.last_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter;
    
    const matchesTag = tagFilter === 'all' || 
      (subscriber.tags && subscriber.tags.includes(tagFilter));
    
    return matchesSearch && matchesStatus && matchesTag;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Newsletter Management</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6 dark:bg-gray-800">
        <div className="border-b dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'subscribers'
                  ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Users className="inline-block w-5 h-5 mr-2" />
                Subscribers
              </div>
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'campaigns'
                  ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Send className="inline-block w-5 h-5 mr-2" />
                Campaigns
              </div>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'templates'
                  ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Edit className="inline-block w-5 h-5 mr-2" />
                Templates
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div>
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 dark:bg-gray-800">
            <div className="flex flex-wrap gap-4 justify-between">
              <div className="flex-1 min-w-[240px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search subscribers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
                
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Tags</option>
                  {availableTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleExportSubscribers}
                  className="btn-outline flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                
                <label className="btn-outline flex items-center cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleImportSubscribers}
                  />
                </label>
                
                <button
                  onClick={() => setIsAddingSubscriber(true)}
                  className="btn-primary flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subscriber
                </button>
              </div>
            </div>
          </div>

          {/* Add Subscriber Form */}
          {isAddingSubscriber && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium dark:text-white">Add New Subscriber</h2>
                <button
                  onClick={() => setIsAddingSubscriber(false)}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newSubscriber.email}
                    onChange={(e) => setNewSubscriber({...newSubscriber, email: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={newSubscriber.first_name}
                    onChange={(e) => setNewSubscriber({...newSubscriber, first_name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={newSubscriber.last_name}
                    onChange={(e) => setNewSubscriber({...newSubscriber, last_name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {['VIP', 'New Customer', 'Promotion', 'Product Updates', 'Blog', ...availableTags].filter((v, i, a) => a.indexOf(v) === i).map(tag => (
                    <label key={tag} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={newSubscriber.tags.includes(tag)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewSubscriber({...newSubscriber, tags: [...newSubscriber.tags, tag]});
                          } else {
                            setNewSubscriber({...newSubscriber, tags: newSubscriber.tags.filter(t => t !== tag)});
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAddSubscriber}
                  className="btn-primary"
                >
                  Add Subscriber
                </button>
              </div>
            </div>
          )}

          {/* Subscribers Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
            <div className="p-6 border-b flex justify-between items-center dark:border-gray-700">
              <h2 className="text-lg font-medium dark:text-white">All Subscribers</h2>
              <div className="flex items-center">
                <Users className="text-primary-600 mr-2 dark:text-primary-400" />
                <span className="text-sm font-medium dark:text-gray-300">{filteredSubscribers.length} Subscribers</span>
              </div>
            </div>
            
            {selectedSubscribers.length > 0 && (
              <div className="bg-gray-50 p-4 flex justify-between items-center dark:bg-gray-700">
                <span className="text-sm font-medium dark:text-white">
                  {selectedSubscribers.length} subscribers selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteSelected}
                    className="btn bg-red-600 text-white hover:bg-red-700 text-sm py-1 px-3 flex items-center dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    Delete Selected
                  </button>
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={filteredSubscribers.length > 0 && selectedSubscribers.length === filteredSubscribers.length}
                        onChange={() => {
                          if (selectedSubscribers.length === filteredSubscribers.length) {
                            setSelectedSubscribers([]);
                          } else {
                            setSelectedSubscribers(filteredSubscribers.map(s => s.id));
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-600"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Subscribed On
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center dark:text-gray-300">Loading...</td>
                    </tr>
                  ) : filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center dark:text-gray-300">No subscribers found</td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedSubscribers.includes(subscriber.id)}
                            onChange={() => {
                              if (selectedSubscribers.includes(subscriber.id)) {
                                setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriber.id));
                              } else {
                                setSelectedSubscribers([...selectedSubscribers, subscriber.id]);
                              }
                            }}
                            className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-600"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {subscriber.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {subscriber.first_name && subscriber.last_name
                            ? `${subscriber.first_name} ${subscriber.last_name}`
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            subscriber.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
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
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                >
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">No tags</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {format(new Date(subscriber.subscribed_at), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleToggleSubscriberStatus(subscriber.id, subscriber.status)}
                              className={`text-sm px-2 py-1 rounded ${
                                subscriber.status === 'active' 
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                              }`}
                            >
                              {subscriber.status === 'active' ? 'Unsubscribe' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteSubscriber(subscriber.id)}
                              className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                              title="Delete subscriber"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
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
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium dark:text-white">{selectedNewsletter.subject}</h2>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="border p-4 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <div dangerouslySetInnerHTML={{ __html: selectedNewsletter.content }} />
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {selectedNewsletter.status === 'sent' ? (
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <p>Sent on: {format(new Date(selectedNewsletter.sent_at!), 'MMM d, yyyy')}</p>
                    <div className="flex gap-4 mt-2 sm:mt-0">
                      <p>Recipients: {selectedNewsletter.recipient_count}</p>
                      <p>Opens: {selectedNewsletter.open_count}</p>
                      <p>Clicks: {selectedNewsletter.click_count}</p>
                    </div>
                  </div>
                ) : selectedNewsletter.status === 'scheduled' ? (
                  <p>Scheduled for: {format(new Date(selectedNewsletter.scheduled_for!), 'MMM d, yyyy h:mm a')}</p>
                ) : (
                  <p>Status: Draft</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6 dark:bg-gray-800">
                <h2 className="text-lg font-medium mb-4 dark:text-white">Create New Campaign</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={newsletterSubject}
                      onChange={(e) => setNewsletterSubject(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Enter newsletter subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Template
                    </label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Select a template (optional)</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>{template.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Content
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={newsletterContent}
                      onChange={setNewsletterContent}
                      className="h-64 mb-12 bg-white dark:bg-gray-700 dark:text-white"
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
                      onClick={() => {
                        if (newsletterContent) {
                          const name = prompt('Enter a name for this template:');
                          if (name) {
                            setNewTemplate({
                              name,
                              content: newsletterContent
                            });
                            setIsAddingTemplate(true);
                          }
                        } else {
                          toast.error('Please add content before saving as template');
                        }
                      }}
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

              <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
                <div className="p-6 border-b dark:border-gray-700">
                  <h2 className="text-lg font-medium dark:text-white">All Campaigns</h2>
                </div>
                {loading ? (
                  <div className="p-6 text-center dark:text-gray-300">Loading...</div>
                ) : newsletters.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No newsletters found. Create your first campaign.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            Subject
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            Stats
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {newsletters.map((newsletter) => (
                          <tr key={newsletter.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{newsletter.subject}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                newsletter.status === 'sent' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                newsletter.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              }`}>
                                {newsletter.status.charAt(0).toUpperCase() + newsletter.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {newsletter.sent_at 
                                ? format(new Date(newsletter.sent_at), 'MMM d, yyyy')
                                : newsletter.scheduled_for
                                ? format(new Date(newsletter.scheduled_for), 'MMM d, yyyy')
                                : format(new Date(newsletter.created_at), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
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
                                  className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                                  title="View newsletter"
                                >
                                  <Eye size={18} />
                                </button>
                                {newsletter.status === 'draft' && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setIsScheduling(true);
                                        setSelectedNewsletter(newsletter);
                                      }}
                                      className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                                      title="Schedule newsletter"
                                    >
                                      <Calendar size={18} />
                                    </button>
                                    <button
                                      onClick={() => handleSendNewsletter(newsletter.id)}
                                      className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                                      title="Send newsletter"
                                    >
                                      <Send size={18} />
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleDeleteNewsletter(newsletter.id)}
                                  className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
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

          {/* Schedule Newsletter Modal */}
          {isScheduling && selectedNewsletter && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black opacity-30" onClick={() => setIsScheduling(false)}></div>
                
                <div className="relative bg-white rounded-lg w-full max-w-md p-6 dark:bg-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium dark:text-white">Schedule Newsletter</h2>
                    <button
                      onClick={() => setIsScheduling(false)}
                      className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                        Date
                      </label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                        Time
                      </label>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={() => handleScheduleNewsletter(selectedNewsletter.id)}
                        className="btn-primary"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div>
          {isAddingTemplate ? (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium dark:text-white">Create New Template</h2>
                <button
                  onClick={() => setIsAddingTemplate(false)}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., Monthly Newsletter, Welcome Email, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    Content
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={newTemplate.content}
                    onChange={(content) => setNewTemplate({...newTemplate, content})}
                    className="h-64 mb-12 bg-white dark:bg-gray-700"
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
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveTemplate}
                    className="btn-primary"
                  >
                    Save Template
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setNewTemplate({
                    name: '',
                    content: ''
                  });
                  setIsAddingTemplate(true);
                }}
                className="btn-primary flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12 dark:text-gray-300">Loading...</div>
            ) : templates.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-300">
                <Edit className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No templates</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Create templates to reuse in your newsletters
                </p>
              </div>
            ) : (
              templates.map((template) => (
                <div key={template.id} className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
                  <div className="p-4 border-b dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium dark:text-white">{template.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setNewsletterContent(template.content);
                            setActiveTab('campaigns');
                          }}
                          className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                          title="Use template"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                          title="Delete template"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 max-h-64 overflow-auto dark:text-gray-300">
                    <div dangerouslySetInnerHTML={{ __html: template.content }} />
                  </div>
                  <div className="p-4 border-t text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    Created: {format(new Date(template.created_at), 'MMM d, yyyy')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterPage;