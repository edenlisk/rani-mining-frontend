import { PiPlus,PiCaretLeftLight } from "react-icons/pi"
import { useNavigate } from "react-router-dom";

const ListContainerHeader = ({ title, subTitle, navtext,navLinktext,isAlowed }) => {
    const navigate = useNavigate();
    return (
        <>
         <PiCaretLeftLight className="mb-1" onClick={()=>navigate(-1)}/>
            <div className="sm:flex sm:justify-between sm:items-center mb-9">
                <div className="text-start">

                    <h4 className=" text-[18px] font-bold">{title}</h4>
                    <h6 className="text-[14px] ">{subTitle}</h6>

                </div>
               { isAlowed?<div className="py-[10px] px-[20px] rounded shadow-md shadow-[#A6A6A6] bg-custom_blue-500  hover:bg-custom_blue-600 flex items-center gap-3" onClick={() => navigate(`/${navLinktext}`)} >
                    <PiPlus className="text-white text-2xl" />
                    <button type="button" className=" bg-transparent text-white text-center" >{navtext}</button>
                </div>:null}

            </div>
        </>
    )

}
export default ListContainerHeader;