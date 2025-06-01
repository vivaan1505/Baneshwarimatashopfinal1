import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<{
    question: string;
    answer: string;
    category: string;
    is_active: boolean;
  }>();

  const answer = watch('answer');

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    if (editingFaq) {
      reset({
        question: editingFaq.question,
        answer: editingFaq.answer,
        category: editingFaq.category,
        is_active: editingFaq.is_active
      });
    } else {
      reset({
        question: '',
        answer: '',
        category: '',
        is_active: true
      });
    }
  }, [editingFaq, reset]);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('category')
        .order('position');

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingFaq) {
        // Update existing FAQ
        const { error } = await supabase
          .from('faqs')
          .update({
            question: data.question,
            answer: data.answer,
            category: data.category,
            is_active: data.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingFaq.id);

        if (error) throw error;
        toast.success('FAQ updated successfully');
      } else {
        // Get max position for the category
        const { data: maxPositionData, error: maxPositionError } = await supabase
          .from('faqs')
          .select('position')
          .eq('category', data.category)
          .order('position', { ascending: false })
          .limit(1);

        if (maxPositionError) throw maxPositionError;
        
        const maxPosition = maxPositionData && maxPositionData.length > 0 
          ? maxPositionData[0].position 
          : 0;

        // Create new FAQ
        const { error } = await supabase
          .from('faqs')
          .insert([{
            question: data.question,
            answer: data.answer,
            category: data.category,
            is_active: data.is_active,
            position: maxPosition + 1
          }]);

        if (error) throw error;
        toast.success('FAQ created successfully');
      }

      setEditingFaq(null);
      reset({ question: '', answer: '', category: '', is_active: true });
      fetchFaqs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Failed to save FAQ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('FAQ deleted successfully');
      fetchFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ');
    }
  };

  const handleMoveUp = async (faq: FAQ) => {
    try {
      // Find the FAQ above this one in the same category
      const prevFaq = faqs
        .filter(f => f.category === faq.category && f.position < faq.position)
        .sort((a, b) => b.position - a.position)[0];

      if (!prevFaq) return;

      // Swap positions
      const { error: error1 } = await supabase
        .from('faqs')
        .update({ position: prevFaq.position })
        .eq('id', faq.id);

      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from('faqs')
        .update({ position: faq.position })
        .eq('id', prevFaq.id);

      if (error2) throw error2;

      fetchFaqs();
    } catch (error) {
      console.error('Error moving FAQ:', error);
      toast.error('Failed to reorder FAQ');
    }
  };

  const handleMoveDown = async (faq: FAQ) => {
    try {
      // Find the FAQ below this one in the same category
      const nextFaq = faqs
        .filter(f => f.category === faq.category && f.position > faq.position)
        .sort((a, b) => a.position - b.position)[0];

      if (!nextFaq) return;

      // Swap positions
      const { error: error1 } = await supabase
        .from('faqs')
        .update({ position: nextFaq.position })
        .eq('id', faq.id);

      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from('faqs')
        .update({ position: faq.position })
        .eq('id', nextFaq.id);

      if (error2) throw error2;

      fetchFaqs();
    } catch (error) {
      console.error('Error moving FAQ:', error);
      toast.error('Failed to reorder FAQ');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">FAQ Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">
              {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('question', { required: 'Question is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.question && (
                  <p className="mt-1 text-sm text-red-600">{errors.question.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Answer <span className="text-red-500">*</span>
                </label>
                <ReactQuill
                  theme="snow"
                  value={answer || ''}
                  onChange={(value) => setValue('answer', value)}
                  className="h-32 mb-12"
                />
                {errors.answer && (
                  <p className="mt-1 text-sm text-red-600">{errors.answer.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('category', { required: 'Category is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="e.g., Shipping, Returns, Products"
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-2">
                {editingFaq && (
                  <button
                    type="button"
                    onClick={() => setEditingFaq(null)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingFaq ? 'Update' : 'Add'} FAQ
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* FAQs List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium">All FAQs</h2>
            </div>
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : faqs.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No FAQs found. Create your first FAQ.
              </div>
            ) : (
              <div>
                {categories.map(category => (
                  <div key={category} className="border-b last:border-b-0">
                    <div className="px-6 py-3 bg-gray-50">
                      <h3 className="text-sm font-medium text-gray-700">{category}</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {faqs
                        .filter(faq => faq.category === category)
                        .map((faq) => (
                          <li key={faq.id} className="hover:bg-gray-50">
                            <div className="p-6">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <button
                                    onClick={() => toggleExpand(faq.id)}
                                    className="flex justify-between items-center w-full text-left"
                                  >
                                    <h3 className="text-lg font-medium text-gray-900 pr-4">{faq.question}</h3>
                                    {expandedFaq === faq.id ? (
                                      <ChevronUp className="flex-shrink-0 h-5 w-5 text-gray-500" />
                                    ) : (
                                      <ChevronDown className="flex-shrink-0 h-5 w-5 text-gray-500" />
                                    )}
                                  </button>
                                  
                                  {expandedFaq === faq.id && (
                                    <div className="mt-4 prose prose-sm max-w-none text-gray-500">
                                      <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex flex-col items-center ml-4 space-y-2">
                                  <button
                                    onClick={() => handleMoveUp(faq)}
                                    className="text-gray-400 hover:text-gray-600"
                                    title="Move up"
                                  >
                                    <ChevronUp size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleMoveDown(faq)}
                                    className="text-gray-400 hover:text-gray-600"
                                    title="Move down"
                                  >
                                    <ChevronDown size={16} />
                                  </button>
                                </div>
                                
                                <div className="flex items-center ml-4 space-x-2">
                                  <button
                                    onClick={() => setEditingFaq(faq)}
                                    className="text-gray-600 hover:text-primary-600"
                                    title="Edit FAQ"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(faq.id)}
                                    className="text-gray-600 hover:text-red-600"
                                    title="Delete FAQ"
                                  >
                                    <Trash size={18} />
                                  </button>
                                </div>
                              </div>
                              
                              {!faq.is_active && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Inactive
                                  </span>
                                </div>
                              )}
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

export default FAQPage;