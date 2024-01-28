import React,{useState} from "react";
import { Modal } from "antd";
import { PiPlus,PiCaretLeftLight } from "react-icons/pi"
import { useNavigate } from "react-router-dom";

const ListPopupContainerHeader = ({ title, subTitle, navtext }) => {
    const navigate = useNavigate();
    const[showmodal,setShowmodal]=useState(false);

    return (
        <>
         <PiCaretLeftLight className="mb-1" onClick={()=>navigate(-1)}/>
            <div className="sm:flex sm:justify-between sm:items-center mb-9">
                <div className="text-start">

                    <h4 className=" text-[18px] font-bold">{title}</h4>
                    <h6 className="text-[14px] ">{subTitle}</h6>

                </div>
                <div className="py-[10px] px-6 rounded bg-amber-500 flex items-center gap-3" onClick={() => setShowmodal(!showmodal)} >
                    <PiPlus className="text-white text-2xl" />
                    <button type="button" className=" bg-transparent text-white text-center" >{navtext}</button>
                </div>
                <Modal

open={showmodal}
onOk={''}
onCancel={() => setShowmodal(!showmodal)}
destroyOnClose
footer={[
    <span key="actions" className=" flex w-full justify-center gap-4 text-base text-white">
        <button key="back" className=" bg-green-400 p-2 rounded-lg" onClick={''}>
            Confirm
        </button>
        <button key="submit" className=" bg-red-400 p-2 rounded-lg" type="primary" onClick={() => setShowmodal(!showmodal)}>
            Cancel
        </button>
    </span>
]}

>

<h2 className="modal-title text-center font-bold text-xl">Confirm Delete</h2>
<p className="text-center text-lg">{`Are you sure you want to delete `}.</p>
</Modal>
            </div>
        </>
    )

}
export default ListPopupContainerHeader;