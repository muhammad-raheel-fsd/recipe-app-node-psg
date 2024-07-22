import { useEffect, useRef, useState } from "react";
import "./userInfo.css";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UserInformation = () => {
  const [user, setUser] = useState(null);
  const [cookies, removeCookie] = useCookies();
  const [menuActive, setMenuActive] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  console.log("USER ======= ", user);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setMenuActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/users/${cookies.auth.userId}`
      );
      const data = await response.json();
      if (data.status === 200) {
        setUser(data.data);
      } else {
        console.log("Error fetching user data");
      }
    } catch (err) {
      console.log("error: " + err);
    }
  };

  const deleteProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/users/deleteUser/${
          cookies.auth.userId
        }`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      console.log("Deleted user===>", result);

      if (result.status === 200) {
        Swal.fire({
          title: "User deleted successfully!",
          text: "The User has been deleted.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        navigate("/");
        removeCookie("auth")
      } else {
        Swal.fire({
          title: "Failed to delete User!",
          // text: "The User could not be deleted because this is used in restaurants.",
          icon: "error",
          confirmButtonText: "Okay",
        });
        navigate("/");
        console.error("Error deleting user:", result);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleLogout = () => {
    removeCookie("auth");
    navigate("/")
  };

  useEffect(() => {
    getUserInfo();
  }, [cookies]);

  return (
    <>
      {user && (
        <div className="profile" onClick={toggleMenu} ref={profileRef}>
          <div className="img-box">
            <img src={user?.image ?? "/avatar.png"} alt="User" />
          </div>
          {menuActive && (
            <div className="menu active">
              <ul>
                <li>
                  <Link
                    to="/auth/updateUser"
                    className="btn btn-primary"
                    onClick={removeCookie}
                  >
                    Update Profile
                  </Link>
                </li>
                <li>
                  <button className="btn delete-button" onClick={deleteProfile}>
                    Delete Profile
                  </button>
                </li>
                <li>
                  <button
                    to="#"
                    onClick={handleLogout}
                    className="btn btn-primary"
                  >
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserInformation;
