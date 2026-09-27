import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import TheaterSelection from "./pages/TheaterSelection";
import SeatBooking from "./pages/SeatBooking";
import Payment from "./pages/Payment";
import Ticket from "./pages/Ticket";
import MyTickets from "./pages/MyTickets";
import NotFound from "./pages/NotFound";

import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import MoviesAdmin from "./admin/Movies";
import TheatersAdmin from "./admin/Theaters";
import BookingsAdmin from "./admin/Bookings";
import ShowsAdmin from "./admin/Shows";

function App() {
  const location = useLocation();

  // Hide Navbar on booking pages and all admin pages
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/ticket") ||
    location.pathname === "/book" ||
    location.pathname === "/payment" ||
    location.pathname === "/my-tickets";

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <ScrollToTop />

      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:slug" element={<MovieDetails />} />
        <Route path="/theaters" element={<TheaterSelection />} />
        <Route path="/seat-booking" element={<SeatBooking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/ticket/:bookingId" element={<Ticket />} />
        <Route path="/my-tickets" element={<MyTickets />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="movies" element={<MoviesAdmin />} />
          <Route path="theaters" element={<TheatersAdmin />} />
          <Route path="bookings" element={<BookingsAdmin />} />
          <Route path="shows" element={<ShowsAdmin />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;