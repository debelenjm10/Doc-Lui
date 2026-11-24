import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PopularServices from "./components/PopularServices";
import Footer from "./components/Footer";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Requests from "./pages/Requests";
import Services from "./pages/Services";
import PageSkeleton from "./components/PageSkeleton";
import logo from "../assets/logo.jpg";

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("docLuiTheme");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 550);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const titles = {
      "/": "Doc Lui Veterinary Clinic",
      "/index.html": "Doc Lui Veterinary Clinic",
      "/services.html": "Services | Doc Lui",
      "/booking.html": "Book a Visit | Doc Lui",
      "/requests.html": "Appointment Requests | Doc Lui",
      "/contact.html": "Contact | Doc Lui"
    };
    document.title = titles[pathname] || "Doc Lui Veterinary Clinic";
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-shell">
      {loading && (
        <PageSkeleton pathname={pathname} />
      )}
      <Header logo={logo} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/services.html" element={<Services />} />
        <Route path="/booking.html" element={<Booking />} />
        <Route path="/requests.html" element={<Requests />} />
        <Route path="/contact.html" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

function Home() {
  return (
    <main>
      <Hero />
      <PopularServices />
    </main>
  );
}

export default App;
