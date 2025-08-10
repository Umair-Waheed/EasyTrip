import React, { useState, useContext, useEffect } from 'react';
import "./GetDestinations.css";
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext.jsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Map from '../../Map/Map.jsx';
import { toast } from 'react-toastify';

const GetDestinations = () => {
  const { url, token } = useContext(StoreContext);
  const [destinationListings, setDestinationListings] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  const listingDeleteHandler = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;
    try {
      const response = await axios.delete(`${url}api/destinations/${id}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success("Listing deleted successfully!");
        setDestinationListings(prev => prev.filter(dest => dest._id !== id));
      }
    } catch (error) {
      toast.error("Error deleting listing.");
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${url}api/destinations`, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setDestinationListings(response.data.destListings);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [url, token]);

  return (
    <div className='get-hotel-listing'>
      <h2 className='text-2xl md:text-3xl font-bold text-[#1EBEB1] text-center mb-8'>All Destinations</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1EBEB1]"></div>
        </div>
      ) : destinationListings.length > 0 ? (
        <div className="listing-grid">
          {destinationListings.map((listing) => {
            const destination = {
              lat: listing.coordinates?.[1] || 0,
              lng: listing.coordinates?.[0] || 0,
            };

            return (
              <div key={listing._id} className="listing-card">
                <div className="image-slider-container">
                  <Slider {...sliderSettings}>
                    {listing.images?.map((img, index) => (
                      <div key={index} className="slider-image-wrapper">
                        <img
                          className="listing-image"
                          src={img}
                          alt={`Destination ${index + 1}`}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>

                <div className="listing-basic">
                  <h3 className='text-[#1EBEB1] truncate'>
                    <span title={listing.name}>
                      {listing.name.length > 15 
                        ? listing.name.substring(0, 15).toUpperCase() + '...'
                        : listing.name.toUpperCase()}
                    </span>
                  </h3>

                  <p className='truncate'>
                    <span className="category font-[500]">{listing.climate}</span> |{' '}
                    <LocationOnIcon sx={{ fontSize: "large" }} />
                    {listing.location}, {listing.country}
                  </p>
                  <p><span className='font-[500]'>Price Range:</span> {listing.priceRange}</p>

                  <div className="listing-actions">
                    <EditIcon className="icon" sx={{ color: "#1EBEB1" }} />
                    <span onClick={() => listingDeleteHandler(listing._id)}>
                      <DeleteIcon className="icon" sx={{ color: "red" }} />
                    </span>
                  </div>

                  <button onClick={() => toggleExpand(listing._id)} className="expand-btn">
                    {expanded[listing._id] ? (
                      <>Collapse <KeyboardArrowUpIcon /></>
                    ) : (
                      <>Expand <ExpandMoreIcon /></>
                    )}
                  </button>
                </div>

                {expanded[listing._id] && (
                  <div className="listing-expanded">
                    <p className='line-clamp-4'><strong>Description:</strong> {listing.description}</p>
                    <div><strong>Category:</strong> {listing.category?.join(', ') || 'N/A'}</div>
                    <div><strong>Safety Level:</strong> {listing.safetyLevel}</div>
                    <div><strong>Climate:</strong> {listing.climate}</div>
                    <div className="mb-5"><strong>Best Visited In:</strong> {listing.bestVisitedIn?.join(', ') || 'N/A'}</div>
                    <Map destination={destination} />

                    <hr />

                    <p className="text-xs text-gray-900 mt-3">
                      <strong>Created At:</strong> {' '}
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className='text-center'>No destinations available.</p>
      )}
    </div>
  );
};

export default GetDestinations;
