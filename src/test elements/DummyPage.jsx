import React, { useState, useEffect } from 'react';
import { ImSpinner2 } from "react-icons/im";
import {Modal} from "antd";

const StyleTestPage = () => {

const[showmodal,setShowmodal]=useState(false)
const[isDeleting,setIsDeleting]=useState(false)
  return (
    <div className=' bg-white w-full h-full flex flex-col items-center gap-3'>
      <p>weee</p>
    <button className='py-2 px-4 rounded text-white bg-custom_blue-500 w-fit ' onClick={() => setShowmodal(!showmodal)}> Default</button>
    <button className='py-2 px-4 rounded text-custom_blue-600 bg-custom_blue-200 w-fit '> Disabled</button>
    <button className='py-2 px-4 rounded text-custom_blue-600 bg-gradient-to-r from-custom_blue-100 to-custom_blue-300 w-fit '> Disabled gradient</button>
    <Modal
              open={showmodal}
              onOk={() => ""}
              onCancel={() => setShowmodal(!showmodal)}
              destroyOnClose
              footer={[
                <span
                key="actions"
                className=" grid sm:flex w-full justify-start gap-4 py-2 text-base text-white pl-7 mt-10 border-t"
              >
                {isDeleting ? (
                  <button
                    key="back"
                    className=" bg-punch-200 flex items-center gap-1 py-[7.5px] px-[20px] text-punch-600  rounded cursor-not-allowed"
                  >
                    <ImSpinner2 className="h-[18px] w-[18px] animate-spin text-punch-600 " />
                    Deleting
                  </button>
                ) : (
                  <button
                    key="submit"
                    className=" bg-punch-500 py-[7.5px] px-[20px] hover:bg-punch-600 rounded"
                    onClick={()=>setIsDeleting(!isDeleting)}
                  >
                    Delete
                  </button>
                )}
                <button
                  key="cancel"
                  className="  border border-shark-800 hover:border-shark-700 hover:text-shark-700 hover:bg-shark-100 text-shark-800 py-[7.5px] px-[20px] rounded transition-all duration-300"
                  type="button"
                  onClick={() => setShowmodal(!showmodal)}
                >
                  Cancel
                </button>
              </span>,
              ]}
            >
              <h2 className="modal-title text-center font-bold text-xl">
                Confirm Delete
              </h2>
              <p className="text-center text-lg">
                {`Are you sure you want to delete `}
                .
              </p>
            </Modal>
            {/* TO BE USED IN ALL modals */}
            <span
                key="actions"
                className=" grid sm:flex w-full justify-start items-center gap-4 py-2 text-base text-white pl-7 mt-10 border-t"
              >
                {isDeleting ? (
                  <button
                    key="back"
                    className=" bg-punch-200 flex items-center gap-2 py-[7.5px] px-[20px] text-punch-600  rounded cursor-not-allowed"
                  >
                    <ImSpinner2 className="h-[18px] w-[18px] animate-spin text-punch-600 " />
                    Deleting
                  </button>
                ) : (
                  <button
                    key="submit"
                    className=" bg-punch-500 py-[7.5px] px-[20px] hover:bg-punch-600 rounded"
                    onClick={"handleDelete"}
                  >
                    Delete
                  </button>
                )}
                <button
                  key="cancel"
                  className="  border border-shark-800 hover:border-shark-700 hover:text-shark-700 hover:bg-shark-100 text-shark-800 py-[7.5px] px-[20px] rounded transition-all duration-300"
                  type="button"
                  onClick={"handleCancel"}
                >
                  Cancel
                </button>
              </span>

              <button className='py-1 px-4 rounded-full text-custom_blue-600 font-semibold bg-custom_blue-200 border-custom_blue-500 border-[0.1px] w-fit '> Disabled gradient</button>
    </div>
    
  );
};

export default StyleTestPage;
