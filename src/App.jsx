import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignIn from "./components/SignIn.jsx";
import SignUp from "./components/SignUp.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "./store/index.js";
import Dashboard from "./components/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import EmailVerification from "./components/EmailVerification.jsx";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path={"/"} element={<SignUp />} />
          <Route path={"/verify-email"} element={<EmailVerification />} />
          <Route path={"/signin"} element={<SignIn />} />
          <Route
            path={"/dashboard"}
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
