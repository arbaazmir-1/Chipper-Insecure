import React from 'react'
import Navbar from '../components/Navbar'
import { auth } from '../../firebase'
import { useState, useEffect } from 'react'
import { doc, onSnapshot, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import ChatComponent from '../components/ChatComponent'
import { useNavigate } from 'react-router-dom'



function FriendsPage() {
    const [friends, setFriends] = useState([])
    const [showChat, setShowChat] = useState(false)
    const [chatId, setChatId] = useState('')
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const [showFriends, setShowFriends] = useState(false)


    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            if (user) {
                setLoading(true)
                const docRef = doc(db, 'users', user.email)
                const unsub = onSnapshot(docRef, (doc) => {
                    setFriends(doc.data()?.friends ?? [])
                    setLoading(false)
                    console.log(doc.data()?.friends)
                })

                return unsub
            } else {
                setLoading(false)
                setFriends([])
            }
        })

        return unsub
    }
    , [])

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/login')
            }
        })
    }
    , [])

    const openChat = (id) => {
        setShowChat(true)
        setChatId(id)
    }


  return (
    <>
        <div className="w-full h-screen ">
            <Navbar />
            <div className="flex flex-row w-full h-full">
            <div className="flex flex-col w-1/4 h-full bg-gray-200">
                <div className="flex flex-row justify-between items-center p-2">
                <h1 className="text-2xl font-bold">Friends</h1>
                <button onClick={() => setShowFriends(!showFriends)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {showFriends ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    )}
                    </svg>
                </button>
                </div>
                {showFriends && (
                <div className="flex flex-col w-full h-full overflow-y-auto">
                    {friends.map((friend) => (
                    <div key={friend} className="flex flex-row justify-between items-center p-2 hover:bg-gray-300 cursor-pointer" onClick={() => openChat(friend)}>
                        <div className="flex flex-row items-center">
                        <div className="w-12 h-12 bg-gray-400 rounded-full mr-2"></div>
                        <h1>{friend}</h1>
                        </div>
                        <button>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        </button>
                    </div>
                    ))}
                </div>
                )}
            </div>
            <div className="flex flex-col w-3/4 h-full bg-gray-100">
                {showChat ? (
                <ChatComponent chatId={chatId} />
                ) : (
                <div className="flex flex-col justify-center items-center w-full h-full">
                    <h1 className="text-2xl font-bold">Select a friend to chat</h1>
                </div>
                )}
            </div>
            </div>
        </div>



    </>
  )
}

export default FriendsPage