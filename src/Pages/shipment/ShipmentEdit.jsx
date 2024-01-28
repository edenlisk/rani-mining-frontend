import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import {BiSolidEditAlt, BiSolidFilePdf} from "react-icons/bi";
import { Responsive, WidthProvider } from "react-grid-layout";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { BsClipboard2MinusFill } from "react-icons/bs";
import {ImSpinner2 } from "react-icons/im";
import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
import {Table, Tooltip, Checkbox, Input, Form, Modal, Spin, message} from "antd";
import { useParams } from "react-router-dom";

import {MdDelete, MdOutlineClose} from "react-icons/md";
import {FaSave} from "react-icons/fa";

import ListModalContainerHeader from "../../components/Listcomponents/ListModalContainerHeader";
import { useAddShipmentMutation, useDetailedStockQuery, useGetOneShipmentQuery } from "../../states/apislice";
import ConfirmFooter from "../../components/modalsfooters/ConfirmFooter";

const ShipmentEdit = () => {
    const { model,shipmentId } = useParams();
    const { data, isLoading, isSuccess, isError, error } = useDetailedStockQuery({model}, {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true
    });
    const [
      AddShipment,
      { isLoading: isSending, isError: isFailed, isSuccess: isSent, error: fail },
    ] = useAddShipmentMutation();
    const {data:info, isLoading:isGetting,isSuccess:isDone,isError:isProblem,error:problem}=useGetOneShipmentQuery(shipmentId)
    const [openBill, setOpenBill] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [shipmentInfo, setShipmentInfo] = useState({
      entries: "",
      averageGrade: "",
      averagePrice: "",
      totalShipmentQuantity: "",
      model: model,
    });
    const [totalWeight, setTotalWeight] = useState(null);
    const [avg, setAvg] = useState(null);
    const [avgPrice, setAvgPrice] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [sourceData, setSourceData] = useState("");
    const [selectedData, setSelectedData] = useState([]);
    const [transformedData, setTransformedData] = useState([]);
    const [editRowKey, setEditRowKey] = useState("");
    const [emptyError, setEmptyError] = useState("");
    const [form] = Form.useForm();
    const [shipmentNumber, setShipmentNumber] = useState("");
    let initialData = [];
    let initialEntryInfo = [];
  

    if (isSuccess) {
      const { data: dt } = data;
      const { detailedStock: dtStk } = dt;
      initialData = dtStk;
    };
    useEffect(() => {
    if (isDone) {
      const { entries} = info.data.shipment;
      const { shipment} = info.data;
    //   const { detailedStock: dtStk } = dt;
    initialEntryInfo=shipment;
        setSelectedData(entries);
    };
    },[isDone]);
  
    useEffect(() => {
      if (isSent) {
        message.success("Shipment added successfully");
      } else if (isFailed) {
        const { message: errorMessage } = fail.data;
        message.error(errorMessage);
      }
    }, [isSent, isFailed, fail]);
  
    const handleBillOpen = () => {
      setOpenBill(!openBill);
    };
  
    useMemo(() => {
      const newTransformedData = selectedData.map((item) => ({
        entryId: item._id,
        lotNumber: item.lotNumber,
        quantity: item.cumulativeAmount,
      }));
  
      const newTotalWeight = selectedData.reduce(
        (total, item) => total + item.cumulativeAmount,
        0
      );
      setTotalWeight(newTotalWeight);
  
      const totalGrade = selectedData.reduce(
        (total, item) => total + item.cumulativeAmount * item.mineralGrade,
        0
      );
  
      // const totalPrice = selectedData.reduce(
      //   (total, item) => total + item.cumulativeAmount * item.mineralGrade,
      //   0
      // );
      const averagegrade =
        newTotalWeight > 0 ? (totalGrade / newTotalWeight).toFixed(3) : "0.000";
  
      setAvg(averagegrade);
      setAvgPrice(newTotalWeight); //TO ADD  AVG PRICE FORMULA
      setTransformedData(newTransformedData);
      setShipmentInfo((prevState) => ({
        ...prevState,
        entries: newTransformedData,
        averageGrade: averagegrade,
        averagePrice: "22",
        totalShipmentQuantity: newTotalWeight,
      }));
    }, [selectedData]);
  
    const handleOpenModal = () => {
      setOpenModal(!openModal);
      setShipmentNumber("");
    };
  
    const handleConfirmModal = () => {
      setConfirmModal(!confirmModal);
      setEmptyError("");
    };
  
    const isEditing = (record) => {
      return record._id === editRowKey;
    };
  
    const edit = (record) => {
      form.setFieldsValue({
        cumulativeAmount: record.cumulativeAmount,
        // companyRepresentative: record.companyRepresentative,
        // index: record.index,
        // weight: record.weight,
        ...record,
      });
      setEditRowKey(record._id);
    };
  
    const save = async (key) => {
      const row = await form.validateFields();
      const newData = [...selectedData];
      const index = newData.findIndex((item) => key === item.index);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          cumulativeAmount: parseFloat(row.cumulativeAmount),
        });
        // setSelectedData(newData);
        const newTotalWeight = newData.reduce(
          (total, item) => total + item.quantity,
          0
        );
  
        const totalGrade = newData.reduce(
          (total, item) => total + item.cumulativeAmount * item.mineralGrade,
          0
        );
  
        const averagegrade =
          newTotalWeight > 0 ? (totalGrade / newTotalWeight).toFixed(3) : "0.000";
  
        setTotalWeight(newTotalWeight);
        setAvg(averagegrade);
        setEditRowKey("");
        setSelectedData(newData);
        const newTransformedData = newData.map((item) => ({
          entryId: item._id,
          lotNumber: item.lotNumber,
          quantity: item.cumulativeAmount,
        }));
        setTransformedData(newTransformedData);
        setShipmentInfo((prevState) => ({
          ...prevState,
          entries: newTransformedData,
          averageGrade: averagegrade,
          averagePrice: "22",
          totalShipmentQuantity: newTotalWeight,
        }));
      }
  
    };
     const handleshipmentNumber=(e)=>{
       setShipmentNumber(e.target.value);
     }
    const columns = [
      {
        title: "Supply date",
        dataIndex: "supplyDate",
        key: "supplyDate",
        sorter: (a, b) => a.supplyDate.localeCompare(b.supplyDate),
        render: (text) => <p>{dayjs(text).format("MMM DD,YYYY")}</p>,
      },
      { title: "Supplier name", dataIndex: "supplierName", key: "supplierName" },
      {
        title: "Quantity (KG)",
        dataIndex: "quantity",
        key: "quantity",
        editTable: true,
      },
      {
        title: "weight out (KG)",
        dataIndex: "weightOut",
        key: "weightOut",
        editTable: true,
      },
      {
        title: "Exported (KG)",
        dataIndex: "exportedAmount",
        key: "exportedAmount",
        editTable: true,
      },
      {
        title: "Grade (%)",
        dataIndex: "mineralGrade",
        key: "mineralGrade",
      },
      {
        title: "Select",
        key: "select",
        render: (_, record) => (
          <Checkbox
            name="checkbox"
            checked={
              selectedData.length > 0 &&
              selectedData.some((selected) => selected._id === record._id)
            }
            onChange={() => handleRowToggle(record)}
          />
        ),
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
                {editable ? (
                  <div className="flex items-center gap-3">
                    <FaSave
                      className=" text-xl"
                      onClick={() => save(record.index)}
                    />
                    <MdOutlineClose
                      className=" text-xl"
                      onClick={() => setEditRowKey("")}
                    />
                  </div>
                ) : (
                  <BiSolidEditAlt
                    className=" text-xl"
                    onClick={() => edit(record)}
                  />
                )}
              </div>
            </>
          );
        },
      },
    ];
  
    const columns2 = [
      {
        title: "Lot number",
        dataIndex: "lotNumber",
        key: "lotNumber",
      },
      {
        title: "Supply date",
        dataIndex: "supplyDate",
        key: "supplyDate",
        sorter: (a, b) => a.supplyDate.localeCompare(b.supplyDate),
        render: (text) => <p>{dayjs(text).format("MMM DD,YYYY")}</p>,
      },
      { title: "Supplier name", dataIndex: "supplierName", key: "supplierName" },
      {
        title: "Beneficiary",
        dataIndex: "beneficiary",
        key: "beneficiary",
      },
      {
        title: "weight out (KG)",
        dataIndex: "weightOut",
        key: "weightOut",
        editTable: true,
      },
      {
        title: "Exported (KG)",
        dataIndex: "exportedAmount",
        key: "exportedAmount",
        editTable: true,
      },
      {
        title: "balance (KG)",
        dataIndex: "cumulativeAmount",
        key: "cumulativeAmount",
        editTable: true,
      },
      {
        title: "Grade (%)",
        dataIndex: "mineralGrade",
        key: "mineralGrade",
      },
      {
        title: "Select",
        key: "select",
        render: (_, record) => (
          <Checkbox
            name="checkbox"
            checked={
              selectedData.length > 0 &&
              selectedData.some((selected) => selected.index === record.index)
            }
            onChange={() => handleRowToggle(record)}
          />
        ),
      }, 
    ];
  
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
      const input = <Input style={{ margin: 0 }} type="text" />;
      return (
        <td {...restProps}>
          {editing ? (
            <Form.Item name={dataIndex} style={{ margin: 0 }}>
              {input}
            </Form.Item>
          ) : (
            children
          )}
        </td>
      );
    };
  
    const handleRowToggle = (record) => {
      if (selectedData.some((selected) => selected.index === record.index)) {
        setSelectedData((prevSelectedData) =>
          prevSelectedData.filter((selected) => selected.index !== record.index)
        );
      } else {
        setSelectedData((prevSelectedData) => [...prevSelectedData, record]);
      }
    };
    const handleRowToggle2 = (record) => {
      if (selectedData.some((selected) => selected.index === record.index)) {
        setSelectedData((prevSelectedData) =>
          prevSelectedData.filter((selected) => selected.index !== record.index)
        );
      } else {
        setSelectedData((prevSelectedData) => [...prevSelectedData, record]);
      }
    };
  
    const handleShipmentSubmit = async () => {
      if (
        shipmentInfo.totalShipmentQuantity !== 0 &&
        shipmentInfo.totalShipmentQuantity !== null &&
        shipmentInfo.entries.length > 0
      ) {
        const body = {...shipmentInfo, shipmentNumber};
        await AddShipment({ body });
        setSelectedData([]);
        setConfirmModal(!confirmModal);
      } else {
        setEmptyError("you can not send empty shipment slip");
      }
    };



    return (
        <>
            <ListModalContainerHeader
                title={"Shipment list"}
                subTitle={"Manage your shipments"}
                open={() => SetMineralModal(!mineralModal)}
                navtext={"New shipment"}
                table={
                    <>
                        {/* <div className=" w-full overflow-x-auto h-full min-h-[320px]">
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
                                    components={{
                                        body: {
                                            cell: EditableCell,
                                        },
                                    }}
                                    rowKey="_id"
                                />
                            </Form>
                        </div>

                        <Modal
                            open={showmodal}
                            onOk={() => handleDelete(selectedRow)}
                            onCancel={() => {
                                setShowmodal(!showmodal);
                                SetSelectedRow({id: null, name: "", date: ""});
                            }}
                            destroyOnClose
                            footer={[
                                <span
                                    key="actions"
                                    className=" flex w-full justify-center gap-4 text-base text-white"
                                >
                  {isDeleting ? (
                      <Spin className="bg-green-400 p-2 rounded-lg"/>
                  ) : (
                      <button
                          key="back"
                          className=" bg-green-400 p-2 rounded-lg"
                          onClick={handleDelete}
                      >
                          Confirm
                      </button>
                  )}
                                    <button
                                        key="submit"
                                        className=" bg-red-400 p-2 rounded-lg"
                                        type="primary"
                                        onClick={() => {
                                            setShowmodal(!showmodal);
                                            SetSelectedRow({id: null, name: "", date: ""});
                                        }}
                                    >
                    Cancel
                  </button>
                </span>,
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
                        {/* <Modal
                            open={mineralModal}
                            onOk={""}
                            onCancel={() => {
                                SetMineralModal(!mineralModal);
                            }}
                            destroyOnClose
                            style={{minHeight: "100%"}}
                            footer={
                                [
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
                        </Modal> */}
                        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-4">
                            <li className=" space-y-1">
                            <p className=" text-slate-800 text-[16px]">Created At</p>
                            <p className="font-semibold text-[16px]">{dayjs(initialEntryInfo.createdAt).format("MMM DD,YYYY")}</p>
                            </li>
                            <li className=" space-y-1">
                            <p className=" text-slate-800 text-[16px]">Mineral type</p>
                            <p className="font-semibold text-[16px]">{initialEntryInfo.totalShipmentQuantity}</p>
                            </li>
                            <li className=" space-y-1">
                            <p className=" text-slate-800 text-[16px]">Payment date</p>
                            <p className="font-semibold text-[16px]">Nov 12, 2023</p>
                            </li>
                            <li className=" space-y-1">
                            <p className=" text-slate-800 text-[16px]">Payment date</p>
                            <p className="font-semibold text-[16px]">Nov 12, 2023</p>
                            </li>
                        </ul>
                            {/* TO ADD TABLE FROM MODAL 1 */}
          
            <div className=" bg-slate-100 rounded-md p-2">
              <h2 className="modal-title text-center font-bold text-xl">
                Shipment details
              </h2>
              <p className="text-center text-lg">
                slots detailed information. Make sure to confirm shipment.
              </p>

              {/* <div className="w-full py-4 space-y-3 text-end"> */}
                <div className=" w-full space-y-2 overflow-y-auto" key="item1">
                  {/* TABLE 2 TO BE  FILLED WITH SELECTED DATA AND EDITABL */}
                  <Form form={form} component={false}>
                    <Table
                      className=" overflow-x-auto w-full bg-white rounded-lg"
                      dataSource={selectedData}
                      columns={mergedColumns}
                      components={{
                        body: {
                          cell: EditableCell,
                        },
                      }}
                      pagination={false}
                      expandable={{
                        expandedRowRender: (record) => (
                          <div className=" space-y-3 w-full">
                            <p className=" text-lg font-bold">More Details</p>
                            <div className=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              <span className=" space-y-2">
                                <p className="text-md font-semibold">
                                  Exported amount: {record.exportedAmount}
                                </p>
                                <p className="text-md font-semibold">
                                  Mineral price: {record.mineralPrice}
                                </p>
                              </span>
                              <span className=" space-y-2">
                                <p className="text-md font-semibold">
                                  Price per unit: {record.pricePerUnit}
                                </p>
                              </span>
                            </div>
                          </div>
                        ),
                        rowExpandable: (record) =>
                          record.supplierName !== "not expandale",
                      }}
                      rowKey="_id"
                    />
                  </Form>

                  <div className="w-full flex flex-col items-end bg-white rounded-md p-2">
                    <span className="grid grid-cols-2 items-center justify-between w-full md:w-1/2  rounded-sm">
                      <p className=" font-semibold col-span-1 p-2 w-full border-b border-t text-start bg-slate-50">Weight (Kgs):</p>
                      <p className=" font-medium col-span-1 p-2 w-full border ">{totalWeight}</p>
                    </span>
                    <span className="flex items-center justify-between w-full md:w-1/2  rounded-sm">
                      <p className=" font-semibold p-2 w-1/2 border-b text-start bg-slate-50">Avg:</p>
                      <p className=" font-medium p-2 border sm:border-t-0 w-1/2 h-full">{avg}</p>
                    </span>
                    <span className="flex items-center justify-between w-full md:w-1/2  rounded-sm">
                      <p className=" font-semibold p-2 w-1/2 border-b text-start bg-slate-50">Total ($):</p>
                      <p className=" font-medium p-2 border sm:border-t-0 w-1/2 h-full">{avgPrice}</p>
                    </span>
                    
                  </div>
                    
                  <button
                    className=" bg-orange-500 text-white py-2 px-4 rounded-md"
                    onClick={() => {
                      handleConfirmModal();
                    }}
                  >
                    submit
                  </button>
                  <div
              className=" w-full p-2 bg-orange-500 rounded-md flex justify-center"
              onClick={handleOpenModal}
            >
              <BsClipboard2MinusFill className=" text-white text-lg" />
            </div>
                </div>
              {/* </div> */}
            </div>


          <Modal
            open={openModal}
            onCancel={handleOpenModal}
            destroyOnClose
            width={"90%"}
            closable={false}
            style={{ padding: "0px 0px", height: "100%" }}
            footer={[
              <span
                key="actions"
                className=" flex w-full justify-center gap-4 text-base text-white"
              >

                <button
                  key="submit"
                  className=" bg-red-400 p-2 rounded-lg"
                  type="primary"
                  onClick={handleOpenModal}
                >
                  Cancel
                </button>
              </span>,
            ]}
          >

<div className=" space-y-2 w-full block text-center">
             {/* TABLE 1 TO SELECT INFO FROM */}
             <p className=" font-bold text-2xl">Stock state</p>
            <Table
              className=" overflow-x-auto w-full  h-4/5 overflow-y-auto bg-white"
              dataSource={initialData}
              loading={{indicator:< ImSpinner2 style={{width:'60px',height:'60px'}} className="animate-spin text-gray-500"/>, spinning:isLoading}}
              columns={columns2}
              rowKey="index"
            />
           
          </div>

          </Modal>
          <Modal
            open={confirmModal}
            onCancel={handleConfirmModal}
            destroyOnClose
            footer={[
              <ConfirmFooter key={"actions"} isSending={isSending} defText={"Confirm"} dsText={"Sending"} handleCancel={handleConfirmModal} handleConfirm={handleShipmentSubmit}/>
              
            ]}
          >
            <div className=" p-2">
              <h2 className="modal-title text-center font-bold text-xl">
                Confirm Shipment
              </h2>
              <p className="text-center text-lg">
                {`Are you sure you want to confirm this Shipment transaction `}.
              </p>
              {emptyError!==""?<p className=" text-red-400 text-center text-md">{emptyError}</p>:null}
            </div>
          </Modal>
                    </>
                }
            />
        </>
    );
};
export default ShipmentEdit;
