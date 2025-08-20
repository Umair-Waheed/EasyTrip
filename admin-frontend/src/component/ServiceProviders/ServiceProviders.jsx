import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

const ServiceProviders = ({ url, token }) => {
  const [providers, setProviders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${url}api/admin/serviceproviders`, {
          headers: { authorization: `Bearer ${token}` },
        });
        setProviders(response.data.providers || []);
      } catch (err) {
        console.error("Error fetching providers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, [url, token]);

  const handleStatusChange = async (id, status) => {
    try {
      setLoading(true);
      await axios.put(`${url}api/admin/serviceproviders/${id}`, 
        {status}, 
        {
        headers: { authorization: `Bearer ${token}` },
      });

      setProviders((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status: status } : p
        )
      );
      toast.success("ServiceProvider status updated!")
    } catch (err) {
      console.error("Error updating provider", err);
    } finally {
      setLoading(false);
    }
  };
  console.log(providers)

  // Apply filters
  const filteredProviders = providers.filter((p) => {
    const statusMatch =
      statusFilter === "all" ? true : p.status === statusFilter;
    const typeMatch =
      serviceTypeFilter === "all" ? true : p.serviceType === serviceTypeFilter;
    return statusMatch && typeMatch;
  });

  const sortedProviders = [...filteredProviders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        Provider Management
      </h1>

      {/* Filter buttons */}
      <div className="flex flex-wrap justify-between gap-3 mb-6">
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg ${
                statusFilter === s
                  ? "bg-[#1EBEB1] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

         {/* Service Type Dropdown */}
        <select
  value={serviceTypeFilter}
  onChange={(e) => setServiceTypeFilter(e.target.value)}
  className="rounded-lg px-3 py-2 bg-gray-200 text-gray-800 focus:outline-none cursor-pointer"
>
  <option value="all">All Service Types</option>
  <option value="hotel">Hotel</option>
  <option value="transport">Transport</option>
  <option value="guide">Guide</option>
</select>

      </div>

      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1EBEB1]"></div>
        </div>
      ) : sortedProviders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No providers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {sortedProviders.map((provider) => (
            <div
              key={provider._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                {/* Status badge */}
                <div className="flex justify-end mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[provider.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {provider.status.charAt(0).toUpperCase() +
                      provider.status.slice(1)}
                  </span>
                </div>

                {/* Provider details */}
                <div className="space-y-3 mb-3 border-b pb-3 border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Provider ID:</span>
                    <span className="font-medium">{provider._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Business Name:</span>
                    <span className="font-medium">{provider.businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium">{provider.serviceType?.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Business Registration/License No:</span>
                    <span className="font-medium">{provider.registrationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Owner:</span>
                    <span className="font-medium">{provider.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank Name:</span>
                    <span className="font-medium">{provider.bankAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account No.</span>
                    <span className="font-medium">{provider.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact:</span>
                    <span className="font-medium">{provider.contactNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">{provider.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{provider.country},{provider.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Earnings:</span>
                    <span className="font-medium">{provider.totalEarning}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-500">Verified:</span>
                    <span className="font-medium">{provider.verified==true?'yes':'No'}</span>
                  </div> */}
                 
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created At:</span>
                    <span className="font-medium">
                      {new Date(provider.createdAt).toLocaleString("en-PK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>

                {/* socail details */}
                <div className="space-y-3 mb-3 border-b pb-3 border-gray-200">
                    {provider.facebookLink && (
                    <a
                      href={provider.facebookLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1EBEB1] underline text-sm"
                    >
                      Facebook Link 
                    </a>
                  )} <br />
                  {provider.instagramLink && (
                    <a
                      href={provider.instagramLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1EBEB1] underline text-sm"
                    >
                      Instagram Link 
                    </a>
                  )} <br />
                  {provider.linkedinLink && (
                    <a
                      href={provider.linkedinLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1EBEB1] underline text-sm"
                    >
                      Linkedin Link 
                    </a>
                  )} <br />
                </div>
                
                {/* Show uploaded docs */}
                <div className="space-y-2">
                    {provider.image && (
                    <a
                      href={provider.image?.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1EBEB1] underline text-sm"
                    >
                      Profile Image
                    </a>
                  )} <br />
                  {provider.governmentId && (
                    <a
                      href={provider.governmentId?.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1EBEB1] underline text-sm"
                    >
                      Government ID
                    </a>
                  )} <br />
                  {provider.hotelLicense && (
                    <a
                      href={provider.hotelLicense?.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1EBEB1] underline text-sm"
                    >
                      Hotel License
                    </a>
                  )} <br/> 
                  {provider.driverLicense && (
                    <a
                      href={provider.driverLicense?.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1EBEB1] underline text-sm"
                    >
                      Driver License
                    </a>
                  )}
                  <br/>
                  {provider.guideCertificate && (
                    <a
                      href={provider.guideCertificate?.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1EBEB1] underline text-sm"
                    >
                      Guide Certificate
                    </a>
                  )}
                </div>
              </div>

              {/* Action buttons only if pending */}
              {provider.status === "pending" && (
                <div className="flex gap-2 mt-5 mx-5 mb-5">
                  <button
                    className="px-6 py-2 rounded-lg bg-[#1ebeb1] text-white hover:bg-[#28b5a9] transition-colors cursor-pointer"
                    onClick={() =>
                      handleStatusChange(provider._id, "approved")
                    }
                    disabled={loading}
                  >
                    Approve
                  </button>

                  <button
                    className="px-6 py-2 border rounded-lg text-gray-800 hover:bg-red-600 transition-colors hover:text-white cursor-pointer"
                    onClick={() =>
                      handleStatusChange(provider._id, "rejected")
                    }
                    disabled={loading}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceProviders;
