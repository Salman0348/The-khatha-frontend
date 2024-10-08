import GroupItem from "./GroupItem";
import styles from "../css-modules/Dashboard.module.css";

const GroupList = ({ groups, getSelectedGroup, selectedGroup }) => {
  return (
    <div className={styles.groupListDiv}>
      {groups.map((group) => (
        <GroupItem
          key={group.group_id}
          group={group}
          selectedGroup={selectedGroup}
          getSelectedGroup={getSelectedGroup}
        />
      ))}
    </div>
  );
};

export default GroupList;
