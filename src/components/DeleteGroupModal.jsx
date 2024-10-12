import { useRef, useState } from "react";
import styles from "../css-modules/DeleteGroupModal.module.css";
import Spinner from "react-bootstrap/esm/Spinner";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
import { HiUsers } from "react-icons/hi";
import { CiWarning } from "react-icons/ci";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setGrpDeleted } from "../store/groupsSlice";

const DeleteGroupModal = ({ show, setShow, groupInfo }) => {
  const dispatch = useDispatch();

  const grpNameInputRef = useRef();

  const [grpNameMatchesErr, setGrpNameMatchesErr] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const handlCloseDeletePopUp = () => {
    setShowDeletePopUp(false);
    setGrpNameMatchesErr("");
  };
  const handleShowDeletePopUp = () => {
    setShowDeletePopUp(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleDeleteGroup = async () => {
    if (isDeleteLoading) {
      return;
    }
    if (grpNameInputRef.current.value !== groupInfo.group_name) {
      setGrpNameMatchesErr("name does not match");
    } else {
      setGrpNameMatchesErr("");

      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const url = `${baseURL}/api/v1/delete-group/${groupInfo.group_id}`;
        setIsDeleteLoading(true);
        const response = await axios.delete(url, { withCredentials: true });
        dispatch(setGrpDeleted(groupInfo?.group_id)); //for refetching groups and it's members
        toast.success(`"${groupInfo.group_name}" group deleted successfully`, {
          closeButton: true,
          autoClose: 5000,
        });
      } catch (error) {
        toast.error("Error while deleting group", {
          closeButton: true,
          autoClose: 5000,
        });
      } finally {
        setShow(false);
        setIsDeleteLoading(false);
      }
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
          <div className={styles.deleteMdlBdyCon}>
            <div className={styles.groupImgNameDiv}>
              <div className={`${styles.groupImgDiv} `}>
                {groupInfo && groupInfo.group_pic_url ? (
                  <img
                    src={groupInfo.group_pic_url}
                    alt="group pic"
                    className={styles.groupImg}
                  />
                ) : (
                  <HiUsers size={35} color="white" />
                )}
              </div>
              <span className={styles.groupName}>{groupInfo?.group_name}</span>
            </div>
            <div className={styles.warningCon}>
              <div className={styles.warningHeading}>
                <span className={styles.warningIconSpan}>
                  <CiWarning />
                </span>
                <span className={styles.warningAttentionMssg}>
                  Important: Please read this to avoid potential issues!
                </span>
              </div>
              <p className={styles.warningMssg}>
                This will permanently delete the <b>{groupInfo?.group_name}</b>{" "}
                group, including its members and entire history.
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className={styles.deleteBtn}
            onClick={() => {
              handleShowDeletePopUp();
            }}
          >
            Understood effects
          </Button>
          {showDeletePopUp && (
            <div className={styles.deletePopUp}>
              <div className={styles.deletePopUpBody}>
                <label
                  htmlFor="group-name"
                  className={styles.grpNameinputLabel}
                >
                  Please type{" "}
                  <span className={styles.confirmGrpName}>
                    "{groupInfo.group_name}"
                  </span>{" "}
                  in the box below to confirm.
                </label>
                <input
                  type="text"
                  name="group-name"
                  className={styles.grpNameInput}
                  ref={grpNameInputRef}
                  style={{
                    borderColor: grpNameMatchesErr ? "red" : "",
                  }}
                />
                <div className={styles.grpNameMatchesErrDiv}>
                  {grpNameMatchesErr && (
                    <p className={styles.grpNameMatchesErr}>
                      {grpNameMatchesErr}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.deletePopUpBtns}>
                <Button
                  variant="secondary"
                  style={{
                    height: "fit-content",
                    padding: "0.375rem 7px",
                    fontSize: "1rem",
                  }}
                  onClick={handlCloseDeletePopUp}
                >
                  Back
                </Button>
                <Button
                  variant="danger"
                  className={styles.deleteBtn}
                  style={{
                    height: "fit-content",
                    padding: "0.375rem 7px",
                    fontSize: "1rem",
                  }}
                  onClick={() => {
                    handleDeleteGroup();
                  }}
                >
                  {isDeleteLoading ? (
                    <Spinner
                      animation="border"
                      role="status"
                      className={styles.deleteGroupSpinner}
                    />
                  ) : (
                    "Confirm group delete"
                  )}
                </Button>
              </div>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteGroupModal;
