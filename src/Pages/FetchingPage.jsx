import React from "react";
import {ImSpinner9,ImSpinner2} from "react-icons/im";

const FetchingPage=()=>{

    return(
        <div className="flex h-screen w-full items-center justify-center bg-white">
            <ImSpinner2 className=" h-20 w-20 animate-spin text-gray-400"/>
        </div>
    )
}
export default FetchingPage;