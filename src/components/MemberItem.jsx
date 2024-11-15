import { useState } from "react";
import styles from "../css-modules/MemberItem.module.css";
import { GoGoal } from "react-icons/go";
import { IoIosPricetags } from "react-icons/io";
import { LuFileText } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import formatToLocalTime from "../../utils/dateTimeFormat.util";

const MemberItem = ({ member, selectedGroupAdminId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const loggedinUserInfo = useSelector((state) => state.user.userInfo);
  const { currencyName } = useSelector((state) => state.currency);
  const {
    member_id,
    user_id,
    member_name,
    member_pic_url,
    member_amount_owed,
    member_last_entry_purpose,
    member_last_entry_amount,
    member_last_entry_time,
    member_last_entry_description,
  } = member;

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={` ${styles.memberItem}`}>
      <div className={` ${styles.header}`} onClick={toggleCollapse}>
        <div className={styles.memberImg}>
          {member_pic_url ? (
            <img
              src={member_pic_url}
              alt="Member"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            <FaUserCircle size={60} color="white" />
          )}
        </div>
        <h5 className={styles.memberName}>
          {loggedinUserInfo && user_id === loggedinUserInfo.id
            ? "You"
            : member_name}
        </h5>
        {user_id === selectedGroupAdminId && (
          <div className={styles.isAdminDiv}>Admin</div>
        )}
        <span
          className={styles.amountOwed}
          title={
            member_amount_owed > 0
              ? `Amount ${member_name} is owed: ${Math.abs(
                  member_amount_owed
                )} ${currencyName}`
              : `Amount ${member_name} owes: ${Math.abs(
                  member_amount_owed
                )} ${currencyName}`
          }
        >
          {member_amount_owed > 0 ? (
            <span>+{member_amount_owed}</span>
          ) : (
            <span>{member_amount_owed}</span>
          )}
        </span>
      </div>

      <div
        className={`${styles.collapsibleContent} ${isOpen ? styles.open : ""}`}
      >
        <div className={` ${styles.body}`}>
          <hr className={styles.divider} />
          {member_last_entry_time ? (
            <>
              <p className={styles.bodyFirstRow}>
                <span className={styles.lstEntryHdng}>Last Entry</span>
                <span className={styles.lastEntryTime}>
                  {formatToLocalTime(member_last_entry_time)}
                </span>
              </p>
              <div className={styles.lastEntryDetail}>
                <p>
                  <IoIosPricetags
                    size={20}
                    className={styles.iconMarginRight}
                    title="Amount"
                  />
                  {currencyName}. {member_last_entry_amount}
                </p>
                <p>
                  <GoGoal
                    size={20}
                    className={styles.iconMarginRight}
                    title="Purpose"
                  />
                  {member_last_entry_purpose}
                </p>
                {member_last_entry_description !== null && (
                  <p className={styles.descriptionP}>
                    <span
                      className={`${styles.iconMarginRight} ${styles.descriptionIconMarginRight}`}
                    >
                      <LuFileText size={20} title="Description" />
                    </span>
                    <span className={styles.description}>
                      {member_last_entry_description}
                    </span>
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className={styles.zeroEntriesDiv}>
              <p className={styles.zeroEntriesP}>Zero Entries</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MemberItem;
