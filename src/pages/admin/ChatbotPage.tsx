import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash, MessageSquare, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

interface ChatbotScript {
  id: string;
  name: string;
  section: string;
  trigger_keywords: string[];
  response: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ChatbotSettings {
  id: string;
  welcome_message: string;
  fallback_message: string;
  is_enabled: boolean;
  auto_response_delay: number;
  human_handoff_threshold: number;
  updated_at: string;
}

const ChatbotPage: React.FC = () => {
  const [scripts, setScripts] = useState<ChatbotScript[]>([]);
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingScript, setEditingScript] = useState<ChatbotScript | null>(null);
  const [editingSettings, setEditingSettings] = useState(false);
  const { register: registerScript, handleSubmit: handleSubmitScript, reset: resetScript, formState: { errors: scriptErrors } } = useForm<{
    name: string;
    section: string;
    trigger_keywords: string;
    response: string;
    is_active: boolean;
  }>();
  const { register: registerSettings, handleSubmit: handleSubmitSettings, reset: resetSettings, formState: { errors: settingsErrors } } = useForm<{
    welcome_message: string;
    fallback_message: string;
    is_enabled: boolean;
    auto_response_delay: number;
    human_handoff_threshold: number;
  }>();

  useEffect(() => {
    fetchScripts();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (editingScript) {
      resetScript({
        name: editingScript.name,
        section: editingScript.section,
        trigger_keywords: editingScript.trigger_keywords.join(', '),
        response: editingScript.response,
        is_active: editingScript.is_active
      });
    } else {
      resetScript({
        name: '',
        section: '',
        trigger_keywords: '',
        response: '',
        is_active: true
      });
    }
  }, [editingScript, resetScript]);

  useEffect(() => {
    if (settings) {
      resetSettings({
        welcome_message: settings.welcome_message,
        fallback_message: settings.fallback_message,
        is_enabled: settings.is_enabled,
        auto_response_delay: settings.auto_response_delay,
        human_handoff_threshold: settings.human_handoff_threshold
      });
    }
  }, [settings, resetSettings]);

