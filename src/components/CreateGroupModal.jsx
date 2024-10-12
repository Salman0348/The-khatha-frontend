import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "../css-modules/CreateGroupModal.module.css";
import { RxCross2 } from "react-icons/rx";
import ImageDisplay from "./ImageDisplay";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { HiUsers } from "react-icons/hi";

function CreateGroupModal({
  showCreateGroupModal,
  setShowCreateGroupModal,
  SetAddNewGroupResponse,
  setIsGroupsDropDownOpen,
}) {
  const [show, setShow] = useState(false);
  const [showCrtPopUp, setShowCrtPopUp] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [errorMssg, setErrorMssg] = useState(null);
  const [isAddMemberLoading, setIsAddMemberLoading] = useState(false);
  const [isCreateGroupLoading, setIsCreateGroupLoading] = useState(false);
  const loggedInUser = useSelector((state) => state.user.userInfo);
  const [members, setMembers] = useState([
    { id: loggedInUser?.id, username: "You" },
  ]); //these members come from fetching against emails entered one by one.

  const formRef = useRef();
  const grpNameRef = useRef();
  const emailRef = useRef();

  const handlShowCrtPopUp = () => setShowCrtPopUp(true);
  const handlCloseCrtPopUp = () => setShowCrtPopUp(false);
  const handleClose = () => {
    setShow(false);
    setShowCreateGroupModal(false);
    setMembers([{ id: loggedInUser?.id, username: "You" }]);
  };

  const handleShow = () => setShow(true);

  const handleNameRemove = (id) => {
    const newMembersArray = members.filter((member) => {
      return (
        (member.id === loggedInUser?.id && member.username === "You") ||
        member.id !== id
      );
    });
    setMembers(newMembersArray);
  };

  const doesMemberAlreadyExist = (id) => {
    return members.some((member) => member.id === id);
  };

  const handleAddMember = async () => {
    if (isAddMemberLoading) {
      return;
    }
    if (members.length < 10) {
      setErrorMssg("");
      if (formRef.current.checkValidity()) {
        try {
          setIsAddMemberLoading(true);
          const email = emailRef.current.value;
          const baseURL = import.meta.env.VITE_API_BASE_URL;
          const response = await axios.post(
            `${baseURL}/api/v1/user-check`,
            {
              email,
            },
            { withCredentials: true }
          );
          if (response.status === 200) {
            if (!doesMemberAlreadyExist(response.data.user.id)) {
              setMembers((prev) => [...prev, response.data.user]); //user obj should be received in response
              emailRef.current.value = "";
            } else {
              setErrorMssg("Member is already selected");
            }
            setIsAddMemberLoading(false);
          }
        } catch (error) {
          setIsAddMemberLoading(false);
          if (error.response && error.response.status === 401) {
            if (error.response.data.error === "INVALID_EMAIL") {
              setErrorMssg("Invalid email");
            }
          } else if (error.response && error.response.status === 500) {
            setErrorMssg("Server error");
          } else {
            setErrorMssg("Network error or unexpected issue");
          }
        }
      } else {
        formRef.current.reportValidity();
      }
    } else {
      setErrorMssg("Members should not exceed 10");
    }
  };

  const handleCreateGroup = async () => {
    if (isCreateGroupLoading) {
      return;
    }
    if (members.length > 0) {
      //i think we don't need this check as it is already done in Create Group button,for now ignore it
      const formData = new FormData();
      formData.append("groupName", grpNameRef.current.value);
      formData.append("members", JSON.stringify(members));
      if (imageFile) {
        formData.append("groupImage", imageFile);
      }

      try {
        setIsCreateGroupLoading(true);
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.post(
          `${baseURL}/api/v1/create-group`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setImageFile(null);
          grpNameRef.current.value = "";
          setMembers([{ id: loggedInUser?.id, username: "You" }]);
          setIsCreateGroupLoading(false);
          handleClose();
          setShowCrtPopUp(false);
          SetAddNewGroupResponse(response); //for refetching the groups and it's members in dashboard comp when a new group is added: useEffect dependency
          toast.success("Group created successfully", {
            closeButton: true,
            autoClose: 5000,
          });
        }
      } catch (error) {
        setIsCreateGroupLoading(false);
        toast.error("Error creating group", {
          closeButton: true,
          autoClose: 5000,
        });
      }
    } else {
      setErrorMssg("Please select at least one member");
    }
  };

  return (
    <>
      <div
        onClick={() => {
          handleShow();
          setIsGroupsDropDownOpen(false);
        }}
        className={styles.creatBtnTxt}
        style={{
          backgroundColor: "var(--white-color)",
          color: "black",
          cursor: "pointer",
        }}
      >
        Create New Group
      </div>

      <Modal
        show={show || showCreateGroupModal}
        onHide={handleClose}
        backdrop="static"
        centered
      >
        <Modal.Body>
          <form action="" ref={formRef}>
            <div className={styles.imgWrap}>
              <ImageDisplay
                imgLableMssg={"group"}
                setImageFile={setImageFile}
                showCrtPopUp={showCrtPopUp}
                icon={HiUsers}
              />
            </div>
            <div className={styles.inputItem}>
              <input
                type="text"
                placeholder='Group Name "max: 30 characters"'
                ref={grpNameRef}
                maxLength={30}
                disabled={showCrtPopUp ? true : false}
                required
              />
            </div>
            <div>
              <div className={`${styles.inputItem} ${styles.addMemberDiv}`}>
                <input
                  type="email"
                  placeholder="Enter members' emails one by one"
                  ref={emailRef}
                  disabled={members.length > 10 || showCrtPopUp ? true : false}
                  required
                />

                <Button
                  variant="primary"
                  className={styles.addMemBtn}
                  onClick={handleAddMember}
                >
                  {isAddMemberLoading ? (
                    <Spinner
                      animation="border"
                      role="status"
                      className={styles.addMemberSpinner}
                    />
                  ) : (
                    <span>Add Member</span>
                  )}
                </Button>
              </div>
              {errorMssg && (
                <p className={styles.MemslmtExcdMssg}>{errorMssg}</p>
              )}
            </div>
          </form>
          <div className={styles.memsOutCon}>
            <div className={styles.memsCon}>
              {members.map((member) => {
                return (
                  <div className={styles.singleNameCon} key={member.id}>
                    <span className={styles.memberName}>{member.username}</span>
                    <RxCross2
                      color="red"
                      onClick={() => handleNameRemove(member.id)}
                      title="remove member"
                      className={styles.removeMembCross}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            className={styles.closeBtn}
          >
            Close
          </Button>
          <Button
            variant="primary"
            className={styles.creatBtn}
            onClick={() => {
              if (members.length > 0 && grpNameRef.current.checkValidity()) {
                handlShowCrtPopUp();
              } else {
                if (members.length === 0) {
                  alert("Please select at least one member");
                }
                if (!grpNameRef.current.checkValidity()) {
                  grpNameRef.current.reportValidity();
                }
              }
            }}
          >
            Create Group
          </Button>
          {showCrtPopUp && (
            <div className={styles.createPopUp}>
              <div className={styles.createPopUpBody}>
                <div className={styles.confirGroupCreationHeader}>
                  Confirm Group Creation
                </div>
                <div className={styles.confirGroupCreationFields}>
                  <span className={styles.confirGroupCreationFieldsTitles}>
                    Group Name:
                  </span>
                  <span>{grpNameRef.current.value}</span>
                </div>
                <div className={styles.confirGroupCreationFields}>
                  <span className={styles.confirGroupCreationFieldsTitles}>
                    Members:{" "}
                  </span>
                  <span>{members.length}</span>
                </div>
              </div>

              <div className={styles.createPopUpBtns}>
                <Button
                  variant="secondary"
                  className={styles.backBtn}
                  onClick={handlCloseCrtPopUp}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  className={styles.confirmBtn}
                  onClick={() => {
                    handleCreateGroup();
                  }}
                >
                  {isCreateGroupLoading ? (
                    <Spinner
                      animation="border"
                      role="status"
                      className={styles.createGroupSpinner}
                    />
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </div>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateGroupModal;
