import React, { useState } from "react";
import { API } from "../Contexts/AllContext";
import axios from "axios";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendEmail = async () => {
    if (!email) return alert("Please enter your email");

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`${API}/user/forgot-password`, { email });

      if (res.data.message) {
        setMessage("Password reset link has been sent to your email.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-sm p-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Forgot Password
        </h2>

        <label className="block mb-2 text-sm">Enter your email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
          className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
        />

        <button
          onClick={handleSendEmail}
          disabled={loading}
          className="w-full py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition disabled:opacity-50 border border-2"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPass;
