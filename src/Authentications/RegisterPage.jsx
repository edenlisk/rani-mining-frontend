import React, {useState} from "react";
import {PiEnvelopeBold, PiEyeFill, PiEyeSlashFill, PiUserBold} from "react-icons/pi";
import {AiFillPhone} from "react-icons/ai";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setName} from "../states/slice";


const RegisterPage = () => {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const [user, setUser] = useState({fullName: "", email: "", password: ""})
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(setName(user));
        if (user !== null) {
            navigate(`/products`)
        }

    };
    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    };
    return (
        <>
            <div className="grid grid-cols-6 h-full">
                <div className="col-span-6 sm:col-span-3 lg:col-span-2 h-full gap-3 flex flex-col bg-white p-3">
                    <h2 className=" text-xl font-bold">Create an account</h2>
                    {/*<p>continue where you left from</p>*/}
                    <form action="" className="flex flex-col justify-center gap-3" onSubmit={handleSubmit}>
                        <span>
                            <p className="mb-2">Full name</p>
                            <span className="flex items-center w-full p-2 rounded border justify-between">
                                <input type="text" required name="name" id="fullName"
                                       className=" focus:outline-none w-full" placeholder="Enter your Full name"
                                       onChange={(handleChange)}/>
                                <PiUserBold className="text-[#a0aaba]"/>
                            </span>
                        </span>
                        <span>
                            <p className="mb-2">Email</p>
                            <span className="flex items-center w-full p-2 rounded border justify-between">
                                <input type="email" required name="email" id="email"
                                       className=" focus:outline-none w-full" placeholder="Enter your Email"
                                       onChange={(handleChange)}/>
                                <PiEnvelopeBold className="text-[#a0aaba]"/>
                            </span>
                        </span>
                        <span>
                            <p className="mb-2">Phone Number</p>
                            <span className="flex items-center w-full p-2 rounded border justify-between">
                                <input type="text" required name="phoneNumber" id="phoneNumber"
                                       className=" focus:outline-none w-full" placeholder="Enter phone number"
                                       onChange={(handleChange)}/>
                                <AiFillPhone className="text-[#a0aaba]"/>
                            </span>
                        </span>
                        <span>
                            <p className="mb-2">Password</p>
                            <span className="flex items-center w-full p-2 rounded border justify-between">
                                <input type={show ? "text" : "password"} required name="password" id="password"
                                       className=" focus:outline-none w-full" placeholder="Enter your Password"
                                       onChange={(handleChange)}/>
                                {show ? (
                                    <PiEyeSlashFill className="text-[#a0aaba]" onClick={() => setShow(!show)}/>) : (
                                    <PiEyeFill className="text-[#a0aaba]" onClick={() => setShow(!show)}/>)}
                            </span>
                        </span>
                        <span>
                            <p className="mb-2">Confirm Password</p>
                            <span className="flex items-center w-full p-2 rounded border justify-between">
                                <input type={show ? "text" : "password"} required name="passwordConfirm" id="passwordConfirm"
                                       className=" focus:outline-none w-full" placeholder="Confirm your password"
                                       onChange={(handleChange)}/>
                                {show ? (
                                    <PiEyeSlashFill className="text-[#a0aaba]" onClick={() => setShow(!show)}/>) : (
                                    <PiEyeFill className="text-[#a0aaba]" onClick={() => setShow(!show)}/>)}
                            </span>
                        </span>
                        <button type="submit" className="w-full px-2 py-3 bg-amber-200 rounded">Sign Up</button>

                        <span className="flex items-center justify-center gap-2">
                            <p>Already a user?</p>
                            <p className=" hover:underline" onClick={() => navigate('/login')}>Sign In</p>
                        </span>
                    </form>
                </div>

                <div
                    className=" col-span-3 sm:col-span-3 lg:col-span-4 hidden sm:block h-full bg-origin-border bg-center bg-no-repeat bg-cover bg-[url('https://img.freepik.com/free-vector/landscape-coal-mining-scene-with-crane-trucks_1308-55217.jpg?w=2000')]"/>
            </div>
        </>
    )
}
export default RegisterPage;