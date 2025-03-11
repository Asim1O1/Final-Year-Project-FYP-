import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  User, Mail, Phone, MapPin, Calendar, Edit, 
  Save, X, Shield, Clock, AlertCircle 
} from "lucide-react";
import { format } from 'date-fns';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state?.auth);
  const userData = user?.data;
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    address: "",
    phone: "",
    gender: ""
  });
  
  // Tabs for profile sections
  const [activeTab, setActiveTab] = useState("personal");
  
  // Initialize form data when user data is available
  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        userName: userData.userName || "",
        email: userData.email || "",
        address: userData.address || "",
        phone: userData.phone || "",
        gender: userData.gender || ""
      });
    }
  }, [userData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would dispatch an action to update the user profile
    // dispatch(updateUserProfile(formData));
    console.log("Updated profile data:", formData);
    setIsEditing(false);
  };
  
  const cancelEdit = () => {
    // Reset form data to original user data
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        userName: userData.userName || "",
        email: userData.email || "",
        address: userData.address || "",
        phone: userData.phone || "",
        gender: userData.gender || ""
      });
    }
    setIsEditing(false);
  };
  
  // Format dates for better display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMMM d, yyyy');
    } catch (e) {
      return e;
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Not Authorized</h1>
        <p className="text-gray-600 mb-6">Please log in to view your profile</p>
        <a
          href="/login"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-full hover:shadow-xl transition text-lg"
        >
          Go to Login
        </a>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="bg-white p-2 rounded-full shadow-lg">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <User size={64} />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{userData?.fullName}</h1>
            <p className="text-blue-100 text-lg">@{userData?.userName}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center">
                <Mail size={14} className="mr-1" /> {userData?.email}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center">
                <Phone size={14} className="mr-1" /> {userData?.phone}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center capitalize">
                <Shield size={14} className="mr-1" /> {userData?.role}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-white text-blue-500 px-4 py-2 rounded-full hover:shadow-lg transition flex items-center"
              >
                <Edit size={16} className="mr-2" /> Edit Profile
              </button>
            ) : (
              <button 
                onClick={cancelEdit}
                className="bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition flex items-center"
              >
                <X size={16} className="mr-2" /> Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap ${
              activeTab === "personal"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap ${
              activeTab === "appointments"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap ${
              activeTab === "reports"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Medical Reports
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap ${
              activeTab === "settings"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Account Settings
          </button>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2">
          {activeTab === "personal" && (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                {isEditing && (
                  <button 
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition flex items-center"
                  >
                    <Save size={16} className="mr-2" /> Save Changes
                  </button>
                )}
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <User className="text-blue-500 mr-3" size={20} />
                        <span className="text-gray-800">{userData?.fullName || "Not specified"}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-blue-500 mr-3">@</span>
                        <span className="text-gray-800">{userData?.userName || "Not specified"}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Mail className="text-blue-500 mr-3" size={20} />
                        <span className="text-gray-800">{userData?.email || "Not specified"}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Phone className="text-blue-500 mr-3" size={20} />
                        <span className="text-gray-800">{userData?.phone || "Not specified"}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <MapPin className="text-blue-500 mr-3" size={20} />
                        <span className="text-gray-800">{userData?.address || "Not specified"}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <User className="text-blue-500 mr-3" size={20} />
                        <span className="text-gray-800 capitalize">{userData?.gender || "Not specified"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === "appointments" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Appointments</h2>
              <div className="text-center py-10">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">You don't have any appointments yet</p>
                <a href="/book-appointment" className="mt-4 inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition">
                  Book an Appointment
                </a>
              </div>
            </div>
          )}
          
          {activeTab === "reports" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Medical Reports</h2>
              <div className="text-center py-10">
                <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No medical reports available</p>
              </div>
            </div>
          )}
          
          {activeTab === "settings" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Change Password</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-800">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive notifications about appointments and reports</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" checked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-800">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Receive SMS about appointment reminders</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <button className="bg-white text-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Summary */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Shield className="text-blue-500 mr-3" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="text-gray-800 capitalize">{userData?.role || "Standard"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="text-blue-500 mr-3" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-800">{formatDate(userData?.createdAt) || "Unknown"}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a href="/book-appointment" className="flex items-center p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                <Calendar className="mr-3" size={20} />
                Book Appointment
              </a>
              <a href="/hospitals" className="flex items-center p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                <Hospital className="mr-3" size={20} />
                Find Hospitals
              </a>
              <a href="/medicalTests" className="flex items-center p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                <DollarSign className="mr-3" size={20} />
                Medical Tests
              </a>
            </div>
          </div>
          
          {/* Support */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-4">If you have any questions or need assistance, our support team is here to help.</p>
            <a href="/contact" className="block text-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;