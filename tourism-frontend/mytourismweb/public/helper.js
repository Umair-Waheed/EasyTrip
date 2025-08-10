import axios from "axios";

const destination = async (setHomeDestination) => {
  const url = "http://localhost:4000/";
  try {
    const response = await axios.get(`${url}api/publicRoute/destinations`);
    // console.log(response.data);

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
  const url = "http://localhost:4000/";
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
  const url = "http://localhost:4000/";
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
  const url = "http://localhost:4000/";
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

export { destination, transport, hotel, guide };
