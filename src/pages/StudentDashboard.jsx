import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaProjectDiagram, FaFolderOpen, FaUserCircle, FaCheckCircle, 
  FaTimesCircle, FaComments, FaClock, FaTrophy, FaGraduationCap 
} from "react-icons/fa";
import ProjectCard from "../components/ProjectCard";
import { AuthContext } from "../context/AuthContext";
import "../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  /* ================= STATE ================= */
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "", description: "", domain: "", progress: "", status: "Pending"
  });
  const [editingId, setEditingId] = useState(null);
  const [portfolio, setPortfolio] = useState({
    bio: "", skills: "", github: "", linkedin: "", resume: ""
  });
  const [activeSection, setActiveSection] = useState("overview");

  const domains = ["Web Development","Machine Learning","Cyber Security","Cloud Computing","Mobile App Development"];

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!user || user.role !== "student") navigate("/login");
    else {
      const savedProjects = JSON.parse(localStorage.getItem(`projects_${user.email}`)) || [];
      setProjects(savedProjects);
      const savedPortfolio = JSON.parse(localStorage.getItem(`portfolio_${user.email}`)) || {};
      setPortfolio(savedPortfolio);
    }
  }, [user, navigate]);

  /* ================= SAVE DATA ================= */
  useEffect(() => { if(user) localStorage.setItem(`projects_${user.email}`, JSON.stringify(projects)); }, [projects, user]);
  useEffect(() => { if(user) localStorage.setItem(`portfolio_${user.email}`, JSON.stringify(portfolio)); }, [portfolio, user]);

  /* ================= PROJECT HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "progress") { const num = Number(value); if(num<0||num>100)return; }
    setFormData({...formData, [name]: value});
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if(editingId){
      setProjects(projects.map(p=>p.id===editingId?{...p,...formData}:p));
      setEditingId(null);
    } else {
      const newProject = {...formData, id: Date.now(), feedback:"No feedback yet"};
      setProjects([...projects,newProject]);
    }
    setFormData({title:"",description:"",domain:"",progress:"",status:"Pending"});
  };
  const handleEdit = (p)=>{ setFormData(p); setEditingId(p.id); setActiveSection("projects"); };
  const handleDelete = (id)=>setProjects(projects.filter(p=>p.id!==id));

  /* ================= DASHBOARD METRICS ================= */
  const totalProjects = projects.length;
  const totalFeedback = projects.filter(p=>p.feedback && p.feedback!=="No feedback yet").length;
  const rejectedProjects = projects.filter(p=>p.status==="Rejected").length;
  const completedProjects = projects.filter(p=>p.status==="Completed").length;
  const upcomingProjects = projects.filter(p=>p.status==="Pending" || p.status==="In Progress").length;
  const skillsCount = portfolio.skills ? portfolio.skills.split(",").length : 0;
  const achievements = completedProjects;

  return (
    <div className="student-dashboard">
      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">
        <h2>🎓 Dashboard</h2>
        <ul>
          <li className={activeSection==="overview"?"active":""} onClick={()=>setActiveSection("overview")}><FaGraduationCap style={{marginRight:"8px"}}/> Overview</li>
          <li className={activeSection==="projects"?"active":""} onClick={()=>setActiveSection("projects")}><FaProjectDiagram style={{marginRight:"8px"}}/> Projects</li>
          <li className={activeSection==="portfolio"?"active":""} onClick={()=>setActiveSection("portfolio")}><FaFolderOpen style={{marginRight:"8px"}}/> Portfolio</li>
          <li className={activeSection==="profile"?"active":""} onClick={()=>setActiveSection("profile")}><FaUserCircle style={{marginRight:"8px"}}/> Profile</li>
        </ul>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="dashboard-content">
        {/* ================= OVERVIEW CARDS ================= */}
        {activeSection==="overview" && (
          <div className="overview-cards">
            <div className="card gradient1"><FaProjectDiagram size={30}/><h3>Total Projects</h3><p>{totalProjects}</p></div>
            <div className="card gradient2"><FaCheckCircle size={30}/><h3>Completed</h3><p>{completedProjects}</p></div>
            <div className="card gradient3"><FaTimesCircle size={30}/><h3>Rejected</h3><p>{rejectedProjects}</p></div>
            <div className="card gradient4"><FaComments size={30}/><h3>Total Feedback</h3><p>{totalFeedback}</p></div>
            <div className="card gradient5"><FaClock size={30}/><h3>Upcoming</h3><p>{upcomingProjects}</p></div>
            <div className="card gradient6"><FaTrophy size={30}/><h3>Achievements</h3><p>{achievements}</p></div>
            <div className="card gradient7"><FaFolderOpen size={30}/><h3>Skills</h3><p>{skillsCount}</p></div>
            <div className="card gradient8"><FaUserCircle size={30}/><h3>Bio Overview</h3><p>{portfolio.bio || "No bio yet"}</p></div>
          </div>
        )}

        {/* ================= PROJECTS ================= */}
        {activeSection==="projects" && (
          <>
            <form className="project-form" onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Project Title" value={formData.title} onChange={handleChange} required/>
              <textarea name="description" placeholder="Project Description" value={formData.description} onChange={handleChange} required/>
              <select name="domain" value={formData.domain} onChange={handleChange} required>
                <option value="">Select Domain</option>
                {domains.map((d,i)=><option key={i} value={d}>{d}</option>)}
              </select>
              <input type="number" name="progress" placeholder="Progress %" min="0" max="100" value={formData.progress} onChange={handleChange} required/>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button type="submit">{editingId?"Update Project":"Add Project"}</button>
            </form>
            <div className="projects-grid">
              {projects.length===0?<p>No projects added yet.</p>:projects.map(p=>(
                <ProjectCard key={p.id} project={p} onEdit={()=>handleEdit(p)} onDelete={()=>handleDelete(p.id)}/>
              ))}
            </div>
          </>
        )}

        {/* ================= PORTFOLIO ================= */}
        {activeSection==="portfolio" && (
          <div className="portfolio-section">
            <h3>📁 My Portfolio</h3>
            <textarea placeholder="About Me / Bio" value={portfolio.bio||""} onChange={(e)=>setPortfolio({...portfolio,bio:e.target.value})}/>
            <input type="text" placeholder="Skills (comma separated)" value={portfolio.skills||""} onChange={(e)=>setPortfolio({...portfolio,skills:e.target.value})}/>
            <input type="text" placeholder="GitHub Link" value={portfolio.github||""} onChange={(e)=>setPortfolio({...portfolio,github:e.target.value})}/>
            <input type="text" placeholder="LinkedIn Link" value={portfolio.linkedin||""} onChange={(e)=>setPortfolio({...portfolio,linkedin:e.target.value})}/>
            <label>Upload Resume:</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e)=>{if(e.target.files.length>0){const file=URL.createObjectURL(e.target.files[0]); setPortfolio({...portfolio,resume:file})}}}/>
            {portfolio.resume && <p>Resume: <a href={portfolio.resume} target="_blank">View</a></p>}
          </div>
        )}

        {/* ================= PROFILE ================= */}
        {activeSection==="profile" && (
          <div className="profile-card">
            <h3>👤 My Profile</h3>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Role:</b> {user.role}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;