import React, { useState } from "react";
import dayjs from 'dayjs'
import { DatePicker } from 'antd';
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";


const TrecabilityData = () => {
    const [formval, setFormval] = useState({ grossQty: "", netQty: "", companyName: "", licenseNumber: "", companyRepresentative: "", representativeId: "", representativePhoneNbr: "", date: "", mineTagsNbr: "", mineralType: "" });
    const [extrafom, setExtraform] = useState(false);
    const handleAddproduct = (e) => {
        setFormval((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

        if (e.target.value === 'mixed') {
            setExtraform(!extrafom);
        }
        else {
            setExtraform(false);
        }

    };
    const handleAddDate = (e) => {
        setFormval((prevState) => ({ ...prevState, date: dayjs(e).format('MMM/DD/YYYY') }));
    };
    const handleExtraForm = (e) => {
        setFormval((prevState) => ({ ...prevState, mineralType: e.target.value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const handleCancel = (e) => {
        setFormval({ grossQty: "", netQty: "", companyName: "", licenseNumber: "", companyRepresentative: "", representativeId: "", representativePhoneNbr: "", date: "", mineTagsNbr: "", mineralType: "" })
    };

    return (
        <>
            <ActionsPagesContainer title={'Register entry'}
                subTitle={'Add required/aditional datails'}
                actionsContainer={<AddComponent component={
                    <div className="grid grid-cols-1 gap-4">
                        <div><p>a listed table with details to be modified(in progress) same as op manager office,CEo page</p></div>
                        <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            <li className=" space-y-1">
                                <p className="pl-1">Gross quantity</p>
                                <input type="text" required autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="grossQty" id="grossQty" onChange={handleAddproduct} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Net quantity</p>
                                <input type="text" required autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="netQty" id="netQty" onChange={handleAddproduct} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Company name</p>
                                <input type="text" required autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="companyName" id="companyName" onChange={handleAddproduct} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Licence number</p>
                                <input type="text" required autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="licenseNumber" id="licenseNumber" onChange={handleAddproduct} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Company representative</p>
                                <input type="text" required autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="companyRepresentative" id="companyRepresentative" onChange={handleAddproduct} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Representative ID number</p>
                                <input type="text" required autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="representativeId" id="representativeId" onChange={handleAddproduct} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Representative phone nbr</p>
                                <input type="text" required autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="representativePhoneNbr" id="representativePhoneNbr" onChange={handleAddproduct} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Date</p>
                                <DatePicker onChange={handleAddDate} id="date" name="date" className=" focus:outline-none p-2 border rounded-md w-full" />
                            </li>
                            <li className=" space-y-2">
                                <p className="pl-1">Minerals Types</p>
                                <select autoComplete="off" required name="mineralType" id="mineralType" className="focus:outline-none p-2 border rounded-md w-full" onChange={handleAddproduct} >
                                    <option value="casiterite">Casiterite</option>
                                    <option value="coltan">Coltan</option>
                                    <option value="wolframite">Wolframite</option>
                                    <option value="berlyium">Berlyium</option>
                                    <option value="lithium">Lithium</option>
                                    <option value="mixed">Mixed</option>
                                </select>
                                <input type="text" required autoComplete="off" className={`focus:outline-none p-2 border rounded-md w-full ${extrafom ? 'block' : 'hidden'}`} name="extaForm" id="extaForm" onChange={handleExtraForm} />
                            </li>
                            <li className=" space-y-1">
                                <p className="pl-1">Mine tags Number</p>
                                <input type="text" required autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="mineTagsNbr" id="mineTagsNbr" onChange={handleAddproduct} />
                            </li>
                        </ul>
                    </div>
                }
                    Add={handleSubmit}
                    Cancel={handleCancel} />} />
        </>
    )
}
export default TrecabilityData;