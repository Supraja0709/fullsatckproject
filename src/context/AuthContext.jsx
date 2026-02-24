import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load logged user on refresh
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // LOGIN
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!existingUser) {
      alert("Invalid email or password");
      return false;
    }

    localStorage.setItem("loggedUser", JSON.stringify(existingUser));
    setUser(existingUser);

    if (existingUser.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/student-dashboard");
    }

    return true;
  };

  // SIGNUP
  const signup = (newUser) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find((u) => u.email === newUser.email)) {
      alert("Email already registered!");
      return false;
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Please login.");
    return true;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("loggedUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};