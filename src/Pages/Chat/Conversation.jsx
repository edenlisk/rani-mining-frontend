import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  useGetOneUserQuery,
  useLazyLastMessageQuery,
} from "../../states/apislice";
import { Avatar } from "antd";

import { UserOutlined } from "@ant-design/icons";
import { setUserData } from "../../states/slice";
import { Skeleton } from "antd";
// import { getUser } from "../../api/UserRequests";
const Conversation = ({
                        data,
                        currentUser,
                        fetch,
                        online,
                        fetchLastMessage,
                        setFetchLastMessage,
                      }) => {
  const userId = data.members.find((id) => id !== currentUser);
  const { data: userInfo, isSuccess: isGettingUserSuccess } =
      useGetOneUserQuery(userId, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
      });
  const [getLastMessage, { isSuccess }] = useLazyLastMessageQuery();
  const [lastMessage, setLastMessage] = useState(null);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  const fetchPreviousMessage = async () => {
    const response = await getLastMessage({ chatId: data._id });
    const { message } = response.data.data;
    if (message) {
      setLastMessage(message[0]);
    }
  };

  useEffect(() => {
    fetchPreviousMessage();
    setFetchLastMessage(false);
  }, []);

  // fetch user data
  useEffect(() => {
    if (fetchLastMessage) {
      fetchPreviousMessage();
      setFetchLastMessage(false);
    }
  }, [data, fetchLastMessage]);

  useEffect(() => {
    if (isGettingUserSuccess) {
      const { user } = userInfo.data;
      setUser(user);
    }
  }, [isGettingUserSuccess]);
  return (
      <>
        <div className="follower conversation">

          {fetch?(<div className="flex items-center gap-2 hover:bg-gray-300 rounded-md py-3 px-2">
            <Skeleton.Avatar active size={40}/>
            <div className="w-fit text-center flex flex-col items-center justify-center">
              <Skeleton.Input active size={12} block/>
              <Skeleton.Input active size={12} />
            </div>


          </div>):(<div className="flex items-center gap-2 hover:bg-gray-300 rounded-md py-3 px-2">
            {/*{online && <div className="online-dot"/>}*/}
            <Avatar size={40}>{user?.name.slice(0, 2)}</Avatar>
            <div className="name flex flex-col">
            <span className=" font-semibold" style={{ fontSize: "1rem" }}>
              {user?.name}
            </span>
              <span style={{ fontSize: "0.8rem" }}>
              {lastMessage?.senderId === currentUser
                  ? `You: ${lastMessage?.text}`
                  : lastMessage?.text}
            </span>
              {/*<span style={{color: online?"#51e200":"", marginRight: 5}}>{online? "Online" : "Offline"}</span>*/}
            </div>
          </div>)}
          {/*CONVERSATION*/}
        </div>
        {/* <hr style={{ width: "85%", border: "0.1px solid #ececec" }} /> */}
      </>
  );
};

export default Conversation;
