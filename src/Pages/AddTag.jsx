import React, {useEffect, useRef, useState} from "react";
import {BsChevronDown} from "react-icons/bs";
import {motion} from "framer-motion";
import { message } from "antd";
import {HiOutlineSearch} from "react-icons/hi";
import {ImSpinner2} from "react-icons/im";
import {useNavigate} from "react-router-dom";
import {useGetAllSuppliersQuery, useCreateTagMutation } from "../states/apislice";
import LoadingButton from "./LoadingButton";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";

const AddTag = () => {
    const [tag, setTag] = useState({supplierId: "", tagNumber: "", sheetNumber: "", weight: ""});
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedSupplierName, setSelectedSupplierName] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [sup, setSup] = useState([]);
    const navigate = useNavigate();
    const { data, isLoading, isSuccess } = useGetAllSuppliersQuery();
    const [createTag, { isLoading: isCreatingTag, isSuccess: createSuccess, isError, error }] = useCreateTagMutation();

    useEffect(() => {
        if (createSuccess) {
            message.success("Tag created successfully");
            return navigate("/tags");
        } else if (isError) {
            return message.error(error.message);
        }
    }, [createSuccess, isError, error]);

    let modalRef = useRef();

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

    const handleCreateTag = async () => {
        if (!tag.supplierId) return message.error("Please select a supplier");
        if (!tag.tagNumber) return message.error("Please enter a tag number");
        if (!tag.sheetNumber) return message.error("Please enter a sheet number");
        if (!tag.weight) return message.error("Please enter a weight");
        await createTag({body: tag});
    }


    useEffect(() => {
        if (isSuccess) {
            const { suppliers } = data.data;
            setSup(suppliers);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (tag.tagNumber.length > 8) {
            return message.warning("Tag number should not be more than 8 characters");
        }
        if (parseInt(tag.weight) >= 75) {
            return message.warning("Weight should not be more than 75");
        }
    }, [tag]);

    const filteredSuppliers = sup.filter((supplier) => {
        const companyName = supplier.companyName || "";
        return companyName.toLowerCase().includes(searchText.toLowerCase());
    });

    const handleSearchInputChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleSupplierSelect = (supplier) => {
        setTag(prevState => ({...prevState, supplierId: supplier._id}));
        setSelectedSupplierName(supplier.companyName);
        setDropdownOpen(false);
    }

    const handleChange = (e) => {
        setTag(prevState => ({...prevState, [e.target.name]: e.target.value}));
    }

    return (
        <ActionsPagesContainer
        title={"Add new tag"}
        subTitle={"Add/enter new tag information"}
        actionsContainer={
            <>

            <ul className="grid grid-cols-1 items-center gap-1 gap-x-2 md:grid-cols-2 lg:grid-cols-3 pb-8">
                <li className=" space-y-2 flex items-end gap-3 col-span-full ">
                    <div>
                        <div ref={modalRef} className="w-fit h-fit relative ">
                            <div
                                className="border p-2 w-[240px] rounded-md flex items-center justify-between gap-6 bg-white"
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
                                style={{zIndex: 100}}
                                animate={
                                    dropdownOpen
                                        ? { opacity: 1, x: -8, y: 1, display: "block" }
                                        : { opacity: 0, x: 0, y: 0, display: "none" }
                                }
                                transition={{
                                    type: "spring",
                                    duration: 0.8,
                                    bounce: 0.35,
                                }}
                                className={`p-2 space-y-3 bg-white w-fit rounded absolute top-12 shadow-2xl `}
                            >
                                <div className="w-full flex items-center gap-2 px-2 py-1 rounded border">
                                    <HiOutlineSearch className={`text-lg `} />
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
                                {isLoading?<div className="w-full flex justify-start items-center gap-1">
                                    <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500" />
                                    <p className=" text-slate-400">Fetching suppliers...</p>
                                </div>:<ul className={`list-none  overflow-auto `}>
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
                    </div>
                    <button
                        className=" bg-custom_blue-500 hover:bg-custom_blue-600 text-white shadow-md shadow-[#A6A6A6] py-[10px] px-[20px] rounded-md"
                        onClick={() => navigate("/add/supplier")}
                    >
                        New supplier
                    </button>
                </li>
            </ul>

            <ul className=" col-span-full grid grid-cols-1 mt-3 gap-x-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center relative p-2 bg-white rounded-md py-4">
                <li>
                    <p className="mb-1">Tag number</p>
                    <input
                        type="text"
                        name="tagNumber"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        value={tag.tagNumber || ""}
                        onWheelCapture={(e) => {
                            e.target.blur();
                        }}
                        onChange={handleChange}
                    />
                </li>
                <li>
                    <p className="mb-1">Tag weight</p>
                    <input
                        type="text"
                        name="weight"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        value={tag.weight || ""}
                        onWheelCapture={(e) => {
                            e.target.blur();
                        }}
                        onChange={handleChange}
                    />
                </li>
                <li>
                    <p className="mb-1">Sheet number</p>
                    <input
                        type="text"
                        name="sheetNumber"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-lg w-full"
                        value={tag.sheetNumber || ""}
                        onWheelCapture={(e) => {
                            e.target.blur();
                        }}
                        onChange={handleChange}
                    />
                </li>
            </ul>
            <div className="mt-3">
                <LoadingButton name={"Submit"} onClickFunction={handleCreateTag} isProcessing={isCreatingTag}/>
            </div>
        </>
        }

        />
    )
}

export default AddTag;
