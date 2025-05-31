import axios from "axios";

const API_URL = "http://hotelcost.somee.com/api/users/";

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
