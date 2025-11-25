import React, { useEffect,useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatsSkeleton from './skeletons/ChatsSkeleton';
import ChatHeader from './messageViewComponents/ChatHeader';
import ChatInput from './messageViewComponents/ChatInput';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {
    const { selectedUser, messages, getMessages, isMessagesLoading } = useChatStore();
    const { authUser } = useAuthStore();
    const messagesEndRef = useRef(null);


    useEffect(() => {
        getMessages(selectedUser?._id)
    }, [selectedUser?._id, getMessages])


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    if (isMessagesLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <ChatsSkeleton />
            <ChatInput />
        </div>
    )

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                    return <div
                        key={message._id}
                        className={`chat ${message?.senderId === authUser?._id ? "chat-end" : "chat-start"}`}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={message?.senderId === authUser?._id ?
                                        authUser?.profilepic || "/avatar.png" :
                                        selectedUser?.profilepic || "/avatar.png"}
                                    alt="User" />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message?.createdAt)}
                            </time>
                        </div>

                        <div className="chat-bubble flex flex-col">
                            {message.imageUrl &&
                                <img src={message?.imageUrl} alt={"Attachment"} className='sm:max-w-[200px] rounded-md mb-2' />
                            }
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                })}

                <div ref={messagesEndRef} />

            </div>
            {/* Todo add a container when there is no message, also add the functionality set chat store to null when user loggs out */}
            <ChatInput />
        </div>
    )
}

export default ChatContainer
