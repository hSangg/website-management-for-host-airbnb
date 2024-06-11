"use client";
import { User } from "@/Type/User";
import React, { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  or,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const Message = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [messages, setMessages] = useState<any>([]);
  const [roomIDList, setRoomIDList] = useState<any>([]);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    const collectionRef = collection(db, "chats");
    const q = query(
      collectionRef,
      where("room", "==", selectedRoom),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot unsusbscribe");
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });

    return unsubscribe;
  }, [selectedRoom]);

  const sendMessage = async () => {
    const chatsRef = collection(db, "chats");

    await addDoc(chatsRef, {
      _id: generateUUID(),
      createdAt: new Date(),
      text: replyMessage,
      user,
      room: selectedRoom,
    });
  };

  const getRoomData = async () => {
    const userID = user?._id;
    console.log(user);
    try {
      const q = query(
        collection(db, "roomChats"),
        where("host_id", "==", userID)
      );
      const list: any = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach((doc) => {
        list.push(doc.data().room_id);
      });
      console.log(list);
      setRoomIDList(list);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRoomClick = (room: string) => {
    setSelectedRoom(room);
  };

  const handleReply = () => {
    sendMessage();
  };

  return (
    <div className="flex text-white min-h-[500px]">
      <div className="w-1/4 backdrop-blur-sm p-4 border-r rounded-tl-[15px] rounded-bl-[15px] bg-black/80 border-gray-200">
        <button onClick={getRoomData}>
          <h2 className="text-lg font-semibold mb-4">Rooms</h2>
        </button>
        <ul>
          {roomIDList.map((room: string, i: number) => (
            <li
              key={i}
              className="cursor-pointer py-2 px-4  border-b border-gray-200 hover:bg-black-50/10 transition duration-300"
              onClick={() => handleRoomClick(room as any)}
            >
              {room}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 bg-black/10 p-4 rounded-br-[15px] rounded-tr-[15px]">
        <h2 className="text-lg font-semibold mb-4">Messages</h2>
        {selectedRoom && (
          <div className="bg-white/10 p-4 border rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">😍</h3>
            <ul>
              {messages.map((message: any, index: any) => (
                <li
                  key={index}
                  onClick={() => {
                    console.log("user._id: ", user?._id);
                    console.log("message.user._id: ", message.user._id);
                  }}
                  style={{
                    textAlign: user?._id == message.user._id ? "right" : "left",
                  }}
                  className={" text-white border-b border-gray-200 py-2"}
                >
                  {message.text}
                </li>
              ))}
            </ul>
            <div className="mt-4 w-full flex">
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="border border-gray-300 bg-transparent rounded-lg p-2 mr-2 w-full"
                placeholder="Type your reply..."
              />
              <button
                onClick={handleReply}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Reply
              </button>
            </div>
          </div>
        )}
        {!selectedRoom && (
          <p className="text-gray-500">Select a room to view messages.</p>
        )}
      </div>
    </div>
  );
};

export default Message;
