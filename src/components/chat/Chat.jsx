import { useEffect } from "react";
import {
  useGetMessagesQuery,
  useMarkChatAsReadMutation,
} from "../../store/chatApiSlice";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

import styles from "../../css-modules/chat/Chat.module.css";

const Chat = ({ groupId, loggedinMemberId, onClose }) => {
  const {
    data: messages = [],
    isLoading,
    isError,
    error,
  } = useGetMessagesQuery(groupId, {
    pollingInterval: 5000,
    // five seconds delay
  });

  const [markChatAsRead] = useMarkChatAsReadMutation();

  // Mark messages as read when chat opens
  useEffect(() => {
    if (groupId) {
      markChatAsRead(groupId);
    }
  }, [groupId, markChatAsRead]);

  // Mark newly received messages as read while chat is open
  useEffect(() => {
    if (groupId && messages.length > 0) {
      markChatAsRead(groupId);
    }
  }, [groupId, messages.length, markChatAsRead]);

  return (
    <div className={styles.chatContainer}>
      <ChatHeader onClose={onClose} />

      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        loggedinMemberId={loggedinMemberId}
        isError={isError}
        error={error}
      />

      <ChatInput groupId={groupId} />
    </div>
  );
};

export default Chat;
