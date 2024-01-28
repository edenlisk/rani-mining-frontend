 import { useParams } from "react-router-dom";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import { useGetOneBuyerQuery } from "../states/apislice";
import FetchingPage from "./FetchingPage";
 const BuyerDetailsPage=()=>{
    let info=[];
    const{buyerId}=useParams();
    const{data,isLoading,isSuccess,isError,error}=useGetOneBuyerQuery({buyerId});
    if(isSuccess){
        const{data:dt}=data;
        const{buyer:byr}=dt;
        info=byr;
    }
return(
    <>
     {isLoading ? (
        <FetchingPage />
      ) : (
        <ActionsPagesContainer title={'Buyer details'}
    subTitle={'Buyers info details'}
    actionsContainer={
        <div className="w-full">
                <ul className="grid grid-cols-2">
                    <li className="border border-r-0 p-2 rounded-tl-sm rounded-bl-sm bg-slate-50">Name</li>
                    <li className="border p-2 rounded-tr-sm rounded-br-sm">{info.name}</li>
                    
                    <li className="border border-r-0 p-2 rounded-tl-sm rounded-bl-sm bg-slate-50">Email</li>
                    <li className="border p-2 rounded-tr-sm rounded-br-sm">{info.email}</li>

                    <li className="border border-r-0 p-2 rounded-tl-sm rounded-bl-sm bg-slate-50">Address</li>
                    <li className="border p-2 rounded-tr-sm rounded-br-sm">{info.address}</li>

                    <li className="border border-r-0 p-2 rounded-tl-sm rounded-bl-sm bg-slate-50">Country</li>
                    <li className="border p-2 rounded-tr-sm rounded-br-sm">{info.country}</li>

                    <li className="border border-r-0 p-2 rounded-tl-sm rounded-bl-sm bg-slate-50">Destination</li>
                    <li className="border p-2 rounded-tr-sm rounded-br-sm">{info.destination}</li>

                </ul>
            </div>
    } />)}
    </>

)
 }
 export default BuyerDetailsPage;