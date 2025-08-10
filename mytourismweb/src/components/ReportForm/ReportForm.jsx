import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
const ReportForm = ({ url, token,onClose }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}api/reports/send`, {
        subject,
        message
      }, {
        headers: { authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success("You query submited!");
        setSubject("");
        setMessage("");
      }
    } catch (err) {
      toast.error("Failed to submit query.");
    }
  };

return (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
    <form onSubmit={handleSubmit} className="w-[400px] bg-white rounded-xl p-5 shadow-xl">
       
      <h2 className="text-[#1EBEB1] mb-5 text-xl text-center font-semibold">Contact Support Team</h2>

      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        required
        className="w-full border mb-3 p-2 rounded"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message..."
        rows={5}
        required
        className="w-full border p-2 mb-3 rounded"
      />
      <button type="submit" className="bg-[#1ebeb1] mb-2 text-white px-4 py-2 rounded w-full hover:bg-[#28b5a9] transition">
        Send Message
      </button>
      <button onClick={onClose} type="submit" className="border border-gray-300 text-[#1EBEB1] px-4 py-2 rounded w-full hover:bg-gray-100 transition">
        Cancel 
      </button>
    </form>
  </div>
);


};

export default ReportForm;
