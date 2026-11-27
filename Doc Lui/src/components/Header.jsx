import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAccess, readAccess } from "../access";

function Header({ logo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("docLuiTheme") === "dark");
  const [access, setAccess] = useState(readAccess);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const links = access?.role === "admin"
    ? [{ to: "/requests.html", label: "Request dashboard" }]
    : access?.role === "client"
      ? [
      { to: "/index.html", label: "Home" },
      { to: "/services.html", label: "Services" },
      { to: "/booking.html", label: "Book a Visit" },
      { to: "/requests.html", label: "My Requests" },
      { to: "/contact.html", label: "Contact" }
      ]
      : [];
  const isActive = to => pathname === to || (to === "/index.html" && pathname === "/");

  useEffect(() => {
    setAccess(readAccess());
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("docLuiTheme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <nav className="nav-container" aria-label="Main navigation">
        <Link className="brand" to="/index.html">
          <img src={logo} alt="Doc Lui Veterinary Clinic logo" />
          <span>
            <strong>DOC LUI</strong>
            <small>VETERINARY CLINIC</small>
          </span>
        </Link>

        <div className="desktop-nav">
          {links.map(link => (
            <Link
              key={link.to}
              className={isActive(link.to) ? "active" : ""}
              aria-current={isActive(link.to) ? "page" : undefined}
              to={link.to}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          {access ? (
            <button
              className="nav-login-button"
              type="button"
              onClick={() => {
                clearAccess();
                setAccess(null);
                navigate("/login.html");
              }}
            >
              Sign out
            </button>
          ) : pathname !== "/login.html" ? (
            <Link className="nav-login-button" to="/login.html">Log in</Link>
          ) : null}
          <button
            className="icon-button"
            type="button"
            onClick={() => setDark(value => !value)}
            aria-label="Toggle theme"
          >
            {dark ? "☀" : "☾"}
          </button>
          {links.length > 0 && (
            <button
              className="menu-button"
              type="button"
              onClick={() => setMenuOpen(value => !value)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-nav">
          {links.map(link => (
            <Link
              key={link.to}
              aria-current={isActive(link.to) ? "page" : undefined}
              to={link.to}
            >
              {link.label}
            </Link>
          ))}
          {access ? (
            <button
              className="mobile-sign-out"
              type="button"
              onClick={() => {
                clearAccess();
                setAccess(null);
                navigate("/login.html");
              }}
            >
              Sign out
            </button>
          ) : pathname !== "/login.html" ? (
            <Link to="/login.html">Log in</Link>
          ) : null}
        </div>
      )}
    </header>
  );
}

export default Header;
