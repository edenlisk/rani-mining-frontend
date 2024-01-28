import React from "react";
import {PiCaretLeftLight } from "react-icons/pi"
import Header from "../Header";
import { useNavigate } from "react-router-dom";



const ActionsPagesContainer = ({title,subTitle,actionsContainer}) => {
    const navigate=useNavigate();
    return (
        <>
            <section className="space-y-3">
                <span>
                <PiCaretLeftLight className="mb-1" onClick={()=>navigate(-1)}/>
            <h4 className=" text-[18px] font-bold pl-1">{title}</h4>
            <h6 className="text-[14px] pl-1 ">{subTitle}</h6>
                </span>
                <div className="bg-white p-4 m-0 border rounded-lg h-fit">
                {actionsContainer}
                </div>
            </section>
        </>
    )

}
export default ActionsPagesContainer;