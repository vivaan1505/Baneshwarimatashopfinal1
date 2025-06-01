import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { format } from 'date-fns';

interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary_range: {
    min: number;
    max: number;
    currency: string;
  };
  status: string;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  resume_url: string;
  cover_letter: string;
}

const CareersPage: React.FC = () => {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    resume_url: '',
    cover_letter: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    
    // Pre-fill form with user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'published')
        .lte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load job listings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOCX file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      // First, ensure the user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to upload your resume');
        return;
      }

      // Upload file with specific MIME type
      const { error: uploadError, data } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, resume_url: publicUrl }));
      toast.success('Resume uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload resume. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    // Validate that resume was uploaded
    if (!formData.resume_url) {
      toast.error('Please upload your resume');
      return;
    }

    setIsSubmitting(true);
    try {
      // Ensure the user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('job_applications')
        .insert({
          ...formData,
          job_id: selectedJob,
          user_id: session?.user.id,
          status: 'pending'
        });

      if (error) throw error;

      setShowSuccess(true);
      setSelectedJob(null);
      setFormData({
        first_name: user?.user_metadata?.first_name || '',
        last_name: user?.user_metadata?.last_name || '',
        email: user?.email || '',
        phone: '',
        resume_url: '',
        cover_letter: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format salary range
  const formatSalaryRange = (salaryRange: Job['salary_range']) => {
    if (!salaryRange) return 'Competitive';
    
    const { currency, min, max } = salaryRange;
    if (min === max) {
      return `${currency}${min.toLocaleString()}`;
    }
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  };

  // Format job type
  const formatJobType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 dark:text-white">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Help shape the future of luxury fashion and beauty. We're looking for passionate individuals to join our growing team.
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-900/20 dark:border-green-800">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400 dark:text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-400">
                    Application Submitted Successfully
                  </h3>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                    <p>Thank you for your interest! We'll review your application and get back to you soon.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-primary-900/30">
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-heading font-medium mb-2 dark:text-white">Innovation</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We embrace new ideas and technologies to revolutionize luxury retail.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-primary-900/30">
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-heading font-medium mb-2 dark:text-white">Growth</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We invest in our team's development and celebrate their success.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-primary-900/30">
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-heading font-medium mb-2 dark:text-white">Diversity</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We celebrate diversity and foster an inclusive workplace culture.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gray-50 rounded-xl p-8 mb-16 dark:bg-gray-800/50">
          <h2 className="text-3xl font-heading font-medium mb-8 text-center dark:text-white">
            Benefits & Perks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
              <h3 className="font-medium mb-2 dark:text-white">Health & Wellness</h3>
              <ul className="text-sm text-gray-600 space-y-2 dark:text-gray-300">
                <li>Comprehensive health insurance</li>
                <li>Dental and vision coverage</li>
                <li>Mental health support</li>
                <li>Fitness reimbursement</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
              <h3 className="font-medium mb-2 dark:text-white">Time Off</h3>
              <ul className="text-sm text-gray-600 space-y-2 dark:text-gray-300">
                <li>Unlimited PTO</li>
                <li>Paid holidays</li>
                <li>Parental leave</li>
                <li>Sabbatical program</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
              <h3 className="font-medium mb-2 dark:text-white">Professional Growth</h3>
              <ul className="text-sm text-gray-600 space-y-2 dark:text-gray-300">
                <li>Learning stipend</li>
                <li>Conference attendance</li>
                <li>Mentorship program</li>
                <li>Career development</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
              <h3 className="font-medium mb-2 dark:text-white">Lifestyle</h3>
              <ul className="text-sm text-gray-600 space-y-2 dark:text-gray-300">
                <li>Employee discount</li>
                <li>Remote work options</li>
                <li>Team events</li>
                <li>Travel opportunities</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <h2 className="text-3xl font-heading font-medium mb-8 dark:text-white">
            Open Positions
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading job listings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
              <h3 className="mt-2 text-lg font-medium dark:text-white">No open positions</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                We don't have any open positions at the moment. Please check back later or 
                <Link to="/contact" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"> contact us </Link> 
                to inquire about future opportunities.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-medium mb-2 dark:text-white">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4 dark:text-gray-300">
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Briefcase size={16} className="mr-1" />
                          {job.department}
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-1" />
                          {formatJobType(job.type)}
                        </div>
                        <div>
                          {formatSalaryRange(job.salary_range)}
                        </div>
                      </div>
                      <div 
                        className="text-gray-600 mb-4 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: job.description }}
                      />
                      <div className="space-y-2">
                        <h4 className="font-medium dark:text-white">Requirements:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 dark:text-gray-300">
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedJob(job.id)}
                      className="inline-flex items-center text-primary-700 hover:text-primary-800 font-medium dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Apply Now
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>

                  {/* Application Form */}
                  {selectedJob === job.id && (
                    <div className="mt-8 border-t pt-8 dark:border-gray-700">
                      <h4 className="text-lg font-medium mb-4 dark:text-white">Apply for {job.title}</h4>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="first_name"
                              required
                              value={formData.first_name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="last_name"
                              required
                              value={formData.last_name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                              Phone
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                            Cover Letter
                          </label>
                          <textarea
                            name="cover_letter"
                            rows={4}
                            value={formData.cover_letter}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Tell us why you're interested in this position..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                            Resume
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.docx"
                            required
                            onChange={handleFileUpload}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Upload your resume (PDF or DOCX, max 5MB)
                          </p>
                          {formData.resume_url && (
                            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                              Resume uploaded successfully!
                            </p>
                          )}
                        </div>

                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => setSelectedJob(null)}
                            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting || !formData.resume_url}
                            className="btn-primary"
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareersPage;