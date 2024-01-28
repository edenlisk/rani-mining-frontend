import React, { useState } from "react";
import {PiEyeFill,PiEyeSlashFill } from "react-icons/pi";


const ResetPasswordPage=()=>{
    const[show,setShow]=useState(false);
    const [user, setUser] = useState({password: "",confirmPassword:"" })
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    };
    return(
        <>
        <div className="grid grid-cols-6 h-full">
            <div className="col-span-6 sm:col-span-3 lg:col-span-2 h-full gap-3 flex flex-col bg-white p-3">
                <h2 className=" text-xl font-bold">Reset Password</h2>
                
            <form action="" className="flex flex-col justify-center gap-3" onSubmit={handleSubmit}>
               <span>
               <p className="mb-2">Password</p>
               <span className="flex items-center w-full p-2 rounded border justify-between">
                <input type={show?"text":"password" } required name="password" id="password" className=" focus:outline-none w-full" placeholder="Enter your Password" />
                {show?( <PiEyeSlashFill className="text-[#a0aaba]" onClick={()=>setShow(!show)}/>) :( <PiEyeFill className="text-[#a0aaba]" onClick={()=>setShow(!show)}/>)}
                </span>
               </span>
               <span>
               <p className="mb-2">Confirm Password</p>
               <span className="flex items-center w-full p-2 rounded border justify-between">
                <input type={show?"text":"password" } required name="confirmPassword" id="confirmPassword" className=" focus:outline-none w-full" placeholder="Enter your Password" />
                {show?( <PiEyeSlashFill className="text-[#a0aaba]" onClick={()=>setShow(!show)}/>) :( <PiEyeFill className="text-[#a0aaba]" onClick={()=>setShow(!show)}/>)}
                </span>
               </span>
               <button type="submit" className="w-full px-2 py-3 bg-amber-200 rounded">Reset Password</button>
            </form>
            </div>

            <div className=" col-span-3 sm:col-span-3 lg:col-span-4 hidden sm:block h-full bg-origin-border bg-center bg-no-repeat bg-cover bg-[url('https://img.freepik.com/free-vector/landscape-coal-mining-scene-with-crane-trucks_1308-55217.jpg?w=2000')]"></div>
            </div></>
    )
}
export default ResetPasswordPage;