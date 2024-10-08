import { HiUsers } from "react-icons/hi";
import styles from "../css-modules/GroupHeader.module.css";
import { MdKeyboardArrowLeft } from "react-icons/md";

const GroupHeader = ({
  selectedGroupName,
  selectedGroupPic,
  handleSelectedGroup,
}) => {
  return (
    <div className={styles.outerDiv}>
      <div
        className={styles.backBtnDiv}
        onClick={() => {
          handleSelectedGroup(null);
        }}
      >
        <MdKeyboardArrowLeft className={styles.leftArrow} />
      </div>
      <div className={styles.groupImgDiv}>
        {selectedGroupPic ? (
          <img
            src={selectedGroupPic}
            alt="group_pic"
            className={styles.groupImg}
          />
        ) : (
          <HiUsers size={27} color="white" />
        )}
      </div>
      <span className={styles.grpNameSpan}>{selectedGroupName}</span>
    </div>
  );
};

export default GroupHeader;
