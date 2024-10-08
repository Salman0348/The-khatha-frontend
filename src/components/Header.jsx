import { useEffect, useRef, useState } from "react";
import styles from "../css-modules/Header.module.css";
import { IoMdPerson } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import EditProfile from "./EditProfile";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logOutSuccess } from "../store/authSlice";
import { clearUserInfo } from "../store/userSlice";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const profileMenuRef = useRef();
  const [editProfileElmnt, setEditProfileElmnt] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  //mouse down event for profile menu
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  //log out
  const handleLogOut = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(
        `${baseURL}/api/v1/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        dispatch(logOutSuccess());
        navigate("/signin");
        dispatch(clearUserInfo());
      }
    } catch (error) {
      toast.error("Error while log out!", {
        closeButton: true,
        autoClose: 5000,
      });
    }
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoSection}>
        <span>
          <img src="blueGreenLogoN.svg" alt="logo" className={styles.logo} />
        </span>
        <span className={styles.logoName}>TheKhatha</span>
      </div>
      <div className={styles.profileSection}>
        <div className={styles.profileMenuCon} ref={profileMenuRef}>
          <div
            className={`${styles.prfImgCon} ${styles.prfToggleImg}`}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {userInfo && userInfo.userPicCloudinayUrl ? (
              <img
                src={userInfo.userPicCloudinayUrl}
                alt="profilePic"
                style={{
                  width: "35px",
                  height: "35px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <FaUserCircle size={35} color="white" />
            )}
          </div>
          <div className={isOpen ? styles.profileMenu : styles.hideProfileMenu}>
            <div className={styles.profileSubInfo}>
              <div className={`${styles.profileSubImg} `}>
                {userInfo && userInfo.userPicCloudinayUrl ? (
                  <img
                    src={userInfo.userPicCloudinayUrl}
                    alt="profilePic"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <FaUserCircle size={35} color="white" />
                )}
              </div>
              <span>{userInfo?.username}</span>
            </div>
            <hr className={styles.prfDivider} />
            <ul className={styles.prfList}>
              <li>
                <div className={styles.menIconsCon}>
                  <IoMdPerson size={20} />
                </div>
                <span className={styles.menItemText}>
                  <EditProfile setIsOpen={setIsOpen} />
                </span>
              </li>
              <hr className={styles.logOutDivider} />
              <li>
                <div className={styles.menIconsCon}>
                  <MdOutlineLogout size={20} />
                </div>
                <span className={styles.menItemText} onClick={handleLogOut}>
                  Log Out
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
