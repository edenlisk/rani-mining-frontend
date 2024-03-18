import React, {useState, useRef, useEffect, useContext} from "react";
import dayjs from "dayjs";
import {Checkbox, DatePicker, message, Modal, Space, Spin, Table} from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ListContainer from "../../components/Listcomponents/ListContainer";
import {
  useGetAllEntriesQuery,
    useDeleteEntryMutation,
  useCreateEditRequestMutation,
} from "../../states/apislice";
import {
  PiMagnifyingGlassDuotone,
  PiDotsThreeVerticalBold,
} from "react-icons/pi";
import { BiSolidFilePdf, BiSolidEditAlt } from "react-icons/bi";
import { ImSpinner2 } from "react-icons/im";
import { BsCardList } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { RiFileEditFill } from "react-icons/ri";
import { HiOutlinePrinter } from "react-icons/hi";
import {useSelector} from "react-redux";
import {SocketContext} from "../../context files/socket";
import {toCamelCase, toInitialCase, fields} from "../../components/helperFunctions";
import {FiEdit} from "react-icons/fi";
import CassiteriteEntryComplete from "./entry/CassiteriteEntryComplete";
import isBetween from "dayjs/plugin/isBetween"
import {FaFileInvoiceDollar} from "react-icons/fa";
import DeleteFooter from "../../components/modalsfooters/DeleteFooter";
dayjs.extend(isBetween);


