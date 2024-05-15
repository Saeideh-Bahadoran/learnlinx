import { useCallback, useState } from 'react';
import { useAppMessage, useLocalSessionId, useParticipantProperty } from '@daily-co/daily-react';

import { Arrow } from '../Tray/Icons/index';
import './Chat.css';

export default function Chat({ showChat, toggleChat }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const localSessionId = useLocalSessionId();
  const username = useParticipantProperty(localSessionId, 'user_name');

  const sendAppMessage = useAppMessage({
    onAppMessage: useCallback(
      (ev) =>
        setMessages((existingMessages) => [
          ...existingMessages,
          {
            msg: ev.data.msg,
            name: ev.data.name,
          },
        ]),
      [],
    ),
  });

  const sendMessage = useCallback(
    (message) => {
      sendAppMessage(
        {
          msg: message,
          name: username || 'Guest',
        },
        '*',
      );

      setMessages([
        ...messages,
        {
          msg: message,
          name: username || 'Guest',
        },
      ]);
    },
    [messages, sendAppMessage, username],
  );

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  return showChat ? (
    <aside className="chat">
      <button onClick={toggleChat} className="close-chat" type="button">
        Close chat
      </button>
      <ul className="chat-messages">
        {messages.map((message, index) => (
          <li key={`message-${index}`} className="chat-message">
            <span className="chat-message-author">{message?.name}</span>:{' '}
            <p className="chat-message-body">{message?.msg}</p>
          </li>
        ))}
      </ul>
      <div className="add-message">
        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            className="chat-input"
            type="text"
            placeholder="Type your message here.."
            value={inputValue}
            onChange={handleChange}
          />
          <button type="submit" className="chat-submit-button">
            <Arrow />
          </button>
        </form>
      </div>
    </aside>
  ) : null;
}
