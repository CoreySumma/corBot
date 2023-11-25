import "./App.css";
import ChatBox from "./Components/Chat/ChatBox";
import gptChatPrompt from "../Utilities/Gpt-chat-prompt";
import React, { useState } from "react";

export default function App() {
  // Intro message in chat box - customize it however you would like!
  const introMessage = {
    content:
      "Hi There! My Name is Corey and I am a Software Engineer based in Austin. Feel free to ask me anything 😊",
    role: "assistant",
  };
  // Backend chat history that includes the prompt
  const [serverSideChatHistory, setServerSideChatHistory] =
    useState(gptChatPrompt);
  // Frontend chat history that does not includes the prompt
  const [clientSideChatHistory, setClientSideChatHistory] = useState([
    introMessage,
  ]);
  return (
    <>
      <h1>CorBot 1.0</h1>
      <ChatBox
        serverSideChatHistory={serverSideChatHistory}
        setServerSideChatHistory={setServerSideChatHistory}
        clientSideChatHistory={clientSideChatHistory}
        setClientSideChatHistory={setClientSideChatHistory}
      />
    </>
  );
}
