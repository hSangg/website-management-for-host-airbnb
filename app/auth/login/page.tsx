"use client";
import { UserAPI } from "@/api/UserAPI";
import { useUserStore } from "@/zustand/user";
import React, { useState, useEffect } from "react";
import { User } from "@/Type/User";
import { useRouter } from "next/navigation";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const router = useRouter();
  //user
  const { user, updateUser } = useUserStore();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      updateUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (password.length >= 6) {
      handleSubmit();
    }
  }, [password]);

  const validateEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email." as any);
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters." as any);
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (isValid) {
      callApi();
    }
  };

  const callApi = async () => {
    console.log("Calling API with Email:", email, "Password:", password);
    try {
      const res = await UserAPI.login(email, password);
      const userData: User = {
        _id: res?.data?._id,
        email: res?.data?.email,
        name: res?.data?.name,
        phone_number: res?.data?.phone_number,
        created_at: res?.data?.created_at,
        isLogedIn: true,
      };

      updateUser(userData);
      localStorage.setItem("token", res?.token);
      localStorage.setItem("user", JSON.stringify(userData));

      router.push("/dashboard");
    } catch (error) {}
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-black shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Login
          </h2>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full py-2 px-4 rounded-lg text-black bg-gray-200 border border-gray-200 focus:outline-none focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="text-sm text-gray-600">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full py-2 px-4 rounded-lg bg-gray-200 border border-gray-200 focus:outline-none focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
