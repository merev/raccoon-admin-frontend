import { useEffect, useState } from "react";
import {
  fetchReservations,
  deleteReservation,
  updateReservationStatus,
} from "../api/reservations";

import "./Reservations.css";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0
  });

  const [filters, setFilters] = useState({
    name: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = {
        ...filters,
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined,
        page,
        per_page: pagination.per_page
      };

      const data = await fetchReservations(queryParams);
      setReservations(data.results); // Assuming your API returns {results, total}
      setPagination(prev => ({
        ...prev,
        page,
        total: data.total
      }));
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

    // Add pagination controls
  const PaginationControls = () => (
    <div className="pagination">
      <button 
        onClick={() => loadData(pagination.page - 1)}
        disabled={pagination.page === 1}
      >
        Previous
      </button>
      <span>Page {pagination.page} of {Math.ceil(pagination.total / pagination.per_page)}</span>
      <button 
        onClick={() => loadData(pagination.page + 1)}
        disabled={pagination.page * pagination.per_page >= pagination.total}
      >
        Next
      </button>
    </div>
  );

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Delete this reservation?")) {
      await deleteReservation(id);
      loadData();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateReservationStatus(id, newStatus);
    loadData(); // refresh table after update
  };

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleResetFilters = () => {
  setFilters({
    name: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });
  // No need to call loadData here - the useEffect will trigger it
};

  return (
    <div className="container">
      <h1>Reservations</h1>
      <button className="refresh" onClick={loadData}>🔄 Refresh</button>
      <form onSubmit={handleSearch} style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleInputChange}
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleInputChange}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="declined">Declined</option>
          <option value="completed">Completed</option>
        </select>
        <div style={{ display: "flex", gap: "5px" }}>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleInputChange}
            placeholder="From date"
          />
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleInputChange}
            placeholder="To date"
          />
        </div>
        <button type="submit" className="search-button">🔍 Filter</button>
        <button 
          type="button" 
          onClick={handleResetFilters}
          className="reset-button"
        >
          ❌ Clear
        </button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.phone}</td>
                <td>{r.date}</td>
                <td>{r.time}</td>
                <td>
                  <select
                    value={r.status}
                    onChange={(e) => handleStatusChange(r.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="declined">Declined</option>
                  </select>
                </td>
                <td>
                  <button className="delete" onClick={() => handleDelete(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <PaginationControls />
    </div>
  );
}
