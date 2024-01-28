import React from "react";
import { ImSpinner2 } from "react-icons/im";

const DeleteFooter = ({
  isDeleting,
  defText,
  dsText,
  handleCancel,
  handleDelete,
}) => {
  return (
    <>
      <span
        key="actions"
        className=" grid sm:flex w-full justify-start items-center gap-4 py-4 text-base text-white  mt-10 border-t"
      >
        {isDeleting ? (
          <button
            key="back"
            className=" bg-punch-200 flex items-center gap-2 py-[7.5px] px-[20px] text-punch-600  rounded cursor-not-allowed"
            disabled={isDeleting}
          >
            <ImSpinner2 className="h-[18px] w-[18px] animate-spin text-punch-600 " />
            {dsText}
          </button>
        ) : (
          <button
            key="submit"
            className=" bg-punch-500 py-[7.5px] px-[20px] hover:bg-punch-600 rounded"
            onClick={handleDelete}
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
export default DeleteFooter;
