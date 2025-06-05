import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { format } from 'date-fns';
import { updateMetaTags, addStructuredData, generateWebPageSchema } from '../utils/seo';

interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[]; // Can contain HTML
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
  const metaUpdatedRef = useRef(false);

  useEffect(() => {
    fetchJobs();
    if (user) {
      setFormData(prev => ({
        ...prev,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        email: user.email || ''
      }));
    }
    updateMetaTags(
      'Careers at MinddShopp | Join Our Team',
      'Explore career opportunities at MinddShopp. Join our team and help shape the future of luxury fashion and beauty.',
      `${window.location.origin}/icon-512.png`,
      window.location.href
    );
    const webPageSchema = generateWebPageSchema({
      title: 'Careers at MinddShopp | Join Our Team',
      description: 'Explore career opportunities at MinddShopp. Join our team and help shape the future of luxury fashion and beauty.',
      url: window.location.href
    });
    addStructuredData(webPageSchema);
    metaUpdatedRef.current = true;
    // eslint-disable-next-line
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'published')
        .gte('expires_at', new Date().toISOString())
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
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOCX file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to upload your resume');
        return;
      }
      const { error: uploadError } = await supabase.storage
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
    if (!formData.resume_url) {
      toast.error('Please upload your resume');
      return;
    }
    setIsSubmitting(true);
    try {
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
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSalaryRange = (salaryRange: Job['salary_range']) => {
    if (!salaryRange) return 'Competitive';
    const { currency, min, max } = salaryRange;
    if (min === max) {
      return `${currency}${min.toLocaleString()}`;
    }
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  };

  const formatJobType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="py-12 bg-gradient-to-br from-white via-blue-50 to-pink-50 min-h-screen">
      <div className="container-custom">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold font-heading mb-6 text-pink-700 drop-shadow">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Help shape the future of luxury fashion and beauty. We're looking for passionate individuals to join our growing team.
          </p>
        </div>
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-green-800 font-semibold">
                  Application Submitted Successfully
                </span>
              </div>
              <p className="mt-2 text-green-800">
                Thank you for your interest! We'll review your application and get back to you soon.
              </p>
            </div>
          </div>
        )}

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <CompanyValue
            icon={<svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            title="Innovation"
            desc="We embrace new ideas and technologies to revolutionize luxury retail."
          />
          <CompanyValue
            icon={<svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title="Growth"
            desc="We invest in our team's development and celebrate their success."
          />
          <CompanyValue
            icon={<svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            title="Diversity"
            desc="We celebrate diversity and foster an inclusive workplace culture."
          />
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl p-8 mb-16 shadow-md">
          <h2 className="text-3xl font-heading font-semibold mb-8 text-center text-blue-900">
            Benefits & Perks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitCard title="Health & Wellness" benefits={[
              'Comprehensive health insurance',
              'Dental and vision coverage',
              'Mental health support',
              'Fitness reimbursement'
            ]} />
            <BenefitCard title="Time Off" benefits={[
              'Unlimited PTO',
              'Paid holidays',
              'Parental leave',
              'Sabbatical program'
            ]} />
            <BenefitCard title="Professional Growth" benefits={[
              'Learning stipend',
              'Conference attendance',
              'Mentorship program',
              'Career development'
            ]} />
            <BenefitCard title="Lifestyle" benefits={[
              'Employee discount',
              'Remote work options',
              'Team events',
              'Travel opportunities'
            ]} />
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <h2 className="text-3xl font-heading font-semibold mb-8 text-pink-700">
            Open Positions
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              <p className="mt-2 text-gray-600">Loading job listings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No open positions</h3>
              <p className="mt-1 text-gray-500">
                We don't have any open positions at the moment. Please check back later or
                <Link to="/contact" className="text-pink-600 hover:text-pink-800"> contact us </Link>
                to inquire about future opportunities.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map(job => (
                <div key={job.id} className="bg-white rounded-xl shadow-md p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-blue-900">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
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
                        className="text-gray-700 mb-4"
                        dangerouslySetInnerHTML={{ __html: job.description }}
                      />
                      <div className="space-y-2">
                        <h4 className="font-semibold">Requirements:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} dangerouslySetInnerHTML={{ __html: req }} />
                          ))}
                        </ul>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedJob(job.id)}
                      className="inline-flex items-center text-pink-700 hover:text-pink-900 font-bold mt-2"
                    >
                      Apply Now
                      <ChevronRight size={18} className="ml-1" />
                    </button>
                  </div>
                  {/* Application Form */}
                  {selectedJob === job.id && (
                    <div className="mt-8 border-t pt-8">
                      <h4 className="text-lg font-bold mb-4 text-blue-900">Apply for {job.title}</h4>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="first_name"
                              required
                              value={formData.first_name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="last_name"
                              required
                              value={formData.last_name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-400"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cover Letter
                          </label>
                          <textarea
                            name="cover_letter"
                            rows={4}
                            value={formData.cover_letter}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-400"
                            placeholder="Tell us why you're interested in this position..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Resume
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.docx"
                            required
                            onChange={handleFileUpload}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-400"
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Upload your resume (PDF or DOCX, max 5MB)
                          </p>
                          {formData.resume_url && (
                            <p className="mt-2 text-sm text-green-600">
                              Resume uploaded successfully!
                            </p>
                          )}
                        </div>
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => setSelectedJob(null)}
                            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting || !formData.resume_url}
                            className="px-6 py-2 bg-pink-600 text-white font-bold rounded-md shadow hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 transition"
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

const CompanyValue = ({
  icon,
  title,
  desc
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="text-center p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-tr from-pink-100 via-blue-100 to-yellow-100">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

const BenefitCard = ({
  title,
  benefits
}: {
  title: string;
  benefits: string[];
}) => (
  <div className="bg-blue-50 p-6 rounded-lg shadow-sm flex flex-col h-full">
    <h3 className="font-semibold mb-2 text-blue-900">{title}</h3>
    <ul className="text-sm text-gray-700 space-y-2 flex-1">
      {benefits.map((b, idx) => (
        <li key={idx}>• {b}</li>
      ))}
    </ul>
  </div>
);

export default CareersPage;