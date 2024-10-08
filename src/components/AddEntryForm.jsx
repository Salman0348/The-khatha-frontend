import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import styles from "../css-modules/AddEntryForm.module.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import Spinner from "react-bootstrap/esm/Spinner";

const AddEntryForm = ({
  selectedGrouploggedinUserMemberId,
  SetAddEntryResponse,
  addEntryResponse,
  selectedGroupMembers,
}) => {
  const loggedInUser = useSelector((state) => state.user.userInfo);

  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCustomParticipantsSelected, setIsCustomParticipantsSelected] =
    useState(false);

  const [isAddEntryLoading, setIsAddEntryLoadingg] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [selectedParticipantsMemberIds, setSelectedParticipantsMemberIds] =
    useState([]);

  useEffect(() => {
    setSelectedParticipants([
      {
        participantMemberId: selectedGrouploggedinUserMemberId,
        participantName: "You",
      },
    ]);
    if (isCustomParticipantsSelected) {
      setIsCustomParticipantsSelected(false);
    }
    setSelectedParticipantsMemberIds([]);
    setError("");
  }, [selectedGrouploggedinUserMemberId, addEntryResponse]); //addEntryResponse: when response is ok(changed) then run effect

  const formRef = useRef();
  const entryAmountRef = useRef();
  const entryPurposeRef = useRef();
  const entryDescriptionRef = useRef();

  const handleAddEntry = async () => {
    try {
      if (formRef.current.checkValidity()) {
        setIsAddEntryLoadingg(true);
        let participantsIds = null;
        if (isCustomParticipantsSelected) {
          participantsIds = selectedParticipantsMemberIds;
        }
        if (isCustomParticipantsSelected && selectedParticipants.length < 2) {
          return setError("Select at least two participants.");
        } else if (isCustomParticipantsSelected) {
          setError("");
          participantsIds = selectedParticipants.map(
            (participant) => participant.participantMemberId
          );
        }

        const entryAmount = entryAmountRef.current.value;
        const entryPurpose = entryPurposeRef.current.value;
        const entryDescription = entryDescriptionRef.current?.value;
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.post(
          `${baseURL}/api/v1/new-entry`,
          {
            submittingMemberId: selectedGrouploggedinUserMemberId,
            entryAmount,
            entryPurpose,
            entryDescription,
            participantsIds, //if it's null it means no custom participants
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          SetAddEntryResponse(response); //for refetching groups and its members, used in one of the above useEffects
          entryAmountRef.current.value = "";
          entryPurposeRef.current.value = "";
          entryDescriptionRef.current.value = "";
          setIsFormOpen(false);
          setIsAddEntryLoadingg(false);
          toast.success("New entry added successfully", {
            closeButton: true,
            autoClose: 5000,
          });
        }
      } else {
        formRef.current.reportValidity();
      }
    } catch (error) {
      setError("");
      setIsAddEntryLoadingg(false);
      if (error.response && error.response.status === 401) {
        if (error.response.data?.error === "INVALID_ENTRY_AMOUNT") {
          toast.error("Please enter only digits greater than 0", {
            closeButton: true,
            autoClose: 5000,
          });
        } else if (
          error.response.data?.error === "INVALID_CUSTOM_PARTICIPANTS"
        ) {
          setError("Select at least two participants.");
        } else {
          toast.error("Error adding new entry", {
            closeButton: true,
            autoClose: 5000,
          });
        }
      } else {
        toast.error("Error adding new entry", {
          closeButton: true,
          autoClose: 5000,
        });
      }
    }
  };

  const togleCollapse = () => {
    setIsFormOpen(!isFormOpen);
  };

  const toggleCustomParticipant = () => {
    if (isCustomParticipantsSelected) {
      setSelectedParticipants([
        {
          participantMemberId: selectedGrouploggedinUserMemberId,
          participantName: "You",
        },
      ]);
      setSelectedParticipantsMemberIds([]);
      setError("");
    }
    setIsCustomParticipantsSelected(!isCustomParticipantsSelected);
  };

  const doesParticipantAlreadyExist = (id) => {
    return selectedParticipants.some(
      (participant) => participant.participantMemberId === id
    );
  };

  //adding participant to selectedParticipants
  const handleSelectChange = (e) => {
    setError("");
    const participantName = e.target.options[e.target?.selectedIndex]?.text;
    let participantMemberId = e.target.value;
    if (typeof participantMemberId === "string") {
      participantMemberId = Number(participantMemberId);
    }
    if (!doesParticipantAlreadyExist(participantMemberId)) {
      setSelectedParticipants((previouParticipants) => [
        ...previouParticipants,
        { participantMemberId, participantName },
      ]);
    } else {
      setError("participant already slected");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  //name remove from selected participants
  const handleNameRemove = (id) => {
    const newSelectedParticipants = selectedParticipants.filter(
      (participant) => participant.participantMemberId !== id
    );
    setSelectedParticipants(newSelectedParticipants);
  };

  return (
    <div className={styles.con}>
      <div className={styles.addEntryCon}>
        <div
          className={`${styles.addEntryFormCon} ${isFormOpen && styles.open}`}
        >
          <form action="" className={styles.entryForm} ref={formRef}>
            <h5 className={styles.heading}>New entry detail</h5>
            <input
              type="number"
              placeholder="Price"
              min="0.001"
              step="any"
              required
              ref={entryAmountRef}
              className={styles.priceInputIem}
            />
            <input
              type="text"
              placeholder="Entry purpose"
              maxLength={30}
              title="up to 30 characters"
              required
              ref={entryPurposeRef}
              className={styles.purposeInputIem}
            />
            <textarea
              rows={3}
              cols={30}
              maxLength={100}
              placeholder="(optional) Description about entry up to 100 characters"
              ref={entryDescriptionRef}
            />
            <div className={styles.cstmPrtcpntAndAddEntryBtnDiv}>
              <div className={styles.customParticipatantBtnDiv}>
                <input
                  type="checkbox"
                  checked={isCustomParticipantsSelected}
                  className={styles.checkBox}
                  onChange={toggleCustomParticipant}
                />
                <span>Custom participants</span>
              </div>

              <div
                className={`${styles.addBtnCon} ${
                  isCustomParticipantsSelected && styles.buttonMoved
                }`}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddEntry();
                  }}
                >
                  {isAddEntryLoading ? (
                    <Spinner
                      animation="border"
                      role="status"
                      className={styles.addEntrySpinner}
                    />
                  ) : (
                    <span>Add Entry</span>
                  )}
                </button>
              </div>
            </div>

            {isCustomParticipantsSelected && (
              <div className={styles.customParticipantDiv}>
                <div className={styles.inputOfPrtcpntDiv}>
                  <select
                    id="participants"
                    name="participants"
                    value={""}
                    className={styles.participantsSelect}
                    onChange={handleSelectChange}
                  >
                    <option value="" disabled>
                      {selectedParticipants.length > 1
                        ? "Select another participant"
                        : "Select participant"}
                    </option>
                    {selectedGroupMembers.map((member) => {
                      return (
                        member.member_id !==
                          selectedGrouploggedinUserMemberId && (
                          <option
                            value={member.member_id}
                            key={member.member_id}
                          >
                            {member.member_name}
                          </option>
                        )
                      );
                    })}
                  </select>
                </div>
                {error && <p className={styles.participantErroP}>{error}</p>}
                <div className={styles.selectedParticipantsDiv}>
                  {selectedParticipants.map((participant) => {
                    return (
                      <div key={participant.participantMemberId}>
                        <span
                          className={styles.selectedParticipantNameSpan}
                          title={
                            participant.participantMemberId ===
                            selectedGrouploggedinUserMemberId
                              ? loggedInUser.username
                              : ""
                          }
                        >
                          {participant.participantName}
                        </span>
                        {participant.participantMemberId !==
                          selectedGrouploggedinUserMemberId && (
                          <span>
                            <RxCross2
                              color="red"
                              size={15}
                              onClick={() =>
                                handleNameRemove(
                                  participant.participantMemberId
                                )
                              }
                              title="remove participant"
                              className={styles.removeParticipantCross}
                            />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
        </div>

        <div
          className={styles.addEntryBtn}
          onClick={togleCollapse}
          title={isFormOpen ? "Hide" : "Add new entry"}
        >
          {isFormOpen ? <FaMinus size={30} /> : <FaPlus size={30} />}
        </div>
      </div>
    </div>
  );
};
export default AddEntryForm;
