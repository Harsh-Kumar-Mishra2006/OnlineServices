import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "../layout/layout";

const Profile: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    profile: {
      age: "",
      gender: "",
      dob: "",
      address: "",
      education: "",
      bio: "",
      avatar: "",
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
        phone: user.phone || "",
        profile: {
          age: user.profile?.age || "",
          gender: user.profile?.gender || "",
          dob: user.profile?.dob || "",
          address: user.profile?.address || "",
          education: user.profile?.education || "",
          bio: user.profile?.bio || "",
          avatar: user.profile?.avatar || "",
        },
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-blue-50 via-white to-sky-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg">
                    {user.profile?.avatar ? (
                      <img
                        src={user.profile.avatar}
                        alt={user.name}
                        className="w-20 h-20 shadow-2xl rounded-full object-cover hover:scale-105 hover:bg-gradient-to-r hover:from-blue-800 hover:to-emerald-800 transition-transform"
                      />
                    ) : (
                      <span className="text-blue-600 font-bold text-2xl">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      {user.name}
                    </h1>
                    <p className="text-blue-100">@{user.username}</p>
                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm text-white mt-1">
                      {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{user.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Username</label>
                      <p className="font-medium text-gray-900">
                        @{user.username}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">
                          {user.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Additional Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Age</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.profile.age}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              profile: {
                                ...profileData.profile,
                                age: e.target.value,
                              },
                            })
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">
                          {user.profile?.age || "Not set"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Gender</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.profile.gender}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              profile: {
                                ...profileData.profile,
                                gender: e.target.value,
                              },
                            })
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">
                          {user.profile?.gender || "Not set"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={profileData.profile.dob}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              profile: {
                                ...profileData.profile,
                                dob: e.target.value,
                              },
                            })
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">
                          {user.profile?.dob || "Not set"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Address</label>
                      {isEditing ? (
                        <textarea
                          value={profileData.profile.address}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              profile: {
                                ...profileData.profile,
                                address: e.target.value,
                              },
                            })
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                      ) : (
                        <p className="font-medium text-gray-900">
                          {user.profile?.address || "Not set"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
