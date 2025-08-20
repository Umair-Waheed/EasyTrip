import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
const ForgotPassword=({url})=> {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
const { role } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}api/${role}/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Error sending reset link");
    }
  };

return (
  <div className="flex justify-center items-center h-screen bg-gray-100">
    <form 
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Forgot Password
      </h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EBEB1]"
      />

      <button
        type="submit"
        className="w-full p-3 rounded-lg bg-[#1EBEB1] text-white font-bold hover:bg-teal-600 transition duration-300"
      >
        Send Reset Link
      </button>

      {message && (
          <p className="mt-4 text-gray-600">{message}</p>
      )}
    </form>
  </div>
);

}
export default ForgotPassword