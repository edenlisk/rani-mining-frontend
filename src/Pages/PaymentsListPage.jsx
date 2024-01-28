import React,{useState,useRef,useEffect} from "react";
import dayjs from "dayjs";
import { Input, Modal, Table } from "antd";
import { motion } from "framer-motion";
import { PiMagnifyingGlassDuotone, PiDotsThreeVerticalBold, PiClipboardDuotone,PiEyeDuotone, PiTrashFill, PiPencilCircleDuotone } from "react-icons/pi";
import { BsCardList } from "react-icons/bs"
import {MdDelete} from "react-icons/md"
import {FiEdit} from "react-icons/fi"
import {RiFileEditFill} from "react-icons/ri";
import {BiSolidEditAlt, BiSolidFilePdf} from "react-icons/bi"
import {FaClipboardList} from "react-icons/fa"
import { HiOutlinePrinter } from "react-icons/hi"
import SalesListContainer from "../components/Listcomponents/ListContainer";
import { useGetAllPaymentsQuery } from "../states/apislice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PaymentsListPage=()=>{
    const { permissions } = useSelector(state => state.persistedReducer.global);
    let dataz = [];
    const navigate=useNavigate();
    const { data, isLoading, isSuccess, isError, error } = useGetAllPaymentsQuery();
    const [searchText, SetSearchText] = useState("");
    const [showActions, SetShowActions] = useState(false);
    const [selectedRow, SetSelectedRow] = useState(null);
    const [showmodal, setShowmodal] = useState(false);
    const [paymentDetailsModal, setPaymentDetailsModal] = useState({companyName:"",beneficiary:"",nationalId:"",phoneNumber:"",paymentAmount:"",currency:"",paymentDate:"",TINNumber:"",licenseNumber:"",location:""});
    const [showPyDetailsModal, setShowPyDetailsModal] = useState(false);
    const [selectedRowInfo, SetSelectedRowInfo] = useState({
        name: "",
        date: "",
        amount:""
    });

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

    if(isSuccess){
        const{data:dt}=data;
        const{payments:paymentz}=dt;
        dataz=paymentz
    };

    const handleActions = (id) => {
        SetShowActions(!showActions);
        SetSelectedRow(id)
    };

    const handleDelete = async() => {
        const buyerId= selectedRow;
        await deleteBuyer({buyerId});
        setShowmodal(!showmodal);
    
    };

    const handleCancel=()=>{
        setPaymentDetailsModal({companyName:"",beneficiary:"",nationalId:"",phoneNumber:"",paymentAmount:"",currency:"",paymentDate:"",TINNumber:"",licenseNumber:"",location:""});
        setShowPyDetailsModal(!showPyDetailsModal);
        SetSelectedRow("");
        // SetShowActions(false);
        
        };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'paymentDate',
            key: 'paymentDate',
            render: (text) => (
                <p>{dayjs(text).format("MMM DD, YYYY")}</p>
            ),
            sorter: (a, b) => a.paymentDate.localeCompare(b.paymentDate),
        },
        {
            title: 'Company',
            dataIndex: 'companyName',
            key: 'companyName',
            sorter: (a, b) => a.companyName.localeCompare(b.companyName),
        },
        {
            title: 'Representative',
            dataIndex: 'beneficiary',
            key: 'beneficiary',
            sorter: (a, b) => a.beneficiary.localeCompare(b.beneficiary),
        },
        {
            title: 'License number',
            dataIndex: 'licenseNumber',
            key: 'licenseNumber',
            sorter: (a, b) => a.licenseNumber.localeCompare(b.licenseNumber),
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Amount payed',
            dataIndex: 'paymentAmount',
            key: 'paymentAmount',
            sorter: (a, b) => a.paymentAmount - b.paymentAmount,
        },

        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, record) => {
              return (
                  <>
                    <div className="flex items-center gap-4">
                    <span>
                      <span className="relative">
                        <PiDotsThreeVerticalBold
                            className="text-lg"
                            onClick={() => handleActions(record._id)}
                        />
                        {selectedRow === record._id ? (
                            <motion.ul
                                ref={modalRef}
                                animate={
                                  showActions
                                      ? { opacity: 1, x: -10, y: 1, display: "block" }
                                      : { opacity: 0, x: 0, y: 0, display: "none" }
                                }
                                className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}
                            >
                                    <li
                                        className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                        onClick={() => {
                                          setPaymentDetailsModal((prevstate)=>({...prevstate,companyName:record.companyName,beneficiary:record.beneficiary,nationalId:record.nationalId,phoneNumber:record.phoneNumber,paymentAmount:record.paymentAmount,currency:record.currency,paymentDate:record.paymentDate,TINNumber:record.TINNumber,licenseNumber:record.licenseNumber,location:record.location}));
                                           setShowPyDetailsModal(!showPyDetailsModal);
                                         
                                        }}
                                    >
                                        <FaClipboardList className=" text-lg"/>
                                        <p>details</p>
                                    </li>
                              {permissions.entry?.edit ? (
                                  <>
                                    {/* <li
                                        className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                        onClick={() => {
                                          {
                                            navigate(`/complete/cassiterite/${record._id}`);
                                          }
                                        }}
                                    >
                                      <RiFileEditFill className=" text-lg" />
                                      <p>complete entry</p>
                                    </li> */}
                                    <li
                                        className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                        onClick={() => {
                                          SetSelectedRow(record._id);
                                          SetSelectedRowInfo({
                                            ...selectedRowInfo,
                                            name: record.companyName,
                                            date: record.supplyDate,
                                          });
                                          setShowmodal(!showmodal);
                                        }}
                                    >
                                      <MdDelete className=" text-lg" />
                                      <p>delete</p>
                                    </li>
                                  </>
                              ) : null}
                            </motion.ul>
                        ) : null}
                      </span>
                    </span>
      
                      {permissions.entry?.delete ? (
                          <span>
                        <MdDelete
                            className="text-lg"
                            onClick={() => {
                              SetSelectedRow(record._id);
                              SetSelectedRowInfo({
                                ...selectedRowInfo,
                                name: record.companyName,
                                date: record.supplyDate,
                                amount:record.paymentAmount
                              });
                              setShowmodal(!showmodal);
                            }}
                        />
                      </span>
                      ) : null}
                    </div>
                  </>
              );
            },
          },
    ]
    return(
        <>
        <SalesListContainer title={'Payments list'}
        subTitle={'Manage your payments'}
        navLinktext={'add/payment'}
        navtext={'Add new payment'}
        table={
            <>
            <Modal

                open={showmodal}
                onOk={() => handleDelete(selectedRow)}
                onCancel={() => setShowmodal(!showmodal)}
                destroyOnClose
                footer={[
                    <span key="actions" className=" flex w-full justify-center gap-4 text-base text-white">
                        <button key="back" className=" bg-green-400 p-2 rounded-lg" onClick={handleDelete}>
                            Confirm
                        </button>
                        <button key="submit" className=" bg-red-400 p-2 rounded-lg" type="primary" onClick={() => setShowmodal(!showmodal)}>
                            Cancel
                        </button>
                    </span>
                ]}

            >

                <h2 className="modal-title text-center font-bold text-xl">Confirm Delete</h2>
                <p className="text-center text-lg">Are you sure you want to delete payment with:</p>
                <p className=" text-lg">{`company name: ${selectedRowInfo.name}`}</p>
                <p className=" text-lg">{`Amount payed: ${selectedRowInfo.amount}`}</p>
                            <p className=" text-lg">{`Supply date: ${dayjs(
                                selectedRowInfo.date
                            ).format("MMM/DD/YYYY")}`}</p>
            </Modal>

            <Modal 
                         width= {'95%'}
                        title="Payment details"
                        open={showPyDetailsModal}
                        // onOk={handleOk}
                        onCancel={handleCancel}
                        // key={paymentDetailsModal.id}
                        destroyOnClose
                        footer={[
                          <button key="close" className=" w-fit rounded px-2 py-1 bg-red-300 font-semibold" onClick={handleCancel}>Close</button>
                        ]}
                        >
                          <div className=" py-4 flex flex-col gap-3">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 items-stretch">
                              <ul className="space-y-1">
                              <li className="items-baseline">
                                  <p className=" text-slate-800 text-[16px]">Payment date</p>
                                  <p className="font-semibold text-[16px]">{`${dayjs(paymentDetailsModal.paymentDate ).format("MMM DD, YYYY")}`}</p>
                                </li>
                              <li className="items-baseline">
                                  <p className=" text-slate-800 text-[16px]">Company name</p>
                                  <p className="font-semibold text-[16px]">{`${paymentDetailsModal.companyName}`}</p>
                                </li>
                                <li className="items-baseline">
                                  <p className=" text-slate-800 text-[16px]">Beneficiary</p>
                                  <p className="font-semibold text-[16px]">{`${paymentDetailsModal.beneficiary}`}</p>
                                </li>
                                <li className="items-baseline">
                                  <p className=" text-slate-800 text-[16px]">Location</p>
                                  <p className="font-semibold text-[16px]">{`${paymentDetailsModal.location}`}</p>
                                </li>
                              </ul>
                              <ul className="space-y-1">
                              <li className="items-baseline">
                                  <p className=" text-slate-800 text-[16px]">Phone number</p>
                                  <p className="font-semibold text-[16px]">{`${paymentDetailsModal.phoneNumber}`}</p>
                                </li>
                                <li className="items-baseline">
                                  <p className=" text-slate-800 text-[16px]">License number</p>
                                  <p className="font-semibold text-[16px]">{`${paymentDetailsModal.licenseNumber}`}</p>
                                </li>
                                <li className="items-baseline">
                                  <p className=" text-slate-800 text-[16px]">TIN number</p>
                                  <p className="font-semibold text-[16px]">{`${paymentDetailsModal.TINNumber}`}</p>
                                </li>
                                <li className="items-baseline">
                                  <p className=" text-slate-800 text-[16px]">National ID</p>
                                  <p className="font-semibold text-[16px]">{`${paymentDetailsModal.nationalId}`}</p>
                                </li>
                              </ul>
                              
                              <ul className="space-y-1">
                                <li className="items-baseline">
                                  <p className=" text-slate-800 text-[16px]">Payment amount</p>
                                  <p className="font-semibold text-[16px]">{`${paymentDetailsModal.paymentAmount} ${paymentDetailsModal.currency}`}</p>
                                </li>

                              </ul>


                            </div>
                          </div>
                        </Modal>

            <div className=" w-full overflow-x-auto h-full min-h-[320px]">
                <div className="w-full flex flex-col  sm:flex-row justify-between items-center mb-4 gap-3">
                    <span className="max-w-[220px] border rounded flex items-center p-1 justify-between gap-2">
                        <PiMagnifyingGlassDuotone className="h-4 w-4" />
                        <input type="text" className=" w-full focus:outline-none" name="tableFilter" id="tableFilter" placeholder="Search..." onChange={(e) => SetSearchText(e.target.value)} />
                    </span>

                    <span className="flex w-fit justify-evenly items-center gap-6 pr-1">
                        <BiSolidFilePdf className=" text-2xl" />
                        <BsCardList className=" text-2xl" />
                        <HiOutlinePrinter className=" text-2xl" />
                    </span>
                </div>
                <Table className=" w-full"
                    loading={isLoading}
                    dataSource={dataz}
                    columns={columns}
                    rowKey="_id"
                />
            </div>
        </>
        }/>
        </>
    )
}
export default PaymentsListPage;