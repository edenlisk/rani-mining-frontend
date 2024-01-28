import { useState } from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";
import { PiEyeSlashFill,PiEyeFill } from "react-icons/pi";
import { useCreateBuyerMutation } from "../states/apislice";
import { useNavigate } from "react-router-dom";


const AddBuyerPage = () => {

    const navigate=useNavigate();
    const [formval, setFormval] = useState({ name:'',email:'',country:'',address:'',destination:''});
    const [show ,setShow]=useState(false);
    const [createNewBuyer,{isSuccess,isLoading,isError,error}]=useCreateBuyerMutation();
    const handleAddproduct = (e) => {
        setFormval({ ...formval, [e.target.name]: e.target.value })
    }
    const handleProductSubmit= async(e)=>{
        e.preventDefault();
        const body={...formval};
        await createNewBuyer({...formval,body});
        setFormval({ name:'',email:'',country:'',address:'',destination:''});
        navigate(-1);
    }
    const handleCancel=()=>{
        setFormval({ name:'',email:'',country:'',address:'',destination:''})
    }
    return (
        <div>
            <ActionsPagesContainer title={'Add Buyer'}
                subTitle={'Add/Update buyer'}
                actionsContainer={<AddComponent component={
                    <div className="flex flex-col gap-3">
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-fit list-none">
                            <li>
                                <p className="mb-1">Name</p>
                                <input value={formval.name || ''} type="text" name="name" id="name" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"
                                    onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Email</p>
                              
                                <input type="email" name="email" id="email" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.email || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Country</p>
                              
                                <input type="text" name="country" id="country" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.country || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Addres</p>
                                <input type="text" name="address" id="address" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.address|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Destination</p>
                                <input type="text" name="destination" id="destination" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.destination|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
 
                        </ul>
                       
                    </div>
                } 
                Add={handleProductSubmit}
                Cancel={handleCancel}
                isloading={isLoading}/>} />
        </div>
    )
}
export default AddBuyerPage;