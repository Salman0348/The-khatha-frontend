import { FaUserCircle } from "react-icons/fa";
import styles from "../css-modules/GroupItemChangePopup.module.css";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useEffect, useRef, useState } from "react";

const GroupItemChangePopup = ({
  groupInfo,
  setIsPopupOpen,
  exceptionFromMouseDownEventRef,
  setShowEditGroupModal,
  setShowDeleteGroupModal,
  isAdmin,
}) => {
  const [isUserNotAdmin, setIsUserNotAdmin] = useState(null);

  const groupChangePopupRef = useRef();

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (
        groupChangePopupRef.current &&
        !groupChangePopupRef.current.contains(e.target) &&
        exceptionFromMouseDownEventRef.current &&
        !exceptionFromMouseDownEventRef.current.contains(e.target)
      ) {
        setIsPopupOpen(false);
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);
  return (
    <div
      className={styles.groupChangePopup}
      ref={groupChangePopupRef}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={styles.groupImgNameDiv}>
        <div className={`${styles.groupImgDiv} `}>
          {groupInfo && groupInfo.group_pic_url ? (
            <img
              src={groupInfo.group_pic_url}
              alt="group pic"
              className={styles.groupImg}
            />
          ) : (
            <FaUserCircle size={35} color="white" />
          )}
        </div>
        <span className={styles.groupNameSpan}>{groupInfo?.group_name}</span>
      </div>
      <hr className={styles.popupDivider} />
      <ul className={styles.grpList}>
        <li>
          <div className={styles.liIconsCon}>
            <FaRegEdit size={20} />
          </div>
          <span
            className={styles.liSpan}
            onClick={() => {
              setShowEditGroupModal(true);
              setIsPopupOpen(false);
            }}
          >
            Edit Group
          </span>
        </li>
        <li className={styles.deleteGrpLi}>
          <div className={styles.liIconsCon}>
            <MdDelete size={20} />
          </div>
          <span
            className={styles.liSpan}
            onClick={() => {
              if (isAdmin) {
                setShowDeleteGroupModal(true);
                setIsPopupOpen(false);
              } else {
                setIsUserNotAdmin(true);
              }
            }}
          >
            {isUserNotAdmin ? (
              <span className={styles.notAdminMssg}>Only admin can delete</span>
            ) : (
              "Delete Group"
            )}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default GroupItemChangePopup;
