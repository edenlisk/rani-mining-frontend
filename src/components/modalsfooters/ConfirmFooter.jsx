import React from "react";
import { ImSpinner2 } from "react-icons/im";

const ConfirmFooter = ({
  isSending,
  defText,
  dsText,
  handleCancel,
  handleConfirm,
}) => {
  return (
    <>
      <span
        key="actions"
        className=" grid sm:flex w-full justify-start items-center gap-4 py-4 text-base text-white  mt-10 border-t"
      >
        {isSending ? (
          <button
            key="back"
            className=" bg-green-200 flex items-center gap-2 py-[7.5px] px-[20px] text-green-600  rounded cursor-not-allowed"
            disabled={isSending}
          >
            <ImSpinner2 className="h-[18px] w-[18px] animate-spin text-green-600 " />
            {dsText}
          </button>
        ) : (
          <button
            key="submit"
            className=" bg-green-500 py-[7.5px] px-[20px] hover:bg-green-600 rounded"
            onClick={handleConfirm}
          >
            {defText}
          </button>
        )}
        <button
          key="cancel"
          className="  border border-shark-800 hover:border-shark-700 hover:text-shark-700 hover:bg-shark-100 text-shark-800 py-[7.5px] px-[20px] rounded transition-all duration-300"
          type="button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </span>
    </>
  );
};
export default ConfirmFooter;
