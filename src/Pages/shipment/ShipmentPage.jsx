import React, {useEffect, useState,useRef} from "react";
import dayjs from "dayjs";
import {Form, Input, message, Modal, Spin, Table} from "antd";
import {motion} from "framer-motion";
import {PiDotsThreeVerticalBold, PiMagnifyingGlassDuotone,} from "react-icons/pi";
import {BiSolidEditAlt, BiSolidFilePdf} from "react-icons/bi";
import {BsCardList, BsDownload} from "react-icons/bs";
import {MdDelete, MdOutlineClose} from "react-icons/md";
import {ImSpinner2 } from "react-icons/im";
import {FaSave} from "react-icons/fa";
import {RiFileEditFill, RiFileListFill} from "react-icons/ri";
import {HiOutlinePrinter} from "react-icons/hi";
import {useGetAllShipmentsQuery, useShipmentReportMutation,} from "../../states/apislice";
import {useNavigate} from "react-router-dom";
import ListModalContainerHeader from "../../components/Listcomponents/ListModalContainerHeader";
import EditShipment from "./EditShipment";
import {HiOutlineClipboardDocumentCheck} from "react-icons/hi2";
import {DownloadShipmentReport} from "../HelpersJsx";
import { useSelector } from "react-redux";
import DeleteFooter from "../../components/modalsfooters/DeleteFooter";


