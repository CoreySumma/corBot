import React, { useState } from "react";
import "./ChatBox.css";
import gptChatApi from "../../../Utilities/Gpt-chat-api";

export default function ChatBox({
  serverSideChatHistory,
  setServerSideChatHistory,
  clientSideChatHistory,
  setClientSideChatHistory,
}) {
  const [inputMessage, setInputMessage] = useState("");

  // Function for adding messages to server side chat history
  // Otherwise add it to the server side chat history with this format {"role": "user", "content": "message"}
  const addMessageToServerSideChatHistory = (message) => {
    setServerSideChatHistory([
      ...serverSideChatHistory,
      { role: "user", content: message },
    ]);
    console.log("Sending to GPT API:", JSON.stringify(serverSideChatHistory, null, 2));
    // Call the GPT chat API to get the response - The function already adds it to server side history
    gptChatApi(serverSideChatHistory, setServerSideChatHistory)
  };

  // Event handler for sending a message attached to the form and displaying it to user - client side
  // and to add it to the server side chat history
  // If the message is empty or only contains spaces, do nothing
  // Otherwise, add the message to the messages array and clear the input
  const addMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;
    // Set client side chat history to include the input message on front-end
    setClientSideChatHistory([...clientSideChatHistory, inputMessage]);
    // Add the message to the server side chat history
    addMessageToServerSideChatHistory(inputMessage);
    setInputMessage("");
  };

  return (
    <div id="chatContainer">
      <div id="chatBox">
        {clientSideChatHistory.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <form id="formEl" onSubmit={addMessage}>
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
