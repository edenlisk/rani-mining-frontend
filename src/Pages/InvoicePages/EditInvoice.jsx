import React, {useEffect, useState} from "react";
import {useGenerateInvoiceMutation, useGetOneSupplierQuery, useGetInvoiceQuery, useGetUnsettledLotsQuery} from "../../states/apislice";
import {useNavigate} from "react-router-dom";
import {Checkbox, message, Modal, Table} from "antd";
import dayjs from "dayjs";
import {getModelAcronym} from "../../components/helperFunctions";
import { v4 as uuidv4 } from 'uuid';


const EditInvoice = ({invoiceId, supplierId}) => {
    const [dataz, setDataz] = useState([]);
    const {data: invoiceData, isSuccess: isSingleInvoiceReady } = useGetInvoiceQuery(invoiceId);
    const [generateInvoice, {data: response, isSuccess, isLoading, isError, error}] = useGenerateInvoiceMutation();
    const {data, isLoading: isFetching, isSuccess: isDone, isError: isProblem} = useGetOneSupplierQuery({supplierId});
    const {data: info, isLoading: isGetting, isSuccess: isComplete} = useGetUnsettledLotsQuery(supplierId);
    const [combinedData, setCombinedData] = useState([]);
    const [download, setDownload] = useState(false);
    const [showmodal, setShowmodal] = useState(true);
    const [existingItems, setExistingItems] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [invoiceInfo, setInvoiceInfo] = useState(
        {
            invoiceNo: "",
            dateOfIssue: "",
            beneficiary: "",
            supplierCompanyName: "",
            processorCompanyName: "",
            extraNotes: "",
            items: [{
                itemName: "",
                quantity: "",
                rmaFeeUSD: "",
                lotNumber: "",
                supplyDate: "",
                pricePerUnit: "",
                concentration: "",
                amount: "",
                mineralType: "",
                entryId: "",
            }],
            supplierId: supplierId,
            supplierAddress: {
                province: "",
                district: "",
                sector: ""
            },

        }
    );

    const keyMap = {
            "weightOut": "quantity",
            "rmaFeeUSD": "rmaFeeUSD",
            "lotNumber": "lotNumber",
            "supplyDate": "supplyDate",
            "pricePerUnit": "pricePerUnit",
            "mineralGrade": "concentration",
            "mineralPrice": "amount",
            "mineralType": "mineralType",
            "_id": "entryId",
        };


    useEffect(() => {
        if (isSingleInvoiceReady) {
            const { invoice } = invoiceData.data;
            if (invoice?.items) {
                const transformedItems = invoice.items.map(originalObject => {
                    const transformedObject = {};
                    for (const [newKey, oldKey] of Object.entries(keyMap)) {
                        transformedObject[newKey] = originalObject[oldKey];
                        transformedObject["index"] = uuidv4();
                    }
                    return transformedObject;
                });
                setExistingItems(transformedItems);
                setSelectedData(transformedItems);
            }
        }

    }, [isSingleInvoiceReady, invoiceData]);

    const [accumulator, setAccumulator] = useState(0);
    const [rmaFeeAccumulator, setRmaFeeAccumulator] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedData) {
            setAccumulator(selectedData.reduce((acc, currentValue) => acc + currentValue.mineralPrice, 0));
            setRmaFeeAccumulator(selectedData.reduce((acc, currentValue) => acc + currentValue.rmaFeeUSD, 0));
        }
    }, [selectedData]);

    useEffect(() => {
        if (isDone) {

            const {supplier: sup} = data.data;
            setInvoiceInfo({
                ...invoiceInfo,
                supplierCompanyName: sup.companyName,
                processorCompanyName: "RANI MINING COMPANY LTD",
                supplierAddress: {
                    province: sup.address.province,
                    district: sup.address.district,
                    sector: sup.address.sector
                },
            })
        }
    }, [isDone]);

    useEffect(() => {
        if (isComplete) {
            const {lots} = info.data;
            setDataz(lots);
        }
    }, [isComplete]);

    useEffect(() => {
        if (dataz && existingItems) {
            const allLots =  [...dataz, ...existingItems].map((item) => {

                return {
                    "weightOut": item.weightOut,
                    "rmaFeeUSD": item.rmaFeeUSD,
                    "lotNumber": item.lotNumber,
                    "supplyDate": item.supplyDate,
                    "pricePerUnit": item.pricePerUnit,
                    "mineralGrade": item.mineralGrade,
                    "mineralPrice": item.mineralPrice,
                    "mineralType": item.mineralType,
                    "_id": item._id,
                    "index": item.index,
                }
            })
        }
    }, [dataz, existingItems]);



    const itemConfirm = () => {
        const transformedData = selectedData.map(item => {
            const newItem = {};
            for (const key in item) {
                const newKey = keyMap[key] || key;
                newItem[newKey] = item[key];
            }
            return newItem;
        });

        setInvoiceInfo((prevState) => ({...prevState, items: transformedData}));
        setShowmodal(!showmodal);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = invoiceInfo;
        // const response = await generateInvoice({body});
        // if (response.data) {
        //     const { invoiceFile, invoiceFileId } = response.data.data;
        //     navigate(`/pdf-viewer/${encodeURIComponent(invoiceFile)}`);
        // }
        // const url = window.URL.createObjectURL(
        //     new Blob([response.data], {type: "application/pdf"})
        // );
        // window.open(url);
    };

    const handleRowToggle = (record) => {
        if (selectedData.some((selected) => (selected._id && selected.lotNumber && selected.weightOut) === (record._id && record.lotNumber && record.weightOut))) {
            setSelectedData((prevSelectedData) =>
                prevSelectedData.filter((selected) => (selected._id && selected.lotNumber && selected.weightOut) !== (record._id && record.lotNumber && record.weightOut))
            );
        } else {
            setSelectedData((prevSelectedData) => [...prevSelectedData, record]);
        }

    };


    const handleCancel = () => {
        setInvoiceInfo({
            invoiceNo: "",
            dateOfIssue: "",
            beneficiary: "",
            supplierCompanyName: "",
            processorCompanyName: "",
            extraNotes: "",
            items: [{
                itemName: "",
                quantity: "",
                rmaFeeUSD: "",
                lotNumber: "",
                supplyDate: "",
                pricePerUnit: "",
                concentration: "",
                amount: "",
                entryId: "",
                mineralType: ""
            }],
            supplierId: "",
            supplierAddress: {
                province: "",
                district: "",
                sector: ""
            }
        });
    }

    useEffect(() => {
        if (isSuccess) {
            if (download) {
                return message.success('Invoice successfully generated!');
            } else {
                return message.success('Invoice successfully saved');
            }
        } else if (isError) {
            const {message: errorMessage} = error.data;
            return message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);

    const columns = [
        {
            title: "Select",
            dataIndex: "select",
            key: "select",
            render: (_, record) => (
                <Checkbox
                    name="checkbox"
                    checked={() => {
                        const exists = selectedData.map((item) => ({_id: item._id, lotNumber: item.lotNumber}));
                        return exists.some((item) => (item._id && item.lotNumber) === (record._id && record.lotNumber));
                    }}
                    // checked={
                    //     selectedData.length > 0 &&
                    //     selectedData.some((selected) => (selected._id && selected.lotNumber && selected.weightOut) === (record._id && record.lotNumber && record.weightOut))
                    // }
                    onChange={() => handleRowToggle(record)}
                />
            ),
        },

        {
            title: "Supply date",
            dataIndex: "supplyDate",
            key: "supplyDate",
            sorter: (a, b) => a.supplyDate.localeCompare(b.supplyDate),
            render: (text) => <p>{dayjs(text).format("MMM DD,YYYY")}</p>,
        },
        {
            title: "Mineral Type",
            dataIndex: "mineralType",
            key: "mineralType",
            render: (text) => {
                if (text) {
                    return <p>{getModelAcronym(text)}</p>;
                }
            }
        },
        {title: "Beneficiary", dataIndex: "beneficiary", key: "beneficiary"},
        {
            title: "weight out (KG)",
            dataIndex: "weightOut",
            key: "weightOut",

        },
        {
            title: "mineral Grade",
            dataIndex: "mineralGrade",
            key: "mineralGrade",

        },
        {
            title: "pricePerUnit",
            dataIndex: "pricePerUnit",
            key: "pricePerUnit",

        },
        // {
        //     title: "Grade (%)",
        //     dataIndex: "mineralGrade",
        //     key: "mineralGrade",
        // },
        {
            title: "Mineral Price",
            dataIndex: "mineralPrice",
            Key: "mineralPrice",
        },
        {
            title: "RMA Fee USD",
            dataIndex: "rmaFeeUSD",
            Key: "rmaFeeUSD",
        },

        // {
        //   title: "Action",
        //   dataIndex: "action",
        //   key: "action",
        //   render: (_, record) => {
        //     const editable = isEditing(record);
        //     return (
        //       <>
        //         <div className="flex items-center gap-1">
        //           {editable ? (
        //             <div className="flex items-center gap-3">
        //               <FaSave
        //                 className=" text-xl"
        //                 onClick={() => save(record.index)}
        //               />
        //               <MdOutlineClose
        //                 className=" text-xl"
        //                 onClick={() => setEditRowKey("")}
        //               />
        //             </div>
        //           ) : (
        //             <BiSolidEditAlt
        //               className=" text-xl"
        //               onClick={() => edit(record)}
        //             />
        //           )}
        //         </div>
        //       </>
        //     );
        //   },
        // },
    ];

    return (
        <div>
            <Modal
                open={showmodal}
                width={"100%"}
                destroyOnClose
                onOk={() => ""}
                onCancel={itemConfirm}

                footer={[]}
            >
                <div className="w-full space-y-3">
                    <Table
                        className=" overflow-x-auto w-full bg-white rounded-lg mt-10"
                        dataSource={combinedData}
                        columns={columns}
                        rowKey="index"
                    />
                    <button className=" bg-orange-300 p-2 rounded text-white"
                            onClick={(e) => {
                                itemConfirm();
                                handleSubmit(e)
                            }}>Confirm
                    </button>
                </div>
            </Modal>
        </div>
    )

}

export default EditInvoice;