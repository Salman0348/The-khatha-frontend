import { IoClose } from "react-icons/io5";

import styles from "../../css-modules/chat/ChatHeader.module.css";

const ChatHeader = ({ onClose }) => {
  return (
    <div className={styles.chatHeader}>
      <span>Group Chat</span>

      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        title="Close chat"
      >
        <IoClose />
      </button>
    </div>
  );
};

export default ChatHeader;
