import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ResetPassword = ({ url }) => {
  const { role, token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${url}api/${role}/reset-password/${token}`,
        { password }
      );
      setMessage(res.data.message);

      if (res.data.success) {
        setTimeout(() => {
          window.location.href = "https://easy-trip-frontend-01.vercel.app/";
        }, 2000);
      }
    } catch (err) {
      setMessage("Error resetting password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EBEB1]"
        />

        <button
          type="submit"
          className="w-full p-3 rounded-lg bg-[#1EBEB1] text-white font-bold hover:bg-teal-600 transition duration-300"
        >
          Reset Password
        </button>

        {message && <p className="mt-4 text-gray-600">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
