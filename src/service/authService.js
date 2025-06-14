import axios from "axios";

const API_URL = "https://hotelcostmx.somee.com/api/Users/";

export const login = async (credenciales) => {
  try {
    const response = await axios.post(`${API_URL}login`, credenciales);
    return response.data; 
  } catch (error) {
    throw error.response?.data || { message: "Error de conexión" };
  }
};
