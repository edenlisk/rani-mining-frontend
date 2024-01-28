import React, {useEffect, useRef, useState} from 'react';
import {useGetOneShipmentQuery, useUpdateShipmentMutation, useDetailedStockQuery } from "../../states/apislice";
import {Form, Input, Table, message, Checkbox} from "antd";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import {motion} from "framer-motion";
import {BiSolidEditAlt} from "react-icons/bi";
import {MdOutlineClose} from "react-icons/md";
import {FaSave} from "react-icons/fa";
import {RiFileEditFill} from "react-icons/ri";
import {ImSpinner2} from "react-icons/im";
import FetchingPage from "../FetchingPage";
import dayjs from "dayjs";
import {CiCirclePlus} from "react-icons/ci";
import DetailsPageContainer from '../../components/Actions components/DetailsComponentscontainer';

const EditShipment = ({record: shipment}) => {
    const [form] = Form.useForm();
    const mineralType = shipment.model;
    const {data, isLoading, isSuccess} = useGetOneShipmentQuery(shipment._id);
    const [updateShipment, {isLoading: isUpdatingShipment, isSuccess: isUpdateSuccess, isError, error}] = useUpdateShipmentMutation();
    const [model, setModel] = useState(null);
    const {data: stockData, isLoading: isStockLoading, isSuccess: isStockSuccess} = useDetailedStockQuery({model}, {skip: model === null});
    const [shipmentLots, setShipmentLots] = useState([]);
    const [shipmentNumber, setShipmentNumber] = useState('');
    const [editRowKey, setEditRowKey] = useState("");
    const [showActions, SetShowActions] = useState(false);
    const [selectedRow, SetSelectedRow] = useState({
        id: null,
        name: "",
        date: "",
    });
    const [stock, setStock] = useState([]);
    const [selectedStock, setSelectedStock] = useState(new Set());
    const [shipmentInfo, setShipmentInfo] = useState({
        averagePrice: null,
        averageGrade: null,
        netWeight: null,
        averageNiobium: null,
    })


    let modalRef = useRef();

    const handleClickOutside = (event) => {
        if (!modalRef.current || !modalRef.current.contains(event.target)) {
            SetShowActions(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    useEffect(() => {
        if (isUpdateSuccess) {
            return message.success("Shipment updated successfully");
        } else if (isError) {
            const { message: errorMessage } = error.data;
            return message.error(errorMessage);
        }
    }, [isUpdateSuccess, isError, error]);

    useEffect(() => {
        if (shipment.shipmentNumber) {
            setShipmentNumber(shipment.shipmentNumber);
        }
    }, []);

    useEffect(() => {
        if (isSuccess || isUpdateSuccess) {
            const {shipmentLots: shipmentComponents, shipment} = data.data;
            setShipmentLots(shipmentComponents);
            if (shipment) {
                const {averagePrice, averageGrade, netWeight, averageNiobium} = shipment;
                if (averagePrice || averageGrade || netWeight) {
                    setShipmentInfo({
                        averagePrice,
                        averageGrade,
                        netWeight,
                        averageNiobium
                    })
                }
            }
        }
    }, [isSuccess, data, isUpdateSuccess]);

    // TODO 11: CHECK HOW TO FILTER TO REMOVE DUPLICATES IN SHIPMENT STOCK LOTS ===> DONE
    useEffect(() => {
        if (isStockSuccess || isUpdateSuccess) {
            const existingLots = shipmentLots.map(item => (JSON.stringify({entryId: item.entryId, lotNumber: parseInt(item.lotNumber)})));
            const { detailedStock } = stockData.data;
            const filteredStock = detailedStock.filter(item => {
                if (!existingLots.includes(JSON.stringify({entryId: item._id?.toString(), lotNumber: parseInt(item.lotNumber)}))) {
                    return {
                        ...item,
                        entryId: item._id,
                        [shipmentNumber]: item.cumulativeAmount,
                        exportedAmount: item.weightOut,
                        balance: 0,
                        companyName: item.supplierName,
                    }
                }
            })
            setStock(filteredStock);

        }
    }, [isStockSuccess, stockData, isUpdateSuccess]);

    const isEditing = (record) => {
        return record.index === editRowKey;
    };

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditRowKey(record.index);
        SetShowActions(false)
    };

    const save = async (key) => {
        const row = await form.validateFields();
        const newData = [...shipmentLots];
        const index = newData.findIndex((item) => key === item.index);
        if (index > -1) {
            const item = newData[index];
            const updatedItem = {
                ...item,
                ...row,
            };
            if (parseFloat(updatedItem[shipmentNumber]) !== parseFloat(item[shipmentNumber])) {
                if (parseFloat(updatedItem[shipmentNumber]) > (parseFloat(item[shipmentNumber]) + parseFloat(item.balance))) {
                    return message.error("Out of range");
                }
                if (parseFloat(updatedItem[shipmentNumber]) === 0) {
                    updatedItem.balance += parseFloat(item[shipmentNumber]);
                    updatedItem.exportedAmount -= parseFloat(item[shipmentNumber]);
                } else if (parseFloat(updatedItem[shipmentNumber]) === (parseFloat(item[shipmentNumber]) + parseFloat(item.balance))) {
                    updatedItem.balance = 0;
                    updatedItem.exportedAmount = updatedItem.weightOut;
                } else if (parseFloat(updatedItem[shipmentNumber]) < (parseFloat(item[shipmentNumber]) + parseFloat(item.balance))) {
                    if (parseFloat(updatedItem[shipmentNumber]) > parseFloat(item[shipmentNumber])) {
                        updatedItem.balance -=  parseFloat(updatedItem[shipmentNumber]) - parseFloat(item[shipmentNumber]);
                        updatedItem.exportedAmount += parseFloat(updatedItem[shipmentNumber]) - parseFloat(item[shipmentNumber]);
                    } else if (parseFloat(updatedItem[shipmentNumber]) < parseFloat(item[shipmentNumber])) {
                        updatedItem.balance += parseFloat(item[shipmentNumber]) - parseFloat(updatedItem[shipmentNumber]);
                        updatedItem.exportedAmount -= parseFloat(item[shipmentNumber]) - parseFloat(updatedItem[shipmentNumber]);
                    }
                }
            }
            newData.splice(index, 1, updatedItem);
            setShipmentLots(newData)
            setEditRowKey("");
            const body = {entries: [updatedItem]}
            await updateShipment({body, shipmentId: shipment._id});
        }
    };


    const handleActions = (id) => {
        SetShowActions(!showActions);
        SetSelectedRow(id);
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'lotNumber',
            key: 'lotNumber',
            width: 10,
            align: 'center',
        },
        {
            title: 'Date',
            dataIndex: 'supplyDate',
            key: 'supplyDate',
            render: (text) => (
                <p>{dayjs(text).format("MMM DD, YYYY")}</p>
            ),
            width: 100
        },
        {
            title: 'Company Name',
            dataIndex: 'companyName',
            key: 'companyName'
        },
        {
            title: 'Beneficiary',
            dataIndex: 'beneficiary',
            key: 'beneficiary',
        },
        {
            title: 'type',
            dataIndex: 'mineralType',
            key: 'mineralType',
            width: 15,
            align: "center"
        },
        {
            title: 'weight Out (kg)',
            dataIndex: 'weightOut',
            key: 'weightOut',
            width: 15,
            align: "center"
        },
        {
            title: 'Exported Amount',
            dataIndex: 'exportedAmount',
            key: 'exportedAmount',
            align: "center"
        },
        {
            title: 'balance',
            dataIndex: 'balance',
            key: 'balance',
            align: "center"
        },
        {
            title: `${shipmentNumber}`,
            dataIndex: `${shipmentNumber}`,
            key: `${shipmentNumber}`,
            editTable: true,
            align: "center",
        },
        {
            title: 'Grade',
            dataIndex: 'mineralGrade',
            key: 'mineralGrade',
            align: "center",
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, record) => {
                const editable = isEditing(record);
                return (
                    <>
                        <div className="flex items-center gap-1">
                          <span className="relative flex gap-2">
                            {editable ? (
                                <>
                                    <FaSave
                                        className=" text-xl"
                                        onClick={() => save(record.index)}
                                    />
                                    <MdOutlineClose
                                        className=" text-xl"
                                        onClick={() => setEditRowKey("")}
                                    />
                                </>
                            ) : (
                                <PiDotsThreeVerticalBold
                                    className=" text-lg"
                                    onClick={() => handleActions(record.index)}
                                />
                            )}
                              {selectedRow === record.index && (
                                  <motion.ul
                                      ref={modalRef}
                                      animate={
                                          showActions
                                              ? {opacity: 1, x: -10, display: "block"}
                                              : {opacity: 0, x: 0, display: "none"}
                                      }
                                      className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}
                                  >
                                      <li
                                          className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                          onClick={() => edit(record)}
                                      >
                                          <BiSolidEditAlt className=" text-lg"/>
                                          <p>edit</p>
                                      </li>
                                  </motion.ul>
                              )}
                          </span>
                        </div>
                    </>
                );
            },
        },

    ]

    if (mineralType === "coltan") {
        columns.splice(5, 0, {
            title: 'Niobium',
            dataIndex: 'niobium',
            key: 'niobium',
            width: 15,
            align: "center"
        })
        columns.splice(6, 0, {
            title: 'Iron',
            dataIndex: 'iron',
            key: 'iron',
            width: 15,
            align: "center"
        })
    } else if (mineralType === "wolframite") {
        columns.splice(8, 0, {
            title: "MTU",
            dataIndex: "metricTonUnit",
            key: "metricTonUnit",
            align: "center",
            width: 15,
        })
    }

    const mergedColumns = columns.map((col) => {
        if (!col.editTable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });


    const EditableCell = ({
                              editing,
                              dataIndex,
                              title,
                              record,
                              children,
                              ...restProps
                          }) => {
        const handleChange = (e) => {
            const { name, value } = e.target;
            if (name === shipmentNumber) {
                if (parseFloat(value) > parseFloat(record.balance + record[shipmentNumber])) {
                    return message.error("Out of Range", 3);
                }
            }
        }
        const input = (
            <Input
                style={{margin: 0}}
                type={"number"}
                name={dataIndex}
                onChange={handleChange}
                onWheelCapture={(e) => {
                    e.target.blur();
                }}
            />
        );
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item name={dataIndex} style={{margin: 0}}>
                        {input}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const dismissStock = () => {
        setStock([]);
        setModel(null);
    }

    const handleRowSelected = (e) => {
        if (selectedStock.has(e.target.value)) {
            const newSet = new Set(selectedStock);
            newSet.delete(e.target.value);
            setSelectedStock(newSet);
            return;
        }
        const newSet = new Set([...selectedStock, e.target.value]);
        setSelectedStock(newSet);
    }

    const handleSubmit = async () => {
        const transformedRecords = Array.from(selectedStock).map(record => {
            return {
                ...record,
                entryId: record._id,
                [shipmentNumber]: record.cumulativeAmount,
                exportedAmount: record.weightOut,
                balance: 0,
            }
        })
        const body = {entries: transformedRecords};
        await updateShipment({body, shipmentId: shipment._id});
    }
    const stockColumns = [
        {
            title: '#',
            dataIndex: 'lotNumber',
            key: 'lotNumber',
            width: 10,
            align: 'center',
        },
        {
            title: 'Date',
            dataIndex: 'supplyDate',
            key: 'supplyDate',
            render: (text) => {
                if (text) {
                    return (
                        <p>{dayjs(text).format("MMM DD, YYYY")}</p>
                    )
                } else {
                    return null;
                }
            },
            width: 100
        },
        {
            title: 'Company Name',
            dataIndex: 'companyName',
            key: 'companyName'
        },
        {
            title: 'Beneficiary',
            dataIndex: 'beneficiary',
            key: 'beneficiary',
        },
        {
            title: 'type',
            dataIndex: 'mineralType',
            key: 'mineralType',
            width: 15,
            align: "center"
        },
        {
            title: 'weight in (kg)',
            dataIndex: 'weightIn',
            key: 'weightIn',
            width: 15,
            align: "center"
        },
        {
            title: 'Exported Amount',
            dataIndex: 'exportedAmount',
            key: 'exportedAmount',
            align: "center"
        },
        {
            title: 'balance',
            dataIndex: 'cumulativeAmount',
            key: 'cumulativeAmount',
            align: "center"
        },

        {
            title: 'Grade',
            dataIndex: 'mineralGrade',
            key: 'mineralGrade',
            align: "center",
        },
        {
            title: "Select",
            key: "select",
            render: (_, record) => (
                <Checkbox
                    name="checkbox"
                    value={record}
                    onChange={handleRowSelected}
                />
            ),
        }
    ];

    return (
        <>
            {isLoading ? (
                <FetchingPage/>
            ) :  (
                <DetailsPageContainer
                    title={`Shipment Lots`}
                    actionsContainer={
                        <>
                            <Form form={form} component={false}>
                                <div>
                                    <p className="font-semibold p-2">Total Weight: {parseFloat(shipmentInfo.netWeight).toFixed(4)}</p>
                                    <p className="font-semibold p-2">Average Grade: {parseFloat(shipmentInfo.averageGrade).toFixed(4)}</p>
                                    <p className="font-semibold p-2">Average Price: {parseFloat(shipmentInfo.averagePrice).toFixed(4)}</p>
                                    <p className="font-semibold p-2">Average Niobium: {parseFloat(shipmentInfo.averageNiobium).toFixed(4)}</p>
                                </div>
                                <Table
                                    loading={{
                                        indicator: (<ImSpinner2 style={{width: "60px", height: "60px"}}
                                                                className="animate-spin text-gray-500"/>),
                                        spinning: isLoading
                                    }}
                                    columns={mergedColumns}
                                    dataSource={shipmentLots}
                                    bordered
                                    components={{
                                        body: {
                                            cell: EditableCell,
                                        }
                                    }}
                                    rowKey="index"
                                />
                            </Form>
                            <div className="flex justify-center mb-3">
                                <button
                                    className="p-1 bg-blue-400 border rounded-[4px] text-white flex items-center"
                                    onClick={() => setModel(shipment.model)}
                                >
                                    <CiCirclePlus
                                        className="text-lg"
                                        size={30}
                                    />
                                    Add More Lots From Stock
                                </button>
                            </div>
                            {stock.length > 0 && (
                                <div>
                                    <Table
                                        loading={{
                                            indicator: (<ImSpinner2 style={{width: "60px", height: "60px"}}
                                                                    className="animate-spin text-gray-500"/>),
                                            spinning: isStockLoading
                                        }}
                                        columns={stockColumns}
                                        dataSource={stock}
                                        bordered
                                        rowKey="index"
                                    />
                                    <div className=" self-end flex gap-2 flex-col sm:flex-row w-full justify-start sm:gap-2 items-start action-buttons">
                                        {isUpdatingShipment ? (
                                            <button
                                                className="px-2 flex gap-1 items-center justify-start py-2 bg-orange-200 rounded-md text-gray-500"
                                                type="submit"
                                            >
                                                <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500" />
                                                Sending
                                            </button>
                                        ) : (
                                            <button className="px-6 py-2 bg-orange-300 rounded-md" type="button" onClick={handleSubmit}>
                                                Submit
                                            </button>
                                        )}
                                        <button
                                            className="px-6 py-2 bg-blue-100 rounded-md"
                                            onClick={dismissStock}
                                            type="button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    }
                />
            )}
        </>
    )
}

export default EditShipment;