const CassiteriteListPage = () => {
  const { userData } = useSelector(state => state.persistedReducer.global);
  const socket = useContext(SocketContext);
  const [dataz, setDataz] = useState([]);
  const{permissions} = userData;
  const [createEditRequest, {
    isLoading: isCreateRequestLoading,
    isSuccess: isCreateRequestSuccess,
    isError: isCreateRequestError,
    error: createRequestError
  }] = useCreateEditRequestMutation();
  const { data, isLoading, isSuccess, isError, error } =
      useGetAllEntriesQuery({model: "cassiterite"}, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
      });
  const [
    deleteEntry,
    { isLoading: isDeleting, isSuccess: isdone, isError: isproblem },
  ] = useDeleteEntryMutation();

  const navigate = useNavigate();
  const [searchText, SetSearchText] = useState("");
  const [showActions, SetShowActions] = useState(false);
  const [selectedRowInfo, SetSelectedRowInfo] = useState({
    name: "",
    date: "",
  });
  const [selectedRow, SetSelectedRow] = useState("");
  const [model, Setmodel] = useState(null);
  const [showmodal, setShowmodal] = useState(false);
  const [record, setRecord] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      const { data: dt } = data;
      const { entries: entrz } = dt;
      setDataz(entrz);
    }
  }, [isSuccess]);

  const {RangePicker} = DatePicker;


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
    const entryId = selectedRow;
    await deleteEntry({ model: "cassiterite", entryId });
    SetSelectedRow("");
    setShowmodal(!showmodal);
  };



  const initialCheckboxValues = fields.reduce((acc, field) => {
    acc[toCamelCase(field)] = false;
    return acc;
  }, {});

  const [checkboxValues, setCheckboxValues] = useState(initialCheckboxValues);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const showModal = () => {
    setIsModalOpen(true);
  }

  useEffect(() => {
    if (isCreateRequestSuccess) {
      message.success("Edit Request created successfully");
    } else if (isCreateRequestError) {
      const { message: errorMessage } = createRequestError.data;
      message.error(errorMessage);
    }
  }, [isCreateRequestSuccess, isCreateRequestError, createRequestError])

  const handleOk = async () => {
    const finalBody = {editableFields: [], model: "cassiterite", recordId: "", username: userData.username};
    setCheckboxValues(initialCheckboxValues);
    setIsModalOpen(false);
    for (const key of Object.keys(checkboxValues)) {
      if (checkboxValues[key] === true) {
        finalBody.editableFields.push({
          fieldname: toInitialCase(key),
          initialValue: record[key]
        })
      }
    }
    finalBody.recordId = record._id;
    if (!finalBody.editableFields.length) {
      setIsModalOpen(false);
      return;
    }
    await createEditRequest({body: finalBody});
    socket.emit("new-edit-request", {username: userData.username});
    // if (response) {
    //   const { editRequest } = response.data.data;
    //   if (editRequest) {
    //     setRequestId(editRequest._id);
    //   }
    // }
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setCheckboxValues(initialCheckboxValues);
  }


  const columns = [
    {
      title: "Supply date",
      dataIndex: "supplyDate",
      key: "supplyDate",
      sorter: (a, b) => a.supplyDate.localeCompare(b.supplyDate),
      render: (text) => (
          <p>{dayjs(text).format("MMM DD, YYYY")}</p>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Space>
              <RangePicker
                  value={selectedKeys}
                  onChange={(dates) => setSelectedKeys(dates)}
              />
              <button
                  className="px-6 py-1 bg-orange-300 rounded-md"
                  type= "button"
                  onClick={() => {
                    if (isSuccess && selectedKeys.length > 0) {
                      const {data: dt} = data;
                      const {entries: entrz} = dt;
                      if (entrz) {
                        setDataz(entrz);
                      }
                      const startDate = selectedKeys[0] || dayjs();
                      const endDate = selectedKeys[1] || dayjs();
                      const sortedData = entrz.filter(dt => dayjs(dt.supplyDate).isBetween(startDate, endDate, null, '[]'))
                      setDataz(sortedData);
                    }
                    confirm();
                  }}
              >
                OK
              </button>
              <button
                  className="px-6 py-1 bg-red-300 rounded-md"
                  type= "button"
                  onClick={() => {
                    if (isSuccess) {
                      const {data: dt} = data;
                      const {entries: entrz} = dt;
                      if (entrz) {
                        setDataz(entrz);
                      }
                    }
                    clearFilters()
                  }}>
                Reset
              </button>
            </Space>
          </div>
      ),
      onFilter: (value, record) => {
        const startDate = value[0];
        const endDate = value[1];

        return dayjs(record.supplyDate).isBetween(startDate, endDate, null, '[]');
      },
      filterIcon: (filtered) => (
          <span>{filtered ? '📅' : '📅'}</span>
      ),
    },
    {
      title: "Company name",
      dataIndex: "companyName",
      key: "companyName",
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
            String(record.companyName)
                .toLowerCase()
                .includes(value.toLowerCase()) ||
            String(record.beneficiary)
                .toLowerCase()
                .includes(value.toLowerCase()) ||
            String(record.mineralType)
                .toLowerCase()
                .includes(value.toLowerCase()) ||
            String(record.weightIn).toLowerCase().includes(value.toLowerCase()) ||
            String(dayjs(record.supplyDate).format("MMM DD, YYYY"))
                .toLowerCase()
                .includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Beneficiary",
      dataIndex: "beneficiary",
      key: "beneficiary",
      sorter: (a, b) => a.beneficiary.localeCompare(b.beneficiary),
    },
    {
      title: "Mineral type",
      dataIndex: "mineralType",
      key: "mineralType",
      sorter: (a, b) => a.mineralType.localeCompare(b.mineralType),
    },
    {
      title: "Weight in",
      dataIndex: "weightIn",
      key: "weightIn",
      sorter: (a, b) => a.weightIn - b.weightIn,
    },
    {
      title: "Balance",
      dataIndex: "cumulativeAmount",
      key: "cumulativeAmount",
      sorter: (a, b) => a.cumulativeAmount - b.cumulativeAmount,
      render: (_, record) => {
        if (record.output) {
          let sum = 0;
          record.output.forEach((item) => {
            if(item.cumulativeAmount){
              sum += parseFloat(item.cumulativeAmount);
            } else{
              sum += parseFloat(item.weightOut) || 0;
            }
           
          });
          return <p>{sum}</p>;
        }
      }
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
                        {permissions?.entry?.edit && (
                            <li
                                className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                onClick={() => {
                                  navigate(`/entry/edit/${"cassiterite"}/${record._id}`);
                                }}
                            >
                              <BiSolidEditAlt className=" text-lg" />
                              <p>edit</p>
                            </li>
                        )}

                        {/* TODO 15: SHOW MENU BASED ON PERMISSIONS*/}
                        {permissions?.invoices?.create && (
                            <li
                                className="flex gap-2 p-2 items-center hover:bg-slate-100"
                                onClick={() => {
                                  if (record.supplierId) {
                                    navigate(`/add/invoice/${record.supplierId}/cassiterite/${record._id}`);
                                  } else {
                                    return message.warning("You have assign supplier to this entry");
                                  }
                                }}
                            >
                              <FaFileInvoiceDollar className=" text-xl" />
                              <p>Make invoice</p>
                            </li>
                        )}

                        {/*{permissions.entry?.delete ? (*/}
                        {/*    <>*/}
                        {/*      /!*<li*!/*/}
                        {/*      /!*    className="flex gap-4 p-2 items-center hover:bg-slate-100"*!/*/}
                        {/*      /!*    onClick={() => {*!/*/}
                        {/*      /!*      {*!/*/}
                        {/*      /!*        navigate(`/complete/cassiterite/${record._id}`);*!/*/}
                        {/*      /!*      }*!/*/}
                        {/*      /!*    }}*!/*/}
                        {/*      /!*>*!/*/}
                        {/*      /!*  <RiFileEditFill className=" text-lg" />*!/*/}
                        {/*      /!*  <p>complete entry</p>*!/*/}
                        {/*      /!*</li>*!/*/}
                        {/*      <li*/}
                        {/*          className="flex gap-4 p-2 items-center hover:bg-slate-100"*/}
                        {/*          onClick={() => {*/}
                        {/*            SetSelectedRow(record._id);*/}
                        {/*            SetSelectedRowInfo({*/}
                        {/*              ...selectedRowInfo,*/}
                        {/*              name: record.companyName,*/}
                        {/*              date: record.supplyDate,*/}
                        {/*            });*/}
                        {/*            setShowmodal(!showmodal);*/}
                        {/*          }}*/}
                        {/*      >*/}
                        {/*        <MdDelete className=" text-lg" />*/}
                        {/*        <p>delete</p>*/}
                        {/*      </li>*/}
                        {/*    </>*/}
                        {/*) : null}*/}
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
                        });
                        setShowmodal(!showmodal);
                      }}
                  />
                </span>
                ) : null}

                {!permissions.entry?.edit &&
                <span>
                  <FiEdit
                      className="text-lg"
                      onClick={() => {
                        setRecord(record);
                        showModal();
                      }}
                  />
              </span>
                }
              </div>
            </>
        );
      },
    },
  ];

  const handleCheckboxChange = (itemName) => {
    setCheckboxValues({
      ...checkboxValues,
      [itemName]: !checkboxValues[itemName], // Toggle the checkbox value
    });
  };

  return (
      <>
        <ListContainer
            title={"Cassiterite entries list"}
            subTitle={"Manage your cassiterite  entries"}
            navLinktext={`entry/add/${"cassiterite"}`}
            navtext={"Add new Entry"}
            isAllowed={permissions.entry?.create}
            table={
              <>
                <Modal
                    open={showmodal}
                    onOk={() => handleDelete()}
                    onCancel={() => {
                      setShowmodal(!showmodal);
                      SetSelectedRow("");
                    }}
                    destroyOnClose
                    footer={[
                 <DeleteFooter key={"actions"} isDeleting={isDeleting} defText={"Delete"} dsText={"Deleting"} handleCancel={() => {
                  setShowmodal(!showmodal);
                  SetSelectedRow("");
              }} handleDelete={handleDelete}/>
                    ]}
                >
                  <h2 className="modal-title text-center font-bold text-xl">
                    Confirm Delete
                  </h2>
                  <p className=" text-lg">
                    Are you sure you want to delete entry with:
                  </p>
                  <li className=" text-lg">{`company name: ${selectedRowInfo.name}`}</li>
                  <li className=" text-lg">{`Supply date: ${dayjs(
                      selectedRowInfo.date
                  ).format("MMM/DD/YYYY")}`}</li>
                </Modal>

                <Modal
                    title="Select Fields You Want To Edit"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    destroyOnClose
                    okButtonProps={{className: "bg-green-400 p-2 rounded-lg"}}
                    // cancelButtonProps={{className: "py-[5px] px-[20px] shadow-md shadow-[#A6A6A6] bg-punch-500 hover:bg-punch-700 text-white rounded-md", type: "default"}}
                    // okButtonProps={{className: "bg-custom_blue-500 hover:bg-custom_blue-600 text-white shadow-md shadow-[#A6A6A6] py-[7px] px-[15px] rounded-md"}}
                >
                  {fields.map((item, index) => (
                      <div key={index}>
                        <Checkbox
                            checked={checkboxValues[toCamelCase(item)]}
                            onChange={() => handleCheckboxChange(toCamelCase(item))}
                        >
                          {item}
                        </Checkbox>
                      </div>
                  ))}
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
                      expandable={{
                        expandedRowRender: (record) => <CassiteriteEntryComplete entryId={record._id}/>,
                        rowExpandable: (record) => record.output?.length > 0,
                      }}
                      rowKey="_id"
                  />
                </div>
              </>
            }
        />
      </>
  );
};
export default CassiteriteListPage;
