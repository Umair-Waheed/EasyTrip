import { useState, useContext,useRef } from 'react';
import axios from 'axios';
import "./AddDestinations.css"
import compressImage from "../../../utils/compressImage.js"
import { StoreContext } from '../../../context/StoreContext';
import { toast } from 'react-toastify';

const categories=[ 
  "Mountain",
  "Nature",
  "Adventure",
  "Waterspot",
  "Camping",
  "Hiking",
  "Beach",
  "Historical",
  "Religious",
  "Urban",
  "Cultural",
]
const AddDestinations = () => {
  const [destinationData, setDestinationData] = useState({
    name: '',
    description: '',
    location: '',
    longitude:'',
    latitude:'',
    country: '',
    category: [],
    safetyLevel: 'Medium',
    priceRange: '',
    bestVisitedIn: [],
    climate: ''
  });
  const imageRef=useRef(null);

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { url, token } = useContext(StoreContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Determine which array to update based on the checkbox name
      if (name === 'bestVisitedIn') {
        // Handle season checkboxes
        const newSeasons = checked 
          ? [...destinationData.bestVisitedIn, value]
          : destinationData.bestVisitedIn.filter(season => season !== value);
        
        setDestinationData({
          ...destinationData,
          bestVisitedIn: newSeasons
        });
      } else if (name === 'category') {
        // Handle category checkboxes
        const newCategories = checked 
          ? [...destinationData.category, value]
          : destinationData.category.filter(cat => cat !== value);
        
        setDestinationData({
          ...destinationData,
          category: newCategories
        });
      }
    } else {
      // Handle all other inputs
      setDestinationData({ ...destinationData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      
      // Compress and append images
      const compressedImages = [];
      for(const image of images) {
        const compressedImage = await compressImage(image);
        compressedImages.push(compressedImage);
      }
      compressedImages.forEach((image) => formData.append('images', image));

      // Append all form fields
      Object.entries(destinationData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      });
      

      const response = await axios.post(`${url}api/destinations`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success('Listing added successfully!');
        // Reset form
        setDestinationData({
          name: '',
          description: '',
          location: '',
          country: '',
          longitude:'',
          latitude:'',
          category: [],
          safetyLevel: 'Medium',
          priceRange: '',
          bestVisitedIn: [],
          climate: ''
        });
        setImages([]);
        if (imageRef.current) {
          imageRef.current.value = ''; // Reset file input
        }
      setIsLoading(false);

      }
    } catch (error) {
      // console.error('Error:', error.response?.data || error.message);
      toast.error('Submission failed! Please try again.');
    } 
  };

  return (
    <div className="add-dest-listing-container max-w-4xl mx-auto p-8 mt-4 bg-white shadow-xl rounded">
      <h2 className="text-3xl text-[#1EBEB1] font-bold mb-8 text-center">Add Destinations</h2>
      <form onSubmit={handleSubmit} className="add-dest-listing-form grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Existing fields */}
        <div className='md:col-span-2'>
          <label className="add-destination-listing-form-label font-semibold">Destination Name</label>
          <input type="text" placeholder="E.g. Hunza, Skardu" name="name" 
            value={destinationData.name} onChange={handleChange} required 
            className="w-full px-4 py-2 border rounded" />
        </div>

        <div className="md:col-span-2">
          <label className="add-dest-listing-form-label font-semibold">Description</label>
          <textarea name="description" value={destinationData.description} 
            onChange={handleChange} rows={4} 
            className="w-full px-4 py-2 border rounded" />
        </div>

        {/* categories */}
        
        <div className="md:col-span-2">
          <label className="add-dest-listing-form-label font-semibold">Categories</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center space-x-2">
                <input type="checkbox" name="category" value={cat}
                  checked={destinationData.category.includes(cat)}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 mr-2 text-[#1EBEB1]" />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* <div>
          <label className="add-dest-listing-form-label font-semibold">Category</label>
          <select name="category" value={destinationData.category} onChange={handleChange}
            className="w-full px-4 py-2 border rounded" required>
            <option value="">Select Category</option>
            <option value="Beach">Beach</option>
            <option value="Mountain">Mountain</option>
            <option value="Historical">Historical</option>
            <option value="Religious">Religious</option>
            <option value="Adventure">Adventure</option>
            <option value="Urban">Urban</option>
            <option value="Nature">Nature</option>
            <option value="Cultural">Cultural</option>
          </select>
        </div> */}

        <div>
          <label className="add-dest-listing-form-label font-semibold">Price Range</label>
          <select name="priceRange" value={destinationData.priceRange} onChange={handleChange}
            className="w-full px-4 py-2 border rounded" required>
            <option value="">Select Price Range</option>
            <option value="Budget">Budget</option>
            <option value="Mid-Range">Mid-Range</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>

        <div>
          <label className="add-dest-listing-form-label font-semibold">Safety Level</label>
          <select name="safetyLevel" value={destinationData.safetyLevel} onChange={handleChange}
            className="w-full px-4 py-2 border rounded">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="add-dest-listing-form-label font-semibold">Climate</label>
          <select name="climate" value={destinationData.climate} onChange={handleChange}
            className="w-full px-4 py-2 border rounded">
            <option value="">Select Climate</option>
            <option value="Tropical">Tropical</option>
            <option value="Arid">Arid</option>
            <option value="Temperate">Temperate</option>
            <option value="Continental">Continental</option>
            <option value="Polar">Polar</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="add-dest-listing-form-label font-semibold">Best Visited In</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['Winter', 'Spring', 'Summer', 'Autumn'].map((season) => (
              <label key={season} className="flex items-center space-x-2">
                <input type="checkbox" name="bestVisitedIn" value={season}
                  checked={destinationData.bestVisitedIn.includes(season)}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 mr-2 text-[#1EBEB1]" />
                <span>{season}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="add-dest-listing-form-label font-semibold">Location</label>
          <input type="text" placeholder="E.g. Gilgit-Baltistan" name="location" 
            value={destinationData.location} onChange={handleChange} required 
            className="w-full px-4 py-2 border rounded" />
        </div>

        <h2 className="add-dest-listing-form-label text-[22px] mb-0 font-semibold md:col-span-2">Coordinates</h2>
        <div>
            <label className="add-dest-listing-form-label font-semibold">Longitude</label>
            <input type="number" placeholder="E.g. 74.6500° E" name="longitude" 
              value={destinationData.longitude} onChange={handleChange} required 
              className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="add-dest-listing-form-label font-semibold">Latitude</label>
            <input type="number" placeholder="E.g. 36.3167° N" name="latitude" 
              value={destinationData.latitude} onChange={handleChange} required 
              className="w-full px-4 py-2 border rounded" />
          </div>

        <div>
          <label className="add-dest-listing-form-label font-semibold">Country</label>
          <input type="text" name="country" value={destinationData.country} placeholder='E.g. Pakistan'
            onChange={handleChange} required 
            className="w-full px-4 py-2 border rounded"
             />
        </div>

        <div className='md:col-span-2'>
          <label className="add-dest-listing-form-label font-semibold">Destination Images (max 5)</label>
          <input type="file" multiple accept="image/*" 
            onChange={handleImageChange} ref={imageRef}
            className="w-full px-4 py-2 border rounded" />
          <small className="text-gray-500">*Supported formats: JPG, PNG, JPEG</small>
        </div>

        <div className="md:col-span-2 text-center">
          <button type="submit" disabled={isLoading}
            className="w-full bg-[#1EBEB1] hover:bg-[#149d95] text-white py-3 rounded transition-colors">
            {isLoading ? 'Submitting...' : 'Submit Listing'}
          </button>
        </div>
      </form>
    </div>  
  )
}

export default AddDestinations;