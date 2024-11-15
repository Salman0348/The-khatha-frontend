import { GoGoal } from "react-icons/go";
import { IoIosPricetags } from "react-icons/io";
import { LuFileText } from "react-icons/lu";
import { IoPerson } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";

import styles from "../css-modules/HistoryItem.module.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import extractMemberNames from "../../utils/extractMemberNames.util";
import formatToLocalTime from "../../utils/dateTimeFormat.util";

const HistoryItem = ({ historyItem, selectedGroupMembersIdAndName }) => {
  const loggedInUserInfo = useSelector((state) => state.user.userInfo);
  const { currencyName } = useSelector((state) => state.currency);

  const {
    id,
    entry_no,
    entry_amount,
    entry_purpose,
    user_id,
    entry_person,
    entry_date,
    entry_description,
  } = historyItem;
  let { participant_member_ids } = historyItem;
  let isAllMembersAreParticipants = false;
  try {
    if (participant_member_ids) {
      participant_member_ids = participant_member_ids.split(",");
    }
    if (
      Array.isArray(selectedGroupMembersIdAndName) &&
      Array.isArray(participant_member_ids) &&
      selectedGroupMembersIdAndName.length === participant_member_ids.length
    ) {
      isAllMembersAreParticipants = true;
    }
  } catch (error) {
    toast.error("Error while displaying entry participants.", {
      closeButton: true,
      autoClose: 5000,
    });
  }

  let participantNames = [];
  if (!isAllMembersAreParticipants) {
    participantNames = extractMemberNames(
      selectedGroupMembersIdAndName,
      participant_member_ids
    );
  }

  return (
    <div className={styles.historyItem}>
      <div className={styles.itemHeading}>
        <span className={styles.entryNo}>Entry No: {entry_no}</span>
        <span className={styles.entryTime}>
          {formatToLocalTime(entry_date)}
        </span>
      </div>
      <div className={styles.itemSubDiv}>
        <div>
          <IoIosPricetags size={20} className="me-2" title="Amount" />
        </div>
        <span>
          {currencyName}. {entry_amount}
        </span>
      </div>
      <div className={styles.itemSubDiv}>
        <div>
          <GoGoal size={20} className="me-2" title="Purpose" />
        </div>
        <span>{entry_purpose}</span>
      </div>
      <div className={styles.itemSubDiv}>
        <div>
          <IoPerson size={20} className="me-2" title="Member" />
          <span>
            {loggedInUserInfo && user_id === loggedInUserInfo.id
              ? "You"
              : entry_person}
          </span>
        </div>
      </div>
      {(Array.isArray(participantNames) && participantNames.length > 0) ||
      isAllMembersAreParticipants ? (
        <div className={styles.itemSubDiv}>
          <div>
            <FaUsers size={"20px"} title="Participants" />
          </div>
          <span>
            {isAllMembersAreParticipants ? "All" : participantNames.join(", ")}
          </span>
        </div>
      ) : (
        ""
      )}
      {entry_description !== ("" || null) && (
        <div className={styles.itemSubDiv}>
          <div>
            <LuFileText size={"20px"} title="Description" />
          </div>
          <span>{entry_description}</span>
        </div>
      )}
      <hr className={styles.dividerline} />
    </div>
  );
};
export default HistoryItem;
