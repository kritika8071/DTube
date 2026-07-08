import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSignout = async () => {
    try {
      await api.post("/auth/signout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        DTube
      </Link>

      {/* Navigation Links */}
      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          Home
        </Link>
        <Link to="/trending" style={styles.link}>
          Trending
        </Link>
        {user && (
          <Link to="/upload" style={styles.link}>
            Upload
          </Link>
        )}
      </div>

      {/* Auth Buttons */}
      <div style={styles.auth}>
        {user ? (
          <div style={styles.userSection}>
            <span style={styles.username}>
              {user.username}
            </span>
            <button
              style={styles.signoutBtn}
              onClick={handleSignout}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div style={styles.authButtons}>
            <Link to="/login" style={styles.loginBtn}>
              Sign In
            </Link>
            <Link to="/signup" style={styles.signupBtn}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    backgroundColor: "#1a1a1a",
    borderBottom: "1px solid #333",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: "#ff0000",
    fontSize: "24px",
    fontWeight: "bold",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    gap: "24px",
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "14px",
  },
  auth: {
    display: "flex",
    alignItems: "center",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  username: {
    color: "#aaaaaa",
    fontSize: "14px",
  },
  signoutBtn: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "1px solid #333",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  authButtons: {
    display: "flex",
    gap: "12px",
  },
  loginBtn: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "1px solid #333",
    borderRadius: "4px",
    fontSize: "14px",
  },
  signupBtn: {
    padding: "8px 16px",
    backgroundColor: "#ff0000",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
  },
};

export default Navbar;