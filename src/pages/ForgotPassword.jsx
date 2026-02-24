import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    newPassword: "",
  });

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleReset = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem(form.email));

    if (!user) {
      alert("Email not registered.");
      return;
    }

    if (!passwordRegex.test(form.newPassword)) {
      alert("Password must meet strong criteria.");
      return;
    }

    user.password = form.newPassword;

    localStorage.setItem(form.email, JSON.stringify(user));

    alert("Password updated successfully!");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleReset}>
        <h2>Reset Password</h2>

        <input
          type="email"
          placeholder="Registered Email"
          required
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          required
          onChange={(e) =>
            setForm({ ...form, newPassword: e.target.value })
          }
        />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ForgotPassword;