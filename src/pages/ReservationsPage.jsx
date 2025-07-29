import { useEffect, useState, useCallback } from "react";
import {
  fetchReservations,
  deleteReservation,
  updateReservationStatus,
} from "../api/reservations";

import "./Reservations.css";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
  };

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0
  });

  const [filters, setFilters] = useState({
    name: "",
    status: "",
    subscription: "",
    dateFrom: "",
    dateTo: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchReservations({
        ...filters,
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined,
        page: pagination.page,
        per_page: pagination.per_page
      });

      setReservations(response.results);
      setPagination(prev => ({
        ...prev,
        total: response.total
      }));
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.per_page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const nextPage = () => {
  const totalPages = Math.ceil(pagination.total / pagination.per_page);
    if (pagination.page < totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };


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
    setPagination(prev => ({ ...prev, page: 1 }));
  };

   // Update your pagination controls in the JSX:
  const totalPages = Math.ceil(pagination.total / pagination.per_page);


  const handleResetFilters = () => {
  setFilters({
    name: "",
    status: "",
    subscription: "",
    dateFrom: "",
    dateTo: "",
  });
  // No need to call loadData here - the useEffect will trigger it
};

const ReservationDetailsModal = () => (
  <div className={`modal ${isModalOpen ? 'open' : ''}`}>
    <div className="modal-content">
      <span className="close" onClick={closeModal}>&times;</span>
      {selectedReservation && (
        <div className="reservation-details">
          <h2>Reservation Details</h2>
            <div className="details-grid">
            <div className="detail-item">
              <strong>ID:</strong>
              <span>{selectedReservation.id}</span>
            </div>
            <div className="detail-item">
              <strong>Created At:</strong>
              <span>{new Date(selectedReservation.created_at).toLocaleString()}</span>
            </div>
             <div className="detail-item">
              <strong>Service Type:</strong>
              <span>{selectedReservation.service_type}</span>
            </div>
            <div className="detail-item">
              <strong>Name:</strong>
              <span>{selectedReservation.name}</span>
            </div>
            <div className="detail-item">
              <strong>Email:</strong>
              <span>{selectedReservation.email}</span>
            </div>
            <div className="detail-item">
              <strong>Phone:</strong>
              <span>{selectedReservation.phone}</span>
            </div>
            <div className="detail-item">
              <strong>Address:</strong>
              <span>{selectedReservation.address}</span>
            </div>
            <div className="detail-item">
              <strong>Date:</strong>
              <span>{selectedReservation.date}</span>
            </div>
            <div className="detail-item">
              <strong>Time:</strong>
              <span>{selectedReservation.time}</span>
            </div>
            <div className="detail-item">
              <strong>Status:</strong>
              <span className={`status-${selectedReservation.status.toLowerCase()}`}>
                {selectedReservation.status}
              </span>
            </div>
            <div className="detail-item">
              <strong>Flat Type:</strong>
              <span>{selectedReservation.flat_type}</span>
            </div>
            <div className="detail-item">
              <strong>Subscription:</strong>
              <span>{selectedReservation.subscription}</span>
            </div>
            <div className="detail-item">
              <strong>Plan:</strong>
              <span>{selectedReservation.plan || 'Custom'}</span>
            </div>
            <div className="detail-item">
              <strong>Total Price:</strong>
              <span>{selectedReservation.total_price} лв</span>
            </div>
            {selectedReservation.info && (
              <div className="detail-item full-width">
                <strong>Additional Info:</strong>
                <p>{selectedReservation.info}</p>
              </div>
            )}
            {selectedReservation.activities?.length > 0 && (
              <div className="detail-item full-width">
                <strong>Activities:</strong>
                <ul>
                  {selectedReservation.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="modal-actions">
            <button 
              className="status-button"
              onClick={() => {
                handleStatusChange(selectedReservation.id, 'confirmed');
                closeModal();
              }}
              disabled={selectedReservation.status === 'confirmed'}
            >
              Confirm
            </button>
            <button 
              className="status-button decline"
              onClick={() => {
                handleStatusChange(selectedReservation.id, 'declined');
                closeModal();
              }}
              disabled={selectedReservation.status === 'declined'}
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);

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
        <select
          name="service_type"
          value={filters.service_type}
          onChange={handleInputChange}
        >
          <option value="">All services</option>
          <option value="flats">Flats</option>
          <option value="offices">Offices</option>
        </select>
        <select
          name="subscription"
          value={filters.subscription}
          onChange={handleInputChange}
        >
          <option value="">All subscriptions</option>
          <option value="Еднократно">Еднократно</option>
          <option value="Седмично">Седмично</option>
          <option value="Месечно">Месечно</option>
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
        <>
        <p>
          Showing {reservations.length} of {pagination.total} reservations
        </p>
        <table>
          <thead>
            <tr>
              <th>Created At ↓</th>
              <th>Service</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Time</th>
              <th>Subscription</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>{r.service_type}</td>
                <td>{r.name}</td>
                <td>{r.phone}</td>
                <td>{r.date}</td>
                <td>{r.time}</td>
                <td>{r.subscription}</td>
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
                <td className="action-buttons">
                  <button 
                    className="view-button"
                    onClick={() => openModal(r)}
                  >
                    Details
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(r.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: "20px" }}>
      <button 
        onClick={prevPage} 
        disabled={pagination.page === 1}
      >
        ⬅ Previous
      </button>
      <span style={{ margin: "0 10px" }}>
        Page {pagination.page} of {totalPages}
      </span>
      <button 
        onClick={nextPage} 
        disabled={pagination.page >= totalPages}
      >
        Next ➡
      </button>
    </div>
        </>
      )}
      <ReservationDetailsModal />
    </div>
  );
}