const ShipmentPage = () => {
    const {userData} = useSelector(state => state.persistedReducer?.global);
    const [form] = Form.useForm();
    const {data, isLoading, isSuccess, isError, error} =
        useGetAllShipmentsQuery("", {
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true
        });

    const navigate = useNavigate();
    const {permissions} = userData;
    const [searchText, SetSearchText] = useState("");
    const [dataz, SetDataz] = useState([]);
    const [mineralModal, SetMineralModal] = useState(false);
    const [showActions, SetShowActions] = useState(false);
    const [selectedRow, SetSelectedRow] = useState({
        id: null,
        name: "",
        date: "",
    });
    const [showmodal, setShowmodal] = useState(false);
    const [editRowKey, setEditRowKey] = useState("");
    const [updateMessage, setUpdateMessage] = useState("");
    const [updateErrorMessage, setUpdateErrorMessage] = useState("");

    useEffect(() => {
        if (updateMessage) {
            return message.success(updateMessage);
        } else if (updateErrorMessage) {
            return message.error(updateErrorMessage);
        }
    }, [updateMessage, updateErrorMessage]);


    let modalRef = useRef();
 
    const handleClickOutside = (event) => {
        if (!modalRef.current ||!modalRef.current.contains(event.target)) {
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
        if (isSuccess) {
            const {data: dt} = data;
            const {shipments: ships} = dt;
            SetDataz(ships);
        }
    }, [isSuccess]);

    const handleActions = (id) => {
        SetShowActions(!showActions);
        SetSelectedRow(id);
    };



    const downloadReport = async (record) => {
        const shipmentId = record._id;
        await createShipmentReport({shipmentId});
    };

    const handleDelete = async () => {
        const entryId = selectedRow.id;
        await deleteColtan({entryId});
        SetSelectedRow({id: null, name: "", date: ""});
        setShowmodal(!showmodal);
    };
    const columns = [
        {
            title: "Date Created",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            render: (text) => <p>{dayjs(text).format("MMM DD,YYYY")}</p>,
            filteredValue: [searchText],
            onFilter: (value, record) => {
              return (
                String(record.netWeight)
                  .toLowerCase()
                  .includes(value.toLowerCase()) ||
                String(record.averageGrade)
                  .toLowerCase()
                  .includes(value.toLowerCase()) ||
                String(record.model)
                  .toLowerCase()
                  .includes(value.toLowerCase()) ||
                String(record.weightIn).toLowerCase().includes(value.toLowerCase()) ||
                String(dayjs(record.createdAt).format("MMM DD, YYYY"))
                  .toLowerCase()
                  .includes(value.toLowerCase())
              );
            },
        },
        {
            title: "Net Weight",
            dataIndex: "netWeight",
            key: "netWeight",
            editTable: true,
            sorter: (a, b) =>
                a.netWeight - b.netWeight,
        },
        {
            title: "Avg. Grade",
            dataIndex: "averageGrade",
            key: "averageGrade",
            sorter: (a, b) => a.averageGrade - b.averageGrade,
            render: (_, record) => {
                return (
                    <span>{record.averageGrade}</span>
                )
            }
        },
        {
            title: "Avg. Price",
            dataIndex: "averagePrice",
            key: "averagePrice",
            sorter: (a, b) => a.averagePrice - b.averagePrice,
            render: (_, record) => {
                return (
                    <span>{record.averagePrice}</span>
                )
            }
        },
        // {
        //     title: "status",
        //     dataIndex: "status",
        //     key: "status",
        //     sorter: (a, b) => a.status.localeCompare(b.status),
        //     render: (text) => {
        //         // "in stock", "fully exported", "rejected", "non-sell agreement", "partially exported"
        //         let color =
        //             text === "in stock"
        //                 ? "bg-green-500"
        //                 : text === "ordered"
        //                 ? "bg-amber-500"
        //                 : "bg-red-500";
        //         return (
        //             <p className={` px-3 py-1 ${color} w-fit text-white rounded`}>
        //                 {text}
        //             </p>
        //         );
        //     },
        // },
        {
            title: "Mineral type",
            dataIndex: "model",
            key: "model",
            sorter: (a, b) => a.model.localeCompare(b.model),
        },

        {
            title: "Reports",
            dataIndex: "action",
            key: "action",
            render: (_, record) => {
                if (record) {
                    return (
                        <DownloadShipmentReport
                            record={record}
                        />
                    )

                }

                // return (
                //     <BsDownload
                //         className=" text-lg"
                //         onClick={() => handleGenerate(record)}
                //     />
                // );
            },
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
                            onClick={() => save(record._id)}
                        />
                        <MdOutlineClose
                            className=" text-xl"
                            onClick={() => setEditRowKey("")}
                        />
                    </>
                ) : (
                    <PiDotsThreeVerticalBold
                        className=" text-lg"
                        onClick={() => handleActions(record._id)}
                    />
                )}
                  {selectedRow === record._id && (
                      <motion.ul
                      ref={modalRef}
                          animate={
                              showActions
                                  ? {opacity: 1, x: -10, display: "block"}
                                  : {opacity: 0, x: 0, display: "none"}
                          }
                          className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}
                      >
                          {/* <li
                              className="flex gap-4 p-2 items-center hover:bg-slate-100"
                              onClick={() => {
                                  navigate(`/buyer/details/${record._id}`);
                              }}
                          >
                              <RiFileListFill className=" text-lg"/>
                              <p>more details</p>
                          </li> */}
                          {/*<li*/}
                          {/*    className="flex gap-4 p-2 items-center hover:bg-slate-100"*/}
                          {/*    onClick={() => {*/}
                          {/*        handleExpandable(record._id);*/}
                          {/*        // navigate(`/shipment/edit/${record.model}/${record._id}`)}*/}
                          {/*    }}*/}
                          {/*>*/}
                          {/*    <BiSolidEditAlt className=" text-lg"/>*/}
                          {/*    <p>edit</p>*/}
                          {/*</li>*/}
                          <li
                              className="flex gap-4 p-2 items-center hover:bg-slate-100"
                              onClick={() => {
                                  navigate(`/shipment/complete/${record._id}`)
                              }}
                          >
                              <RiFileEditFill className=" text-lg"/>
                              <p>complete shipment</p>
                          </li>


                          {!["beryllium", "lithium"].includes(record.model) && (
                              <li
                                  className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                  onClick={() => navigate(`/shipment/forward-note/${record._id}`)}
                              >
                                  <HiOutlineClipboardDocumentCheck className=" text-lg"/>
                                  <p>Forward Note</p>
                              </li>
                          )}


                          <li
                              className="flex gap-4 p-2 items-center hover:bg-slate-100"
                              onClick={() => {
                                  navigate(`/shipment/tags/${record._id}`)
                              }}
                          >
                              <RiFileEditFill className=" text-lg"/>
                              <p>Shipment documents</p>
                          </li>
                          {/* <li
                              className="flex gap-4 p-2 items-center hover:bg-slate-100"
                              onClick={() => {
                                  edit(record);
                              }}
                          >
                              <MdDelete className=" text-lg"/>
                              <p>delete</p>
                          </li> */}
                      </motion.ul>
                  )}
              </span>

                            {/* <span>
                <MdDelete
                  className=" text-lg"
                  onClick={() => {
                    SetSelectedRow({
                      ...selectedRow,
                      id: record.id,
                      name: record.companyName,
                      date: record.supplyDate,
                    });
                    setShowmodal(!showmodal);
                  }}
                />
              </span> */}
                        </div>
                    </>
                );
            },
        },
    ];

    const handleSelect = (e) => {
        navigate(`/shipment/add/${e.target.value}`);
    };

    const isEditing = (record) => {
        return record._id === editRowKey;
    };

    const edit = (record) => {
        form.setFieldsValue({
            totalShipmentQuantity: record.totalShipmentQuantity,
            // companyRepresentative: record.companyRepresentative,
            // index: record.index,
            // weight: record.weight,
            ...record,
        });
        setEditRowKey(record._id);
    };

    const save = async (key) => {
        const shipmentId = key;
        const row = await form.validateFields();
        const newData = [...dataz];
        const index = newData.findIndex((item) => key === item._id);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {...item, ...row});
            SetDataz(newData);
            setEditRowKey("");
            const info = {...item, ...row, netWeight: parseFloat(row.netWeight),}
        }
    };

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
        const input = <Input style={{margin: 0}} type="number"/>;
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

    return (
        <>
            <ListModalContainerHeader
                title={"Shipment list"}
                subTitle={"Manage your shipments"}
                isAlowed={permissions.shipments?.create}
                open={() => SetMineralModal(!mineralModal)}
                navtext={"New shipment"}
                table={
                    <>
                        <div className=" w-full overflow-x-auto h-full min-h-[320px]">
                            <div className="w-full flex flex-col  sm:flex-row justify-between items-center mb-4 gap-3">
                <span className="max-w-[220px] border rounded flex items-center p-1 justify-between gap-2">
                  <PiMagnifyingGlassDuotone className="h-4 w-4"/>
                  <input
                      type="text"
                      className=" w-full focus:outline-none"
                      name="tableFilter"
                      id="tableFilter"
                      placeholder="Search..."
                      onChange={(e) => SetSearchText(e.target.value)}
                  />
                </span>

                                <span className="flex w-fit justify-evenly items-center gap-6 pr-1">
                  <BiSolidFilePdf className=" text-2xl"/>
                  <BsCardList className=" text-2xl"/>
                  <HiOutlinePrinter className=" text-2xl"/>
                </span>
                            </div>
                            <Form form={form} component={false}>
                                <Table
                                    className=" w-full"
                                    loading={{indicator:< ImSpinner2 style={{width:'60px',height:'60px'}} className="animate-spin text-gray-500"/>, spinning:isLoading}}
                                    dataSource={dataz}
                                    columns={mergedColumns}
                                    expandable={{
                                        expandedRowRender: record => <EditShipment
                                                                        record={record}
                                                                        setUpdateErrorMessage={setUpdateErrorMessage}
                                                                        setUpdateMessage={setUpdateMessage}/>,
                                        rowExpandable: (record) => record.entries?.length > 0,
                                        // expandRowByClick: true,
                                    }}
                                    components={{
                                        body: {
                                            cell: EditableCell,
                                        },
                                    }}
                                    rowKey="_id"
                                />
                            </Form>
                        </div>

{/*                         <Modal
                            open={showmodal}
                            onOk={() => handleDelete(selectedRow)}
                            onCancel={() => {
                                setShowmodal(!showmodal);
                                SetSelectedRow({id: null, name: "", date: ""});
                            }}
                            destroyOnClose
                            footer={[
                                <DeleteFooter key={"actions"}
                                //  isDeleting={isDeleting}
                                defText={"Delete"} 
                                dsText={"Deleting"}
                                 handleCancel={() => {
                                 setShowmodal(!showmodal);
                                 SetSelectedRow("");
                               }} handleDelete={handleDelete}/>
                            ]}
                        >
                            <h2 className="modal-title text-center font-bold text-xl">
                                Confirm Delete
                            </h2>
                            <p className=" text-lg">
                                Are you sure you want to delete transaction with:
                            </p>
                            <li className=" text-lg">{`company name: ${selectedRow.name}`}</li>
                            <li className=" text-lg">{`Supply date: ${dayjs(
                                selectedRow.date
                            ).format("MMM/DD/YYYY")}`}</li>
                        </Modal> */}
                        {/* select mineral type modal */}
                        <Modal
                            open={mineralModal}
                            onOk={""}
                            onCancel={() => {
                                SetMineralModal(!mineralModal);
                            }}
                            destroyOnClose
                            style={{minHeight: "100%"}}
                            footer={
                                [
                                    // <span
                                    //   key="actions"
                                    //   className=" flex w-full justify-center gap-4 text-base text-white"
                                    // >
                                    //   {isDeleting ? (
                                    //     <Spin className="bg-green-400 p-2 rounded-lg" />
                                    //   ) : (
                                    //     <button
                                    //       key="back"
                                    //       className=" bg-green-400 p-2 rounded-lg"
                                    //       onClick={handleDelete}
                                    //     >
                                    //       Confirm
                                    //     </button>
                                    //   )}
                                    //   <button
                                    //     key="submit"
                                    //     className=" bg-red-400 p-2 rounded-lg"
                                    //     type="primary"
                                    //     onClick={() => {
                                    //       setShowmodal(!showmodal);
                                    //       SetSelectedRow({ id: null, name: "", date: "" });
                                    //     }}
                                    //   >
                                    //     Cancel
                                    //   </button>
                                    // </span>,
                                ]
                            }
                        >
                            <div className="w-full p-2 text-center space-y-2 h-[280px]">
                                <p className=" text-xl font-semibold">Select mineral type</p>

                                <select
                                    name="mineralType"
                                    id="mineralType"
                                    autoComplete="off"
                                    className="focus:outline-none p-2 border rounded-md w-full"
                                    defaultValue="mintype"
                                    onChange={handleSelect}
                                >
                                    <option value="mintype" hidden>
                                        Select a mineral type
                                    </option>
                                    <option value="coltan">Coltan</option>
                                    <option value="cassiterite">Cassiterite</option>
                                    <option value="beryllium">Beryllium</option>
                                    <option value="lithium">Lithium</option>
                                    <option value="wolframite">Wolframite</option>
                                </select>
                            </div>
                        </Modal>
                    </>
                }
            />
        </>
    );
};
export default ShipmentPage;
