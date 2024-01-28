import React, { useState, useRef, useEffect } from "react";
import { Input, Modal, Table } from "antd";
import { motion } from "framer-motion";
import {
  PiMagnifyingGlassDuotone,
  PiDotsThreeVerticalBold,
  PiClipboardDuotone,
  PiEyeDuotone,
  PiTrashFill,
  PiPencilCircleDuotone,
} from "react-icons/pi";
import { BiSolidFilePdf, BiSolidEditAlt } from "react-icons/bi";
import { BsCardList } from "react-icons/bs";
import { FaListAlt } from "react-icons/fa";
import { HiOutlinePrinter } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { RiFileEditFill } from "react-icons/ri";
import SalesListContainer from "../components/Listcomponents/ListContainer";
import {
  useGetAllBuyersQuery,
  useDeleteBuyerMutation,
} from "../states/apislice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DeleteFooter from "../components/modalsfooters/DeleteFooter";

const BuyersListPage = () => {
  const [dataz, setDataz] = useState([]);
  const { permissions } = useSelector(state => state.persistedReducer?.global);
  const { data, isLoading, isSuccess, isError, error } = useGetAllBuyersQuery();
  const [
    deleteBuyer,
    { isLoading: isDeleting, isSuccess: isdone, isError: isproblem },
  ] = useDeleteBuyerMutation();

  const navigate = useNavigate();
  const [searchText, SetSearchText] = useState("");
  const [showActions, SetShowActions] = useState(false);
  const [selectedRow, SetSelectedRow] = useState(null);
  const [showmodal, setShowmodal] = useState(false);
  const [selectedRowInfo, SetSelectedRowInfo] = useState({
    name: "",
    address: "",
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

  useEffect(() => {
    if (isSuccess) {
      const { buyers } = data.data;
      setDataz(buyers);
    }
  }, [isSuccess, data]);

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
    const buyerId = selectedRow;
    await deleteBuyer({ buyerId });
    setShowmodal(!showmodal);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      sorter: (a, b) => a.country.localeCompare(b.country),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
      sorter: (a, b) => a.destination.localeCompare(b.destination),
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
                      {permissions.buyers.edit ? (
                        <li
                          className="flex gap-4 p-2 items-center hover:bg-slate-100"
                          onClick={() => {
                            {
                              navigate(`/edit/buyer/${record._id}`);
                            }
                          }}
                        >
                          <BiSolidEditAlt className=" text-lg" />
                          <p>edit</p>
                        </li>
                      ) : null}
                      <li
                        className="flex gap-4 p-2 items-center hover:bg-slate-100"
                        onClick={() => {
                          navigate(`/buyer/details/${record._id}`);
                        }}
                      >
                        <FaListAlt className=" text-lg" />
                        <p>details</p>
                      </li>
                    </motion.ul>
                  ) : null}
                </span>
              </span>

              {permissions.buyers.delete ? (
                <span>
                  <MdDelete
                    className="text-lg"
                    onClick={() => {
                      SetSelectedRow(record._id);
                      SetSelectedRowInfo({
                        ...selectedRowInfo,
                        name: record.name,
                        address: record.address,
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
  ];

  return (
    <>
      <SalesListContainer
        title={"Buyers list"}
        subTitle={"Manage your buyers"}
        navLinktext={"add/buyer"}
        navtext={"Add new Buyer"}
        isAllowed={permissions.buyers.create}
        table={
          <>
            {/* <Modal

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
                            <p className="text-center text-lg">{`Are you sure you want to delete ${selectedRow}`}.</p>
                        </Modal> */}

            {/* ////////////// */}

            <Modal
              open={showmodal}
              onOk={() => handleDelete(selectedRow)}
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
                Are you sure you want to delete buyer with:
              </p>
              <li className=" text-lg">{`Name: ${selectedRowInfo.name}`}</li>
              <li className=" text-lg">{`Address: ${selectedRowInfo.address}`}</li>
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
                loading={isLoading}
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
export default BuyersListPage;
