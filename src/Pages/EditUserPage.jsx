import { useState } from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";
import { PiEyeSlashFill, PiEyeFill } from "react-icons/pi";


const EditUserPage = () => {
    const [formval, setFormval] = useState({ fullName: '', userName: '', email: '', role: "", password: '', confirmPassword: '' });
    const [show, setShow] = useState(false);
    const handleAddproduct = (e) => {
        setFormval({ ...formval, [e.target.name]: e.target.value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
    }
    const handleCancel = (e) => {
        setFormval({ fullName: '', userName: '', email: '', role: "", password: '', confirmPassword: '' })
    }
    return (
        <div>
            <ActionsPagesContainer title={'Edit User'}
                subTitle={'Edit/Update user'}
                actionsContainer={<AddComponent component={
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <ul className="grid grid-cols-1 gap-4  list-none" component="form">
                            <li>
                                <p className="mb-1 pl-1">Full Name</p>
                                <input value={formval.fullName || ''} required type="text" name="fullName" id="fullName" className="focus:outline-none p-2 border rounded-lg w-full"
                                    onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1 pl-1">User Name</p>

                                <input value={formval.userName || ''} required type="text" name="userName" id="userName" className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1 pl-1">Email</p>
                                <input value={formval.email || ''} required type="email" name="email" id="email" className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}

                        </ul>
                        <ul className="grid grid-cols-1 gap-4 h-fit">
                            <li>
                                <p className="mb-1 pl-1">Role</p>
                                <select value={formval.role || ''} required name="role" id="role" className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleAddproduct} >
                                    <option value="CEO">CEO</option>
                                    <option value="managing director office">Managing director office</option>
                                    <option value="operations manager office">Operations manager office</option>
                                    <option value="accountancy office">Accountancy office</option>
                                    <option value="trecability">Trecability</option>
                                    <option value="storekeeper">Storekeeper</option>
                                </select>
                            </li>
                            <li>
                                <p className="mb-1 pl-1">Password</p>
                                <span className=" flex items-center w-full border rounded-lg p-2 justify-between">
                                    <input value={formval.password || ''} required type={show ? "text" : "password"} name="password" id="password" className=" focus:outline-none w-full" onChange={handleAddproduct} />
                                    {show ? <PiEyeSlashFill onClick={() => setShow(!show)} /> : <PiEyeFill className="" onClick={() => setShow(!show)} />}
                                </span>

                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1 pl-1">Confirm Password</p>
                                <span className=" flex items-center w-full border rounded-lg p-2 justify-between">
                                    <input value={formval.confirmPassword || ''} required type={show ? "text" : "password"} name="confirmPassword" id="confirmPassword" className=" focus:outline-none w-full" onChange={handleAddproduct} />
                                    {show ? <PiEyeSlashFill onClick={() => setShow(!show)} /> : <PiEyeFill className="" onClick={() => setShow(!show)} />}
                                </span>

                            </li>
                            {/* ******* */}

                        </ul>

                        <span className="">
                            <p className="mb-1 pl-1">User image</p>
                            <input type="file" name="userImage" id="userImage" className=" p-2 border rounded-lg w-full h-fit md:h-52" />
                        </span>

                    </div>
                }
                    Add={handleSubmit}
                    Cancel={handleCancel} />} />
        </div>
    )
}
export default EditUserPage;