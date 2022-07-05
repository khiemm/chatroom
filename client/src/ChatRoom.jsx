import React from 'react';
import { useState, useEffect, useRef } from 'react'
import ChatRoomStyle from "./ChatRoomStyle.module.css";

const io = require('socket.io-client')
var globalSocket;

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const messageInputRef = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:3000/unauthorized', { transports: ['websocket'] })

    socket.on('connected', () => {
      console.log('connected')
      socket.emit('join_room', { room: 'room1' })
    });

    socket.on('room_joined', (data) => {
      console.log('room_joined', data)
    })

    socket.on('message_sent', data => {
      console.log('message_sent', data)
      setMessages(messages => {
        return [...messages, data]
      })
    });

    socket.on('room_left', (data) => {
      console.log('room_left', data)
    });

    globalSocket = socket
    return () => {
      // cleanup
    }
  }, [])

  return (
    <div className={ChatRoomStyle.container}>
      <h1 className={ChatRoomStyle.title} >
        Chat Room
      </h1>
      <div>
        <input ref={messageInputRef} autoFocus />
        <button onClick={() => {
          globalSocket.emit('send_message', { room: 'room1', msg: messageInputRef.current.value })
          messageInputRef.current.value = '';
        }}>Send</button>
      </div>
      <div>
        <ul>
          {messages.map((e, i) => <li key={i}>{e.msg}</li>)}
        </ul>
      </div>
    </div >
  )
}

export default ChatRoom