import { useEffect, useRef, useState } from "react";
import styles from "../css-modules/SignInAndSignUp.module.css";
import { Link } from "react-router-dom";
import { signIn } from "../apis";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { statusChange } from "../store/authSlice"; //action

const SignIn = () => {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.authentication);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formRef = useRef();
  const signInCredentials = {};
  useEffect(() => {
    if (status === "signupSucceededAndEmailVerified") {
      toast.success("Account created successfully", {
        closeButton: true,
        autoClose: 5000,
      });
      dispatch(statusChange("idle")); //back to default
    } else if (status === "signinSucceeded") {
      localStorage.removeItem("emailVerification");
      navigate("/dashboard");
      dispatch(statusChange("idle")); //for not unthorizing by dashboard
    } else if (status === "logOutSucceeded") {
      toast.success("Loged out successfully", {
        closeButton: true,
        autoClose: 5000,
      });
      dispatch(statusChange("idle")); //back to default
    }
  }, [status, user, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (status === "loading") {
      return;
    }
    if (formRef.current.checkValidity()) {
      signInCredentials.email = email;
      signInCredentials.password = password;
      dispatch(signIn(signInCredentials));
    } else {
      formRef.current.reporValidity();
    }
  };

  return (
    <div className={styles.completeScreen}>
      <div className={styles.signInCard}>
        <div className={styles.welcomeMessage}>
          <div className={styles.logo}>
            <img src="greenLogoN.svg" alt="logo" className={styles.logoImg} />
          </div>
          <h1 className={styles.welcomeMessageTitle}>
            Welcome Back to TheKhatha
          </h1>
          <hr className={styles.hr} />
          <p className={styles.welcomeMessageP}>
            Sign In to manage and track your group's expenses effortlessly.
          </p>
        </div>
        <div className={styles.SignInInfo}>
          <h2 className={styles.signInTitle}>Sign In</h2>

          <form
            action=""
            onSubmit={handleSubmit}
            className={styles.SignInForm}
            ref={formRef}
          >
            <input
              type="email"
              placeholder="Email address"
              name="user-email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <div className={styles.signinPasswordDiv}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={togglePasswordVisibility}
                className={styles.eyeIconSpan}
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </span>
            </div>
            {error === "Invalid email or password" && (
              <p className={styles.error}>{error}</p>
            )}
            <button type="submit" value="Sign In" className={styles.SignInBtn}>
              {status === "loading" ? (
                <Spinner animation="border" role="status" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
          <div className={styles.SignUpMessage}>
            <p>
              New to TheKhatha? <Link to="/">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
