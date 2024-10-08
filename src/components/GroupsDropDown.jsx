import { useEffect, useReducer, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import styles from "../css-modules/GroupsDropDown.module.css";
import CreateGroupModal from "./CreateGroupModal";

const GroupsDropDown = ({
  showCreateGroupModal,
  setShowCreateGroupModal,
  SetAddNewGroupResponse,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div className={styles.dropDownContainer} ref={menuRef}>
      <div className={`${styles.threeDotsCon} ${isOpen && styles.openColor}`}>
        <BsThreeDotsVertical
          className={styles.threeDots}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
      </div>
      <div className={isOpen ? styles.menu : styles.hideMenu}>
        <div className={styles.newGroupBtn}>
          <CreateGroupModal
            showCreateGroupModal={showCreateGroupModal}
            setShowCreateGroupModal={setShowCreateGroupModal}
            SetAddNewGroupResponse={SetAddNewGroupResponse}
            setIsGroupsDropDownOpen={setIsOpen}
          />
        </div>
      </div>
    </div>
  );
};
export default GroupsDropDown;
