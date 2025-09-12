import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../Contexts/AllContext";

const ResetPass = () => {
    const { token } = useParams(); // URL se token lena
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const HandleResetPass = async () => {
        if (!newPassword || !confirmPassword)
            return alert("Please fill both fields");

        if (newPassword !== confirmPassword)
            return alert("Passwords do not match");

        try {
            setLoading(true);
            setMessage("");
            const res = await axios.post(`${API}/user/reset-password`, { token, newPassword })


            if (res.data.message) {
                setMessage("Password reset successful. Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
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
            <div className="w-full max-w-md p-8 rounded-2xl shadow-lg p-4">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Reset Password
                </h2>

                <label className="block mb-2 text-sm">New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
                />

                <label className="block mb-2 text-sm">Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
                />

                <button
                    onClick={HandleResetPass}
                    disabled={loading}
                    className="w-full border border-2 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>

                {message && (
                    <p className="mt-4 text-center text-sm text-gray-300">{message}</p>
                )}
            </div>
        </div>
    );
};

export default ResetPass;
