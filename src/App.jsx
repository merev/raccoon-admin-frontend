import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReservationsPage from "./pages/ReservationsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReservationsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
