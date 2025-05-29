import axios from "axios";

const API_URL = "https://localhost:7239/api/users/";

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
