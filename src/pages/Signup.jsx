  import { useState, useContext } from "react";
  import { useNavigate } from "react-router-dom";
  import { AuthContext } from "../context/AuthContext";
  import "../styles/Auth.css";

  const Signup = () => {
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
      name: "",
      email: "",
      role: "student",
      password: "",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const success = signup(form);
      if (success) {
        navigate("/login");
      }
    };

    return (
      <div className="auth-container">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          <input
            placeholder="Name"
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <select
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
  };

  export default Signup;