import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Filter, Check, X, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface RecyclingRequest {
  id: string;
  user_id: string;
  user: {
    email: string;
    user_metadata: {
      first_name: string;
      last_name: string;
    };
  };
  product: {
    name: string;
    brand: {
      name: string;
    };
  };
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  images: string[];
  condition_rating: number;
  estimated_value: number;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const RecyclingPage: React.FC = () => {
  const [requests, setRequests] = useState<RecyclingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // First, fetch the recycling requests with product information
      const { data: recyclingData, error: recyclingError } = await supabase
        .from('recycling_requests')
        .select(`
          *,
          product:products!product_id (
            name,
            brand:brands (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (recyclingError) throw recyclingError;

      // Get the current session for the auth token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session?.access_token) {
        throw new Error('No active session');
      }

      // Fetch user data from the Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/list-users`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const userData = await response.json();
      console.log('userData:', userData);

      // Check if userData has a users property that is an array
      let usersArray;
      if (Array.isArray(userData)) {
        usersArray = userData;
      } else if (userData && Array.isArray(userData.users)) {
        usersArray = userData.users;
      } else {
        console.error('userData structure:', userData);
        throw new Error("Failed to fetch users - invalid response format");
      }

      // Create a map from the array of users
      const userMap = new Map(usersArray.map((user: any) => [user.id, user]));

      // Map user data to recycling requests
      const requestsWithUserData = recyclingData?.map(request => ({
        ...request,
        user: {
          email: userMap.get(request.user_id)?.email || '',
          user_metadata: userMap.get(request.user_id)?.user_metadata || { first_name: '', last_name: '' }
        }
      }));

      setRequests(requestsWithUserData || []);
    } catch (error) {
      console.error('Error fetching recycling requests:', error);
      toast.error('Failed to load recycling requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('recycling_requests')
        .update({
          status,
          admin_notes: adminNotes || null
        })
        .eq('id', requestId);

      if (error) throw error;
      toast.success(`Request ${status}`);
      setSelectedRequest(null);
      setAdminNotes('');
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Recycling Requests</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Condition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">No requests found</td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <React.Fragment key={request.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.user.user_metadata.first_name} {request.user.user_metadata.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{request.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.product.brand?.name || 'No Brand'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < request.condition_rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${request.estimated_value?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(request.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                  {selectedRequest === request.id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                            <p className="text-sm text-gray-600">{request.description}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Images</h4>
                            <div className="flex flex-wrap gap-2">
                              {request.images.map((image, index) => (
                                <a 
                                  key={index} 
                                  href={image} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block"
                                >
                                  <img 
                                    src={image} 
                                    alt={`Product ${index + 1}`} 
                                    className="h-20 w-20 object-cover rounded-md"
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                          
                          {request.status === 'pending' && (
                            <>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Admin Notes</h4>
                                <textarea
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                  placeholder="Add notes about this request..."
                                />
                              </div>
                              
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleUpdateStatus(request.id, 'approved')}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(request.id, 'rejected')}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </button>
                              </div>
                            </>
                          )}
                          
                          {request.admin_notes && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Admin Notes</h4>
                              <p className="text-sm text-gray-600">{request.admin_notes}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecyclingPage;