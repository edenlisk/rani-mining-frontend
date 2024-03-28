import React, {useEffect, useState} from 'react';
import ListContainer from "../components/Listcomponents/ListContainer";
import { useGetAllAssetsQuery } from "../states/apislice";
import {ImSpinner2} from "react-icons/im";
import {Table} from "antd";
import AddAsset from "./AddAsset";
import EditAsset from "./EditAsset";
import DeleteAsset from "./DeleteAsset";



const AssetsList = () => {

    const [assets, setAssets] = useState([]);
    const { data, isLoading, isSuccess } = useGetAllAssetsQuery();

    useEffect(() => {
        if (isSuccess) {
            const { assets } = data.data;
            setAssets(assets);
        }
    }, [data, isSuccess]);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Value",
            dataIndex: "value",
            key: "value",
            render: (_, record) => {
                return <span>{`${record.value} ${record.currency}`}</span>
            }
        },
        {
            title: "status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            align: "center",
            render: (_, record) => {
                return (
                    <div className="flex gap-2 justify-center">
                        <EditAsset assetId={record._id}/>
                        <DeleteAsset assetId={record._id}/>
                        {/*<button className="bg-green-500 text-white p-2 rounded-md">Edit</button>*/}
                        {/*<button className="bg-red-500 text-white p-2 rounded-md">Delete</button>*/}
                    </div>
                )
            }
        }
    ]

    return (
        <>
            <ListContainer
                title={"Assets"}
                subTitle={"List of all assets"}
                // navLinktext={"assets/add"}
                isAllowed={false}
                navtext={"Add Asset"}
                table={
                    <>
                        <div className="flex p-2 w-full items-end justify-end">
                            <AddAsset/>
                        </div>
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
                            dataSource={assets}
                            columns={columns}
                            pagination={{pageSize: 100, size: "small"}}
                            rowKey="_id"
                        />
                    </>
                }
            />
        </>
    )
}

export default AssetsList;