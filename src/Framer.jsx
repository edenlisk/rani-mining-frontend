import React, { useState } from "react";
import dayjs from 'dayjs'
import { motion } from "framer-motion";
import { DatePicker, Space } from 'antd';

const Framer=()=>{

    const [open,setOpen]=useState(false);
    const onChange = (date) => {
      };
    return(
        <>
        <div className="flex">
  <div className="w-1/4"></div> 
  <div className="grid grid-cols-4">
  
    <div className="bg-gray-200 p-2">Header 1</div>
    <div className="bg-gray-200 p-2">Header 2</div>
    <div className="bg-gray-200 p-2">Header 3</div>
    <div className="bg-gray-200 p-2">Header 4</div>
    <div className="p-2">Data 1</div>
    <div className="p-2">Data 2</div>
    <div className="p-2">Data 3</div>
    <div className="p-2">Data 4</div>
  </div>
</div>
        </>
    )
}
export default Framer; 