import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Dashboard.css";

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <h2>My Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
};

export default Profile;