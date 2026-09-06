import { useState } from "react";
import { IoSend } from "react-icons/io5";

import { useSendMessageMutation } from "../../store/chatApiSlice";

import styles from "../../css-modules/chat/ChatInput.module.css";

const ChatInput = ({ groupId }) => {
  const [message, setMessage] = useState("");

  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    try {
      await sendMessage({
        groupId,
        message: trimmedMessage,
      }).unwrap();

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <form className={styles.inputContainer} onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        maxLength={500}
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        title="Send message"
      >
        <IoSend />
      </button>
    </form>
  );
};

export default ChatInput;
