import React, { useState, useEffect } from "react";
import "./ChatBox.css";
import gptChatApi from "../../../Utilities/Gpt-chat-api";

export default function ChatBox({
  serverSideChatHistory,
  setServerSideChatHistory,
  clientSideChatHistory,
  setClientSideChatHistory,
}) {
  const [inputMessage, setInputMessage] = useState("");

// Helper function to handle server side chat history with user messages and call GPT after adding it
  const addMessageToServerSideChatHistory = (message) => {
    const updatedServerSideChatHistory = [
      ...serverSideChatHistory,
      { role: "user", content: message },
    ];
    setServerSideChatHistory(updatedServerSideChatHistory);

    // Call GPT chat API with the updated chat history
    gptChatApi(
      updatedServerSideChatHistory,
      setServerSideChatHistory,
      clientSideChatHistory,
      setClientSideChatHistory
    );
  };

  const handleUserMessage = (e) => {
    e.preventDefault();
    // If it's blank, don't do anything
    if (inputMessage.trim() === "") return;
    //  Add the user message to the client-side chat history
    setClientSideChatHistory([...clientSideChatHistory, inputMessage]);
    // Add the user message to the server-side chat history
    addMessageToServerSideChatHistory(inputMessage);
    setInputMessage("");
  };

  useEffect(() => {
    console.log("Client-side chat history updated:", clientSideChatHistory);
  }, [clientSideChatHistory]);

  useEffect(() => {
    console.log("Server-side chat history updated:", serverSideChatHistory);
  }, [serverSideChatHistory]);

  return (
    <div id="chatContainer">
      <div id="chatBox">
        {clientSideChatHistory.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <form id="formEl" onSubmit={handleUserMessage}>
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
