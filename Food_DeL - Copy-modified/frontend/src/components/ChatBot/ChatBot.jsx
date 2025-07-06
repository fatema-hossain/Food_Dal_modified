import React, { useEffect } from 'react';

const ChatBot = () => {
  useEffect(() => {
    // Load Dialogflow Messenger script
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <df-messenger
        intent="WELCOME"
        chat-title="FoodBot"
        agent-id="8b2b61bb-6e26-48f3-9c9a-91198002647c"
        language-code="en"
      ></df-messenger>
    </div>
  );
};

export default ChatBot;
