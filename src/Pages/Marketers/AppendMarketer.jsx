import React, {useRef, useState, useEffect} from "react";
import {Avatar, Skeleton, message } from "antd";
import {UserOutlined} from "@ant-design/icons";
import {toInitialCase} from "../../components/helperFunctions.js";
import { useGetAllMarketersQuery } from "../../states/apislice.js";


const AppendMarketer = ({visible, position}) => {

    const [searchInput, setSearchInput] = useState("");
    let newChatRef = useRef();
    const [marketers, setMarketers] = useState([]);

    const { data, isLoading, isSuccess, isError, error } = useGetAllMarketersQuery();


    useEffect(() => {
        if (isSuccess) {
            const { marketers: marketersData } = data.data;
            setMarketers(marketersData);
        } else if (isError) {
            message.error(error.data?.message);
        }
    }, [isSuccess, isError, error]);

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
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
    )
}