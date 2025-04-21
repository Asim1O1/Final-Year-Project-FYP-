// src/pages/doctor/Profile.js
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Clipboard,
  Edit,
  Save,
  X,
  Check,
  Briefcase,
  Shield,
  Calendar,
  DollarSign,
} from "lucide-react";

import {
  fetchSingleDoctor,
  handleDoctorUpdate,
} from "../../features/doctor/doctorSlice";
import { Box } from "@chakra-ui/react";


const DoctorProfile = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const user = useSelector((state) => state?.auth?.user?.data);
  const { doctor, isLoading } = useSelector((state) => state.doctorSlice);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
    yearsOfExperience: "",
    address: "",
    gender: "",
    consultationFee: "",
    qualifications: [],
  });

  // Fetch doctor data when component mounts or user changes
  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchSingleDoctor(user._id));
    }
  }, [dispatch, user]);

  // Update form data when doctor info changes
  useEffect(() => {
    if (doctor) {
      setFormData({
        fullName: doctor.fullName || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        specialization: doctor.specialization || "",
        yearsOfExperience: doctor.yearsOfExperience || "",
        address: doctor.address || "",
        gender: doctor.gender || "",
        consultationFee: doctor.consultationFee || "",
        qualifications: doctor.qualifications || [],
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Fix: Wait for API response before closing edit mode
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Wait for the update action to complete
      await dispatch(
        handleDoctorUpdate({
          doctorId: user._id,
          doctorData: formData,
        })
      ).unwrap();

      // After successful update, fetch the latest data
      await dispatch(fetchSingleDoctor(user._id)).unwrap();

      // Only exit edit mode after data has been updated and fetched
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      // You can add error handling or notification here
    }
  };

  const ProfileInfo = ({ icon, label, value }) => (
    <div className="flex items-start mb-4">
      <div className="mr-3 mt-1 text-blue-600">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-medium">{value || "Not provided"}</p>
      </div>
    </div>
  );

  if (loading || isLoading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading profile...</span>
      </Box>
    );
  }

  const QualificationItem = ({ degree, institution, year }) => (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
      <h4 className="font-bold text-gray-800">{degree}</h4>
      <p className="text-gray-700">{institution}</p>
      <div className="flex items-center mt-1 text-sm text-gray-600">
        <Calendar size={14} className="mr-1" />
        {year}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        Doctor Profile
        {doctor?.isVerified && (
          <span className="ml-3 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full flex items-center">
            <Shield size={12} className="mr-1" />
            Verified Professional
          </span>
        )}
      </h1>
      
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors shadow-md"
        >
          <Edit size={16} className="mr-2" />
          Edit Profile
        </button>
      ) : (
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center hover:bg-gray-600 transition-colors shadow-md"
        >
          <X size={16} className="mr-2" />
          Cancel
        </button>
      )}
    </div>

    {isEditing ? (
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Dr. John Smith"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="doctor@example.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Specialization
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Cardiology"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="10"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Consultation Fee (NRS)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
               NPR
              </div>
              <input
                type="text"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="150"
              />
            </div>
          </div>

          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="123 Medical Center Blvd, New York, NY 10001"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors shadow-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    ) : (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header section with status badge */}
        <div className="bg-blue-50 p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">{formData.fullName}</h2>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full flex items-center ${
                doctor?.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  doctor?.isActive ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                {doctor?.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                ${formData.consultationFee}/visit
              </span>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
              <div className="relative group">
                <div className="w-48 h-48 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                  {doctor?.doctorProfileImage ? (
                    <img
                      src={doctor.doctorProfileImage}
                      alt="Doctor profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-blue-300" />
                  )}
                </div>
                <div className="absolute -bottom-1 right-0 bg-blue-600 rounded-full p-2 shadow-lg border-2 border-white">
                  {formData.gender === 'male' ? (
                    <User size={18} className="text-white" />
                  ) : formData.gender === 'female' ? (
                    <User size={18} className="text-white" />
                  ) : (
                    <User size={18} className="text-white" />
                  )}
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center">
                  <Award size={18} className="text-blue-600 mr-2" />
                  <span className="font-medium text-lg">{formData.specialization}</span>
                </div>
                <div className="mt-1 text-gray-600 flex items-center">
                  <Clipboard size={16} className="mr-2" />
                  {formData.yearsOfExperience
                    ? `${formData.yearsOfExperience} years of experience`
                    : "Experience not specified"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <ProfileInfo
                  icon={<Mail size={18} />}
                  label="Email"
                  value={formData.email}
                />

                <ProfileInfo
                  icon={<Phone size={18} />}
                  label="Phone"
                  value={formData.phone}
                />

                <ProfileInfo
                  icon={<MapPin size={18} />}
                  label="Address"
                  value={formData.address}
                />

                <ProfileInfo
                  icon={<User size={18} />}
                  label="Gender"
                  value={
                    formData.gender &&
                    formData.gender.charAt(0).toUpperCase() +
                      formData.gender.slice(1)
                  }
                />
              </div>
            </div>
          </div>

          {/* Qualifications section with improved styling */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Award size={20} className="mr-2 text-blue-600" />
              Qualifications & Education
            </h3>
            
            {formData.qualifications && formData.qualifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.qualifications.map((qual, index) => (
                  <QualificationItem 
                    key={index}
                    degree={qual.degree}
                    institution={qual.institution}
                    year={qual.year}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700 border border-gray-200">
                No qualification information provided.
              </div>
            )}
          </div>

          {/* Certification section with improved styling */}
          {doctor?.certificationImage && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Shield size={20} className="mr-2 text-blue-600" />
                Certification
              </h3>
              <div className="max-w-md mx-auto bg-white p-2 rounded-lg shadow-md border border-gray-200">
                <img
                  src={doctor.certificationImage}
                  alt="Doctor certification"
                  className="w-full h-auto rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>

  );
};

export default DoctorProfile;
