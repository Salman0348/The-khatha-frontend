import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "../css-modules/EditProfile.module.css";
import { FaAngleDown, FaAngleUp, FaEye, FaEyeSlash } from "react-icons/fa";
import ImageDisplay from "./ImageDisplay";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserProfileUpdated } from "../store/userSlice";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";

function EditProfile({ setIsOpen }) {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isImgRemoved, setIsImgRemoved] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const imgUrl = userInfo?.userPicCloudinayUrl || null; //come from logged in user info
  const [cloudinaryImgUrl, setCloudinaryImgUrl] = useState(imgUrl);
  useEffect(() => {
    setCloudinaryImgUrl(imgUrl);
  }, [imgUrl]);

  const [showCurrentPassword, setshowCurrentPassword] = useState(false);
  const toggleCurrentPasswordVisibility = () => {
    setshowCurrentPassword(!showCurrentPassword);
  };

  const [showNewPassword, setshowNewPassword] = useState(false);
  const toggleNewPasswordVisibility = () => {
    setshowNewPassword(!showNewPassword);
  };

  const oldUsername = userInfo?.username || null;
  const [newUsername, setUsername] = useState(oldUsername);
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState("");
  const [isPsswrdConOpen, setIsPsswrdConOpen] = useState(false);
  const [isSaveChangesLoading, setIsSaveChangesLoading] = useState(false);
  const oldPasswordButNotNewPasswordErr =
    "To change password enter new password";

  const usernameRef = useRef();
  const formRef = useRef();

  const handleClose = () => {
    setShow(false);
    setError("");
    setIsPsswrdConOpen(false);
    setUsername(oldUsername);
    setImageFile(null);
    setCloudinaryImgUrl(imgUrl || null);
    setIsImgRemoved(false);
  };
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const value = e.target.value;

    // Check for special characters and length
    const hasSpecialChars = /[^a-zA-Z0-9 ]/.test(value);
    const isTooLong = value.length >= 20;

    if (hasSpecialChars) {
      setError("Username cannot contain special characters.");
    } else if (isTooLong) {
      setError("Username cannot exceed 20 characters.");
    } else {
      setError("");
      setUsername(value);
    }
  };

  const handleSaveChanges = async () => {
    if (isSaveChangesLoading) {
      return;
    }
    if (formRef.current.checkValidity()) {
      if (oldPassword && !newPassword) {
        return setError(oldPasswordButNotNewPasswordErr);
      } else {
        setError("");
      }
      if (newPassword && !oldPassword) {
        return setError("Enter current password");
      } else {
        setError("");
      }
      if (newUsername && newUsername.trim() === "") {
        return setError("Enter valid name");
      } else {
        setError("");
      }
      if (
        !imageFile &&
        oldUsername === newUsername.trim() &&
        !oldPassword &&
        !isImgRemoved
      ) {
        return setError("To save changes at least change one feild");
      } else {
        setError("");
      }

      if (newPassword && newPassword !== confirmPassword) {
        setError("New password and confirm password do not match");
        return;
      } else {
        setError("");
      }

      const formData = new FormData();
      if (oldUsername !== newUsername.trim()) {
        formData.append("newUsername", newUsername);
      }
      if (oldPassword && newPassword) {
        formData.append("oldPassword", oldPassword);
        formData.append("newPassword", newPassword);
      }
      if (imageFile) {
        formData.append("newUserImg", imageFile);
      }
      formData.append("isImgRemoved", isImgRemoved);
      formData.append("oldImgUrl", imgUrl);

      try {
        setIsSaveChangesLoading(true);
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.post(
          `${baseURL}/api/v1/update-profile`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setIsSaveChangesLoading(false);
          dispatch(setUserProfileUpdated()); //for refetching groups and it's members and logged-in user info when profile is updated: in useEffect dependencies(in dashboard comp)

          toast.success("Profile updated successfully", {
            closeButton: true,
            autoClose: 5000,
          });

          //clean ups after succesfull updation
          setImageFile(null);
          setShow(false);
          setIsPsswrdConOpen(false);
          setIsImgRemoved(false);
        }
      } catch (error) {
        setIsSaveChangesLoading(false);
        if (error.response && error.response.status === 401) {
          if (error.response.data.error === "FIELDS_REQUIRED") {
            setError("To save changes, change at least one field");
          } else if (error.response.data.error === "NAME_LIMIT_EXCEEDED") {
            setError("Username cannot exceed 20 characters.");
          }
        } else if (error.response && error.response.status === 403) {
          if (error.response.data.error === "INVALID_OLD_PASSWORD") {
            setError("Incorrect old password.");
          }
        } else {
          toast.error("error while updating your proflie", {
            closeButton: true,
            autoClose: 5000,
          });
        }
      }
    } else {
      formRef.current.reportValidity();
    }
  };

  return (
    <>
      <div
        onClick={() => {
          handleShow();
          setIsOpen((prev) => !prev);
        }}
        className={styles.creatBtnTxt}
        style={{
          backgroundColor: "var(--white-color)",
          color: "black",
          cursor: "pointer",
        }}
      >
        Edit Profile
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Body>
          <p className={styles.heading}>Edit Profile</p>
          <form action="" className={styles.form} ref={formRef}>
            <ImageDisplay
              imgLableMssg={"your profile"}
              setImageFile={setImageFile}
              cloudinaryImgUrl={cloudinaryImgUrl}
              setCloudinaryImgUrl={setCloudinaryImgUrl}
              setIsImgRemoved={setIsImgRemoved}
              icon={FaUserCircle}
            />
            <div className={styles.inputItem}>
              <input
                type="text"
                name="user-name"
                value={newUsername}
                placeholder="Change name"
                onChange={(e) => {
                  handleChange(e);
                }}
                ref={usernameRef}
                maxLength={20}
                required
              />
              {error && <p className={styles.inputErrMssg}>{error}</p>}
            </div>
            <div className={styles.changePsswrdDiv}>
              <div
                className={styles.changePsswrdHeading}
                onClick={() => {
                  setIsPsswrdConOpen((prev) => !prev);
                }}
              >
                <span className={styles.changePsswrdTitle}>
                  Change password
                </span>
                {isPsswrdConOpen ? (
                  <FaAngleUp size={15} />
                ) : (
                  <FaAngleDown size={15} />
                )}
              </div>

              <div
                className={`${styles.psswrdDropDown} ${
                  isPsswrdConOpen ? styles.open : ""
                }`}
              >
                <div className={`${styles.inputItem} ${styles.marginTop}`}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="current-password"
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    minLength={1}
                    style={{
                      borderColor:
                        error === "Enter current password" ? "red" : "",
                    }}
                  />
                  <span
                    onClick={toggleCurrentPasswordVisibility}
                    className={styles.eyeIconSpan}
                  >
                    {showCurrentPassword ? (
                      <FaEyeSlash size={15} />
                    ) : (
                      <FaEye size={15} />
                    )}
                  </span>
                </div>
                <div className={styles.inputItem}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="new-password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    pattern="^\S+$"
                    minLength={8}
                    id="newPassword"
                    style={{
                      borderColor:
                        error ===
                        ("To change password enter new password" ||
                          "New password and confirm password do not match")
                          ? "red"
                          : "",
                    }}
                  />
                  <span
                    onClick={toggleNewPasswordVisibility}
                    className={styles.eyeIconSpan}
                  >
                    {showNewPassword ? (
                      <FaEyeSlash size={15} />
                    ) : (
                      <FaEye size={15} />
                    )}
                  </span>
                  <label htmlFor="newPassword" className={styles.newPassword}>
                    Min 8 charcters long without spaces
                  </label>
                </div>
                <div
                  className={`${styles.inputItem} ${styles.confirmPasswordDiv}`}
                >
                  <input
                    type="password"
                    name="confrim-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    style={{
                      borderColor:
                        error ===
                        "New password and confirm password do not match"
                          ? "red"
                          : "",
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose();
            }}
            className={styles.closeBtn}
          >
            Close
          </Button>
          <Button
            variant="primary"
            className={styles.saveChangesBtn}
            onClick={() => {
              handleSaveChanges();
            }}
          >
            {isSaveChangesLoading ? (
              <Spinner
                animation="border"
                role="status"
                className={styles.saveChangesSpinner}
              />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditProfile;
