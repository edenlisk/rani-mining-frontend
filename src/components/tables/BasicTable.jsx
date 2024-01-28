import { Input, Modal, Table } from "antd";
import mData from "../../MOCK_DATA.json"
import { PiMagnifyingGlassDuotone,PiDotsThreeVerticalBold,PiClipboardDuotone,PiTrashFill } from "react-icons/pi";
import {BiSolidFilePdf} from "react-icons/bi"
import {BsCardList} from "react-icons/bs"
import {HiOutlinePrinter} from "react-icons/hi"
import { motion } from "framer-motion";
import { useState } from "react";
import "../../antd-tailwind.css"

const BasicTable = () => {
    const[searchText,SetSearchText]=useState("");
    const[showActions,SetShowActions]=useState(false);
    const[selectedRow,SetSelectedRow]=useState(null);
    const [showmodal,setShowmodal]=useState(false);

    function transformDataToObjects(data) {
        const transformedArray = data.map(item => {
            const obj = {
                id: item.id,
                product_name: item.product_name,
                date: item.date,
                customer: item.customer,
                total: item.total,
                paid: item.paid,
                status: item.status,
            };
            return obj;

        });
        return transformedArray
    }
    const handleDelete = (id) => {
        SetShowActions(!showActions);
        SetSelectedRow(id)
      };

    const[dataz,SetDataz]=useState(transformDataToObjects(mData));
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
            sorter: (a, b) => a.product_name.localeCompare(b.product_name),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => a.date.localeCompare(b.date),
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
            sorter: (a, b) => a.customer.localeCompare(b.customer),
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            sorter: (a, b) => a.total.localeCompare(b.total),
        },
        {
            title: 'Paid',
            dataIndex: 'paid',
            key: 'paid',
            sorter: (a, b) => a.paid.localeCompare(b.paid),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) =>{
                let color =( text === 'received') ? 'bg-green-500' :( (text === 'ordered') ? 'bg-amber-500' : 'bg-red-500');
           return( <p className={` px-3 text-justify py-1 ${color} w-fit text-white rounded`}>{text}</p>)},
           sorter: (a, b) => a.status.localeCompare(b.status),
           filteredValue:[searchText],
           onFilter:(value,record)=>{
            return (
                String(record.id).toLowerCase().includes(value.toLowerCase())||
                String(record.product_name).toLowerCase().includes(value.toLowerCase())||
                String(record.date).toLowerCase().includes(value.toLowerCase())||
                String(record.customer).toLowerCase().includes(value.toLowerCase())||
                String(record.total).toLowerCase().includes(value.toLowerCase())||
                String(record.paid).toLowerCase().includes(value.toLowerCase())||
                String(record.status).toLowerCase().includes(value.toLowerCase())
                )
           },


        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render:(_,record)=>{
                return(
                    <>
                    <div className="flex items-center gap-1">
                    <span className="relative">
                    <PiDotsThreeVerticalBold onClick={() => handleDelete(record.id)}/>
                  {selectedRow === record.id &&(  
                  <motion.ul animate={showActions?{opacity:1,x:-10,display:"block"}:{opacity:0,x:0,display:"none",}} className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}>
                   <li className="flex gap-2 p-2 items-center hover:bg-slate-100" onClick={()=>{
                SetShowActions(!showActions)}}>
                    <PiClipboardDuotone/>
                    <p>shedule</p>
                   </li>
                   <li className="flex gap-2 p-2 items-center hover:bg-slate-100" onClick={()=>{
                SetShowActions(!showActions)}}>
                    <PiClipboardDuotone/>
                    <p>shedule</p>
                   </li>
                   <li className="flex gap-2 p-2 items-center hover:bg-slate-100" onClick={()=>{
                SetShowActions(!showActions)}}>
                    <PiClipboardDuotone/>
                    <p>shedule</p>
                   </li>
                   <li className="flex gap-2 p-2 items-center hover:bg-slate-100" onClick={()=>{
                SetShowActions(!showActions)}}>
                    <PiClipboardDuotone/>
                    <p>shedule</p>
                   </li>
                    </motion.ul>)}
                    </span>

                    <span>
                        <PiTrashFill onClick={()=>{setShowmodal(!showmodal);
                        SetSelectedRow(record.customer)}}/>
                      
                    
                    </span>
                    </div>

                 
                    </>
                )
            }
        },
    ]

    return (
        <>
          <Modal
                    
                     open={showmodal}
                         onOk={()=>setShowmodal(!showmodal)}
                     onCancel={()=>setShowmodal(!showmodal)}
                     destroyOnClose
                     footer={[
                        <span key="actions" className=" flex w-full justify-center gap-4 text-base text-white">
                             <button key="back" className=" bg-green-400 p-2 rounded-lg" onClick={()=>setShowmodal(!showmodal)}>
                          Confirm
                        </button>
                        <button key="submit" className=" bg-red-400 p-2 rounded-lg" type="primary" onClick={()=>setShowmodal(!showmodal)}>
                          Cancel
                        </button>
                        </span>
            ]}
            
      >
        
        <h2 className="modal-title text-center font-bold text-xl">Confirm Delete</h2>
        <p className="text-center text-lg">{`Are you sure you want to delete ${selectedRow}`}.</p>
                    </Modal>
        <div className=" w-full overflow-x-auto h-full">
            <div className="w-full flex flex-col  sm:flex-row justify-between items-center mb-4 gap-3">
            <span className="max-w-[220px] border rounded flex items-center p-1 justify-between gap-2">
          <PiMagnifyingGlassDuotone className="h-4 w-4"/>
          <input type="text" className=" w-full focus:outline-none" name="tableFilter" id="tableFilter" placeholder="Search..." onChange={(e)=>SetSearchText(e.target.value)} />
          </span>

          <span className="flex w-fit justify-evenly items-center gap-6 pr-1">
            <BiSolidFilePdf className=" text-2xl"/>
            <BsCardList className=" text-2xl"/>
            <HiOutlinePrinter className=" text-2xl"/>
          </span>
            </div>
            <Table className=" w-full" key={dataz.id}
                dataSource={dataz}
                columns={columns}
                rowKey="id"
            />
           
        </div>
        </>
    )
}
export default BasicTable;