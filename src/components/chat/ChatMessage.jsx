import formatMessageTime from "../../../utils/formatMessageTime";
import styles from "../../css-modules/chat/ChatMessage.module.css";

const ChatMessage = ({ message, loggedinMemberId }) => {
  const isOwnMessage = Number(message.member_id) === Number(loggedinMemberId);

  return (
    <div
      className={`${styles.messageContainer} ${
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      }`}
    >
      {!isOwnMessage && (
        <div className={styles.senderName}>{message.username}</div>
      )}

      <div className={styles.message}>{message.message}</div>

      <div className={styles.timestamp}>
        {formatMessageTime(message.created_at)}
      </div>
    </div>
  );
};

export default ChatMessage;
