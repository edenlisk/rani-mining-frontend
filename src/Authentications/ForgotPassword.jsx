import React, { useState } from "react";
import {PiEnvelopeBold} from "react-icons/pi";


const ForgotPasswordPage=()=>{
    const[show,setShow]=useState(false);
    const [user, setUser] = useState({ email: ""})
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
                <h2 className=" text-xl font-bold">Forgot password?</h2>
                <p>Don’t warry! it happens. Please enter the address associated with your account.</p>
            <form action="" className="flex flex-col justify-center gap-3" onSubmit={handleSubmit}>
               <span>
               <p className="mb-2">Email</p>
               <span className="flex items-center w-full p-2 rounded border justify-between">
                <input type="email" name="email" id="email" className=" focus:outline-none w-full" placeholder="Enter your Email"onChange={handleChange} />
                <PiEnvelopeBold className="text-[#a0aaba]"/>
                </span>
               </span>
               <button type="submit" className="w-full px-2 py-3 bg-amber-200 rounded">Submit</button>
            </form>
            </div>

            <div className=" col-span-3 sm:col-span-3 lg:col-span-4 hidden sm:block h-full bg-origin-border bg-center bg-no-repeat bg-cover bg-[url('https://img.freepik.com/free-vector/landscape-coal-mining-scene-with-crane-trucks_1308-55217.jpg?w=2000')]"></div>
            </div></>
    )
}
export default ForgotPasswordPage;