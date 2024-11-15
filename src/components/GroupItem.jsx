import { useEffect, useRef, useState } from "react";
import styles from "../css-modules/GroupItem.module.css";
import { HiUsers } from "react-icons/hi";
import formatToLocalTime from "../../utils/dateTimeFormat.util";
import { useSelector } from "react-redux";
import GroupItemChangePopup from "./GroupItemChangePopup";
import EditGroupModall from "./EditGroupModall";
import DeleteGroupModal from "./DeleteGroupModal";

const GroupItem = ({ group, getSelectedGroup, selectedGroup }) => {
  const loggedinUserInfo = useSelector((state) => state.user.userInfo);
  const { currencyName } = useSelector((state) => state.currency);

  const purposeElement = useRef(null);
  const lastEntryAmountElement = useRef(null);
  const exceptionFromMouseDownEventRef = useRef(null);
  const [isPurposeOwerflow, setIsPurposeOwerflow] = useState(false);
  const [isLastEntryAmountOwerflow, setIsLastEntryAmountOwerflow] =
    useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);

  const {
    group_id,
    admin_id,
    group_name,
    group_pic_url,
    user_amount_owed,
    last_entry_user,
    last_entry_user_id,
    last_entry_purpose,
    last_entry_amount,
    last_entry_date,
  } = group;

  const togglePopupVisibility = (e) => {
    e.stopPropagation();
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    const checkOverflow = () => {
      const el = purposeElement.current;
      if (el) {
        setIsPurposeOwerflow(el.scrollWidth > el.clientWidth);
      }
    };

    checkOverflow();
  }, [group.last_entry_purpose]);

  useEffect(() => {
    const checkOverflow = () => {
      const el = lastEntryAmountElement.current;
      if (el) {
        setIsLastEntryAmountOwerflow(el.scrollWidth > el.clientWidth);
      }
    };
    checkOverflow();
  }, [group.last_entry_amount]);

  //for updation the selectedGroup upon group edit
  useEffect(() => {
    if (selectedGroup && selectedGroup.group_id === group.group_id) {
      getSelectedGroup(group);
    }
  }, [group]);

  return (
    <div
      className={`${styles.groupItem} ${
        selectedGroup && selectedGroup.group_id === group.group_id
          ? `${styles.selected} ${styles.noHover} `
          : ""
      }`}
      onClick={() => {
        if (isPopupOpen) {
          return;
        }
        ((selectedGroup && selectedGroup.group_id !== group.group_id) ||
          !selectedGroup) &&
          getSelectedGroup(group);
      }}
    >
      <div
        className={styles.leftSection}
        onClick={(e) => {
          togglePopupVisibility(e);
        }}
        ref={exceptionFromMouseDownEventRef}
      >
        {group_pic_url ? (
          <img
            src={group_pic_url}
            alt="User"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
              border: "1px solid var(--leading-color)",
            }}
          />
        ) : (
          <HiUsers size={40} color="white" />
        )}
      </div>
      <div className={styles.rightSection}>
        <div className={styles.upperGroupInfo}>
          <h3 className={styles.groupName}>{group_name}</h3>
        </div>
        {last_entry_date /*last_entry_date is a must field in entry so if it's not present the last entry info should not be rendered*/ && (
          <div className={styles.lastEntryInfo}>
            <p className={styles.purposeAndAmount}>
              <span
                className={`${styles.lastEntryMemberName} ${styles.lastEntryTitles}`}
              >
                {last_entry_user_id === loggedinUserInfo?.id
                  ? "You"
                  : last_entry_user}
              </span>
              <span
                className={styles.purpose}
                ref={purposeElement}
                title={`${isPurposeOwerflow ? last_entry_purpose : ""}`}
              >
                : <span>{last_entry_purpose} </span>
              </span>
              <span className={styles.lastEntryTitles}>Rs</span> &nbsp;
              <span
                className={styles.amount}
                ref={lastEntryAmountElement}
                title={`${
                  isLastEntryAmountOwerflow ? `Rs ${last_entry_amount}` : ""
                }`}
              >
                {last_entry_amount}
              </span>
            </p>
            <p className={styles.dateAndTime}>
              {formatToLocalTime(last_entry_date)}
            </p>
          </div>
        )}
      </div>
      <div className={styles.amountOwed}>
        <span
          className="position-absolute badge translate-middle rounded-pill groupItemAmntOwed"
          style={{
            backgroundColor: "var(--leading-color)",
            maxWidth: "69px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={
            user_amount_owed > 0
              ? `Amount you are owed: ${Math.abs(
                  user_amount_owed
                )} ${currencyName}`
              : `Amount you owe: ${Math.abs(user_amount_owed)} ${currencyName}`
          }
        >
          <span className={styles.amountDigits}>
            {user_amount_owed > 0
              ? `+ ${Math.round(user_amount_owed)}`
              : Math.round(user_amount_owed)}
          </span>
        </span>
      </div>
      {isPopupOpen && (
        <GroupItemChangePopup
          groupInfo={{
            group_name,
            group_pic_url,
          }}
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
          setShowEditGroupModal={setShowEditGroupModal}
          setShowDeleteGroupModal={setShowDeleteGroupModal}
          exceptionFromMouseDownEventRef={exceptionFromMouseDownEventRef}
          isAdmin={loggedinUserInfo?.id === admin_id}
        />
      )}

      {showEditGroupModal && (
        <EditGroupModall
          show={showEditGroupModal}
          setShow={setShowEditGroupModal}
          oldGroupName={group_name}
          grpImgUrl={group_pic_url}
          group_id={group_id}
        />
      )}

      {showDeleteGroupModal && (
        <DeleteGroupModal
          show={showDeleteGroupModal}
          setShow={setShowDeleteGroupModal}
          groupInfo={{ group_name, group_pic_url, admin_id, group_id }}
        />
      )}

      {/* why are they here? b/c when the  GroupItemChangePopup is mounted or unmounted it won't effect the visibility of them(EditGroupModall,) */}
    </div>
  );
};

export default GroupItem;
