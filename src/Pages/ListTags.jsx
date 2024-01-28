import React, {useEffect, useState} from "react";
import ListContainer from "../components/Listcomponents/ListContainer";
import { useSelector } from "react-redux";
import {ImSpinner2} from "react-icons/im";
import {Table, Input} from "antd";
import { useGetListTagsQuery } from "../states/apislice";
import {SearchOutlined} from "@ant-design/icons";
import dayjs from "dayjs";


const ListTags = () => {
    const { permissions: userPermissions } = useSelector(state => state.persistedReducer.global);
    const { data, isLoading, isSuccess } = useGetListTagsQuery();
    const [tags, setTags] = useState([]);
    const [modifiedTags, setModifiedTags] = useState([]);
    const [storeTags, setStoreTags] = useState(0);


    useEffect(() => {
        if (isSuccess) {
            const { tags } = data.data;
            setTags(tags);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        let numTags = 0;
        const modifiedTags = tags.filter(tag => tag.tagType === "mine").map((tag, index) => {
            if (tag.tagType === "mine") {
                if (tag.status === "in store") numTags++;
                if (tag.entryId) {
                    return {
                        ...tag,
                        companyName: tag.entryId.companyName,
                        tagNumber: tag.tagNumber,
                        sheetNumber: tag.sheetNumber,
                        tagType: tag.tagType,
                        status: tag.status,
                    }
                } else if (tag.supplierId) {
                    return {
                        ...tag,
                        companyName: tag.supplierId.companyName,
                        tagNumber: tag.tagNumber,
                        sheetNumber: tag.sheetNumber,
                        tagType: tag.tagType,
                        status: tag.status,
                    }
                }
            }
        })
        setStoreTags(numTags);
        setModifiedTags(modifiedTags);
    }, [tags, data]);

    const [searchText, setSearchText] = useState(""); // State for storing the filter value

    // Function to handle filtering based on company name
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm(); // Close the filter dropdown
        setSearchText(selectedKeys[0]);
    };

    const handleReset = (confirm, clearFilters) => {
        clearFilters();
        setSearchText("");
        confirm();
    };

    const columns = [
        {
            title: "Company Name",
            dataIndex: "companyName",
            key: "companyName",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search Company Name"
                        value={selectedKeys[0]}
                        autoFocus
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, "companyName")}
                        style={{ width: 188, marginBottom: 8, display: "block" }}
                    />
                    <div className="flex gap-2">
                        <button className="px-6 py-1 bg-orange-300 rounded-md" onClick={() => handleSearch(selectedKeys, confirm, "companyName")}>Search</button>
                        <button className="px-6 py-1 bg-red-300 rounded-md" onClick={() => handleReset(confirm, clearFilters)}>Reset</button>
                    </div>
                </div>
            ),
            filterIcon: (filtered) => <SearchOutlined size={30} style={{ color: filtered ? "#1890ff" : undefined }} />,
            onFilter: (value, record) => record.companyName.toLowerCase().includes(value.toLowerCase()),
            // onFilterDropdownVisibleChange: (visible) => {
            //     if (visible) {
            //         // Auto focus on the input field when the filter dropdown is opened
            //         setTimeout(() => document.getElementById("searchInput").select(), 100);
            //     }
            // },
        },
        {
            title: "Tag Number",
            dataIndex: "tagNumber",
            key: "tagNumber",
        },
        {
            title: "Weight",
            dataIndex: "weight",
            key: "weight",
        },
        {
            title: "Sheet Number",
            dataIndex: "sheetNumber",
            key: "sheetNumber",
        },
        {
            title: "Tag Type",
            dataIndex: "tagType",
            key: "tagType",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "registration Date",
            dataIndex: "registrationDate",
            key: "registrationDate",
            render: (text)  => {
                if (text) {
                    return <span>{dayjs(text).format("MMM DD, YYYY")}</span>
                } else {
                    return null;
                }
            }
        },
        {
            title: "Export Date",
            dataIndex: "exportDate",
            key: "exportDate",
            render: (text)  => {
                if (text) {
                    return <span>{dayjs(text).format("MMM DD, YYYY")}</span>
                } else {
                    return null;
                }
            }
        }
    ]

    return (
        <>
            <ListContainer
                title={"List of Tags"}
                isAllowed={userPermissions.tags?.create}
                navLinktext={"add/tag"}
                navtext={"Add New Tag"}
                table={
                    <>
                        <Table
                            className=" w-full overflow-x-auto"
                            loading={{
                                indicator: (
                                    <ImSpinner2
                                        style={{width: "60px", height: "60px"}}
                                        className="animate-spin text-gray-500"
                                    />
                                ),
                                spinning: isLoading,
                            }}
                            dataSource={modifiedTags}
                            columns={columns}
                            rowKey="_id"
                            onChange={(pagination, filters, sorter) => {
                                const { companyName } = filters;
                                if (companyName?.length > 0) {
                                    const numTags = modifiedTags.reduce((acc, currTag) => {
                                        if (currTag.companyName.toLowerCase().includes(companyName[0]?.toLowerCase()) && currTag.status === "in store") {
                                            return acc + 1;
                                        }
                                        return acc;
                                    }, 0);
                                    setStoreTags(numTags);
                                } else {
                                    const numTags = modifiedTags.reduce((acc, currTag) => {
                                        if (currTag.status === "in store") {
                                            return acc + 1;
                                        }
                                        return acc;
                                    }, 0);
                                    setStoreTags(numTags);
                                }
                            }}
                            footer={() => {
                                return (
                                    <div className="flex justify-start gap-3">
                                        <p className="text-lg font-semibold">Total Tags: {modifiedTags.length}</p>
                                        <p className="text-lg font-semibold">Tags in store: {storeTags}</p>
                                    </div>
                                )
                            }}
                        />
                    </>
                }
            />
        </>
    )
}

export default ListTags;