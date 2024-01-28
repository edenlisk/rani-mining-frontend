import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { Modal, Spin, Table, message } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ListContainer from "../../components/Listcomponents/ListContainer";
import { useGetAllUsersQuery, useDeleteUserMutation, useVerify2FAMutation, useSetup2FAMutation } from "../../states/apislice";
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
import { toInitialCase } from "../../components/helperFunctions";
import {useSelector} from "react-redux";
import DeleteFooter from "../../components/modalsfooters/DeleteFooter";
import { Tb2Fa } from "react-icons/tb";

const UsersListPage = () => {
  let dataz = [];
  const { permissions, userData } = useSelector(state => state.persistedReducer?.global);
  const { data, isLoading, isSuccess, isError, error } = useGetAllUsersQuery("", {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true
  });
  const [
    deleteUser,
    { isLoading: isDeleting, isSuccess: isdone, isError: isproblem,error:problem },
  ] = useDeleteUserMutation();

  const [setup2FA, { isLoading: isSettingUp, isSuccess: is2FA, isError: is2FAError, error: error2FA }] = useSetup2FAMutation();
  const [verify2FA, { isLoading: isVerifying, isSuccess: isVerified, isError: isVerifyError, error: errorVerify }] = useVerify2FAMutation()




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
  const [show2fa, setShow2fa] = useState(false);
  const [qrcode, setQrcode] = useState("");
  const [secret, setSecret] = useState("");
  const [twoFA, setTwoFA] = useState({code:"", email:""});


  useEffect(() => {
    if (isVerified) {
        message.success("2FA verified successfully");
    } else if (isVerifyError) {
        const { message: errorMessage } = errorVerify.data;
        message.error(errorMessage);
    }
  }, [isVerified]);

  let modalRef = useRef();

  const handleClickOutside = (event) => {
    if (!modalRef.current || !modalRef.current.contains(event.target)) {
      SetShowActions(false);
    }
  };

  const setup2FactorAuth = async (email) => {
    const response = await setup2FA({body: {email}});
    const data = response.data;
    setQrcode(data.imageUrl);
    setSecret(data.secret);
  }

  const verify2FactorAuth = async ({email, code}) => {
    await verify2FA({body: {email, code, secret}});
    setShow2fa(false);
  }

  useEffect(() => {
    if (isdone) {
      message.success("User deleted successfully");
    } else if (isproblem) {
      const { message: errorMessage } = problem.data;
      message.error(errorMessage);
    }
  }, [isdone, isproblem, problem]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  if (isSuccess) {
    const { data: dt } = data;
    const { users:userz } = dt;
    dataz = userz;
  }

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
    const userId = selectedRow;
    await deleteUser( userId );
    SetSelectedRow("");
    setShowmodal(!showmodal);
  };

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      
    },
    {
      title: "role",
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
      filteredValue: [searchText],
      render:(text)=><span>{toInitialCase(text)}</span>,
      onFilter: (value, record) => {
        return (
          String(record.name)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.role)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.email)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.phoneNumber).toLowerCase().includes(value.toLowerCase()) ||
          String(dayjs(record.supplyDate).format("MMM DD, YYYY"))
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
    },
    {
      title: "active",
      dataIndex: "active",
      key: "active",
      sorter: (a, b) => a.active.localeCompare(b.active),
      render:(_,record)=>{
            return (
              <div className=" text-center">
                <label htmlFor={`check${record._id }`} className={`bg-gray-100 px-1 py-1 rounded-full flex flex-col justify-center w-12 ${record.active===true?'items-end':'items-start'}`}>
                <input type="checkbox" name="" id={`check${record._id }`} className=" sr-only peer" />
                <div className={`rounded-full p-[7.8px]  ${record.active === true ? 'bg-orange-400' : ' bg-slate-400'}`}/>
                </label>
              {/* <div className={`bg-gray-100 px-1 py-1 rounded-full flex flex-col justify-center w-12 ${ghee===true?'items-end':'items-start'}`} onClick={()=>record.active=false}>
              <div className={`rounded-full p-[7.8px]  ${ghee===true?'bg-orange-400':' bg-slate-400'}`}></div>
              </div>
              
              */}
              </div>
            )
        
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
                      <li onClick={() => {
                        setShow2fa(true);
                        setup2FactorAuth(record.email);
                        setTwoFA(prevState => ({...prevState, email: record.email}));
                      }} className="flex gap-4 p-2 items-center hover:bg-slate-100">
                        <button className="flex gap-4 p-2 items-center">
                          <Tb2Fa/>
                          Enable 2FA
                        </button>
                      </li>
                      {permissions.users?.edit && record._id.toString() !== userData._id.toString() && (
                          <li
                              className="flex gap-4 p-2 items-center hover:bg-slate-100"
                              onClick={() => {
                                navigate(`/user/edit/${record._id}`);
                              }}
                          >
                            <BiSolidEditAlt className=" text-lg" />
                            <p>edit</p>
                          </li>
                      )}
                    </motion.ul>
                  ) : null}
                </span>
              </span>

              {permissions.users.delete && record._id.toString() !== userData._id.toString() && (
                  <span>
                  <MdDelete
                      className="text-lg"
                      onClick={() => {
                        SetSelectedRow(record._id);
                        SetSelectedRowInfo({
                          ...selectedRowInfo,
                          name: record.name,
                          date: record.supplyDate,
                        });
                        setShowmodal(!showmodal);
                      }}
                  />
                </span>
              )}
            </div>
          </>
        );
      },
    },
  ];

  return (
    <>
      <ListContainer
        title={"Users list"}
        subTitle={"Manage your users"}
        navLinktext={"add/user"}
        navtext={"Add new User"}
        isAllowed={permissions.users?.create}
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
                <DeleteFooter key={"actions"} isDeleting={isDeleting}
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
                Are you sure you want to User with 
              </p>
              <li className=" text-lg">{`Name: ${selectedRowInfo.name}`}</li>
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
              <Modal
                  open={show2fa}
                  destroyOnClose
                  onOk={() => verify2FactorAuth(twoFA)}
                  onCancel={() => setShow2fa(!show2fa)}
                  okButtonProps={{className: "bg-blue-500"}}
                  cancelButtonProps={{className: "bg-red-500 text-white"}}
              >
                <div>
                    <p>Scan the QR code below with your Google Authenticator app</p>
                    <div className="flex justify-center">
                        <img src={qrcode} alt="qr code"/>
                    </div>
                </div>
                <div>
                  <input
                      type="number"
                      name="code"
                      id="code"
                      placeholder="Enter the 6 digit code from the app"
                      className="w-full border p-2 rounded mt-2 focus:outline-none"
                      onChange={(e) => setTwoFA(prevState => ({...prevState, code: e.target.value}))}
                      onWheelCapture={(e) => e.target.blur()}
                  />
                </div>
              </Modal>
            </div>
          </>
        }
      />
    </>
  );
};
export default UsersListPage;
