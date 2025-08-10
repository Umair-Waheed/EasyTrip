import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const Report = ({url,token}) => {
  const [reports, setReports] = useState([]);
  const [replyForms, setReplyForms] = useState({});
  const [replies, setReplies] = useState({});

  // Fetch all reports on load
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${url}api/reports/admin`,
            {
            headers:{
                authorization:`Bearer ${token}`
            }
            }); // Your actual API route
        if (res.data.success) {
          setReports(res.data.reports);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
      }
    };
    fetchReports();
  }, []);
console.log(reports)
  // Toggle reply form visibility
  const toggleReplyForm = (reportId) => {
    setReplyForms((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  // Handle reply submission
  const handleReplySubmit = async (reportId, userId,reportSubject) => {
    try {
      const replyMessage = replies[reportId];
      const res = await axios.put(`${url}api/reports/reply/${reportId}`, {
        userId,
        reportSubject,
        message: replyMessage,
      },
    {
        headers:{authorization: `Bearer ${token}`}
    }
    );
    console.log(res.data.message);
      if (res.data.success) {
        toast(`${res.data.message}`)
        setReplyForms((prev) => ({ ...prev, [reportId]: false }));
        setReplies((prev) => ({ ...prev, [reportId]: '' }));
      }else{
         toast(`${res.data.message}`)

      }
    } catch (err) {
      console.error('Reply failed:', err);
      toast(err)
    }
  };
  const sortedReports=[...(reports || [])].sort((a,b)=>
      new Date(b.createdAt) - new Date(a.createdAt));
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#1EBEB1]">User Reports</h2>

      {sortedReports.length === 0 ? (
        <p className="text-gray-600">No reports found.</p>
      ) : (
        sortedReports.map((report) => (
          <div key={report._id} className="bg-white p-4 shadow-md rounded-md mb-6">
            <p><strong>From User ID:</strong> {report.userId}</p>
            <p><strong>Subject:</strong> {report.subject}</p>
            <p><strong>Message:</strong> {report.message}</p>
            <p><strong>Replied Status:</strong> {report.status}</p>
            <p><strong>Reponse:</strong> {report.adminResponse}</p>
            <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleString('en-PK', {dateStyle: 'medium',timeStyle: 'short'})}</p>
          {report.status != 'replied' &&
            (<button
              className="mt-3 px-4 py-1 bg-[#1EBEB1] text-white rounded hover:bg-[#1aa9a0] transition"
              onClick={() => toggleReplyForm(report._id)}
            >
              {replyForms[report._id] ? 'Close Reply' : 'Reply'}
            </button>)}

            {replyForms[report._id] && (
              <div className="mt-4">
                <textarea
                  rows="4"
                  placeholder="Write your reply..."
                  className="w-full border p-2 rounded mb-2"
                  value={replies[report._id] || ''}
                  onChange={(e) =>
                    setReplies((prev) => ({
                      ...prev,
                      [report._id]: e.target.value,
                    }))
                  }
                />
                <button
                  onClick={() => handleReplySubmit(report._id, report.userId,report.subject)}
                  className="px-4 py-2 bg-white border border-gray-200 text-[#1EBEB1] rounded hover:bg-gray-100"
                >
                  Send Reply
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Report;
