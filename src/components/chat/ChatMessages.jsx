import { useEffect, useLayoutEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

import styles from "../../css-modules/chat/ChatMessages.module.css";

const ChatMessages = ({
  messages,
  loggedinMemberId,
  isLoading,
  isError,
  error,
}) => {
  const messagesEndRef = useRef(null);
  const isInitialLoad = useRef(true);

  // Initial chat opening: jump directly to the bottom
  useLayoutEffect(() => {
    if (messages?.length > 0 && isInitialLoad.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      isInitialLoad.current = false;
    }
  }, [messages]);

  // After initial load: smoothly scroll when new messages arrive
  useEffect(() => {
    if (messages?.length > 0 && !isInitialLoad.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isLoading) {
    return <div className={styles.status}>Loading messages...</div>;
  }

  if (isError) {
    return <div className={styles.status}>Failed to load messages.</div>;
  }

  if (!messages || messages.length === 0) {
    return <div className={styles.empty}>No messages yet.</div>;
  }

  return (
    <div className={styles.messagesContainer}>
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          loggedinMemberId={loggedinMemberId}
        />
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
