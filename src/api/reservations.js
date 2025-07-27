import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const fetchReservations = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
  );
  
  const res = await axios.get(`${API_BASE}/admin/reservations`, { 
    params: {
      ...cleanParams,
      page: params.page || 1,
      per_page: params.per_page || 10
    }
  });
  return res.data;
};

export const deleteReservation = async (id) => {
  const res = await axios.delete(`${API_BASE}/admin/reservations/${id}`);
  return res.data;
};

export const updateReservationStatus = async (id, status) => {
  const res = await axios.patch(`${API_BASE}/admin/reservations/${id}`, {
    status,
  });
  return res.data;
};