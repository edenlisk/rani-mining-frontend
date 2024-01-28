import React, {useEffect, useState, useContext} from "react";
import Conversation from "./Conversation";
import {useUserChatsQuery, useGetAllUsersQuery} from "../../states/apislice";
import {useSelector} from "react-redux";
import ChatBox from "./ChatBox";
// import io from 'socket.io-client';
import {SocketContext} from "../../context files/socket";
import {GrAddCircle} from "react-icons/gr";
import {IoMdAddCircle} from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { IoFilterOutline } from "react-icons/io5";
import {UserOutlined} from "@ant-design/icons";
import {Avatar, message} from "antd";
import NewUSerChart from "./NewUserChat";

// const socket = io.connect("http://localhost:5001");
const Chat = () => {
    const socket = useContext(SocketContext);

    const { userData } = useSelector(state => state.persistedReducer.global);
    const {data, isLoading, isSuccess} = useUserChatsQuery({userId: userData._id},
        {
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true
        }
    );
    // const [fetchData, setFetchData] = useState(true);
    // const {data:usersData, isSuccess:usersSuccess} = useGetAllUsersQuery("", {skip: fetchData});
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [receiveMessage, setReceiveMessage] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);
    const [fetchLastMessage, setFetchLastMessage] = useState(false);
    const [newUserModal, setNewUserModal] = useState(false);
    const [users, setUsers] = useState([]);
    // const [currentUserTyping, setCurrentUserTyping] = useState({status: false, receiverId: null});


    useEffect(() => {
        socket.emit('new-user-add', {userId: userData._id, username: userData.username, role: userData.role, permissions: userData.permissions});
        socket.on('get-users', users => {
            setOnlineUsers(users);
        })
    }, [userData]);


    useEffect(() => {
        socket.on('receive-message', data => {
            setReceiveMessage(data);
            setFetchLastMessage(true);
        })
    }, []);

    // useEffect(() => {
    //     if (currentUserTyping) {
    //         socket.emit('current-typing', currentUserTyping);
    //     }
    // }, [currentUserTyping]);


    useEffect(() => {
        if (sendMessage !== null) {
            socket.emit('send-message', sendMessage);
            setFetchLastMessage(true);
        }
    }, [sendMessage]);

    useEffect(() => {
        if (isSuccess) {
            const {chats: userChats} = data.data;
            setChats(userChats);
        }
    }, [isSuccess]);

    // useEffect(() => {
    //     if (usersSuccess) {
    //         const {users} = usersData.data;
    //         if (users) setUsers(users);
    //     }
    // }, [usersSuccess]);

    // const fetchUsers = () => {
    //     setFetchData(false);
    // }




    return (
        <>
        <div className="flex h-full space-y-3 item">
            {/*CHATTING*/}

            <div className="w-1/4 bg-zinc-50 overflow-y-hidden rounded-[4px] p-2 rounded-tr-none rounded-br-none border-r border-gray-200 ">
            <div className="add chatt flex justify-between items-center p-2">
          <p className=" font-bold text-xl">Chats</p>
          <div className="flex justify-end items-center">
            <span className=" p-4 hover:bg-gray-300 rounded-md relative" onClick={()=>setNewUserModal(!newUserModal)}>
              <FiEdit />
            </span>
            {/* ADD NEW CHAT USER MODAL */}

            {/* <div className=" bg-red-500 rounded-md shadow-lg h-96 max-w-72 absolute top-36 left-60 z-50 p-2 space-y-1">
                <p className=" text-lg font-bold">New Chat</p>
                <input type="text" className="w-full px-2 py-1 rounded-md"/>
                <div className=" space-y-2 max-h-[290px] w-full overflow-y-auto">
                    <p>all contacts</p>

                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                    <div className="flex items-center gap-3">
                                    <Avatar size={40} icon={<UserOutlined/>}/>
                                    <div className="name" style={{fontSize: "0.9rem"}}>
                                        <span className=" font-bold">
                                         Alfred
                                        </span>
                                    </div>
                                </div>
                </div>
            </div> */}
            <NewUSerChart visible={newUserModal} setChats={setChats} chats={chats} setNewUserModal={setNewUserModal} position={"top-36 left-60"}/>

            <span className=" p-4 hover:bg-gray-300 rounded-md">
              <IoFilterOutline />
            </span>
          </div>
        </div>
                {/*<div className="flex justify-end">*/}
                {/*    <IoMdAddCircle className="text-3xl" style={{marginRight: "0.2rem", marginTop: "0.2rem"}} color={"#1816dc"} size={35} onClick={fetchUsers}/>*/}
                {/*</div>*/}
                {chats.map((chat, index) => (
                    <div key={index} onClick={() => setCurrentChat(chat)}>
                        <Conversation fetch={isLoading} data={chat} currentUser={userData._id}  fetchLastMessage={fetchLastMessage} setFetchLastMessage={setFetchLastMessage}/>
                    </div>
                ))}
            </div>
            {/* <div className="w-full"> */}
                <ChatBox chat={currentChat} currentUser={userData._id}  setSendMessage={setSendMessage} receivedMessage={receiveMessage}/>
            {/* </div> */}
        </div>
        </> 
    )
}

export default Chat;
