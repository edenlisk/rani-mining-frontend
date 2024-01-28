import React, {useContext, useEffect, useState} from "react";
import {useGetAllEditRequestsQuery, useUpdateEditRequestMutation} from "../states/apislice";
import ListContainer from "../components/Listcomponents/ListContainer";
import {ImSpinner2} from "react-icons/im";
import Countdown from "react-countdown";
import {message, Table} from "antd";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {SocketContext} from "../context files/socket";
import {toInitialCase} from "../components/helperFunctions";
import {useSelector} from "react-redux";

dayjs.extend(localizedFormat);


const EditRequests = () => {
    const socket = useContext(SocketContext);
    const { permissions } = useSelector(state => state.persistedReducer?.global);
    const {data, isSuccess, isLoading} = useGetAllEditRequestsQuery("", {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });
    const [updateEditRequest, {
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateEditRequestMutation();
    const [editRequests, setEditRequests] = useState([]);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (isSuccess) {
            const {editRequests} = data.data;
            setEditRequests(editRequests);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (isUpdateSuccess) {
            message.success("Edit request updated successfully");
        } else if (isUpdateError) {
            const {message: errorMessage} = updateError.data;
            message.error(errorMessage);
        }
    }, [isUpdateSuccess, isUpdateError, updateError]);


    const handleUpdate = async (body, record) => {
        setUserName(record.username);
        await updateEditRequest({body, requestId: record._id});
        socket.emit("request-decision", {decision: body.decision, userName});
        // if (isUpdateSuccess && body.decision) {
        //     socket.emit("request-authorized", userName);
        // } else if (isUpdateSuccess && body.decision === false) {
        //     socket.emit("request-rejected", userName);
        // }
    }

    const columns = [
        {
            title: "username",
            dataIndex: "username",
            key: "username",
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: "Requested At",
            dataIndex: "editRequestedAt",
            // key: "username",
            sorter: (a, b) => a.editRequestedAt.localeCompare(b.editRequestedAt),
            render: (_, record) => <span>{dayjs(record.editRequestedAt).format("llll")}</span>
        },
        {
            title: "Expires At",
            dataIndex: "editExpiresAt",
            // key: "edit",
            sorter: (a, b) => a.username.localeCompare(b.username),
            render: (_, record) => <span>{record.editExpiresAt ? dayjs(record.editExpiresAt).format("llll"): null}</span>

        },
        {
            title: "Time Rem.",
            dataIndex: "editExpiresAt",
            // key: "edit",
            sorter: (a, b) => a.username.localeCompare(b.username),
            render: (_, record) => {
                return (
                    <>
                        {record.requestStatus === "authorized" || record.requestStatus === "expired" ?
                            <Countdown
                                date={dayjs(record.editExpiresAt).valueOf()}
                                // onComplete={() => {
                                //     if (record.requestStatus === "pending") {
                                //         handleUpdate({ requestStatus: "expired" }, record._id);
                                //     }
                                // }}
                                renderer={({hours, minutes, seconds, completed}) => {
                                    if (completed) {
                                        return <span>Timeout</span>
                                    } else {
                                        return (
                                            <span>
                                                {String(hours).padStart(2, "0")}:
                                                {String(minutes).padStart(2, "0")}:
                                                {String(seconds).padStart(2, "0")}
                                            </span>
                                        )
                                    }
                                }}
                            /> :
                            null
                        }
                    </>
                )
            }
        },
        {
            title: "Status",
            dataIndex: "requestStatus",
            key: "requestStatus",
            align: "center",
            sorter: (a, b) => a.username.localeCompare(b.username),
            render: (_, record) => {
                let item;
                if (record.requestStatus === "pending") {
                    item = <span className=" text-center text-xs  font-medium py-1 px-2 rounded-full text-custom_blue-600 bg-custom_blue-200 border-custom_blue-500 border w-fit ">{record.requestStatus}</span>
                } else if (record.requestStatus === "authorized") {
                    item = <span className=" text-center text-xs  font-medium py-1 px-2 rounded-full text-green-600 bg-green-200 border-green-500 border w-fit ">{record.requestStatus}</span>
                } else if (record.requestStatus === "rejected") {
                    item = <span className=" text-center text-xs  font-medium py-1 px-2 rounded-full text-red-600 bg-red-200 border-red-500 border w-fit ">{record.requestStatus}</span>
                } else {
                    item = <span className=" text-center text-xs  font-medium py-1 px-2 rounded-full text-gray-600 bg-gray-200 border-gray-500 border w-fit ">{record.requestStatus}</span>
                    
                }
                return (
                    <div className=" text-start"> {item}</div>
                );
            }
        },
        {
            title: "Decision",
            dataIndex: "editExpiresAt",
            // key: "edit",
            // sorter: (a, b) => a.username.localeCompare(b.username),
            render: (_, record) => {
                return (
                    <span className="flex gap-1">

                        <button
                            disabled={record.requestStatus !== "pending"}
                            className="bg-green-500 p-1 pl-2 pr-2 rounded-[4px]"
                            onClick={() => handleUpdate({decision: true}, record)}
                        >
                            Authorize
                        </button>
                        <button
                            disabled={record.requestStatus !== "pending"}
                            className="bg-red-500 p-1 pl-2 pr-2 rounded-[4px]"
                            onClick={() => handleUpdate({decision: false}, record)}
                        >
                            Reject
                        </button>

                        {permissions.editRequests?.authorize && (
                            <button
                                disabled={record.requestStatus !== "pending"}
                                className="bg-green-300 p-1 pl-2 pr-2 rounded-[4px]"
                                onClick={() => handleUpdate({decision: true}, record)}
                            >
                                Authorize
                            </button>
                        )}
                        {permissions.editRequests?.reject && (
                            <button
                                disabled={record.requestStatus !== "pending"}
                                className="bg-red-400 p-1 pl-2 pr-2 rounded-[4px]"
                                onClick={() => handleUpdate({decision: false}, record)}
                            >
                                Reject
                            </button>
                        )}

                    </span>
                )
            }
        },

    ]



    return (
        <>
            <ListContainer
                title={"Edit Requests"}
                table={
                    <>
                        <Table
                            className="w-full overflow-x-auto"
                            loading={{
                                indicator: (
                                    <ImSpinner2
                                        style={{width: "60px", height: "60px"}}
                                        className="animate-spin text-gray-500"
                                    />
                                ),
                                spinning: isLoading,
                            }}
                            dataSource={editRequests}
                            columns={columns}
                            expandable={{
                                expandedRowRender: (record) => {
                                    const excludedFields = ["_id", "updatedAt", "createdAt", "registrationDate", "id", "entryId", "_v", "__v"];

                                    return (
                                        <div>
                                            {record.editableFields.map(({fieldname, initialValue}) => {
                                                if (!excludedFields.includes(fieldname)) {
                                                    return (
                                                        <div key={fieldname}>
                                                            <span className="font-bold">{fieldname}</span>
                                                            {!Array.isArray(initialValue) ? <span className="ml-2">{initialValue}</span> : (
                                                                <ul className="ml-2">
                                                                    {initialValue.map(item => {
                                                                        Object.entries(item).map(([key, value]) => {
                                                                            if (!excludedFields.includes(`${key}`)) {
                                                                                return (
                                                                                    <li key={key}>
                                                                                        <span className="font-bold">{toInitialCase(key)}</span>
                                                                                        <span className="ml-2">{value}</span>
                                                                                    </li>
                                                                                )
                                                                            }
                                                                        })
                                                                    })}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    )
                                },
                                rowExpandable: (record) => record.editableFields?.length > 0,
                            }}
                            rowKey="_id"
                        />
                    </>
                }
            />
        </>
    )
}

export default EditRequests;