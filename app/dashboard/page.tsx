"use client";
import React, { useEffect, useState } from "react";
import Message from "@/components/Message";
import AddRoomForm from "@/components/AddRoomForm";

const Dashboard = () => {
  const [user, setUser] = useState({
    _id: "",
    name: "",
    email: "",
    created_at: "",
    phone_number: "",
    isLogedIn: false,
  });

  useEffect(() => {
    // Check if window is defined (so we're on the browser)
    if (typeof window !== "undefined") {
      // Now we can safely use localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  return (
    <div className="container mx-auto flex items-center justify-center">
      <video
        className="fixed inset-0 w-full h-full object-cover z-[-1]"
        autoPlay
        loop
        muted
        preload="auto"
      >
        <source src="/video/static_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="w-full shadow-md bg-black/20 backdrop-blur-lg rounded-lg p-8">
        {user.isLogedIn ? (
          <div>
            <Message />
            <AddRoomForm />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600">
              Please login to access the dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
