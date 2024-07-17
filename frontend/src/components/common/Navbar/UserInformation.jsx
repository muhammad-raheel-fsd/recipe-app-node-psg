import { useEffect, useState } from "react";
import "./userInfo.css";

const UserInformation = ({ cookies, removeCookie }) => {
  const [user, setUser] = useState(null); // useState at the top level

  const getUserInfo = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/users/${cookies.auth.userid}`);
      const data = await response.json();
      if (data.status === 200) {
        setUser(data.data[0]);
        console.log(data.data[0].image);
      } else {
        console.log("Error fetching user data");
      }
    } catch (err) {
      console.log("error: " + err);
    }
  };

  const handleLogout = () => {
    removeCookie("auth");
  };

  useEffect(() => {
    getUserInfo();
  }, []); 

  return (
    <>
      {user && (
        <div className="userContainer">
          <img className="userImage" src={user.image} alt="User" />
          <div className="userPopup">
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInformation;
