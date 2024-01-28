import {PiCaretLeftLight } from "react-icons/pi"
import { useNavigate } from "react-router-dom";
const Header = ({title,subTitle}) => {
    const navigate=useNavigate();
    return (
        <div className="">
               <PiCaretLeftLight className="mb-1" onClick={()=>navigate(-1)}/>
            <h4 className=" text-[18px] font-bold pl-1">{title}</h4>
            <h6 className="text-[14px] pl-1 ">{subTitle}</h6>

        </div>
    )
}
export default Header;