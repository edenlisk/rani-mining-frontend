import React, {useState, useEffect, useRef} from "react";
import { FiEdit } from "react-icons/fi";
import { IoFilterOutline } from "react-icons/io5";
import { Avatar, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useCreateChatMutation, useGetAllUsersQuery } from "../../states/apislice";
import { current } from "@reduxjs/toolkit";
import { positions } from "slate";
import { Skeleton } from "antd";
import { useSelector } from "react-redux";
import {toInitialCase} from "../../components/helperFunctions";

const NewUSerChart = ({ chats, currentUser, setChats, visible, position, setNewUserModal }) => {
  const {userData}=useSelector(state => state.persistedReducer.global);
  const { data, isLoading, isSuccess, isError, error } = useGetAllUsersQuery();
  const [createNewChart,{isLoading:isCreating,isSuccess:isDone,isError:isFail,error:fail}]=useCreateChatMutation();
  // senderId,receiverId
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [existingChats, setExistingChats] = useState([]);

  let newChatRef = useRef();

  const handleClickOutside = (event) => {
    if (!newChatRef.current || !newChatRef.current.contains(event.target)) {
      setNewUserModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (chats) {
      setExistingChats(chats.map(chat => chat.members.find(member => member !== currentUser)));
    }
  }, [chats]);

  useEffect(() => {
    if (isSuccess) {
      const { users } = data.data;
      const filterUsers = users.filter((user) => user.name.toLowerCase().includes(searchInput.toLowerCase()) && user._id !== userData._id && !existingChats.includes(user._id));
      setFilteredUsers(filterUsers);
    }
  }, [isSuccess, data, searchInput]);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleNewChartUser = async (id) => {
    const body={senderId:userData._id,receiverId:id};
    console.log(body);
    const existingChats = chats.map(chat => chat.members.find(member => member.toString() !== userData._id.toString()));
    if (existingChats.includes(id.toString())) {
      setNewUserModal(!visible);
      return;
    }
    const response = await createNewChart({body});
    if (response) {
        const { newChat } = response.data.data;
        setChats(prevState => ([...prevState, newChat]));
        setNewUserModal(!visible);
    }
    setNewUserModal(!visible);
  };


  return (
    <>
      <div
        className={`rounded-md shadow-lg h-96 max-w-72 absolute ${position} bg-gray-200 z-50 p-2 space-y-1 ${
          visible ? "block" : "hidden"
        }`}
        ref={newChatRef}
      >
        <p className=" text-lg font-bold">New Chat</p>
        <input
          type="text"
          name="filteredUser"
          className="w-full px-2 py-1 rounded-md focus:outline-none"
          onChange={handleSearchInputChange}
          value={searchInput}
        />

        <div className=" space-y-2 max-h-[290px] w-full overflow-y-auto">
          <p>All Contacts</p>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(({ name, role, _id }) => (
              <div
                key={_id}
                className="flex items-center gap-3"
                onClick={currentUser}
              >
                {isLoading ?(
                  <>
                    <Skeleton.Avatar active size={40} />
                    <Skeleton.Input active />
                  </>
                ): (
                  <div className="flex gap-2" onClick={()=>{handleNewChartUser(_id)}}>
                    <Avatar size={40} icon={<UserOutlined />} />
                    <div
                      className="name flex flex-col"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <span className=" font-bold">{name}</span>
                      <span className="">{toInitialCase(role)}</span>
                    </div>
                  </div>
                ) }
              </div>
            ))
          ) : (
            <>
                    <Skeleton.Avatar active size={40} />
                    <Skeleton.Input active />
                  </>
          )}
        </div>
      </div>
    </>
  );
};

export default NewUSerChart;
