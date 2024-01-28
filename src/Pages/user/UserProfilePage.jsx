import React, { useState } from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import {PiEyeFill,PiEyeSlashFill } from "react-icons/pi";


const UserProfilePage=()=>{
    const[show,setShow]=useState(false);
    const [userData,setUserData]=useState({firstName:"",lastName:"",email:"",phone:"",userName:"",password:""});

    const handleChange=(e)=>{
        setUserData((prevUser)=>({...prevUser,[e.target.name]:e.target.value}));
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        setUserData({firstName:"",lastName:"",email:"",phone:"",userName:"",password:""});
    }
    const handleCancel=()=>{
        setUserData({firstName:"",lastName:"",email:"",phone:"",userName:"",password:""});
    }

    return (
        <>
        <ActionsPagesContainer 
        title={'Profile'}
        subTitle={'User Profile'}
        actionsContainer={
            <div className="flex flex-col gap-3 w-full">
                <div className="w-full flex flex-col relative">
                    <div className="w-full bg-orange-500 h-20"></div>
                    {/* <div className=" w-44 h-24 rounded-full border-8 -top-2 relative border-b-gray-100 bg-origin-border bg-center bg-no-repeat bg-cover bg-[url('https://img.freepik.com/free-vector/landscape-coal-mining-scene-with-crane-trucks_1308-55217.jpg?w=2000')]"></div> */}
                    <div className="w-full sm:flex h-20">
                        <div className="w-full flex gap-1">
                        <div className=" rounded-[50%] w-24 h-full -top-12 border-8 border-b-gray-200 bg-origin-border bg-center bg-no-repeat bg-cover bg-[url('https://img.freepik.com/free-vector/landscape-coal-mining-scene-with-crane-trucks_1308-55217.jpg?w=2000')]"></div>
                        <span className="w-full"> 
                            <p>william jose</p>
                            <p>Update photo and profile</p>
                        </span>
                        </div>
                        <span className="flex gap-2 items-center w-full justify-end text-white">
                            <button className="py-2 px-3 rounded-md bg-orange-300">Save</button>
                            <button className="py-2 px-3 rounded-md bg-slate-500">Cancel</button>
                        </span>
                        
                    </div>
                    
                </div>
                <form action="submit" onSubmit={handleSubmit} className=" grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4">
                    <span className=" space-y-1">
                        <p>First Name</p>
                        <input type="text" autoComplete="off" className="w-full border rounded-lg py-2 px-1 focus:outline-none" name="firstName" id="firstName" value={userData.firstName || ''} onChange={handleChange}/>
                    </span>
                    <span className=" space-y-1">
                        <p>Last Name</p>
                        <input type="text" autoComplete="off" className="w-full border rounded-lg py-2 px-1 focus:outline-none" name="lastName" id="lastName" value={userData.lastName || ''} onChange={handleChange}/>
                    </span>
                    <span className=" space-y-1">
                        <p>Email</p>
                        <input type="email" autoComplete="off" className="w-full border rounded-lg py-2 px-1 focus:outline-none" name="email" id="email" value={userData.email|| ''} onChange={handleChange}/>
                    </span>
                    <span className=" space-y-1">
                        <p>Phone</p>
                        <input type="text" autoComplete="off" className="w-full border rounded-lg py-2 px-1 focus:outline-none" name="phone" id="phone" value={userData.phone || ''} onChange={handleChange}/>
                    </span>
                    <span className=" space-y-1">
                        <p>User Name</p>
                        <input type="text" autoComplete="off" className="w-full border rounded-lg py-2 px-1 focus:outline-none" name="userName" id="userName" value={userData.userName || ''} onChange={handleChange}/>
                    </span>
                    <span className=" space-y-1">
                        <p>Password</p>
                        <span className="flex items-center w-full p-2 rounded border justify-between">
                <input type={show?"text":"password" } required name="password" id="password" className=" focus:outline-none w-full" placeholder="Enter your Password" value={userData.password || ''} onChange={handleChange} />
                {show?( <PiEyeSlashFill className="text-[#a0aaba]" onClick={()=>setShow(!show)}/>) :( <PiEyeFill className="text-[#a0aaba]" onClick={()=>setShow(!show)}/>)}
                </span>
                    </span>
                    <div className="col-span-full flex items-center gap-2 text-white">
                        <button type="submit" className="py-2 px-3 rounded-md bg-orange-300">submit</button>
                        <button className="py-2 px-3 rounded-md bg-slate-500" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        }/>
        </>
    )

};

export default UserProfilePage;