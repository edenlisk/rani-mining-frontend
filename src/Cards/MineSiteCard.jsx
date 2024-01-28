import React from "react";
import { MdLocationOn} from "react-icons/md";

const MineSiteCard=({name,code,lat,long})=>{

    return(
        <div className="p-2 flex flex-col gap-3 rounded-lg shadow-xl bg-gray-100">
        <div className=" grid grid-cols-2 gap-2 items-center">
            <MdLocationOn className=" text-3xl text-gray-500" />
            <p className=" justify-self-end text-md font-semibold">{name}</p>
        </div>
        <ul>
            <li className="flex gap-1 items-center">
                <p className=" font-semibold">Code:</p>
                <p>{code}</p>
            </li>
            <li className="flex gap-1 items-center">
                <p className=" font-semibold">Latitude:</p>
                <p>{lat}</p>
            </li>
            <li className="flex gap-1 items-center">
                <p className=" font-semibold">Longitude:</p>
                <p>{long}</p>
            </li>
        </ul>
    </div>
    )
}
export default MineSiteCard;