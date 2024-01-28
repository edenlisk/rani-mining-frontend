import React, { useState, useRef, useEffect } from "react";
import { Input, Modal, Table,DatePicker } from "antd";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import {
  PiMagnifyingGlassDuotone,
  PiDotsThreeVerticalBold,
  PiClipboardDuotone,
  PiEyeDuotone,
  PiTrashFill,
  PiPencilCircleDuotone,
} from "react-icons/pi";
import { BiSolidFilePdf, BiSolidEditAlt, BiSolidDetail } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { BsCardList } from "react-icons/bs";
import { HiOutlinePrinter } from "react-icons/hi";
import { ImSpinner2 } from "react-icons/im";
import { FaFileAlt } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa";
import ListContainer from "../components/Listcomponents/ListContainer";
import {
  useGetAllSuppliersQuery,
  useDeleteSupplierMutation,
  useGetSuppliersInvoiceQuery,
} from "../states/apislice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DeleteFooter from "../components/modalsfooters/DeleteFooter";
import ConfirmFooter from "../components/modalsfooters/ConfirmFooter";

const SuppliersListPage = () => {
  
  const { permissions } = useSelector(state => state.persistedReducer?.global);
  const { RangePicker } = DatePicker;
  let dataz = [];
  const { data, isLoading, isError, isSuccess, error } =
    useGetAllSuppliersQuery();
  // const { data:info, isLoading:isGetting, isError:isFail, isSuccess:isDone, error:fail } =
  //   useGetSuppliersInvoiceQuery(supplierId);

    const useSupplierData = (supplierId) => {
      if(supplierId!==null ||""){

        const { data, isLoading, error,isSuccess } = useGetSuppliersInvoiceQuery(supplierId);
       
    
          return { data, isLoading, error };
     

      };
  
    };
    const handleSupplierinvoice=(supplierId)=>{
      const dt = useSupplierData(supplierId);
    };

   

  const [
    deleteSupplier,
    { isLoading: isDeleting, isSuccess: isdone, isError: isproblem },
  ] = useDeleteSupplierMutation();
  const navigate = useNavigate();
  const [searchText, SetSearchText] = useState("");
  const [showActions, SetShowActions] = useState(false);
  const [dateModal, SetDateModal] = useState(false);
  const [selectedRowInfo, SetSelectedRowInfo] = useState({
    name: "",
    license: "",
  });
  const [selectedRow, SetSelectedRow] = useState(null);
  const [showmodal, setShowmodal] = useState(false);
  const[supplierId,setSupplierId]=useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  if (isSuccess) {
    const { data: dt } = data;
    const { suppliers: spl } = dt;
    dataz = spl;
  };

  const handleDateChange = (dates, dateStrings) => {

    if (dates && dates.length === 2) {
      const startDate = dates[0].startOf('month');
      const endDate = dates[1].endOf('month');

      setStartDate(startDate.format('YYYY-MM-DD'));
      setEndDate(endDate.format('YYYY-MM-DD'));

    }
  };

  const handleActions = (id) => {
    if (selectedRow === id) {
      SetShowActions(false);
      SetSelectedRow("");
    } else {
      SetSelectedRow(id);
      SetShowActions(true);
    }
  };
  
  const handleDelete = async () => {
    const supplierId = selectedRow;
    await deleteSupplier({ supplierId });
    setShowmodal(!showmodal);
  };
  const columns = [
    {
      title: "Company name",
      dataIndex: "companyName",
      key: "companyName",
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "TIN number",
      dataIndex: "TINNumber",
      key: "TINNumber",
      sorter: (a, b) => a.TINNumber.localeCompare(b.TINNumber),
    },
    {
      title: "License number",
      dataIndex: "licenseNumber",
      key: "licenseNumber",
      sorter: (a, b) => a.licenseNumber.localeCompare(b.licenseNumber),
    },
    {
      title: "Phone number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <>
            <div className="flex items-center gap-4">
              <span className="relative">
                <PiDotsThreeVerticalBold
                  className="text-lg"
                  onClick={() => handleActions(record._id)}
                />
                {selectedRow === record._id && (
                  <motion.ul
                    ref={modalRef}
                    animate={
                      showActions
                        ? { opacity: 1, x: -10, display: "block" }
                        : { opacity: 0, x: 0, display: "none" }
                    }
                    className={` border bg-white z-20 shadow-md rounded absolute -left-[170px] w-[170px] space-y-2`}
                  >
                    {permissions?.suppliers?.view && (
                        <li
                            className="flex gap-2 p-2 items-center hover:bg-slate-100"
                            onClick={() => {
                              navigate(`/supplier/details/${record._id}`);
                            }}
                        >
                          <BiSolidDetail className=" text-xl" />
                          <p>details</p>
                        </li>
                    )}
                    {permissions?.suppliers?.edit && (
                        <li
                            className="flex gap-2 p-2 items-center hover:bg-slate-100"
                            onClick={() => {
                              {
                                navigate(`/edit/supplier/${record._id}`);
                              }
                            }}
                        >
                          <BiSolidEditAlt className=" text-xl" />
                          <p>Edit</p>
                        </li>
                    )}
                    {/*<li*/}
                    {/*  className="flex gap-2 p-2 items-center hover:bg-slate-100"*/}
                    {/*  onClick={() => {*/}
                    {/*    {*/}
                    {/*      navigate(`/add/invoice/${record._id}`);*/}
                    {/*    }*/}
                    {/*  }}*/}
                    {/*>*/}
                    {/*  <FaFileInvoiceDollar className=" text-xl" />*/}
                    {/*  <p>Make invoice</p>*/}
                    {/*</li>*/}

                    {permissions.dueDiligence?.create && (
                        <li
                            className="flex gap-2 p-2 items-center hover:bg-slate-100"
                            onClick={() => {
                              setSupplierId(record._id);
                              SetDateModal(!dateModal);
                            }}
                        >
                          <FaFileAlt className=" text-xl" />
                          <p>Make report</p>
                        </li>
                    )}
                    {permissions.invoices?.view && (
                        <li
                            className="flex gap-2 p-2 items-center hover:bg-slate-100"
                            onClick={() => {
                              navigate(`/supplier/invoices/${record._id}`);
                            }}
                        >
                          <FaFileAlt className=" text-xl" />
                          <p>Invoice List</p>
                        </li>
                    )}
                  </motion.ul>
                )}
              </span>

              <span>
                <MdDelete
                  className="text-lg"
                  onClick={() => {
                    SetSelectedRow(record._id);
                    SetSelectedRowInfo({
                      ...selectedRowInfo,
                      name: record.companyName,
                      license: record.licenseNumber,
                    });
                    setShowmodal(!showmodal);
                  }}
                />
              </span>
            </div>
          </>
        );
      },
    },
  ];
  return (
    <>
      <ListContainer
        title={"Suppliers List"}
        subTitle={"Manage your Suppliers"}
        navLinktext={"add/supplier"}
        navtext={"Add supplier"}
        isAllowed={permissions.suppliers?.create}
        table={
          <>
            <Modal
              open={showmodal}
              onOk={() => handleDelete(selectedRow)}
              onCancel={() => setShowmodal(!showmodal)}
              destroyOnClose
              footer={[
                <DeleteFooter key={"actions"} isDeleting={isDeleting} defText={"Delete"} dsText={"Deleting"} handleCancel={() => setShowmodal(!showmodal)} handleDelete={handleDelete}/>
              ]}
            >
              <h2 className="modal-title text-center font-bold text-xl">
                Confirm Delete
              </h2>
              <p className="text-center text-lg">
                {`Are you sure you want to delete ${selectedRowInfo.name} with license number ${selectedRowInfo.license}`}
                .
              </p>
            </Modal>

            <Modal
              open={dateModal}
              onOk={() =>SetDateModal(!dateModal)}
              onCancel={() =>{
                setStartDate("");
                setEndDate("");
                setSupplierId("");
                    SetDateModal(!dateModal);
              }}
              destroyOnClose
              footer={[
                <ConfirmFooter key={"date_actions"} isSending={isDeleting} defText={"Confirm"} dsText={"Sending"} handleCancel={() =>{ 
                  setStartDate();
                  setEndDate();
                setSupplierId();
                SetDateModal(!dateModal);
              }} handleConfirm={() => {
                navigate(`/due-diligence-report/${supplierId}/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`);
                setStartDate("");
                setEndDate("");
                setSupplierId("");

              }}/>
              ]}
            >
              <h2 className="modal-title text-center font-bold text-lg">
               Date footer
              </h2>
              <p className="text-center text-lg">
                {`Select report months to be included in the report `}
                .
              </p>
              <RangePicker picker="month" onChange={handleDateChange} />
            </Modal>

            <div className=" w-full overflow-x-auto h-full min-h-[320px]">
              <div className="w-full flex flex-col  sm:flex-row justify-between items-center mb-4 gap-3">
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

                <span className="flex w-fit justify-evenly items-center gap-6 pr-1">
                  <BiSolidFilePdf className=" text-2xl" />
                  <BsCardList className=" text-2xl" />
                  <HiOutlinePrinter className=" text-2xl" />
                </span>
              </div>
              <Table
                className=" w-full"
                loading={{
                  indicator: (
                    <ImSpinner2
                      style={{ width: "60px", height: "60px" }}
                      className="animate-spin text-gray-500"
                    />
                  ),
                  spinning: isLoading,
                }}
                dataSource={dataz}
                columns={columns}
                rowKey="_id"
              />
            </div>
          </>
        }
      />
    </>
  );
};
export default SuppliersListPage;
