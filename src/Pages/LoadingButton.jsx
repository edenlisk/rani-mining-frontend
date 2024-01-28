import {ImSpinner2} from "react-icons/im";
import React from "react";


const LoadingButton = ({name, isProcessing, onClickFunction}) => {
    return (
        <div className=" self-end flex gap-2 flex-col sm:flex-row w-full justify-start sm:gap-2 items-start action-buttons">
            {isProcessing ? (
                <button
                    className="px-2 flex gap-1 items-center justify-start py-1 bg-orange-200 rounded-md text-gray-500"
                    type="submit"
                    disabled={true}
                >
                    <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500" />
                    Sending
                </button>
            ) : (
                <button className="bg-custom_blue-500 hover:bg-custom_blue-600 text-white shadow-md shadow-[#A6A6A6] py-[7px] px-[15px] rounded-md" onClick={onClickFunction} type="button">
                    {name}
                </button>
            )}
        </div>
    )
}

export default LoadingButton;