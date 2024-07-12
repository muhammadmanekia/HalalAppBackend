const axios = require("axios");

async function getNearbyRestaurants(API_URL) {
  try {
    console.log(API_URL + "restaurants");
    const response = await axios.get(`${API_URL}restaurants`);
    console.log(response);
  } catch (error) {
    console.log(error);
    //   Alert.alert('Error', 'Unable to fetch restaurants at this time.', [
    //     {text: 'Okay'},
    //   ]);
  }
}

getNearbyRestaurants("https://halalappbackend.onrender.com/");
