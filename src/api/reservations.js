import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const fetchReservations = async (params = {}) => {
  // Clean params and ensure pagination values are numbers
  const cleanParams = {
    ...Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    ),
    page: Number(params.page) || 1,
    per_page: Number(params.per_page) || 10
  };
  
  const res = await axios.get(`${API_BASE}/admin/reservations`, { 
    params: cleanParams
  });
  
  return {
    results: res.data.data,
    total: res.data.total,
    page: res.data.page,
    per_page: res.data.per_page
  };
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