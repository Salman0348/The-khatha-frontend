import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { statusChange } from "../store/authSlice"; //action
import styles from "../css-modules/EmailVerification.module.css";
import { toast } from "react-toastify";
import { MdVerifiedUser } from "react-icons/md";
import { VscError } from "react-icons/vsc";

const EmailVerification = () => {
  const [successMessage, setsuccessMessage] = useState("");
  const [err, setErr] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const verifyEmail = async () => {
      setErr("");
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(
          `${baseURL}/api/v1/verify-email?token=${token}`
        );

        if (response.status === 200) {
          setErr("");
          setsuccessMessage("Email verified successfully! You can now");
          dispatch(statusChange("signupSucceededAndEmailVerified")); // for redirecting to sign in page in sign up page
          localStorage.setItem("emailVerification", "verified"); //storing for cross tab availability
          setTimeout(() => navigate("/signin"), 5000);
        }
      } catch (error) {
        setsuccessMessage("");
        if (error.response && error.response.status === 400) {
          if (
            error.response.data.error ===
            ("INVALID_OR_EXPIRED_TOKEN" || "TOKEN_REQUIRED")
          ) {
            setErr("Invalid or expired token.");
          }
        } else {
          toast.error(
            "Unexpected error occured while verifying email. Please try again later.",
            {
              closeButton: true,
              autoClose: 5000,
            }
          );
        }
      }
    };

    verifyEmail();
  }, [location.search]);

  return (
    <div className={styles.mainCon}>
      {err ? (
        <div className={styles.errorMessageDiv}>
          <div className={styles.errorIconDiv}>
            <VscError />
          </div>
          <p className={styles.messageP}>
            {err} <span className={styles.tryAgainSpan}>Try again</span>{" "}
            <Link to="/" style={{ textDecoration: "none" }}>
              {" "}
              <span style={{ textWrap: "nowrap" }}>Sign Up</span>{" "}
            </Link>
          </p>
        </div>
      ) : successMessage ? (
        <div className={styles.successMessageDiv}>
          <div className={styles.successIconDiv}>
            <MdVerifiedUser />
          </div>
          <p className={styles.messageP}>
            {successMessage}
            <Link to="/signin" style={{ textDecoration: "none" }}>
              &nbsp;<span style={{ textWrap: "nowrap" }}>Sign In</span>
            </Link>
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default EmailVerification;
