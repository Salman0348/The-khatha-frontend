import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setUserInfo, setUserProfileUpdatedDefault } from "../store/userSlice";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const dispatch = useDispatch();
  const { isUserProfileUpdated } = useSelector((state) => state.user); //for refetching the logged-in user info if changed

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseURL}/api/v1/dashboard`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
        dispatch(setUserInfo(response.data.user));
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
    dispatch(setUserProfileUpdatedDefault());
  }, [isUserProfileUpdated]);

  if (isAuthenticated === null)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner
          style={{ width: "100px", height: "100px" }}
          animation="border"
          role="status"
        />
      </div>
    );
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
