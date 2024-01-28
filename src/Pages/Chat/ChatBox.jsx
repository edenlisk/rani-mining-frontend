import React, {useEffect, useRef, useState} from "react";
import {useGetOneUserQuery, useAddMessageMutation, useLazyGetMessagesQuery,useCreateChatMutation} from "../../states/apislice";
// import { format } from "timeago";
import InputEmoji from 'react-input-emoji'
import { VscSend } from "react-icons/vsc";
import {UserOutlined} from "@ant-design/icons";
import {Avatar, message} from "antd";
import {GrAdd} from "react-icons/gr";
// import RelativeTime from "dayjs/plugin/relativeTime";
// import dayjs from "dayjs";
// dayjs.extend(RelativeTime);



const ChatBox = ({chat, currentUser, setSendMessage, receivedMessage, setCurrentUserTyping}) => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const [getMessages, {isLoading, isSuccess}] = useLazyGetMessagesQuery();
    const {data, isSuccess: isGettingUserSuccess} = useGetOneUserQuery(userId, {skip: !userId});
    const [addMessage, {isError: isAddMessageError, error: addMessageError}] = useAddMessageMutation();
    // const [createChat] = useCreateChatMutation({senderId,receiverId});   TO DO LATER  IN THE CHAT 

    // respond to failure to send message
    useEffect(() => {
        if (isAddMessageError) {
            const {message: errorMessage} = addMessageError;
            message.error(errorMessage);
        }
    }, [addMessageError, isAddMessageError]);

    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const handleChange = (newMessage) => {
        setNewMessage(newMessage);
    }

    useEffect(() => {
        if (receivedMessage !== null && receivedMessage?.chatId === chat?._id) {
            setMessages(prevState => ([...prevState, receivedMessage]));
        }
    }, [receivedMessage]);

    // fetching data for header
    useEffect(() => {
        if (chat !== null) {
            if (isGettingUserSuccess) {
                const { user } = data.data;
                setUserData(user);
            }
        }
    }, [chat, currentUser, isGettingUserSuccess]);

    // fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await getMessages({chatId: chat._id});
                const {messages} = data.data.data;
                setMessages(messages);
            } catch (error) {
            }
        };

        if (chat !== null) fetchMessages();
    }, [chat]);


    // Always scroll to last Message
    useEffect(() => {
        scroll.current?.scrollIntoView({behavior: "smooth"});
    }, [messages])


    // Send Message
    const handleSend = async (e) => {
        if (newMessage === "") return;
        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id,
        }
        const { data } = await addMessage({body: message});
        const { message: msg } = data.data;
        setMessages(prevState => ([...prevState, msg]));
        setNewMessage("");

        // send message to socket server
        const receiverId = chat?.members?.find((id) => id !== currentUser);
        setSendMessage({...message, receiverId});
        // setCurrentUserTyping({status: false, receiverId: null});

    }

    // useEffect(() => {
    //     window.onclick = () => setCurrentUserTyping({status: false, receiverId: null})
    // }, []);


// Receive Message from parent component
//     useEffect(() => {
//         if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
//             setMessages([...messages, receivedMessage]);
//         }
//
//     }, [receivedMessage])


    const scroll = useRef();
    const imageRef = useRef();

    return (
        <>
            <div className="ChatBox-container w-full h-full overflow-y-hidden overflow-x-hidden relative ">
                {chat ? (
                    <>
                        {/* chat-header */}
                        <div className="chat-header border-b shadow-lg p-2 w-full absolute z-20 bg-zinc-700">
                           
                                <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                          {userData?.name}
                                        </span>
                                    </div>
                                </div>

                        </div>
                        {/* chat-body */}
                        <div className="flex flex-col h-full w-full py-20 px-2 convo-body gap-2 overflow-y-scroll z-10">
                            {messages.map((message, index) => (
                                <div key={index} ref={scroll}
                                     className={`${message.senderId === currentUser ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white self-end" : "bg-white"} ps-2 pe-6 pb-[9px] shadow-md pt-1 text-start rounded-[4px] w-fit`}
                                >
                                    <span>{message.text}</span>{""}
                                    {/*<span>{format(message.createdAt)}</span>*/}
                                </div>
                            ))}
                        </div>
                        {/* chat-sender */}
                        <div className="flex items-center absolute shadow-md bottom-0 w-full z-20 bg-zinc-50">
                            <GrAdd onClick={() => imageRef.current.click()}/>
                            <InputEmoji
                                value={newMessage}
                                onChange={handleChange}
                                onEnter={handleSend}
                                // onFocus={() => setCurrentUserTyping({status: true, receiverId: chat?.members?.find((id) => id !== currentUser)})}
                            />
                            <button className="bg-blue-400 flex items-center gap-1 p-2 rounded-[4px] text-white" onClick={handleSend}>
                                <p className="m-0">Send</p>
                                <VscSend />
                                
                            </button>
                            <input
                                type="file"
                                name=""
                                id=""
                                style={{display: "none"}}
                                ref={imageRef}
                            />
                        </div>
                        {" "}
                    </>
                ) : (
                    <span className="chatbox-empty-message">
                        Tap on a chat to start conversation...
                    </span>
                )}
            </div>
        </>
    );
};

export default ChatBox;