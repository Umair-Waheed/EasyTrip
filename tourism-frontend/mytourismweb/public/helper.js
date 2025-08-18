import axios from "axios";
const url="https://easytrip-production.up.railway.app/";

const destination = async (setHomeDestination) => {  
// let url="http://localhost:4000/"
const destination = async (setHomeDestination) => {
  try {
    const response = await axios.get(`${url}api/publicRoute/destinations`);

    if (response.data.success) {
      console.log(response.data.destListings);
      setHomeDestination(response.data.destListings);
    }
  } catch (error) {
    //   alert(response.data.message);
    console.log(error);
  }
};

const transport = async (setHomeTransport) => {
  try {
    const response = await axios.get(`${url}api/publicRoute/transports`);
    // console.log(response.data);

    if (response.data.success) {
      console.log(response.data.listing);
      setHomeTransport(response.data.listing);
    }
  } catch (error) {
    //   alert(response.data.message);
    console.log(error);
  }
};

const hotel = async (setHomeHotel) => {
  try {
    const response = await axios.get(`${url}api/publicRoute/hotels`);
    // console.log(response.data);

    if (response.data.success) {
      console.log(response.data.listing);
      setHomeHotel(response.data.listing);
    }
  } catch (error) {
    //   alert(response.data.message);
    console.log(error);
  }
};
const guide = async (setHomeGuide) => {
  try {
    const response = await axios.get(`${url}api/publicRoute/guides`);
    // console.log(response.data);

    if (response.data.success) {
      console.log(response.data.listing);
      setHomeGuide(response.data.listing);
    }
  } catch (error) {
    //   alert(response.data.message);
    console.log(error);
  }
};
}

export { destination, transport, hotel, guide }
