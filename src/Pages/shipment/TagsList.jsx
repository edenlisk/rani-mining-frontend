import React, {useEffect, useState} from "react";
import ListContainer from "../../components/Listcomponents/ListContainer";
import { useGetTagsListQuery,
    useUpdateTagMutation,
    useGenerateTagListMutation,
    useGetOneShipmentQuery,
    useGenerateNegociantTagsListMutation,
    useGeneratePackingListMutation,
} from "../../states/apislice";
import { Table, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {ImSpinner2} from "react-icons/im";
import LoadingButton from "../LoadingButton";


const TagsList = () => {
    const { shipmentId } = useParams();
    const { data: shipmentData, isSuccess: isShipmentSuccess } = useGetOneShipmentQuery(shipmentId, {refetchOnMountOrArgChange: true, refetchOnReconnect: true});
    const { data, isLoading, isSuccess } = useGetTagsListQuery({shipmentId}, {refetchOnMountOrArgChange: true, refetchOnReconnect: true});
    const [updateTag, {isSuccess: isUpdateTagSuccess, isError: isUpdateTagError, error: updateTagError}] = useUpdateTagMutation();
    const [generateTagList, {isLoading: isGeneratingTagList, isSuccess: isGenerateTagListSuccess, isError: isGenerateTagListError, error: generateTagListError}] = useGenerateTagListMutation();
    const [generateNegociantTagsList, {isLoading: isGeneratingNegTagList, isSuccess: isGenerateNegociantTagsListSuccess, isError: isGenerateNegociantTagsListError, error: generateNegociantTagsListError}] = useGenerateNegociantTagsListMutation();
    const [generatePackingList, {isLoading: isGeneratingPackingList, isSuccess: isGeneratePackingListSuccess, isError: isGeneratePackingListError, error: generatePackingListError}] = useGeneratePackingListMutation();

    const [entries, setEntries] = useState([]);
    const [tagListFile, setTagListFile] = useState(null);
    const [packingListFile, setPackingListFile] = useState(null);
    const [negociantTagListFile, setNegociantTagListFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            const { entries } = data.data;
            setEntries(entries);
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isGenerateNegociantTagsListSuccess) {
            return message.success("Negociant tag list generated successfully");
        } else if (isGenerateNegociantTagsListError) {
            const { message: errorMessage } = generateNegociantTagsListError.data;
            return message.error(errorMessage);
        }
    }, [isGenerateNegociantTagsListSuccess, isGenerateNegociantTagsListError, generateNegociantTagsListError]);

    useEffect(() => {
        if (isGeneratePackingListSuccess) {
            return message.success("Packing list generated successfully");
        } else if (isGeneratePackingListError) {
            const { message: errorMessage } = generatePackingListError.data;
            return message.error(errorMessage);
        }
    }, [isGeneratePackingListSuccess, isGeneratePackingListError, generatePackingListError]);

    useEffect(() => {
        if (isShipmentSuccess) {
            const { shipment } = shipmentData.data;
            if (shipment.tagListFile) setTagListFile(shipment.tagListFile.url);
            if (shipment.packingListFile) setPackingListFile(shipment.packingListFile.url);
            if (shipment.negociantTagListFile) setNegociantTagListFile(shipment.negociantTagListFile.url);
        }
    }, [isShipmentSuccess]);


    const columns = [
        {
            title: "Supply date",
            dataIndex: "supplyDate",
            key: "supplyDate",
            sorter: (a, b) => a.supplyDate.localeCompare(b.supplyDate),
            render: (_, record) => <span>{dayjs(record.supplyDate).format("YYYY-MM-DD")}</span>
        },
        {
            title: "Company Name",
            dataIndex: "companyName",
            key: "companyName",
            sorter: (a, b) => a.companyName.localeCompare(b.companyName),
        },
        {
            title: "Weight In (KG)",
            dataIndex: "weightIn",
            key: "weightIn",
            sorter: (a, b) => a.weightIn.localeCompare(b.weightIn),
        },
        {
            title: "Weight Out (KG)",
            dataIndex: "weightOut",
            key: "weightOut",
            sorter: (a, b) => a.weightOut.localeCompare(b.weightOut),
            render: (_, record) => {
                if (record) {
                    let weightOut = 0;
                    record.output.forEach(lot => {
                        weightOut += lot.weightOut;
                    })
                    return <span>{weightOut}</span>
                }
            }
        },
        {
            title: "Balance (KG)",
            dataIndex: "cumulativeAmount",
            key: "cumulativeAmount",
            sorter: (a, b) => a.cumulativeAmount.localeCompare(b.cumulativeAmount),
            render: (_, record) => {
                if (record) {
                    let balance = 0;
                    record.output.forEach(lot => {
                        balance += lot.cumulativeAmount;
                    })
                    return <span>{balance}</span>
                }
            }
        }
    ];

    useEffect(() => {
        if (isGenerateTagListSuccess) {
            return message.success("Tag list generated successfully");
        } else if (isGenerateTagListError) {
            const { message: errorMessage } = generateTagListError.data;
            return message.error(errorMessage);
        }
    }, [isGenerateTagListSuccess, isGenerateTagListError, generateTagListError]);

    useEffect(() => {
        if (isUpdateTagSuccess) {
            return message.success("Tag status updated successfully");
        } else if (isUpdateTagError) {
            const { message: errorMessage } = updateTagError.data;
            return message.error(errorMessage);
        }
    }, [isUpdateTagSuccess, isUpdateTagError, updateTagError]);

    const handleGenerateTagList = async () => {
        const response = await generateTagList({shipmentId});
        if (response.data) {
            const { tagListFile: tagFile } = response.data.data;
            setTagListFile(tagFile);
        }
    }

    const handleGenerateNegociantTagList = async () => {
        const response = await generateNegociantTagsList({shipmentId});
        if (response.data) {
            const { negociantTagListFile: tagFile } = response.data.data;
            if (tagFile) setNegociantTagListFile(tagFile);
        }
    }


    const handleGeneratePackingList = async () => {
        const response = await generatePackingList({shipmentId});
        if (response.data) {
            const { packingListFile: packingFile } = response.data.data;
            setPackingListFile(packingFile);
        }
    }

    const handleDownloadTagList = () => {
        navigate(`/${tagListFile}`);
    }

    return (
        <>
            <ListContainer
                title={'Prepare tags list'}
                subTitle={'Prepare tags list for this shipment'}
                table={
                    <>
                        <Table
                            columns={columns}
                            dataSource={entries}
                            loading={isLoading}
                            expandable={{
                                expandedRowRender: record => {
                                    const handleChange = async (tag) => {
                                        let status;
                                        if (tag.status === "in store") {
                                            status = "out of store"
                                        } else if (tag.status === "out of store") {
                                            status = "in store";
                                        }
                                        const body = {status}
                                        await updateTag({body, tagNumber: tag.tagNumber});
                                    }
                                    if (record.mineTags || record.negociantTags) {
                                        return (
                                            <div className="w-full flex flex-col gap-3 bg-white rounded-md p-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold">Negociant Tags</h3>
                                            <span className="grid grid-cols-4 items-center justify-between w-full md:w-1/2  rounded-sm">
                                              <p className=" font-medium col-span-1 p-2 w-full border ">#</p>
                                              <p className=" font-semibold col-span-1 p-2 w-full border-b border-t text-start bg-slate-50">Tag  Number</p>
                                              <p className=" font-medium col-span-1 p-2 w-full border ">Weight</p>
                                              <p className=" font-medium col-span-1 p-2 w-full border ">Status</p>
                                            </span>
                                                    {record.negociantTags?.map((negociantTag, index) => {
                                                        if (negociantTag) {
                                                            return (
                                                                <span key={index} className="grid grid-cols-4 items-center justify-between w-full md:w-1/2  rounded-sm">
                                                          <p className=" font-medium col-span-1 p-2 w-full border ">{index + 1}</p>
                                                          <p className=" font-semibold col-span-1 p-2 w-full border-b border-t text-start bg-slate-50">{negociantTag.tagNumber}</p>
                                                          <p className=" font-medium col-span-1 p-2 w-full border ">{negociantTag.weight}</p>
                                                          <select defaultValue={negociantTag.status} className=" font-medium col-span-1 p-2 w-full border" onChange={() => handleChange(negociantTag)}>
                                                              <option value="in store">In Store</option>
                                                              <option value="out of store">Out of Store</option>
                                                          </select>
                                                        </span>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold">Mine Tags</h3>
                                                <span className="grid grid-cols-4 items-center justify-between w-full md:w-1/2  rounded-sm">
                                              <p className=" font-medium col-span-1 p-2 w-full border ">#</p>
                                              <p className=" font-semibold col-span-1 p-2 w-full border-b border-t text-start bg-slate-50">Tag  Number</p>
                                              <p className=" font-medium col-span-1 p-2 w-full border ">Weight</p>
                                              <p className=" font-medium col-span-1 p-2 w-full border ">Status</p>
                                            </span>
                                                    {record.mineTags?.map((mineTag, index) => {
                                                        if (mineTag) {
                                                            return (
                                                                <span key={index} className="grid grid-cols-4 items-center justify-between w-full md:w-1/2  rounded-sm">
                                                          <p className=" font-medium col-span-1 p-2 w-full border ">{index + 1}</p>
                                                          <p className=" font-semibold col-span-1 p-2 w-full border-b border-t text-start bg-slate-50">{mineTag.tagNumber}</p>
                                                          <p className=" font-medium col-span-1 p-2 w-full border ">{mineTag.weight}</p>
                                                          <select defaultValue={mineTag.status} className=" font-medium col-span-1 p-2 w-full border" onChange={() => handleChange(mineTag)}>
                                                              <option value="in store">In Store</option>
                                                              <option value="out of store">Out of Store</option>
                                                          </select>
                                                        </span>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    }
                                },
                                rowExpandable: record => record
                            }}
                            rowKey="_id"
                        />
                        <div className="flex justify-center gap-2">
                            <div className="flex flex-col items-center gap-2">
                                <LoadingButton name={"GENERATE MINE TAG LIST"} isProcessing={isGeneratingTagList} onClickFunction={handleGenerateTagList}/>
                                {/*<button onClick={handleGenerateTagList} className="p-1 bg-blue-400 text-white border rounded-[4px]">Generate tag list</button>*/}
                                {tagListFile && <a target='_blank' className="text-white p-1 bg-blue-400 border rounded-[4px]" rel='noopener noreferrer'
                                                   href={tagListFile ? tagListFile : ""}>
                                    Download tag list</a>}
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <LoadingButton name={"GENERATE NEGOCIANT TAG LIST"} isProcessing={isGeneratingNegTagList} onClickFunction={handleGenerateNegociantTagList}/>
                                {/*<button onClick={handleGenerateNegociantTagList} className="p-1 bg-blue-400 text-white border rounded-[4px]">GENERATE NEGOCIANT TAG LIST</button>*/}
                                {negociantTagListFile && <a target='_blank' className="text-white p-1 bg-blue-400 border rounded-[4px]" rel='noopener noreferrer'
                                                            href={negociantTagListFile ? negociantTagListFile : ""}>
                                    Download negociant tags</a>}
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <LoadingButton name={"GENERATE PACKING LIST"} isProcessing={isGeneratingPackingList} onClickFunction={handleGeneratePackingList}/>
                                {/*<button onClick={handleGeneratePackingList} className="p-1 bg-blue-400 text-white border rounded-[4px]">GENERATE PACKING LIST</button>*/}
                                {packingListFile && <a target='_blank' className="text-white p-1 bg-blue-400 border rounded-[4px]" rel='noopener noreferrer'
                                                       href={packingListFile ? packingListFile : ""}>
                                    Download packing list</a>
                                }
                            </div>
                        </div>
                    </>

                }

            />

        </>
    )
}

export default TagsList;