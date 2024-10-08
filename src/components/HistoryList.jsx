import HistoryItem from "./HistoryItem";
import styles from "../css-modules/HistoryItem.module.css";
import generatePDF from "../../utils/generatePDF";

const HistoryList = ({
  groupName,
  historyItems,
  selectedGroupMembers: selectedGroupMembersIdAndName,
}) => {
  return (
    <div className="pb-2">
      {historyItems &&
        historyItems.map((historyItem) => (
          <HistoryItem
            key={historyItem.id}
            historyItem={historyItem}
            selectedGroupMembersIdAndName={selectedGroupMembersIdAndName}
          />
        ))}
      {historyItems && (
        <div className={styles.generatePdfBtnDiv}>
          <button
            className={styles.generatePdfBtn}
            onClick={() => {
              generatePDF(
                groupName,
                historyItems,
                selectedGroupMembersIdAndName
              );
            }}
          >
            Generate pdf
          </button>
        </div>
      )}
    </div>
  );
};
export default HistoryList;
