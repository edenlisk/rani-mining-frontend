import React, {useEffect, useState} from "react";
import {useGetAllLogsQuery} from "../states/apislice";
import dayjs from "dayjs";
import {Table, Button} from "antd";
import { useNavigate } from "react-router-dom";
import {FaExternalLinkSquareAlt} from "react-icons/fa";


const UsersActivityLogs = () => {
    const {data, isLoading, isSuccess} = useGetAllLogsQuery("",
        {
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true
        }
    );
    const [usersLogs, setUsersLogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            const {logs} = data.data
            setUsersLogs(logs);
        }
    }, [isSuccess, data]);

    const handleChange = (pagination, filters, sorter) => {
    }


    const columns = [
        {
            title: "User",
            dataIndex: "username",
            key: "username",
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: "Summary",
            dataIndex: "logSummary",
            key: "logSummary",
            sorter: (a, b) => a.logSummary.localeCompare(b.logSummary),
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            render: (_, record) => <span>{dayjs(record.createdAt).format("llll")}</span>
        },
        {
            title: "Link",
            dataIndex: "link",
            key: "link",
            sorter: (a, b) => a.link.localeCompare(b.link),
            render: (_, record) => {
                if (record.link) {
                    return <Button title="link to modified entry" onClick={() => navigate(record.link)} icon={<FaExternalLinkSquareAlt size={20}/>}/>
                }
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (_, record) => {
                if (record.status === "approved") {
                    return <span className="p-1" style={{color: "green"}}>{record.status}</span>
                } else if (record.status === "failed") {
                    return <span className="p-1" style={{color: "red"}}>{record.status}</span>
                }
            }
        },
    ];

    return (
        <Table
            columns={columns}
            expandable={{
                expandedRowRender: record => {
                    if (record.modifications) {
                        return (
                            <div className="w-full flex flex-col items-start bg-white rounded-md p-2">
                                <span className="grid grid-cols-6 items-center justify-between w-full md:w-1/2  rounded-sm">
                                  <p className=" font-semibold col-span-2 p-2 w-full border-b border-t text-start bg-slate-50">Field Name</p>
                                  <p className=" font-medium col-span-2 p-2 w-full border ">Initial Value</p>
                                  <p className=" font-medium col-span-2 p-2 w-full border ">New Value</p>
                                </span>
                                {record.modifications.map((modification, index) => {
                                    if (!Array.isArray(modification.initialValue)) {
                                        if (modification.initialValue || modification.newValue) {
                                            return (
                                                <span key={index} className="grid grid-cols-6 items-center justify-between w-full md:w-1/2  rounded-sm">
                                              <p className=" font-semibold col-span-2 p-2 w-full border-b border-t text-start bg-slate-50">{modification.fieldName}</p>
                                              <p className=" font-medium col-span-2 p-2 w-full border ">{modification.initialValue}</p>
                                              <p className=" font-medium col-span-2 p-2 w-full border ">{modification.newValue}</p>
                                            </span>
                                            )
                                        }
                                    }
                                })}
                            </div>
                        )
                    }
                },
                rowExpandable: record => record.modifications?.length > 0,
            }}
            dataSource={usersLogs}
            bordered
            // expandRowByClick
            rowKey="_id"
        />
    )



}
export default UsersActivityLogs;