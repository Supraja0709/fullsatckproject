import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text">
          <h1 className="hero-title">Welcome to Student Portfolio Tracker</h1>
          <p className="hero-description">
            Showcase your projects, track progress, get feedback, and manage your portfolio — all in one place!
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/login")}>Login</button>
          </div>
        </div>
        
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📁</div>
            <h3>Manage Projects</h3>
            <p>Add, update, and track your projects easily with progress and status indicators.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Portfolio Management</h3>
            <p>Maintain your bio, skills, GitHub, LinkedIn, and resume in one portfolio.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Performance Overview</h3>
            <p>Get a dashboard overview with total projects, feedback, achievements, and more.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Feedback & Comments</h3>
            <p>Receive feedback from teachers/admins and improve your projects effectively.</p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="cta-section">
        <h2 className="section-title">Start managing your portfolio today!</h2>
        <p className="cta-description">
          Create an account and take control of your projects and achievements.
        </p>
        <div className="cta-buttons">
          <button className="btn-primary" onClick={() => navigate("/signup")}>Get Started</button>
          <button className="btn-secondary" onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <p>© {new Date().getFullYear()} Student Portfolio Tracker. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default HomePage;