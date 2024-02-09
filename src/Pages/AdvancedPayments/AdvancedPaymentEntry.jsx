import React, {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import {motion} from "framer-motion";
import {DatePicker, message} from "antd";
import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../components/Actions components/AddComponent";
import {useAddAdvancePaymentMutation, useGetAllSuppliersQuery, useSaveFileMutation} from "../../states/apislice";
import {BsChevronDown} from "react-icons/bs";
import {HiOutlineSearch} from "react-icons/hi";
import {ImSpinner2} from "react-icons/im";
import NewDocumentEditorComponent from "../NewDocumentEditorComponent";
import { useNavigate } from "react-router-dom";

const AdvancedPaymentEntry = () => {
    const [sup, setSup] = useState([]);
    const [paymentInfo, setPaymentInfo] = useState({
        supplierId: '',
        companyName: '',
        beneficiary: '',
        nationalId: '',
        phoneNumber: '',
        location: {province: "", district: "", sector: "", cell: ''},
        email: '',
        paymentAmount: null,
        currency: '',
        paymentDate: '',
        USDRate: null,
    });
    const [AddAdvancedPayment, {isLoading, isSuccess, isError, error}] = useAddAdvancePaymentMutation();
    const {data, isloading: isFetching, isSuccess: isDone, isError: isFail, error: fail} = useGetAllSuppliersQuery()
    const [saveFile, {
        isSuccess: isDocumentSaved,
        isError: isSaveError,
        isLoading: isSaving,
        error: saveError
    }] = useSaveFileMutation();
    const navigate = useNavigate();

    let modalRef = useRef();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedSupplierName, setSelectedSupplierName] = useState(null);
    const [searchText, setSearchText] = useState("");

    const [documentEditor, setDocumentEditor] = useState(null);

    const handleClickOutside = (event) => {
        if (!modalRef.current || !modalRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);


    useEffect(() => {
        if (isDone) {
            const {suppliers: sups} = data.data;
            setSup(sups);
        }
    }, [data, isDone])


    const filteredSuppliers = sup.filter((supplier) => {
        const companyName = supplier.companyName || "";
        return companyName.toLowerCase().includes(searchText.toLowerCase());
    });

    const handleSearchInputChange = (e) => {
        setSearchText(e.target.value);
    };


    const handleEntry = (e) => {
        setPaymentInfo((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSupplierSelect = (supplier) => {
        setSelectedSupplierName(supplier.companyName);
        const chosenSupplier = sup.find((sup) => sup._id === supplier._id);
        if (chosenSupplier) {
            setPaymentInfo((prevstate) => ({
                ...prevstate,
                supplierId: chosenSupplier._id,
                companyName: chosenSupplier.companyName
            }));
        }
        // setchecked(false);
        // setFormval((prev) => ({ ...prev, supplierId: supplier._id }));
        setDropdownOpen(false);
        setSearchText("");
    };

    const handleAddPaymentDate = (e) => {
        setPaymentInfo((prevState) => ({
            ...prevState,
            paymentDate: e,
        }));
    };

    useEffect(() => {
        if (isSuccess) {
            return message.success("Advanced payment added successfully");
        } else if (isError) {
            const {message: errorMessage} = error.data;
            return message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);

    const handleChangeLocation = (e) => {
        const {name, value} = e.target;
        if (name.includes("location.")) {
            const addressField = name.split(".")[1];
            setPaymentInfo((prevState) => ({
                ...prevState,
                location: {
                    ...prevState.location,
                    [addressField]: value
                }
            }));
        }
    };

    const onDownload = () => {
        if (documentEditor?.documentEditor) {
            documentEditor.documentEditor.save("Untitled", 'Docx');
        }
    }

    const onSave = async () => {
        if (!documentEditor.documentEditor) return;
        const file = await documentEditor.documentEditor.saveAsBlob('Docx');
        const formData = new FormData();
        formData.append('data', file);
        return file;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = paymentInfo;
        const formData = new FormData();
        for (const [key, value] of Object.entries(body)) {
            if (value === null || value === "") {
                formData.append(key, "");
            } else {
                if (value instanceof Object) {
                    formData.append(key, JSON.stringify(value));
                    continue;
                }
                formData.append(key, value);
            }
        }
        const file = await onSave();
        formData.append('data', file, "New Advanced Payment.docx");
        await AddAdvancedPayment({body: formData});
        handleCancel();
        navigate(-1);
    };

    const handleCancel = () => {
        setPaymentInfo({
            supplierId: '',
            companyName: '',
            beneficiary: '',
            nationalId: '',
            phoneNumber: '',
            location: {province: '', district: '', sector: '', cell: ''},
            email: '',
            paymentAmount: null,
            currency: '',
            paymentDate: '',
            contractName: '',
            USDRate: null,
        });
    };

    return (
        <ActionsPagesContainer
            title={"Advanced payment"}
            subTitle={"Add new advanced payment"}
            actionsContainer={
                <AddComponent
                    component={
                        <div className="grid grid-cols-1 gap-y-10 pb-10">
                            <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                <li className=" space-y-1">
                                    <p className="pl-1">Company name</p>
                                    {/* <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="companyName"
                                        id="companyName"
                                        value={paymentInfo.companyName || ""}
                                        onChange={handleEntry}

                                    /> */}
                                    <div ref={modalRef} className=" h-fit relative ">
                                        <div
                                            className="border p-2 w-full rounded-md flex items-center justify-between gap-6 bg-white"
                                            onClick={() => {
                                                setDropdownOpen((prev) => !prev);
                                            }}
                                        >
                                            <p className=" ">
                                                {selectedSupplierName
                                                    ? selectedSupplierName
                                                    : "select a supplier"}
                                            </p>
                                            <BsChevronDown
                                                className={`text-md transition ease-in-out duration-500 ${
                                                    dropdownOpen ? "rotate-180" : null
                                                }`}
                                            />
                                        </div>
                                        <motion.div
                                            animate={
                                                dropdownOpen
                                                    ? {opacity: 1, x: -8, y: 1, display: "block"}
                                                    : {opacity: 0, x: 0, y: 0, display: "none"}
                                            }
                                            transition={{
                                                type: "spring",
                                                duration: 0.8,
                                                bounce: 0.35,
                                            }}
                                            className={`p-2 space-y-3 bg-white w-fit rounded absolute top-12 shadow-2xl `}
                                        >
                                            <div className="w-full flex items-center gap-2 px-2 py-1 rounded border">
                                                <HiOutlineSearch className={`text-lg `}/>
                                                <input
                                                    type="text"
                                                    name="searchTextInput"
                                                    id="searchTextInput"
                                                    placeholder="Search"
                                                    className="w-full focus:outline-none"
                                                    value={searchText}
                                                    onChange={handleSearchInputChange}
                                                />
                                            </div>
                                            {isLoading ? <div className="w-full flex justify-start items-center gap-1">
                                                <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500"/>
                                                <p className=" text-slate-400">Fetching suppliers...</p>
                                            </div> : <ul className={`list-none  overflow-auto `}>
                                                {filteredSuppliers.map((supplier, index) => (
                                                    <li
                                                        key={index}
                                                        className=" hover:bg-slate-300 rounded-md p-2"
                                                        onClick={() => handleSupplierSelect(supplier)}
                                                    >
                                                        {supplier.companyName}
                                                    </li>
                                                ))}
                                            </ul>}
                                        </motion.div>
                                    </div>
                                </li>

                                <li className=" space-y-1">
                                    <p className="pl-1">Beneficiary</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="beneficiary"
                                        id="beneficiary"
                                        value={paymentInfo.beneficiary || ""}
                                        onChange={handleEntry}

                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">National Id</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="nationalId"
                                        id="nationalId"

                                        value={paymentInfo.nationalId || ""}
                                        onChange={handleEntry}

                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Phone number</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="phoneNumber"
                                        id="phoneNumber"

                                        value={paymentInfo.phoneNumber || ""}
                                        onChange={handleEntry}

                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Province</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="location.province"
                                        id="province"

                                        value={paymentInfo.location.province || ""}
                                        onChange={handleChangeLocation}

                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">District</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="location.district"
                                        id="district"

                                        value={paymentInfo.location.district || ""}
                                        onChange={handleChangeLocation}

                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Sector</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="location.sector"
                                        id="sector"

                                        value={paymentInfo.location.sector || ""}
                                        onChange={handleChangeLocation}

                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Cell</p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="location.cell"
                                        id="cell"

                                        value={paymentInfo.location.cell || ""}
                                        onChange={handleChangeLocation}

                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Email</p>
                                    <input
                                        type="email"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="email"
                                        id="email"
                                        value={paymentInfo.email || ""}
                                        onChange={handleEntry}

                                    />
                                </li>

                                <li className=" space-y-1">
                                    <p className="pl-1">Payment amount</p>
                                    <input
                                        type="number"
                                        autoComplete="off"
                                        name="paymentAmount"
                                        id="paymentAmount"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        value={paymentInfo.paymentAmount || ''}
                                        onChange={handleEntry}
                                        onWheelCapture={(e) => {
                                            e.target.blur();
                                        }}
                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Currency</p>
                                    <select
                                        name="currency"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        defaultValue={paymentInfo.currency || '' || "defaultcurrency"}
                                        onChange={handleEntry}
                                    >
                                        <option value="defaultcurrency" hidden>
                                            {paymentInfo.currency ? `${paymentInfo.currency}` : "select currency"}
                                        </option>
                                        <option value="USD">USD</option>
                                        <option value="RWF">RWF</option>
                                    </select>
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">USD Rate</p>
                                    <input
                                        type="number"
                                        autoComplete="off"
                                        className="focus:outline-none p-2 border rounded-md w-full"
                                        name="USDRate"
                                        id="USDRate"
                                        value={paymentInfo.USDRate || ""}
                                        disabled={paymentInfo.currency === "USD"}
                                        required={paymentInfo.currency === "RWF"}
                                        onChange={handleEntry}
                                    />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Payment date</p>
                                    <DatePicker
                                        onChange={handleAddPaymentDate}
                                        id="paymentDate"
                                        name="paymentDate"
                                        className=" focus:outline-none p-2 border rounded-md w-full"
                                        value={
                                            paymentInfo.paymentDate ? dayjs(paymentInfo.paymentDate) : null
                                        }

                                    />
                                </li>

                                {/*<li className=" space-y-1">*/}
                                {/*    <p className="pl-1">Contract name</p>*/}
                                {/*    <input*/}
                                {/*        autoComplete="off"*/}
                                {/*        type="text"*/}
                                {/*        name="contractName"*/}
                                {/*        id="contractName"*/}
                                {/*        className="focus:outline-none p-2 border rounded-md w-full"*/}
                                {/*        value={paymentInfo.contractName || ""}*/}
                                {/*        onChange={handleEntry}*/}

                                {/*    />*/}
                                {/*</li>*/}
                            </ul>
                            <div>
                                <NewDocumentEditorComponent
                                    setDocumentEditor={setDocumentEditor}
                                />
                                <div>
                                    <button className="px-4 py-1 bg-blue-300 rounded-md" type="button"
                                            onClick={onDownload}>Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                    Add={handleSubmit}
                    Cancel={handleCancel}
                    isloading={isLoading}
                />
            }/>
    )

}
export default AdvancedPaymentEntry;