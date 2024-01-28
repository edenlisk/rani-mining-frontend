import { useEffect, useState } from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";
import { PiEyeSlashFill,PiEyeFill } from "react-icons/pi";
import { useGetOnePaymentQuery,useAddPaymentMutation } from "../states/apislice";
import { useNavigate, useParams } from "react-router-dom";
import FetchingPage from "./FetchingPage";


const EditPaymentPage = () => {

    let info=[];
    const{paymentId}=useParams();
    const navigate=useNavigate();
    const{data,isLoading,isSuccess,isError}=useGetOnePaymentQuery({paymentId});
    const [formval, setFormval] = useState({companyName:'',beneficiary:'',nationalId:'',licenseNumber:'',phoneNumber:'',TINNumber:'',email:'',location:'',paymentAmount:'',currency:''});
    const [show ,setShow]=useState(false);
useEffect(()=>{
    if(isSuccess){
        const{data:dt}=data;
        const{payment:paymnt}=dt;
        setFormval({companyName:paymnt.companyName,beneficiary:paymnt.beneficiary,nationalId:paymnt.nationalId,licenseNumber:paymnt.licenseNumber,phoneNumber:paymnt.phoneNumber,TINNumber:paymnt.TINNumber,email:paymnt.email,location:paymnt.location,paymentAmount:paymnt.paymentAmount,currency:paymnt.currency})
    };
},[isSuccess])
   
    const handleAddproduct = (e) => {
        setFormval({ ...formval, [e.target.name]: e.target.value })
    }
    const handleProductSubmit= async(e)=>{
        e.preventDefault();
        const body={...formval};
        await createPayment({...formval,body});
        navigate(-1);
    }
    const handleCancel=()=>{
        setFormval({companyName:'',beneficiary:'',nationalId:'',licenseNumber:'',phoneNumber:'',TINNumber:'',email:'',location:'',paymentAmount:'',currency:''});
        navigate(-1);
    }
    return (
        <div>
           {isLoading?(<FetchingPage/>):(
             <ActionsPagesContainer title={'Edit Payment'}
             subTitle={'Edit/Update payment'}
             actionsContainer={<AddComponent component={
                 <div className="flex flex-col gap-3">
                     <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-fit list-none">
                         <li>
                             <p className="mb-1">Company Name</p>
                           
                             <input type="text" name="companyName" id="companyName" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.companyName || ''} onChange={handleAddproduct} />
                         </li>
                         {/* ******* */}
                         <li>
                             <p className="mb-1">Beneficiary</p>
                           
                             <input type="text" name="beneficiary" id="beneficiary" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.beneficiary || ''} onChange={handleAddproduct} />
                         </li>
                         {/* ******* */}
                         <li>
                             <p className="mb-1">National ID</p>
                             <input type="text" name="nationalId" id="nationalId" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.nationalId|| ''} onChange={handleAddproduct} />
                         </li>
                         {/* ******* */}
                         <li>
                             <p className="mb-1">License number</p>
                             <input type="text" name="licenseNumber" id="licenseNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.licenseNumber|| ''} onChange={handleAddproduct} />
                         </li>
                         {/* ******* */}
                         <li>
                             <p className="mb-1">Phone number</p>
                             <input type="text" name="phoneNumber" id="phoneNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.phoneNumber|| ''} onChange={handleAddproduct} />
                         </li>
                         {/* ******* */}
                         <li>
                             <p className="mb-1">TIN number</p>
                             <input type="text" name="TINNumber" id="TINNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.TINNumber|| ''} onChange={handleAddproduct} />
                         </li>
                         {/* ******* */}
                         <li>
                             <p className="mb-1">Location</p>
                             <input type="text" name="location" id="location" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.location|| ''} onChange={handleAddproduct} />
                         </li>
                         {/* ******* */}
                         <li>
                             <p className="mb-1">Amount payed</p>
                             <input type="text" name="paymentAmount" id="paymentAmount" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.paymentAmount|| ''} onChange={handleAddproduct} />
                         </li>
                         {/* ******* */}
                         <li>
                             <p className="mb-1">Currency</p>
                             <input type="text" name="currency" id="currency" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.currency|| ''} onChange={handleAddproduct} />
                         </li>
                         {/* ******* */}

                     </ul>
                    
                 </div>
             } 
             Add={handleProductSubmit}
             Cancel={handleCancel}/>} />
           )}
        </div>
    )
}
export default EditPaymentPage;