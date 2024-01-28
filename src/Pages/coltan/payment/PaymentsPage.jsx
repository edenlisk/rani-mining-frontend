import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import dayjs from "dayjs";
import {
  Spin,
  Table,
  Form,
  Input,
  Button,
  Modal,
  DatePicker,
  Collapse,
  Space,
  Popconfirm,
  message,
  Radio,
} from "antd";
import { toast } from "react-toastify";
import ActionsPagesContainer from "../../../components/Actions components/ActionsComponentcontainer";
import {
  useGetEntryQuery,
  useGetPaymentHistoryQuery,
  useAddPaymentMutation,
  useGetAllAdvancePaymentsQuery,
} from "../../../states/apislice";
// import AddComponent from "../../../components/Actions components/AddComponent";
import { RiFileListFill, RiFileEditFill } from "react-icons/ri";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GrHistory } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { MdClose } from "react-icons/md";
import { BsCheck2 } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import { IoCaretForward } from "react-icons/io5";
import { handleConvertToUSD } from "../../../components/helperFunctions";
import { EditFilled } from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";
// import {Model} from "echarts/types/src/export/api";
import EditPayment from "../../EditPayment";
import CurrencyConverter from "../../CurrencyConverter";

const PaymentsPage = () => {
  const { Panel } = Collapse;
  const { entryId, model, lotNumber } = useParams();


  const { data, isLoading, isSuccess, isError, error } = useGetEntryQuery({
    model,
    entryId,
  });

  const { data: paymentHistoryData, isSuccess: isPaymentHistoryReady } =
    useGetPaymentHistoryQuery(
      { entryId, model, lotNumber },
      {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
      }
    );
  const [dataz, setDataz] = useState([]);
  const {
    data: adv,
    isLoading: isFetching,
    isError: isFail,
    error: fail,
    isSuccess: isDone,
  } = useGetAllAdvancePaymentsQuery();
  const [
    addPayment,
    {
      isLoading: isSending,
      isSuccess: isPaymentSuccess,
      isError: isPaymentError,
      error: paymentError,
    },
  ] = useAddPaymentMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [advancedListModal, SetAdvancedListModal] = useState(false);
  const [formval, setFormval] = useState({
    lat: "",
    long: "",
    name: "",
    code: "",
  });
  const [payment, setPayement] = useState({
    paymentDate: "",
    location: "",
    phoneNumber: "",
    beneficiary: "",
    paymentAmount: null,
    paymentMode: "",
  });
  const [selectedAccordData, setSelectedAccordData] = useState({ item: "" });
  const [selectedRow, SetSelectedRow] = useState({
    id: null,
    name: "",
    date: "",
  });
  const [suply, setSuply] = useState([]);
  const [lotInfo, setLotInfo] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editRowKey, setEditRowKey] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showPayModel, setShowPayModel] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [USDRate, setUSDRate] = useState({ USDRate: null });
  const [USDEquivalent, setUSDEquivalent] = useState(null);
  const [lotPaymentInfo, setLotPaymentInfo] = useState({
    paid: "",
    unpaid: "",
    netPrice: "",
    mineralPrice: "",
    rmaFee: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (isPaymentHistoryReady || isPaymentSuccess) {
      const { lotPaymentHistory } = paymentHistoryData.data;
      setPaymentHistory(lotPaymentHistory);
    }
  }, [isPaymentHistoryReady, paymentHistoryData, isPaymentSuccess]);

  useEffect(() => {
    if (isPaymentSuccess) {
      return message.success("Payment Completed Successfully");
    } else if (isPaymentError) {
      const { message: errorMessage } = paymentError.data;
      return message.error(errorMessage);
    }
  }, [isPaymentError, isPaymentSuccess, paymentError]);

  useEffect(() => {
    if (isSuccess || isPaymentSuccess) {
      const { entry } = data.data;
      if (entry) {
        if (entry.beneficiary) {
          setPayement({ ...payment, beneficiary: entry.beneficiary });
        }

        const selectedLot = entry.output.find(
            (item) => parseInt(item.lotNumber) === parseInt(lotNumber)
        );

        if (selectedLot) {
          setLotPaymentInfo((prevState) => ({
            ...prevState,
            paid: selectedLot.paid,
            unpaid: selectedLot.unpaid,
            netPrice: selectedLot.netPrice,
            mineralPrice: selectedLot.mineralPrice,
            rmaFee: selectedLot.rmaFeeUSD,
          }));
        }

        // if (['cassiterite', "wolframite", "coltan"].includes(model)) {
        //   if (selectedLot) {
        //     setLotPaymentInfo((prevState) => ({
        //       ...prevState,
        //       paid: selectedLot.paid,
        //       unpaid: selectedLot.unpaid,
        //       netPrice: selectedLot.netPrice,
        //       mineralPrice: selectedLot.mineralPrice,
        //       rmaFee: selectedLot.rmaFeeUSD,
        //     }));
        //   }
        // } else {
        //   setLotPaymentInfo((prevState) => ({
        //             ...prevState,
        //             paid: entry.paid,
        //             unpaid: entry.unpaid,
        //             netPrice: entry.netPrice,
        //             mineralPrice: entry.mineralPrice,
        //             rmaFee: entry.rmaFeeUSD,
        //           }));
        // }



        // if (model === "lithium" || "beryllium") {
        //     setLotPaymentInfo((prevState) => ({
        //         ...prevState,
        //         paid: entry.paid,
        //         unpaid: entry.unpaid,
        //         netPrice: entry.netPrice,
        //         mineralPrice: entry.mineralPrice,
        //         rmaFee: entry.rmaFeeUSD,
        //       }));
        //
        //
        // }
      }
    }
  }, [isSuccess, data, isPaymentSuccess]);

  useEffect(() => {
    if (isDone || isPaymentSuccess) {
      const { payments } = adv.data;
      setDataz(payments);
    }
  }, [isDone, isPaymentSuccess, adv]);

  const columns = [
    // {
    //     title: '#',
    //     dataIndex: 'lotNumber',
    //     key: 'lotNumber',
    //     sorter: (a, b) => a.lotNumber.localeCompare(b.lotNumber),
    // },
    {
      title: "date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      sorter: (a, b) => a.paymentDate - b.paymentDate,
      render: (text) => {
        return (
          <>
            <p>{dayjs(text).format("MMM DD, YYYY")}</p>
          </>
        );
      },
    },
    {
      title: "beneficiary",
      dataIndex: "beneficiary",
      key: "beneficiary",
      editTable: true,
      sorter: (a, b) => a.beneficiary.localeCompare(b.beneficiary),
    },
    {
      title: "Phone number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
    },
    {
      title: "location",
      dataIndex: "location",
      key: "location",
      render: (_, record) => {
        if (
          typeof record.location === "object" &&
          !Array.isArray(record.location) &&
          record.location !== null
        ) {
          const { province, district, sector, cell } = record.location;
          return <span>{`${cell}, ${sector}, ${district}, ${province}`}</span>;
        }
      },
      // sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
      title: "payment amount",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      editTable: true,

      sorter: (a, b) => a.paymentAmount - b.paymentAmount,
    },
    {
      title: "currency",
      dataIndex: "currency",
      key: "currency",
      editTable: true,
      sorter: (a, b) => a.currency.localeCompare(b.currency),
    },
    {
      title: "payment mode",
      dataIndex: "paymentMode",
      key: "paymentMode",
      editTable: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      editTable: true,
      render: (_, record) => {
        return (
          <>
            <FaRegEdit
              size={20}
              onClick={() => {
                setPaymentInfo({ ...record, model });
                setEditModalOpen(true);
              }}
            />
          </>
        );
      },
    },
  ];

  const columns2 = [
    {
      title: "Payment date",
      dataIndex: "paymentDate",
      // key: "paymentDate",
      Key: "_id",
      sorter: (a, b) => a.paymentDate.localeCompare(b.paymentDate),
      render: (text) => {
        return (
          <>
            <p>{dayjs(text).format("MMM DD, YYYY")}</p>
          </>
        );
      },
    },
    {
      title: "Company name",
      dataIndex: "companyName",
      // key: "companyName",
      Key: "_id",
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
      //   filteredValue: [searchText],
      //   onFilter: (value, record) => {
      //     return (
      //       String(record.companyName)
      //         .toLowerCase()
      //         .includes(value.toLowerCase()) ||
      //       String(record.beneficiary)
      //         .toLowerCase()
      //         .includes(value.toLowerCase()) ||
      //       String(record.mineralType)
      //         .toLowerCase()
      //         .includes(value.toLowerCase()) ||
      //       String(record.weightIn).toLowerCase().includes(value.toLowerCase()) ||
      //       String(dayjs(record.supplyDate).format("MMM DD, YYYY"))
      //         .toLowerCase()
      //         .includes(value.toLowerCase())
      //     );
      //   },
    },
    {
      title: "Beneficiary",
      dataIndex: "beneficiary",
      key: "beneficiary",
      sorter: (a, b) => a.beneficiary.localeCompare(b.beneficiary),
    },

    {
      title: "Amount payed",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      sorter: (a, b) => a.paymentAmount - b.paymentAmount,
    },
    {
      title: "Amount remaining",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      sorter: (a, b) => a.remainingAmount - b.remainingAmount,
    },
  ];
  useEffect(() => {
    // Handle confirmation logic, e.g., send data to the state
    if (selectedAccordData) {
      // Perform any other logic here
    }
  }, [selectedAccordData]);

  const handleUseButtonClick = async (item) => {
    // setSelectedAccordData({item:item});
    const paymentInAdvanceId = item;
    const body = { entryId, lotNumber, model, paymentInAdvanceId };
    await addPayment({ body });
    // setIsModalVisible(true);
  };

  const testInfo = [
    {
      cumulativeAmount: 70,
      exportedAmount: 0,
      lotNumber: 1,
      paid: 150000,
      rmaFee: 8750,
      rmaFeeDecision: "pending",
      settled: false,
      status: "in progress",
      weightOut: 70,
      _id: "64ccaff3669d584e8ff70bbc",
    },
    {
      cumulativeAmount: 40,
      exportedAmount: 0,
      id: "64ca67b1492ba72b23596c5a",
      lotNumber: 2,
      paid: 120000,
      rmaFee: 5000,
      rmaFeeDecision: "pending",
      settled: false,
      status: "in progress",
      weightOut: 40,
      _id: "64ca67b1492ba72b23596c5a",
    },
  ];
  // totals
  const total = paymentHistory.reduce(
    (total, obj) => total + obj.paymentAmount,
    0
  );
  const handlePayment = (e) => {
    setPayement((prevpay) => ({ ...prevpay, [e.target.name]: e.target.value }));
  };

  const handleAddDate = (e) => {
    setPayement((prevpay) => ({
      ...prevpay,
      paymentDate: dayjs(e).format("MMM/DD/YYYY"),
    }));
  };
  const handleCancel = () => {
    setPayement({
      beneficiary: "",
      paymentAmount: null,
      location: "",
      phoneNumber: "",
      paymentDate: "",
      paymentMode: "",
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const body = { ...payment, entryId, lotNumber, model };
    await addPayment({ body });
    handleCancel();
    handleShowForm();
  };

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
  }, [USDEquivalent, USDRate]);

  return (
    <>
      <ActionsPagesContainer
        title={`${model} Payments`}
        // subTitle={'Make Coltan Payments'}
        actionsContainer={
          // <AddComponent component={
          <>
            <div className="w-full space-y-4">
              {/*<p className=" font-bold text-lg">Total Amount: 750,000</p>*/}
              <div className="flex gap-2 items-center pb-9">
                <GrHistory />
                <p className=" text-lg font-semibold">Payments history</p>
              </div>
              <div>
                <div className="w-full flex-col sm:flex-row justify-between items-center mb-4 gap-4 space-y-2">
                  <span className="max-w-[220px] border rounded flex items-center p-1 justify-between gap-2">
                    <PiMagnifyingGlassDuotone className="h-4 w-4" />
                    <input
                      type="text"
                      className=" w-full focus:outline-none"
                      name="tableFilter"
                      id="tableFilter"
                      placeholder="Search..."
                      onChange={(e) => SetSearchText(e.target.value)}
                    />
                  </span>

                  <button
                    type="button"
                    className=" py-[8px] px-[20px] rounded shadow-md shadow-[#A6A6A6] text-white bg-custom_blue-500  hover:bg-custom_blue-600 flex items-center gap-3"
                    onClick={() => SetAdvancedListModal(!advancedListModal)}
                  >
                    Advanced payments
                  </button>

                  {/* <span className="flex w-fit justify-evenly items-center gap-6 pr-1">
                                    <BiSolidFilePdf className=" text-2xl" />
                                    <BsCardList className=" text-2xl" />
                                    <HiOutlinePrinter className=" text-2xl" />
                                </span> */}
                </div>
                <Table
                  className=" overflow-x-auto"
                  columns={columns}
                  dataSource={paymentHistory}
                  pagination={false}
                  rowKey="paymentId"
                />
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-md">
                <p className=" font-semibold text-lg">
                  Paid: {lotPaymentInfo.paid} $
                </p>
                <p className=" font-semibold text-lg">
                  Unpaid: {lotPaymentInfo.unpaid} $
                </p>
                <p className=" font-semibold text-lg">
                  Mineral Price: {lotPaymentInfo.mineralPrice}$
                </p>
                <p className=" font-semibold text-lg">
                  RMA Fee: {lotPaymentInfo.rmaFee} $
                </p>
                <p className=" font-semibold text-lg">
                  Net Price: {lotPaymentInfo.netPrice} $
                </p>
                {/*<p>{total}</p>*/}
                {/*<p>owing(to be paid)</p>*/}
              </div>

              <div className="w-full space-y-6">
                <button
                  type="button"
                  className="flex gap-2 bg-slate-300 rounded-md items-end justify-center p-2"
                  onClick={handleShowForm}
                >
                  <IoAdd className=" text-xl" />
                  <p className="">Add payment</p>
                </button>

                <CurrencyConverter/>

                {showForm ? (
                  <form
                    action="submit"
                    onSubmit={handlePaymentSubmit}
                    className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-2 bg-gray-100 rounded-md p-2 shadow-lg shadow-zinc-300"
                  >
                    <span className=" space-y-1">
                      <p className="pl-1">Date</p>
                      <DatePicker
                        onChange={handleAddDate}
                        id="paymentDate"
                        name="paymentDate"
                        className=" focus:outline-none p-2 border rounded-md w-full"
                      />
                    </span>
                    <span className=" space-y-1">
                      <p className="pl-1">Beneficiary</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="beneficiary"
                        id="beneficiary"
                        value={payment.beneficiary || ""}
                        onChange={handlePayment}
                      />
                    </span>
                    <span className=" space-y-1">
                      <p className="pl-1">Amount</p>
                      <input
                        type="number"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="paymentAmount"
                        id="paymentAmount"
                        value={payment.paymentAmount || ""}
                        onWheelCapture={(e) => {
                          e.target.blur();
                        }}
                        onChange={handlePayment}
                      />
                    </span>
                    <span className=" space-y-1">
                      <p className="pl-1">Location</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="location"
                        id="location"
                        value={payment.location || ""}
                        onChange={handlePayment}
                      />
                    </span>
                    <span className=" space-y-1">
                      <p className="pl-1">Phone number</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={payment.phoneNumber || ""}
                        onChange={handlePayment}
                      />
                    </span>
                    <span className=" space-y-1">
                      {/*              <p className="pl-1">Currency</p>*/}
                      {/*              <select*/}
                      {/*  name="currency"*/}
                      {/*  autoComplete="off" */}
                      {/*  className="focus:outline-none p-2 border rounded-md w-full"*/}
                      {/*  defaultValue={payment.currency || ''|| "defaultcurrency"}*/}
                      {/*  onChange={handlePayment}*/}
                      {/*>*/}
                      {/*  <option value="defaultcurrency" hidden>*/}
                      {/*    {payment.currency ? `${payment.currency}` : "select Currency"}*/}
                      {/*  </option>*/}
                      {/*  <option value="USD">USD</option>*/}
                      {/*  <option value="RWF">RWF</option>*/}
                      {/*</select>*/}
                    </span>
                    <span className=" space-y-1">
                      <p className="pl-1">Payment mode</p>
                      <Radio.Group
                        name="paymentMode"
                        id="paymentMode"
                        onChange={handlePayment}
                        value={payment.paymentMode}
                      >
                        <Radio value={"Cash"}>Cash</Radio>
                        <Radio value={"Bank Transfer"}>Bank Transfer</Radio>
                        <Radio value={"Cheque"}>Cheque</Radio>
                        {/*<Radio value={4}>D</Radio>*/}
                      </Radio.Group>
                      {/*<label>*/}
                      {/* <input type="radio" value="cash" name="paymentMode" onChange={handlePayment}/>*/}
                      {/* Cash*/}
                      {/* </label>*/}
                      {/*<label>*/}
                      {/* <input type="radio" value="cheque" name="paymentMode" onChange={handlePayment}/>*/}
                      {/* Cheque*/}
                      {/* </label>*/}
                      {/*<label>*/}
                      {/* <input type="radio" value="cash" name="paymentMode" onChange={handlePayment}/>*/}
                      {/* Cash*/}
                      {/* </label>*/}
                    </span>
                    <span className=" grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-full justify-self-start">
                      {isSending ? (
                       <button
                       type="submit"
                       className="bg-green-200 flex items-center gap-2 py-[7.5px] px-[20px] text-green-600  rounded cursor-not-allowed"
                     >
                       <ImSpinner2 className="h-[18px] w-[18px] animate-spin text-green-600 " />
                       <p type="submit" className="">
                         Sending
                       </p>
                     </button>
                   ) : (
                     <button
                       type="submit"
                       className="flex gap-2 items-center justify-center bg-green-500 py-[7.5px] px-[20px] text-slate-50 hover:bg-green-600 rounded"
                       onClick={handlePaymentSubmit}
                     >
                       <BsCheck2 className=" text-lg" />
                       <p type="submit" className="">
                         Confirm
                       </p>
                     </button>
                   )}

                      <button
                        type="button"
                        className="flex gap-2 justify-center items-center border border-shark-800 hover:border-punch-700 hover:text-punch-700 hover:bg-punch-100 text-shark-800 py-[7.5px] px-[20px] rounded transition-all duration-300 "
                        onClick={handleCancel}
                      >
                        <MdClose className=" text-lg" />
                        <p className="">Cancel</p>
                      </button>
                    </span>
                  </form>
                ) : null}
              </div>
            </div>
          </>
          // }
          // />
        }
      />

      <Modal
        width={"80%"}
        style={{ top: 20 }}
        open={advancedListModal}
        title="advanced payments"
        footer={null}
        onCancel={() => SetAdvancedListModal(!advancedListModal)}
      >
        {/* <Table
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
                                dataSource={dataz}
                                columns={columns2}
                                rowKey="_id"
                            /> */}

        <>
          <div className=""></div>
          <Collapse
            expandIcon={({ isActive }) => (
              <IoCaretForward rotate={isActive ? 90 : 0} />
            )}
            size="small"
            accordion
            className="w-full"
          >
            {dataz.map((item) => (
              <Panel
                header={
                  <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-2">
                    <span className="">
                      <p className=" font-bold">Company name:</p>
                      <p className=" text-md">{item.companyName}</p>
                    </span>

                    <span className="">
                      <p className=" font-bold">Payed amount:</p>
                      <p className=" text-md">{item.paymentAmount}</p>
                    </span>

                    <span className="">
                      <p className=" font-bold">Remaining amount:</p>
                      <p className=" text-md">{item.remainingAmount}</p>
                    </span>
                    <span className="">
                      <p className=" font-bold">Payment date:</p>
                      <p className=" text-md">
                        {dayjs(item.paymentDate).format("MMM DD, YYYY")}
                      </p>
                    </span>
                  </div>
                }
                key={item._id}
              >
                <ul className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
                  <li className="space-y-1">
                    <p className=" font-bold">Beneficiary:</p>
                    <p>{item.beneficiary}</p>
                  </li>
                  <li className="space-y-1">
                    <p className=" font-bold">Email:</p>
                    <p>{item.email}</p>
                  </li>
                  <li className="space-y-1">
                    <p className=" font-bold">Phone number:</p>
                    <p>{item.phoneNumber}</p>
                  </li>
                  <li className="space-y-1">
                    <p className=" font-bold">National ID:</p>
                    <p>{item.nationalId}</p>
                  </li>
                </ul>
                <Button onClick={() => handleUseButtonClick(item._id)}>
                  Pay
                </Button>
              </Panel>
            ))}
          </Collapse>
        </>
      </Modal>
      <EditPayment
        setEditModalOpen={setEditModalOpen}
        editModalOpen={editModalOpen}
        paymentInfo={paymentInfo}
      />
    </>
  );
};
export default PaymentsPage;