  const fetchScripts = async () => {
    try {
      const { data, error } = await supabase
        .from('chatbot_scripts')
        .select('*')
        .order('section')
        .order('name');

      if (error) throw error;
      setScripts(data || []);
    } catch (error) {
      console.error('Error fetching chatbot scripts:', error);
      toast.error('Failed to load chatbot scripts');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('chatbot_settings')
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, create default settings
          const { data: newSettings, error: createError } = await supabase
            .from('chatbot_settings')
            .insert([{
              welcome_message: 'Welcome to MinddShopp! How can I assist you today?',
              fallback_message: 'I\'m sorry, I don\'t understand. Could you please rephrase your question?',
              is_enabled: true,
              auto_response_delay: 1000,
              human_handoff_threshold: 3
            }])
            .select()
            .single();

          if (createError) throw createError;
          setSettings(newSettings);
        } else {
          throw error;
        }
      } else {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching chatbot settings:', error);
      toast.error('Failed to load chatbot settings');
    }
  };

  const onSubmitScript = async (data: any) => {
    try {
      const scriptData = {
        name: data.name,
        section: data.section,
        trigger_keywords: data.trigger_keywords.split(',').map((k: string) => k.trim()),
        response: data.response,
        is_active: data.is_active
      };

      if (editingScript) {
        // Update existing script
        const { error } = await supabase
          .from('chatbot_scripts')
          .update({
            ...scriptData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingScript.id);

        if (error) throw error;
        toast.success('Script updated successfully');
      } else {
        // Create new script
        const { error } = await supabase
          .from('chatbot_scripts')
          .insert([scriptData]);

        if (error) throw error;
        toast.success('Script created successfully');
      }

      setEditingScript(null);
      resetScript({
        name: '',
        section: '',
        trigger_keywords: '',
        response: '',
        is_active: true
      });
      fetchScripts();
    } catch (error) {
      console.error('Error saving script:', error);
      toast.error('Failed to save script');
    }
  };

  const onSubmitSettings = async (data: any) => {
    try {
      const { error } = await supabase
        .from('chatbot_settings')
        .update({
          welcome_message: data.welcome_message,
          fallback_message: data.fallback_message,
          is_enabled: data.is_enabled,
          auto_response_delay: data.auto_response_delay,
          human_handoff_threshold: data.human_handoff_threshold,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings?.id);

      if (error) throw error;
      toast.success('Settings updated successfully');
      setEditingSettings(false);
      fetchSettings();
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const handleDeleteScript = async (id: string) => {
    if (!confirm('Are you sure you want to delete this script?')) return;

    try {
      const { error } = await supabase
        .from('chatbot_scripts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Script deleted successfully');
      fetchScripts();
    } catch (error) {
      console.error('Error deleting script:', error);
      toast.error('Failed to delete script');
    }
  };

  const sections = Array.from(new Set(scripts.map(script => script.section)));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Chatbot Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chatbot Settings */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Chatbot Settings</h2>
              {!editingSettings ? (
                <button
                  onClick={() => setEditingSettings(true)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <Edit size={18} />
                </button>
              ) : (
                <button
                  onClick={() => setEditingSettings(false)}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {settings && (
              <div>
                {editingSettings ? (
                  <form onSubmit={handleSubmitSettings(onSubmitSettings)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Welcome Message
                      </label>
                      <textarea
                        {...registerSettings('welcome_message', { required: 'Welcome message is required' })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {settingsErrors.welcome_message && (
                        <p className="mt-1 text-sm text-red-600">{settingsErrors.welcome_message.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Fallback Message
                      </label>
                      <textarea
                        {...registerSettings('fallback_message', { required: 'Fallback message is required' })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {settingsErrors.fallback_message && (
                        <p className="mt-1 text-sm text-red-600">{settingsErrors.fallback_message.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Auto-Response Delay (ms)
                      </label>
                      <input
                        type="number"
                        {...registerSettings('auto_response_delay', { 
                          required: 'Delay is required',
                          min: { value: 0, message: 'Delay must be positive' }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {settingsErrors.auto_response_delay && (
                        <p className="mt-1 text-sm text-red-600">{settingsErrors.auto_response_delay.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Human Handoff Threshold
                      </label>
                      <input
                        type="number"
                        {...registerSettings('human_handoff_threshold', { 
                          required: 'Threshold is required',
                          min: { value: 1, message: 'Threshold must be at least 1' }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Number of failed responses before offering human support
                      </p>
                      {settingsErrors.human_handoff_threshold && (
                        <p className="mt-1 text-sm text-red-600">{settingsErrors.human_handoff_threshold.message}</p>
                      )}
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...registerSettings('is_enabled')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Enable Chatbot
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn-primary flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Settings
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Status</h3>
                      <p className={`mt-1 ${settings.is_enabled ? 'text-green-600' : 'text-red-600'}`}>
                        {settings.is_enabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Welcome Message</h3>
                      <p className="mt-1 text-gray-600">{settings.welcome_message}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Fallback Message</h3>
                      <p className="mt-1 text-gray-600">{settings.fallback_message}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Auto-Response Delay</h3>
                      <p className="mt-1 text-gray-600">{settings.auto_response_delay} ms</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Human Handoff Threshold</h3>
                      <p className="mt-1 text-gray-600">{settings.human_handoff_threshold} failed responses</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Last Updated</h3>
                      <p className="mt-1 text-gray-600">
                        {new Date(settings.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Script Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-lg font-medium mb-4">
              {editingScript ? 'Edit Script' : 'Add New Script'}
            </h2>
            <form onSubmit={handleSubmitScript(onSubmitScript)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...registerScript('name', { required: 'Name is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="e.g., Shipping Policy, Return Process"
                />
                {scriptErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{scriptErrors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Section <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...registerScript('section', { required: 'Section is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="e.g., General, Shipping, Returns, Products"
                />
                {scriptErrors.section && (
                  <p className="mt-1 text-sm text-red-600">{scriptErrors.section.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trigger Keywords <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...registerScript('trigger_keywords', { required: 'Trigger keywords are required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="shipping, delivery, tracking, comma separated"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Comma-separated keywords that will trigger this response
                </p>
                {scriptErrors.trigger_keywords && (
                  <p className="mt-1 text-sm text-red-600">{scriptErrors.trigger_keywords.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Response <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...registerScript('response', { required: 'Response is required' })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="The chatbot's response when triggered"
                />
                {scriptErrors.response && (
                  <p className="mt-1 text-sm text-red-600">{scriptErrors.response.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...registerScript('is_active')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-2">
                {editingScript && (
                  <button
                    type="button"
                    onClick={() => setEditingScript(null)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingScript ? 'Update' : 'Add'} Script
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Scripts List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-medium">Chatbot Scripts</h2>
              <div className="flex items-center">
                <MessageSquare className="text-primary-600 mr-2" />
                <span className="text-sm font-medium">{scripts.length} Scripts</span>
              </div>
            </div>
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : scripts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No scripts found. Create your first script.
              </div>
            ) : (
              <div>
                {sections.map(section => (
                  <div key={section} className="border-b last:border-b-0">
                    <div className="px-6 py-3 bg-gray-50">
                      <h3 className="text-sm font-medium text-gray-700">{section}</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {scripts
                        .filter(script => script.section === section)
                        .map((script) => (
                          <li key={script.id} className="p-6 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <h3 className="text-lg font-medium text-gray-900">{script.name}</h3>
                                  {!script.is_active && (
                                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  <span className="font-medium">Triggers:</span> {script.trigger_keywords.join(', ')}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                  {script.response}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingScript(script)}
                                  className="text-gray-600 hover:text-primary-600"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteScript(script.id)}
                                  className="text-gray-600 hover:text-red-600"
                                >
                                  <Trash size={18} />
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;