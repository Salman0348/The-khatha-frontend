import { statusChange } from "../store/authSlice"; //action
import { signUp } from "../apis";
import styles from "../css-modules/SignInAndSignUp.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Spinner from "react-bootstrap/esm/Spinner";

const SignUp = () => {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.authentication);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isResendEmailLoading, setIsResendEmailLoading] = useState(false);
  const [isResendEmailSent, setIsResendEmailSent] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [err, setErr] = useState(null);
  const message = "Please verify your email. ";

  const formRef = useRef();
  const signUpCredentials = {};
  const [verificationSent, setVerificationSent] = useState(false);

  const handleNameChange = (e) => {
    const value = e.target.value;

    // Check for special characters and length
    const hasSpecialChars = /[^a-zA-Z0-9 ]/.test(value);
    const isTooLong = value.length >= 20;

    if (hasSpecialChars) {
      setErr("Username cannot contain special characters.");
    } else if (isTooLong) {
      setErr("Username cannot exceed 20 characters.");
    } else {
      setErr("");
      setUsername(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.removeItem("emailVerification"); //removing the previous verified status
    if (formRef.current.checkValidity()) {
      signUpCredentials.username = username;
      signUpCredentials.email = email;
      signUpCredentials.password = password;
      if (password !== confirmPassword) {
        setErr("Passwords do not match");
        return;
      } else {
        setErr("");
      }

      dispatch(signUp(signUpCredentials));
    } else {
      formRef.current.reportValidity();
    }
  };

  useEffect(() => {
    if (status === "signupSucceeded") {
      //flag:i am using signupSucceeded for sending verification email after creating pending_user
      setVerificationSent(true);
    } else if (status === "signupSucceededAndEmailVerified") {
      navigate("/signin");
    } else if (status === "failed") {
      toast.error(error, {
        closeButton: true,
        autoClose: 5000,
      });
      dispatch(statusChange("idle"));
    }
  }, [status, verificationSent]);

  const handleResendEmail = async () => {
    setVerificationSent(false);
    setIsResendEmailSent(false);
    setErr("");
    if (formRef.current.checkValidity()) {
      setIsResendEmailLoading(true);
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.post(
          `${baseURL}/api/v1/resend-verification`,
          { email }
        );

        if (response.status === 200) {
          setVerificationSent(true);
          setIsResendEmailSent(true);
          setIsResendEmailLoading(false);
        } else {
          setErr(response?.data?.message || "unexpected error");
          setIsResendEmailLoading(false);
        }
      } catch (error) {
        setErr("An error occurred. Please try again later.");
        setIsResendEmailLoading(false);
      }
    } else {
      formRef.current.reportValidity();
    }
  };

  useEffect(() => {
    //storage event listener
    const handleStorageChange = (event) => {
      if (event.key === "emailVerification" && event.newValue === "verified") {
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setVerificationSent(false);
        dispatch(statusChange("signupSucceededAndEmailVerified"));
      }
    };

    //event listener
    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className={styles.completeScreen}>
      <div className={styles.signInCard}>
        <div className={styles.welcomeMessage}>
          <div className={styles.logo}>
            <img src="greenLogoN.svg" alt="logo" className={styles.logoImg} />
          </div>
          <h1 className={styles.welcomeMessageTitle}>Join TheKhatha</h1>
          <hr className={styles.hr} />
          <p className={styles.welcomeMessageP}>
            Sign up to create an account and start managing your group's
            expenses.
          </p>
        </div>
        <div className={styles.SignInInfo}>
          <h2>Sign Up</h2>
          <form
            action=""
            onSubmit={handleSubmit}
            className={styles.SignInForm}
            ref={formRef}
          >
            <input
              type="text"
              placeholder="User name"
              value={username}
              name="user-name"
              onChange={(e) => {
                handleNameChange(e);
              }}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              name="user-email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <div className={styles.passwordDiv}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                pattern="^\S+$"
                minLength={8}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <label htmlFor="password" className={styles.passwordLable}>
                Min 8 charcters long without spaces
              </label>
              <span
                onClick={togglePasswordVisibility}
                className={styles.eyeIconSpan}
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </span>
            </div>
            <input
              type="password"
              placeholder="Confirm password"
              name="confirm-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
            />
            {isResendEmailLoading ? (
              <div className={styles.isResendEmailSpinnerDiv}>
                Resend email is on its way
                <Spinner
                  animation="grow"
                  role="status"
                  className={styles.isResendEmailSpinner}
                />
              </div>
            ) : (
              (verificationSent ||
                status === "USER_EXISTS_IN_PENDING_USER") && (
                <div className={styles.verificationEmailSentMssgP}>
                  {isResendEmailSent ? (
                    "Email resent! "
                  ) : status === "USER_EXISTS_IN_PENDING_USER" ? (
                    <p>Verification pending for this email.</p>
                  ) : (
                    ""
                  )}
                  {message}
                  <p>
                    Didn’t receive it?
                    <span
                      onClick={handleResendEmail}
                      className={styles.resendEmailSpan}
                    >
                      Resend Verification
                    </span>
                  </p>
                </div>
              )
            )}

            {err ? <p className={styles.error}>{err}</p> : ""}
            <button type="submit" value="Sign Up" className={styles.SignInBtn}>
              {status === "loading" ? (
                <Spinner animation="border" role="status" />
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>
          <div className={styles.SignInMessage}>
            <p>
              Already have an account? <Link to="/signin">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
