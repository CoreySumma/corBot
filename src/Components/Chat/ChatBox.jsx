import React, { useState } from "react";
import gptPrompt from "../../../Utilities/Gpt-prompt";
import "./ChatBox.css";

export default function ChatBox({ serverSideChatHistory, setServerSideChatHistory, clientSideChatHistory, setClientSideChatHistory }) {
  const [inputMessage, setInputMessage] = useState("");
  setServerSideChatHistory([...serverSideChatHistory, gptPrompt]);

  // Event handler for sending a message attached to the form and displaying it to user - client side
  // If the message is empty or only contains spaces, do nothing
  // Otherwise, add the message to the messages array and clear the input
  const handleDisplayMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    setClientSideChatHistory([...clientSideChatHistory, inputMessage]);
    setInputMessage("");
  };

  return (
    <div id="chatContainer">
      <div id="chatBox">
        {clientSideChatHistory.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <form id="formEl" onSubmit={handleDisplayMessage}>
        <input
          type="text"
          id="userInput"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
