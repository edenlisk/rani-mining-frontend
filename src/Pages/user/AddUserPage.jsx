import {useEffect, useState} from "react";
import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../components/Actions components/AddComponent";
import {PiEyeFill, PiEyeSlashFill} from "react-icons/pi";
import {useSignupMutation} from "../../states/apislice";
import {useNavigate} from "react-router-dom";
import {message} from "antd";


const AddUserPage = () => {
    const navigate = useNavigate();
    const [signup, {isLoading, isSuccess, isError, error}] = useSignupMutation();
    const [formval, setFormval] = useState({
        name: '',
        phoneNumber: '',
        username: '',
        email: '',
        role: "",
        password: '',
        passwordConfirm: ''
    });
    const [show, setShow] = useState(false);
    const handleAddproduct = (e) => {
        setFormval((prevState) => ({...prevState, [e.target.name]: e.target.value}));
    }
    useEffect(() => {
        if (isSuccess) {
            message.success("User created successfully");
        } else if (isError) {
            const {message: errorMessage} = error.data;
            message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup({body: formval});
        handleCancel();
        navigate(-1);

    }
    const handleCancel = (e) => {
        setFormval({name: '', phoneNumber: '', username: '', email: '', role: "", password: '', passwordConfirm: ''})
    }
    return (
        <>
            <ActionsPagesContainer title={'Add User'}
                                   subTitle={'Add/Update user'}
                                   actionsContainer={<AddComponent component={
                                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                           <ul className="grid grid-cols-1 gap-4  list-none">
                                               <li>
                                                   <p className="mb-1 pl-1">Full Name</p>
                                                   <input value={formval.name || ''} required autoComplete="name"
                                                          type="text" name="name" id="fullName"
                                                          className="focus:outline-none p-2 border rounded-md w-full"
                                                          onChange={handleAddproduct}/>
                                               </li>
                                               {/* ******* */}

                                               <li>
                                                   <p className="mb-1 pl-1">Email</p>
                                                   <input value={formval.email || ''} required autoComplete="off"
                                                          type="email" name="email" id="email"
                                                          className="focus:outline-none p-2 border rounded-md w-full"
                                                          onChange={handleAddproduct}/>
                                               </li>
                                               {/* ******* */}
                                               <li>
                                                   <p className="mb-1 pl-1">Username</p>
                                                   <input value={formval.username || ''} required autoComplete="off"
                                                          type="username" name="username" id="username"
                                                          className="focus:outline-none p-2 border rounded-md w-full"
                                                          onChange={handleAddproduct}/>
                                               </li>
                                               {/* ******* */}
                                               <li>
                                                   <p className="mb-1 pl-1">Phone Number</p>

                                                   <input value={formval.phoneNumber || ''} required autoComplete="off"
                                                          type="text" name="phoneNumber" id="phoneNumber"
                                                          className="focus:outline-none p-2 border rounded-md w-full"
                                                          onChange={handleAddproduct}/>
                                               </li>
                                               {/* ******* */}

                                           </ul>
                                           <ul className="grid grid-cols-1 gap-4 h-fit">
                                               <li>
                                                   <p className="mb-1 pl-1">Role</p>
                                                   <select value={formval.role || ''}
                                                           required name="role" id="role"
                                                           className="focus:outline-none p-2 border rounded-md w-full"
                                                           onChange={handleAddproduct}>
                                                       <option value="ceo">CEO</option>
                                                       <option value="managingDirector">Managing director office
                                                       </option>
                                                       <option value="operationsManager">Operations manager office
                                                       </option>
                                                       <option value="accountant">Accountancy office</option>
                                                       <option value="traceabilityOfficer">Traceability office</option>
                                                       <option value={"laboratoryOfficer"}>Laboratory officer</option>
                                                       <option value="storekeeper">Storekeeper</option>
                                                   </select>
                                               </li>
                                               <li>
                                                   <p className="mb-1 pl-1">Password</p>
                                                   <span
                                                       className=" flex items-center w-full border rounded-md p-2 justify-between">
                                    <input value={formval.password || ''} required type={show ? "text" : "password"}
                                           name="password" id="password" className=" focus:outline-none w-full"
                                           onChange={handleAddproduct}/>
                                                       {show ? <PiEyeSlashFill onClick={() => setShow(!show)}/> :
                                                           <PiEyeFill className="" onClick={() => setShow(!show)}/>}
                                </span>

                                               </li>
                                               {/* ******* */}
                                               <li>
                                                   <p className="mb-1 pl-1">Confirm Password</p>
                                                   <span
                                                       className=" flex items-center w-full border rounded-md p-2 justify-between">
                                    <input value={formval.passwordConfirm || ''} required
                                           type={show ? "text" : "password"} name="passwordConfirm" id="passwordConfirm"
                                           className=" focus:outline-none w-full" onChange={handleAddproduct}/>
                                                       {show ? <PiEyeSlashFill onClick={() => setShow(!show)}/> :
                                                           <PiEyeFill className="" onClick={() => setShow(!show)}/>}
                                </span>

                                               </li>
                                               {/* ******* */}

                                           </ul>

                        {/*                   <span className="">*/}
                        {/*    <p className="mb-1 pl-1">User image</p>*/}
                        {/*    <input type="file" name="userImage" id="userImage"*/}
                        {/*           className=" p-2 border rounded-lg w-full h-fit md:h-52" value={""} onChange={handleAddproduct}/>*/}
                        {/*</span>*/}

                                       </div>
                                   }
                                                                   Add={handleSubmit}
                                                                   Cancel={handleCancel}
                                                                   isloading={isLoading}/>}

            />
        </>
    )
}
export default AddUserPage;