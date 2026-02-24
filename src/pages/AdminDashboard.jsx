import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [allProjects, setAllProjects] = useState([]);
  const [studentCount, setStudentCount] = useState(0); // <-- student count

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    } else {
      loadAllProjectsAndStudents();
    }
  }, [user, navigate]);

  const loadAllProjectsAndStudents = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    let projects = [];

    // Count students
    const students = users.filter(u => u.role === "student");
    setStudentCount(students.length);

    // Load projects
    students.forEach((u) => {
      const studentProjects =
        JSON.parse(localStorage.getItem(`projects_${u.email}`)) || [];

      const portfolio =
        JSON.parse(localStorage.getItem(`portfolio_${u.email}`)) || {};

      studentProjects.forEach((p) => {
        projects.push({
          ...p,
          studentName: u.name,
          studentEmail: u.email,
          portfolio,
        });
      });
    });

    setAllProjects(projects);
  };

  const updateProjectStatus = (email, id, status, feedback) => {
    const studentProjects =
      JSON.parse(localStorage.getItem(`projects_${email}`)) || [];

    const updated = studentProjects.map((p) =>
      p.id === id ? { ...p, status, feedback } : p
    );

    localStorage.setItem(`projects_${email}`, JSON.stringify(updated));
    loadAllProjectsAndStudents(); // <-- reload after update
  };

  const filteredProjects = allProjects.filter((project) => {
    return (
      project.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (filterStatus === "All" || project.status === filterStatus)
    );
  });

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>🛠 Admin Dashboard</h2>

        <div className="profile-section">
          <span
            className="admin-name"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {user?.name} ⬇
          </span>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <button
                onClick={() => {
                  setShowProfileCard(!showProfileCard);
                  setShowProfileMenu(false);
                }}
              >
                View Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PROFILE CARD */}
      {showProfileCard && (
        <div className="profile-card">
          <h3>👤 Admin Profile</h3>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
          <button
            className="close-profile"
            onClick={() => setShowProfileCard(false)}
          >
            Close
          </button>
        </div>
      )}

      {/* STATISTICS CARDS */}
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{studentCount}</p>
        </div>

        <div className="stat-card">
          <h3>Total Projects</h3>
          <p className="stat-number">{allProjects.length}</p>
        </div>

        <div className="stat-card">
          <h3>Certified</h3>
          <p className="stat-number">
            {allProjects.filter(p => p.status === "Certified").length}
          </p>
        </div>

        <div className="stat-card">
          <h3>Rejected</h3>
          <p className="stat-number">
            {allProjects.filter(p => p.status === "Rejected").length}
          </p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number">
            {allProjects.filter(p => p.status === "Pending").length}
          </p>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="admin-filters">
        <input
          type="text"
          placeholder="Search by student name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Certified">Certified</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* PROJECT GRID */}
      <div className="projects-grid">
        {filteredProjects.length === 0 ? (
          <p className="no-project">No matching projects found.</p>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="admin-card">
              <h3>{project.title}</h3>
              <p><b>Student:</b> {project.studentName}</p>
              <p><b>Email:</b> {project.studentEmail}</p>
              <p><b>Domain:</b> {project.domain}</p>
              <p><b>Description:</b> {project.description}</p>
              <p><b>Progress:</b> {project.progress}%</p>
              <p><b>Status:</b> {project.status}</p>

              <div className="portfolio-view">
                <h4>📁 Portfolio</h4>
                <p><b>Bio:</b> {project.portfolio.bio || "N/A"}</p>
                <p><b>Skills:</b> {project.portfolio.skills || "N/A"}</p>
                <p><b>GitHub:</b> {project.portfolio.github || "N/A"}</p>
                <p><b>LinkedIn:</b> {project.portfolio.linkedin || "N/A"}</p>
              </div>

              <textarea
                placeholder="Give feedback..."
                className="feedback-box"
                defaultValue={project.feedback}
                onBlur={(e) =>
                  updateProjectStatus(
                    project.studentEmail,
                    project.id,
                    project.status,
                    e.target.value
                  )
                }
              />

              <div className="button-group">
                <button
                  className="certify-btn"
                  onClick={() =>
                    updateProjectStatus(
                      project.studentEmail,
                      project.id,
                      "Certified",
                      project.feedback
                    )
                  }
                >
                  Certify
                </button>

                <button
                  className="reject-btn"
                  onClick={() =>
                    updateProjectStatus(
                      project.studentEmail,
                      project.id,
                      "Rejected",
                      project.feedback
                    )
                  }
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;