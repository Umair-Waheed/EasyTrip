import React, { useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContext.jsx'
import { useContext } from 'react'
import axios from "axios"
import "./PaymentDetails.css"

const PaymentDetails = ({formatPrice}) => {
    const { url, token } = useContext(StoreContext);
    const [payments, setPayments] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'held', 'completed', 'failed', 'refunded'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}api/payment/paymentdetails`, {
                    headers: { authorization: `Bearer ${token}` },
                });
                if (response.data.success) {
                    setPayments(response.data.payments);
                }
            } catch (error) {
                console.error('Error fetching payments:', error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPayments();
    }, [url, token]);
    console.log(payments);
    const filteredPayments = payments.filter(payment => {
        if (filter === 'all') return true;
        return payment.status === filter;
    });

     const sortedPayments=[...(filteredPayments || [])].sort((a,b)=>
    new Date(b.createdAt) - new Date(a.createdAt));

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        held: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
        refunded: 'bg-purple-100 text-purple-800'
    };

    const transferStatusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        refunded: 'bg-purple-100 text-purple-800'
    };

    return (
        <div className="container mx-auto px-4 py-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Payment Management</h1>
            
            <div className="flex gap-3 space-x-2 mt-8 mb-5 flex-wrap">
                <button 
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-[#1EBEB1] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    All
                </button>
                {/* <button 
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-[#1EBEB1] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Pending
                </button> */}
                <button 
                    onClick={() => setFilter('held')}
                    className={`px-4 py-2 rounded-lg ${filter === 'held' ? 'bg-[#1EBEB1] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Held
                </button>
                <button 
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-[#1EBEB1] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Completed
                </button>
                {/* <button 
                    onClick={() => setFilter('failed')}
                    className={`px-4 py-2 rounded-lg ${filter === 'failed' ? 'bg-[#1EBEB1] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Failed
                </button> */}
                <button 
                    onClick={() => setFilter('refunded')}
                    className={`px-4 py-2 rounded-lg ${filter === 'refunded' ? 'bg-[#1EBEB1] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Refunded
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1EBEB1]"></div>
                </div>
            ) : sortedPayments.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">No payments found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {sortedPayments.map((payment) => (
                        <div key={payment._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex justify-end gap-1 mb-2 items-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[payment.status] || 'bg-gray-100 text-gray-800'}`}>
                                           Payment: {payment.status}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${transferStatusColors[payment.transferStatus] || 'bg-gray-100 text-gray-800'}`}>
                                            Transfer: {payment.transferStatus}
                                        </span>
                                    </div>
                                <div className="border-b border-gray-100 mb-2">
                                      <div className="flex justify-between">
                                            <span className="text-gray-500">Transaction ID:</span>
                                            <span className="font-medium">#{payment.transactionId}</span>
                                        </div>
                                      <div className="flex justify-between">
                                            <span className="text-gray-500">Payment ID:</span>
                                            <span className="font-medium">#{payment._id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Payment Date:</span>
                                            <span className="font-medium">{new Date(payment.createdAt).toLocaleString('en-PK', {dateStyle: 'medium',timeStyle: 'short'})}</span>
                                        </div>
                                    
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Booking ID:</span>
                                        <span className="font-medium">{payment.booking}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">User ID:</span>
                                        <span className="font-medium">{payment.user}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Provider ID:</span>
                                        <span className="font-medium">{payment.provider}</span>
                                    </div>
                                    {/* <div className="flex justify-between">
                                        <span className="text-gray-500">Hold Status:</span>
                                        <span className="font-medium">{payment.holdStatus ? 'Yes' : 'No'}</span>
                                    </div> */}
                                </div>

                                <div className="mt-2 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-500">Total Amount:</span>
                                        <span className="text-lg font-bold text-[#1EBEB1]">
                                            Rs.{formatPrice(payment.amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-500">Provider Amount:</span>
                                        <span className="text-md font-medium text-gray-700">
                                            Rs.{formatPrice(payment.providerAmount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-500">Admin Commission:</span>
                                        <span className="text-md font-medium text-gray-700">
                                            Rs.{formatPrice(payment.commissionAmount)}
                                        </span>
                                    </div>
                                    {payment.refundedAmount > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500">Refunded Amount:</span>
                                            <span className="text-md font-medium text-red-500">
                                                Rs.{formatPrice(payment.refundedAmount)} 
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Transfer Date:</span>
                                        <span className="font-medium">{new Date(payment.updatedAt).toLocaleString('en-PK', {dateStyle: 'medium',timeStyle: 'short'})}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PaymentDetails;