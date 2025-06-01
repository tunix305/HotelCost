// src/services/authService.js
import axios from "axios";

const API_URL = "http://www.hotelcost.somee.com/api/Users/";

export const login = async (credenciales) => {
  try {
    const response = await axios.post(`${API_URL}login`, credenciales);
    return response.data; // Aquí puedes guardar token o usuario
  } catch (error) {
    throw error.response?.data || { message: "Error de conexión" };
  }
};
