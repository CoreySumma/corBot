import { useEffect } from "react";
import axios from "axios";

export default async function GptApi(
  serverSideChatHistory,
  setServerSideChatHistory
) {
  try {
    let response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: serverSideChatHistory,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPEN_AI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    setServerSideChatHistory([
      ...serverSideChatHistory,
      response.data.choices[0],
    ]);
    return response.data.choices[0].text;
  } catch (error) {
    console.log("Error calling chat GPT --->", error);
  }
}
