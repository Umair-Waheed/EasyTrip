import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets.js';
import { toast } from 'react-toastify';
const BookingForm = ({ serviceType,setIsBooking,listingId }) => {
  const { url } = useContext(StoreContext);
  const [listing, setListing] = useState(null);
  const navigate=useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    arrivalDate: null,
    departureDate: null,
    pricingType: 'per_day',
    hours:'',
    additionalDetails: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        let reqUrl = '';
      const baseUrl = `${url}api/publicRoute`;

      switch (serviceType) {
        case 'hotel':
          reqUrl = `${baseUrl}/hotels/${listingId}`;
          break;
        case 'transport':
          reqUrl = `${baseUrl}/transports/${listingId}`;
          break;
        case 'guide':
          reqUrl = `${baseUrl}/guides/${listingId}`;
          break;
        default:
          console.log("invalid service")
      }

        const response=await axios.get(reqUrl);
        console.log(response.data.listing);
        setListing(response.data.listing);
        setError("");
      } catch (err) {
        setError('Failed to load listing');
      }
    };
    fetchListing();

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setForm(prev => ({ ...prev, fullName: user.name, email: user.email }));
    }
  }, [listingId, serviceType, url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };



     
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

     if (form.hours > 8) {
      toast.warning("Hourly bookings cannot exceed than 8 hours");
      setLoading(false);
      return;
    } 

    try {
      const token = localStorage.getItem('token');
      const formData = {
        ...form,
        arrivalDate: form.arrivalDate.toISOString().split('T')[0],
        departureDate: form.departureDate.toISOString().split('T')[0],
        serviceType
      };
      console.log(formData);
      const response = await axios.post(`${url}api/bookings/${listingId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        console.log(response.data);
        toast.success('Booking confirmed! Proceed payment from dashboard for successful booking.');
        // toast.success('Booking Successful! Please wait for owner approval.');
        setForm({
          fullName: '',
          email: '',
          contactNumber: '',
          arrivalDate: null,
          departureDate: null,
          pricingType: 'per_day',
          additionalDetails: ''
        });
        setLoading(false);
        setError("");
        navigate("/user/dashboard");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed';
      setError(msg);
      
    } finally {
      setLoading(false);
    }
  };

 const formatPrice = (amount) => {
    return amount.toLocaleString("en-PK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };
  
  console.log(listing);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  ">
      <div className="bg-white p-6  rounded-lg shadow-lg max-w-2xl w-full relative scrollable-cards overflow-y-auto max-h-[600px] space-y-4 pr-5">
        <h3 className="text-3xl font-[600] m-0 mt-3 mb-5">BOOK {serviceType.toUpperCase()}</h3>
        <button
        onClick={() => setIsBooking(false)}
        className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-black"
      >
        &times;
      </button>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* //booking policies */}
        <p className="text-red-500 text-sm" > By requesting a booking, you agree to our
        <a className='underline' href="/booking-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#007BFF", marginLeft: "4px" }}>
          Booking Policy
        </a>.</p>
        {/* Display pricing information based on service type */}
        {listing && (
          <div className="mb-4">
            {serviceType === 'hotel' ? (
              <div>
                <p className='text-[14px]' ><strong>Original Price:</strong><span className='line-through'> Rs. {formatPrice(listing.pricing?.originalPrice)}</span></p>
                  <p className='text-[14px]'><strong>Discount Price:</strong> Rs. {formatPrice(listing.pricing?.discountedPrice)} <span className='text-[#7d7f7c] text-[14px]'>&nbsp;&nbsp;//one day price</span></p>
              </div>
            ) : (
              <div>
                
              <p className='text-[14px]' ><strong>PerDay-Price:</strong> Rs. {formatPrice(listing.pricing?.perDay)} </p>
              <p className='text-[14px]'><strong>PerHour-Price:</strong> Rs. {formatPrice(listing.pricing?.perHour)} </p>
              <p className='text-[14px]'><strong>Discount-Percentage:</strong> {listing.pricing?.discountPercentage}%  <span className='text-[#7d7f7c] text-[14px]'>&nbsp;&nbsp;//discount apply after booking confirmation</span></p>  
              
              </div>
            )}
            <p className='text-[#7d7f7c] text-[14px]' >Total price show after the booking confirmation!</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium">Full Name</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
          <div className='grid grid-cols-2 gap-5'>
          <div className="mb-3">
            <label className="block text-sm font-medium">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Contact Number</label>
            <input type="text" name="contactNumber" value={form.contactNumber} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium">Arrival Date</label>
              <DatePicker selected={form.arrivalDate} onChange={date => setForm(prev => ({ ...prev, arrivalDate: date }))} dateFormat="yyyy-MM-dd" required className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Departure Date</label>
              <DatePicker selected={form.departureDate} onChange={date => setForm(prev => ({ ...prev, departureDate: date }))} dateFormat="yyyy-MM-dd" required className="w-full p-2 border rounded" />
            </div>
          </div>

          {serviceType !== 'hotel' && (
  <>
    <div className="mb-3">
      <label className="block text-sm font-medium">Pricing Type</label>
      <select
        name="pricingType"
        value={form.pricingType}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="per_day">Per Day</option>
        <option value="per_hour">Per Hour</option>
      </select>
    </div>

    {form.pricingType === 'per_hour' && (
      <div className="mb-3">
        <label className="block text-sm font-medium">Number of Hours</label>
        <input
          type="number"
          name="hours"
          value={form.hours || ''}
          onChange={handleChange}
          min={1}
          className="w-full p-2 border rounded"
          placeholder="Enter number of hours"
          required
        />
      </div>
    )}
  </>
)}

          <div className="mb-3">
            <label className="block text-sm font-medium">Additional Details</label>
            <textarea name="additionalDetails"   placeholder="Mention any special requests or preferences here..."
                 value={form.additionalDetails} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <button type="submit" disabled={loading} className="w-full p-2 bg-[#1EBEB1] text-white rounded">
            {loading ? 'Processing...' : 'Submit Booking Form'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
