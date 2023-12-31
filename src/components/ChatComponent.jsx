import React, { useEffect, useRef, useState } from 'react';
import { auth } from '../../firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase';

function ChatComponent({ chatId }) {
  const [message, setMessage] = useState([]);
  const [sendMessage, setSendMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [otherUser, setOtherUser] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'chats', chatId), (doc) => {
      const allMessages = doc.data().messages;
      const latestMessages = allMessages.slice(-50);
      setMessage(latestMessages);
      setOtherUser(doc.data().users.filter((user) => user.email !== auth.currentUser.email)[0]);
    });
    return unsub;
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  const sendMessageToDb = () => {
    if (sendMessage.length > 0) {
      updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion({ message: sendMessage, timestamp: new Date().getTime(), user: auth.currentUser.email })
      });
      setSendMessage('');
    } else {
      alert('Enter a message');
    }
  };

  useEffect(() => {
    const timesAgo = (timestamp) => {
      // ... (the time ago calculation code)
    };

    const time = timesAgo(new Date().getTime());
    const interval = setInterval(() => {
      const time = timesAgo(new Date().getTime());
      setMessage((prev) => prev.map((msg) => ({ ...msg, time })));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full md:w-3/4 h-full rounded-2xl flex flex-col justify-center current-chat overflow-y-scroll shadow-md mx-2">
      <div className="w-3/6 h-1/12 flex justify-between items-center p-4 ">
        <div className="w-1/4 h-full flex justify-center items-center">
          <img src={otherUser?.photo ? otherUser.photo : "https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png"} alt="" className="w-10 h-10 rounded-full" />
        </div>
        <div className="w-3/4 h-full flex flex-col justify-center items-start">
          <h1 className="text-lg font-mono">{otherUser?.email}</h1>
        </div>
      </div>
      <div className="w-full h-full overflow-y-auto px-4">
        {/* chat messages */}
        {message?.map((msg) => {
          const time = new Date(msg?.timestamp).toUTCString();
          const hours = time.slice(-12, -10);
          const minutes = time.slice(-9, -7);
          const ampm = hours >= 12 ? 'pm' : 'am';
          const newTime = hours + ':' + minutes + ' ' + ampm;
          //get the date and month
          const date = time.slice(5, 7);
          const month = time.slice(8, 11);
          const year = time.slice(12, 16);
          const newDate = date + ' ' + month + ' ';
          //how many mins ago
            const mins = Math.floor((new Date().getTime() - msg.timestamp) / 60000);
            const hoursAgo = Math.floor(mins / 60);
            const daysAgo = Math.floor(hoursAgo / 24);
            const monthsAgo = Math.floor(daysAgo / 30);
                let timeAgo = '';

            if (mins < 1) {
                timeAgo = 'Just now';
            } else if (mins === 1) {
                timeAgo = '1 min ago';
            }
           else if (mins < 60) {
                timeAgo = mins + ' mins ago';
            } else if (hoursAgo < 24) {
                timeAgo = hoursAgo + ' hours ago';
            } else if (daysAgo < 30) {
                timeAgo = daysAgo + ' days ago';
            } else if (monthsAgo < 12) {
                timeAgo = monthsAgo + ' months ago';
            } else {
                timeAgo = 'a long time ago';
            }
            
            

          return (
            <div key={msg?.timestamp} className="w-h-fit-content flex flex-col justify-center items-center">
              <div className="w-3/4 h-fit-content flex flex-col justify-center items-center">
                
                <div className={`w-full h-fit my-2 flex justify-end ${
                    msg?.user === auth?.currentUser?.email ? 'flex-row' : 'flex-row-reverse'

                }`}>
                <div
                  className={`w-fit h-fit-content  rounded-2xl p-2 ${
                    msg?.user === auth?.currentUser?.email ? 'bg-green-500 text-white ' : 'bg-gray-200 self-end '
                    }`}
                >
                    <p className="text-sm font-mono">{msg?.message}</p>

                
                    <p className={`text-xs font-mono ${
                        msg?.user === auth?.currentUser?.email ? 'text-gray-200' : 'text-gray-500'
                    } `}>
                    {/* {msg.user === auth?.currentUser?.email ? 'You' : otherUser?.name}{' '} */}
                    {" "}
                    {timeAgo}
                </p>
                </div>
                </div>
                </div>
            </div>
            );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full h-1/12 flex justify-center items-center p-2 ">
        <div className="w-4/5 h-full flex justify-center items-center">
          <input
            type="text"
            className="w-full h-full rounded-2xl p-4 border-2 border-gray-200"
            placeholder="Type a message"
            value={sendMessage}
            onChange={(e) => setSendMessage(e.target.value)}
          />
        </div>
        <div className="w-1/5 h-full flex justify-center items-center">
          <button
            className="w-1/2 h-full rounded-2xl bg-blue-500 text-white"
            onClick={sendMessageToDb}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;
