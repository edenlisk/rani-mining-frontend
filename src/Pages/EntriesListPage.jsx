import React, { useState } from "react";
import dayjs from "dayjs";
import { Input, Modal, Table } from "antd";
import { motion } from "framer-motion";
import { PiMagnifyingGlassDuotone, PiDotsThreeVerticalBold, PiClipboardDuotone,PiEyeDuotone, PiTrashFill, PiPencilCircleDuotone } from "react-icons/pi";
import { BiSolidFilePdf } from "react-icons/bi"
import { BsCardList } from "react-icons/bs"
import { HiOutlinePrinter } from "react-icons/hi"
import SalesListContainer from "../components/Listcomponents/ListContainer";
import { useGetAllEntriesQuery,useDeleteEntryMutation, useDeleteSupplierMutation } from "../states/apislice";
import { useNavigate } from "react-router-dom";

const EntriesListPage = () => {
    let dataz = [];
    const { data, isLoading, isSuccess, isError, error } = useGetAllEntriesQuery();
    const[deleteBuyer,{isLoading:isDeleting,isSuccess:isdone,isError:isproblem}]=useDeleteEntryMutation();

    const navigate=useNavigate();
    const [searchText, SetSearchText] = useState("");
    const [showActions, SetShowActions] = useState(false);
    const [selectedRow, SetSelectedRow] = useState(null);
    const [model, Setmodel] = useState(null);
    const [showmodal, setShowmodal] = useState(false);

    if (isSuccess) {
        const { data: dt } = data;
        const { entries: entrz } = dt;
        dataz = entrz;
    };
    const handleActions = (id) => {
        SetShowActions(!showActions);
        SetSelectedRow(id)
    };
    const handleDelete = async () => {
        const entryId= selectedRow;
        await useDeleteEntryMutation({entryId});
        setShowmodal(!showmodal);
    
    };
    const columns = [
        {
            title: 'companyName',
            dataIndex: 'companyName',
            key: 'companyName',
            sorter: (a, b) => a.companyName.localeCompare(b.companyName),
        },
        {
            title: 'TINNumber',
            dataIndex: 'TINNumber',
            key: 'TINNumber',
            sorter: (a, b) => a.TINNumber.localeCompare(b.TINNumber),
        },
        {
            title: 'mineralType',
            dataIndex: 'mineralType',
            key: 'mineralType',
            sorter: (a, b) => a.mineralType.localeCompare(b.mineralType),
        },
        {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            render:(text)=>{
                // "in stock", "fully exported", "rejected", "non-sell agreement", "partially exported"
                let color =( text === 'in stock') ? 'bg-green-500' :( (text === 'ordered') ? 'bg-amber-500' : 'bg-red-500');
                return(
                    <p className={` px-3 py-1 ${color} w-fit text-white rounded`}>{text}</p>
                )
            }
        },
        {
            title: 'supplyDate',
            dataIndex: 'supplyDate',
            key: 'supplyDate',
            sorter: (a, b) => a.supplyDate.localeCompare(b.supplyDate),
            render:(text)=>{
                return(
                    <>
                    <p>{dayjs(text).format('MMM/DD/YYYY')}</p>
                    </>
                )
            }
        },

        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => {
                return (
                    <>
                        <div className="flex items-center gap-1">
                            <span className="relative">
                                <PiDotsThreeVerticalBold onClick={() => handleActions(record._id)} />
                                {selectedRow === record._id && (
                                    <motion.ul animate={showActions ? { opacity: 1, x: -10, display: "block" } : { opacity: 0, x: 0, display: "none", }} className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}>
                                       
                                        <li className="flex gap-2 p-2 items-center hover:bg-slate-100" onClick={() => {navigate(`/buyer/details/${record._id}`)}}>
                                            <PiEyeDuotone className=" text-xl" />
                                            <p>details</p>
                                        </li>
                                        <li className="flex gap-2 p-2 items-center hover:bg-slate-100" onClick={() => {{navigate(`/edit/buyer/${record._id}`)} }}>
                                            <PiPencilCircleDuotone className=" text-xl" />
                                            <p>edit</p>
                                        </li>
                                        <li className="flex gap-2 p-2 items-center hover:bg-slate-100" onClick={() => {
                                            SetShowActions(!showActions)
                                        }}>
                                            <PiClipboardDuotone className=" text-xl" />
                                            <p>shedule</p>
                                        </li>
                                    </motion.ul>)}
                            </span>

                            <span>
                                <PiTrashFill onClick={() => {
                                    SetSelectedRow(record._id);
                                    setShowmodal(!showmodal);
                                }} />


                            </span>
                        </div>


                    </>
                )
            }
        },
    ]

    return (
        <>
            <SalesListContainer title={'Entries list'}
                subTitle={'Manage your Entries'}
                navLinktext={'entry/storekeeper'}
                navtext={'Add new Entry'}
                table={
                    <>
                        <Modal

                            open={showmodal}
                            onOk={() => handleDelete(selectedRow)}
                            onCancel={() => setShowmodal(!showmodal)}
                            destroyOnClose
                            
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

                } />
        </>
    )
}
export default EntriesListPage;