import { useEffect, useState } from "react";
import {
  fetchReservations,
  deleteReservation,
  updateReservationStatus,
} from "../api/reservations";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    name: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  const loadData = async () => {
    setLoading(true);
    const queryParams = {
      ...filters,
      date_from: filters.dateFrom || undefined,
      date_to: filters.dateTo || undefined,
    };
    delete queryParams.dateFrom;
    delete queryParams.dateTo;

    const data = await fetchReservations();
    setReservations(data);
    setLoading(false);
  };

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

  return (
    <div className="container">
      <h1>Reservations</h1>
      <button className="refresh" onClick={loadData}>🔄 Refresh</button>
      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
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
        <input
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleInputChange}
        />
        <button type="submit">🔍 Filter</button>
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
    </div>
  );
}
