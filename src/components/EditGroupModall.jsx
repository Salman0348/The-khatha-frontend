import { useEffect, useRef, useState } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "../css-modules/EditGroupModall.module.css";
import ImageDisplay from "./ImageDisplay";
import { useDispatch } from "react-redux";
import { setIsGroupInfoUpdated } from "../store/groupsSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { HiUsers } from "react-icons/hi";

const EditGroupModall = ({
  show,
  setShow,
  oldGroupName,
  grpImgUrl,
  group_id,
}) => {
  const dispatch = useDispatch();

  const formRef = useRef();

  const [error, setError] = useState("");
  const [isGrpImgRemoved, setIsGrpImgRemoved] = useState(false);
  const [isSaveChangesLoading, setIsSaveChangesLoading] = useState(false);
  const [newGroupName, setNewGroupName] = useState(oldGroupName);
  const [imageFile, setImageFile] = useState(null);
  const [cloudinaryGrpImgUrl, setCloudinaryGrpImgUrl] = useState(grpImgUrl);

  useEffect(() => {
    setCloudinaryGrpImgUrl(grpImgUrl);
  }, [grpImgUrl]);

  const handleClose = () => {
    setShow(false);
    setError("");
    setNewGroupName(oldGroupName);
    setImageFile(null);
    setCloudinaryGrpImgUrl(grpImgUrl || null);
    setIsGrpImgRemoved(false);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (formRef.current.checkValidity()) {
      if (
        (!imageFile &&
          newGroupName &&
          oldGroupName === newGroupName.trim() &&
          !isGrpImgRemoved) ||
        !newGroupName.trim()
      ) {
        return setError("To save changes at least change one feild");
      } else {
        setError("");
      }

      const formData = new FormData();
      if (oldGroupName !== newGroupName.trim()) {
        formData.append("newGroupName", newGroupName.trim());
      }
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      if (grpImgUrl) {
        formData.append("oldImgUrl", grpImgUrl); //for removing old image from clodinary
      }
      formData.append("isImgRemoved", isGrpImgRemoved);
      formData.append("groupId", group_id);

      try {
        setIsSaveChangesLoading(true);
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.post(
          `${baseURL}/api/v1/update-group`,
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
          dispatch(setIsGroupInfoUpdated(true)); //for refetching groups when group is successfully updated: in useEffect dependencies(in dashboard comp)

          toast.success("group updated successfully", {
            closeButton: true,
            autoClose: 5000,
          });

          //clean ups after succesfull updation
          setImageFile(null);
          setShow(false);
          setIsGrpImgRemoved(false);
        }
      } catch (error) {
        setIsSaveChangesLoading(false);
        if (error.response && error.response.status === 401) {
          if (error.response.data?.error === "FIELDS_REQUIRED") {
            setError(
              error.response.data?.message ||
                "To save changes, change at least one field"
            );
          } else if (error.response.data?.error === "INVALID_GROUP_NAME") {
            setError(
              error.response.data?.message ||
                "Group name must be 1-30 characters long."
            );
          } else if (
            error.response.data?.error === "GROUP_ID_AND_USER_IDS_ARE_REQUIRED"
          ) {
            setError(
              error.response.data?.message || "Group and user ids are required"
            );
          }
        } else if (error.response && error.response.status === 403) {
          if (error.response.data?.error === "NOT_A_MEMBER") {
            setError(
              error.response.data?.message ||
                "You are not authorized to update this group"
            );
          }
        } else {
          toast.error(`error while updating: ${oldGroupName}`, {
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
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Body>
          <p className={styles.heading}>Edit Group</p>
          <form action="" className={styles.form} ref={formRef}>
            <ImageDisplay
              imgLableMssg={"group"}
              setImageFile={setImageFile}
              cloudinaryImgUrl={cloudinaryGrpImgUrl}
              setCloudinaryImgUrl={setCloudinaryGrpImgUrl}
              setIsImgRemoved={setIsGrpImgRemoved}
              icon={HiUsers}
            />
            <div className={styles.inputItem}>
              <input
                type="text"
                name="group-name"
                placeholder="Change group name"
                value={newGroupName}
                onChange={(e) => {
                  setNewGroupName(e.target.value);
                }}
                maxLength={30}
                required
              />
              <label htmlFor="group-name" className={styles.changeNameLabel}>
                Change group name: max 30 characters
              </label>
              {error && <p className={styles.inputErrMssg}>{error}</p>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose();
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            className={styles.saveChangesBtn}
            onClick={(e) => {
              handleSaveChanges(e);
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
    </div>
  );
};

export default EditGroupModall;
