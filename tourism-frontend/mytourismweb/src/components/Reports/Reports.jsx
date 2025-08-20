import React, { useState, useEffect } from "react";
import axios from "axios";
const UserReports = ({ url, token }) => {
  const [reports, setReports] = useState([]);
  

  // Fetch all reports on load
  useEffect(() => {
    let userId = "";
    if (token) {
      const decodeToken = JSON.parse(atob(token.split(".")[1]));
      userId = decodeToken.id;
    }
    console.log(userId)
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${url}api/reports/user/${userId}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }); // Your actual API route
        if (res.data.success) {
          setReports(res.data.reports);
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };
    fetchReports();
  }, []);
  console.log(reports);

  const sortedReports = [...(reports || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="p-3 max-w-4xl mx-auto">
      <h2 className="text-3xl mb-4 font-bold text-gray-800">My Reports</h2>

      {sortedReports.length === 0 ? (
        <p className="text-gray-600">No reports found.</p>
      ) : (
        sortedReports.map((report) => (
          <div
            key={report._id}
            className="bg-white p-4 shadow-md rounded-md mb-6"
          >
            <p>
              <strong>User ID:</strong> {report.userId}
            </p>
            <p>
              <strong>Subject:</strong> {report.subject}
            </p>
            <p>
              <strong>Message:</strong> {report.message}
            </p>
            <p>
              <strong>Report Status:</strong> {report.status}
            </p>
            {report.adminResponse && (
            <p>
              <strong>Team Reponse:</strong> {report.adminResponse}
            </p>
            )}
            <p>
              <strong>Report Date:</strong>{" "}
              {new Date(report.createdAt).toLocaleString("en-PK", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            {report.createdAt !== report.updatedAt && (
                <p>
              <strong>Response Date:</strong>{" "}
              {new Date(report.updatedAt).toLocaleString("en-PK", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            )}
            
        
          </div>
        ))
      )}
    </div>
  );
};

export default UserReports;
