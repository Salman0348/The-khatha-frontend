import React from "react";
import styles from "../css-modules/GroupListSkeleton.module.css";

const GroupListSkeleton = () => {
  return (
    <div className={styles.groupListSkeleton}>
      <div className={styles.groupItemSkeleton}>
        <div className={styles.skeletonCircle}></div>
        <div style={{ flexGrow: 1 }}>
          <div
            className={`${styles.skeletonLine} ${styles.groupNameSkeleton}`}
          ></div>
          <div
            className={`${styles.skeletonLine} ${styles.lastEntrySkeleton}`}
          ></div>
          <div
            className={`${styles.skeletonLine} ${styles.dateSkeleton}`}
          ></div>
        </div>
        <div className={styles.amountOwedSkeleton}></div>
      </div>
      <div className={styles.groupItemSkeleton}>
        <div className={styles.skeletonCircle}></div>
        <div style={{ flexGrow: 1 }}>
          <div
            className={`${styles.skeletonLine} ${styles.groupNameSkeleton}`}
          ></div>
          <div
            className={`${styles.skeletonLine} ${styles.lastEntrySkeleton}`}
          ></div>
          <div
            className={`${styles.skeletonLine} ${styles.dateSkeleton}`}
          ></div>
        </div>
        <div className={styles.amountOwedSkeleton}></div>
      </div>
      <div className={styles.groupItemSkeleton}>
        <div className={styles.skeletonCircle}></div>
        <div style={{ flexGrow: 1 }}>
          <div
            className={`${styles.skeletonLine} ${styles.groupNameSkeleton}`}
          ></div>
          <div
            className={`${styles.skeletonLine} ${styles.lastEntrySkeleton}`}
          ></div>
          <div
            className={`${styles.skeletonLine} ${styles.dateSkeleton}`}
          ></div>
        </div>
        <div className={styles.amountOwedSkeleton}></div>
      </div>
    </div>
  );
};

export default GroupListSkeleton;
