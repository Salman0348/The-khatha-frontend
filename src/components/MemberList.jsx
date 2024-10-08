import MemberItem from "./MemberItem";
import styles from "../css-modules/Dashboard.module.css";

const MemberList = ({
  selectedGroupMembers,
  showHistory,
  selectedGroupAdminId,
}) => {
  return (
    <div
      className={`${
        showHistory
          ? styles.memberListOnShowedHistory
          : styles.memberListOnHiddenHistory
      }`}
    >
      {selectedGroupMembers.map((member) => (
        <MemberItem
          key={member.member_id}
          member={member}
          selectedGroupAdminId={selectedGroupAdminId}
        />
      ))}
    </div>
  );
};
export default MemberList;
