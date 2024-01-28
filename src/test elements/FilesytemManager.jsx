import React from "react";
import { BsFolderFill } from "react-icons/bs";
import { FaFolderOpen,FaRegFile } from "react-icons/fa";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";

const FilesytemManger = () => {
  return (
    <div className="h-full bg-white w-80 p-2">
      <div className="  grid grid-cols-1 items-centerrounded-md">
        <div className=" hover:bg-red-400 active:bg-red-200 h-[29px] rounded-md ">
          <div className="flex items-center h-full gap-2 rounded-md rounded-l-none rounded-bl-none">
            <FiChevronRight className="" />
            <BsFolderFill className=" text-lg" />
            <p className="">assets</p>
            {/* FULL FOLDER CLOSE WITH NAME CONTAINER WITH NO LEFT BORDER */}
          </div>
        </div>

        <div className="flex items-center h-full gap-2 rounded-md rounded-l-none rounded-bl-none">
          <FiChevronDown className="" />
          <FaFolderOpen className=" text-lg" />
          <p className="">pages</p>
          {/* FULL FOLDER OPEN WITH NAME CONTAINER WITH NO LEFT BORDER */}
        </div>

        <div className=" hover:bg-red-400 active:bg-red-200 h-[29px] rounded-md pl-[9px]">
          <div className="flex items-center h-full gap-2 rounded-md rounded-l-none rounded-bl-none border-l">
            <FiChevronRight className="" />
            <BsFolderFill className=" text-lg" />
            <p className="">assets</p>
          </div>
          {/* FULL FOLDER CLOSE WITH NAME CONTAINER WITH LEFT BORDER */}
        </div>

        <div className=" hover:bg-red-400 active:bg-red-200 h-[29px] rounded-md pl-[9px] bg-purple-200">
          <div className="flex items-center h-full gap-2 rounded-md rounded-l-none rounded-bl-none border-l">

         <span className="pl-4"> <FaRegFile className=" text-lg" /></span>
          <p className="">assets</p>
          </div>
          {/* FULL FOLDER CLOSE WITH NAME CONTAINER WITH LEFT BORDER */}
        </div>
      </div>
      <p className=" my-4">clear one elements only</p>



        <div className="flex h-[36px] items-center rounded-md hover:bg-slate-200 hover:text-gray-900">
            <span className="h-full px-1 items-center border-gray-400 flex">
            <FiChevronDown className=" " />
            </span>
        <span className=" col-span-full flex items-center gap-1 px-2 w-full h-full">
        <BsFolderFill className=" " />
            <p className="w-full">assets</p>
        </span>
           
        </div>


        <div className="flex h-[36px] items-center rounded-md hover:bg-slate-200 hover:text-gray-900">
            <span className="h-full px-[6px] border-r border-gray-400"></span>
            <span className="h-full flex items-center justify-center pl-[2px] border-">
            <FiChevronRight className=" w-fit" />
            </span>
       
        <span className=" col-span-full flex items-center gap-1 px-2 w-full h-full">
        <BsFolderFill className=" text-lg" />
            <p className="w-full">reports</p>
        </span>
           
        </div>
        <div className="flex h-[36px] items-center rounded-md hover:bg-slate-200 hover:text-gray-900">
            <span className="h-full px-[6px] border-r border-gray-400"></span>
            <span className="h-full flex items-center justify-center pl-[2px]">
            <FiChevronDown className=" w-fit" />
            </span>
       
        <span className=" col-span-full flex items-center gap-1 px-2 w-full h-full">
        <BsFolderFill className=" text-lg" />
            <p className="w-full">2023</p>
        </span>
           
        </div>

        <div className="flex h-[36px] items-center rounded-md hover:bg-slate-200 hover:text-gray-900">
            <span className="h-full px-[6px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full flex items-center justify-center ">
            <FiChevronDown className=" w-fit" />
            </span>
       
        <span className=" col-span-full flex items-center gap-1 px-2 w-full h-full">
        <BsFolderFill className=" text-lg" />
            <p className="w-full">january</p>
        </span>
           
        </div>
        <div className="flex h-[36px] items-center rounded-md hover:bg-slate-200 hover:text-gray-900">
            <span className="h-full px-[6px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full flex  items-center justify-center  border-gray-400 ">
            <FiChevronDown className=" w-fit" />
            </span>
       
        <span className=" col-span-full flex items-center gap-1 px-2 w-full h-full">
        <BsFolderFill className=" text-lg" />
            <p className="w-full">january report term 1</p>
        </span>
           
        </div>
        <div className="flex h-[36px] items-center rounded-md hover:bg-slate-200 hover:text-gray-900">
            <span className="h-full px-[6px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full flex px-2 items-center justify-center  border-gray-400 ">
            {/* <FiChevronDown className=" w-fit" /> */}
            </span>
       
        <span className=" col-span-full flex items-center gap-1 px-2 w-full h-full">
        <FaRegFile className=" text-lg" />
            <p className="w-full">january report 1</p>
        </span>
           
        </div>
        <div className="flex h-[36px] items-center rounded-md hover:bg-slate-200 hover:text-gray-900">
            <span className="h-full px-[6px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full flex px-2 items-center justify-center  border-gray-400 ">
            {/* <FiChevronDown className=" w-fit" /> */}
            </span>
       
        <span className=" col-span-full flex items-center gap-1 px-2 w-full h-full">
        <FaRegFile className=" text-lg" />
            <p className="w-full">january report 1</p>
        </span>
           
        </div>
        <div className="flex h-[36px] items-center rounded-md hover:bg-slate-200 hover:text-gray-900">
            <span className="h-full px-[6px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full flex px-2 items-center justify-center  border-gray-400 ">
            {/* <FiChevronDown className=" w-fit" /> */}
            </span>
       
        <span className=" col-span-full flex items-center gap-1 px-2 w-full h-full">
        <FaRegFile className=" text-lg" />
            <p className="w-full">january report 1</p>
        </span>
           
        </div>
        <div className="flex h-[36px] items-center rounded-md hover:bg-slate-200 hover:text-gray-900">
            <span className="h-full px-[6px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full flex px-2 items-center justify-center ">
            {/* <FiChevronDown className=" w-fit" /> */}
            </span>
       
        <span className=" col-span-full flex items-center gap-1 px-2 w-full h-full">
        <FaRegFile className=" text-lg" />
            <p className="w-full">january report 2</p>
        </span>
           
        </div>
        <div className="flex h-[36px] items-center rounded-md hover:bg-slate-200 hover:text-gray-900">
            <span className="h-full px-[6px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full px-[4.7px] border-r border-gray-400"></span>
            <span className="h-full grid grid-cols-3 "></span>
            <span className="h-full flex px-2 items-center justify-center">
            {/* <FiChevronDown className=" w-fit" /> */}
            </span>
       
        <span className=" col-span-full flex items-center gap-1 px-2 w-full h-full">
        <FaRegFile className=" text-lg" />
            <p className="w-full">february report</p>
        </span>
           
        </div>

        <div className="flex h-[36px] items-center rounded-md hover:bg-slate-200 hover:text-gray-900">
            <span className="h-full px-[6px] border-r border-gray-400"></span>
            <span className="h-full flex items-center justify-center pl-[2px] border-">
            <FiChevronRight className=" w-fit" />
            </span>
       
        <span className=" col-span-full flex items-center gap-1 px-2 w-full h-full">
        <BsFolderFill className=" text-lg" />
            <p className="w-full">assets</p>
        </span>
           
        </div>
        <button className="p-2 bg-orange-700" onClick={()=>window.print()}>yoola print me</button>

    </div>
  );
};
export default FilesytemManger;
