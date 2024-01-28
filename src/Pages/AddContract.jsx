import React, {useEffect, useState,useRef} from "react";
import {useAddContractMutation, useGetAllBuyersQuery} from "../states/apislice";
import dayjs from "dayjs";
import { DatePicker, message } from "antd";
import { motion } from "framer-motion";
import {HiPlus, HiMinus, HiOutlineSearch} from "react-icons/hi";
import {BsChevronDown} from "react-icons/bs";
import {ImSpinner2} from "react-icons/im";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import AddComponent from "../components/Actions components/AddComponent";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";

const AddContract = () => {
    // const { buyerId } = useParams();
    let sup=[""];
    const navigate=useNavigate();

    const {
        data,
        isLoading: isGetting,
        isError: isproblem,
        error: problem,
        isSuccess: isGettingBuyersSuccess
    } = useGetAllBuyersQuery();

    

    const [contractInfo, setContractInfo] = useState(
        {
            name: "",
            buyerName: "",
            buyerId: "",
            minerals: "",
            contractStartDate: "",
            contractExpiryDate: "",
            contract: ""
        }
    );
    const [buyerz, setBuyerz] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedBuyerName, setSelectedBuyerName] = useState(null);
    const [searchText, setSearchText] = useState("");

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

    // useEffect(() => {
        if (isGettingBuyersSuccess) {
            const { buyers: buyrz } = data.data;
          sup=buyrz;
        }
    // }, [isGettingBuyersSuccess]);


    const fileInputRefs = {
      contract: useRef(null),
    };

    const [fileNames, setFileNames] = useState({
      contract: "",
    });
    const [addContract, {isLoading, isSuccess, isError, error}] = useAddContractMutation();

    useEffect(() => {
        if (isSuccess) {
            message.success("Contract Added Successfully");
        } else if (isError) {
            const { message: errorMessage } = error.data;
            message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);

    const handleStartDate=(date)=>{
      setContractInfo((prevState) => ({
        ...prevState,
        contractStartDate: date,
      }));
    };

    const handleExpiryDate=(date)=>{
      setContractInfo((prevState) => ({
        ...prevState,
        contractExpiryDate: date,
      }));
    };

    const handleCustomUpload = (key) => {
      fileInputRefs[key].current.click();
    };

    const filteredBuyers = sup.filter((buyer) => {
      const companyName = buyer.companyName || "";
      return companyName.toLowerCase().includes(searchText.toLowerCase());
    });
  
    const handleSearchInputChange = (e) => {
      setSearchText(e.target.value);
    };
  // IYI
    const handleBuyerSelect = (buyer) => {
      setSelectedBuyerName(buyer.name);
      const chosenBuyer = sup.find((sup) => sup._id === buyer._id);
      if (chosenBuyer) {
        setContractInfo({
          ...contractInfo,
          name: chosenBuyer.name,
          licenseNumber: chosenBuyer.licenseNumber,
          TINNumber: chosenBuyer.TINNumber,
          email: chosenBuyer.email,
          buyerId: chosenBuyer._id,
        });
        // setBeneficial(chosenBuyer.buyerName);
      }
      // setchecked(false);
      setContractInfo((prev) => ({ ...prev, buyerIdId: chosenBuyer._id }));
      setDropdownOpen(false);
      setSearchText("");
    };

    const handleChange = (e) => {
        if (e.target.type === "file") {
            setFileNames((prevFileNames) => {
                return ({
                    ...prevFileNames,
                    [e.target.name]: e.target.files[0] ? e.target.files[0].name : "",
                })
            });
            setContractInfo((prevState) => ({...prevState, [e.target.name]: e.target.files[0]}));
        } else if (e.target.name === "buyerId") {
            const buyer = buyerz.find(item => item._id === e.target.value);
            setContractInfo(prevState => ({...prevState, buyerName: buyer.name, buyerId: buyer._id}));
        } else {
            setContractInfo(prevState => ({...prevState, [e.target.name]: e.target.value}));
        }
    };


    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in contractInfo) {
            if (contractInfo.hasOwnProperty(key)) {
                formData.append(key, contractInfo[key]);
            }
        }
        // ADD CONTRACT THROUGH FORMDATA AND ALSO OTHER INFO USING CONTRACT INFO STATE OBJECT (SPREAD OPERATOR)
        await addContract({body: formData});

        handleCancel();
    }

    const handleCancel = () => {
        setContractInfo(
            {
                name: "",
                buyerName: "",
                buyerId: "",
                minerals: "",
                contractStartDate: "",
                contractExpiryDate: "",
                contract: ""
            }
        )
        setFileNames({
            contract: "",
        });
    }
 
    return (
        <>
        <ActionsPagesContainer
        title={"Add contract"}
        subTitle={"Add new contract"}
        actionsContainer={
          <AddComponent
            component={
                <div className="grid grid-cols-1 gap-1">

                <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                    {/* <li className=" space-y-1">
                        <p className="pl-1">Buyer name</p>
                        <select
                            autoComplete="off"
                            className="focus:outline-none p-2 border rounded-md w-full"
                            name="buyerId"
                            id="buyerId"
                            value={contractInfo.buyerId || ""}
                            onChange={handleChange}
                        >
                            <option value="defaultBuyer" hidden>
                                Select a buyer
                            </option>
                            {buyerz.map(({ _id, name }) => (
                                <option key={_id} value={_id}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </li> */}
                                           <li className=" space-y-2 flex items-end gap-3 col-span-full ">
                      
                      <div ref={modalRef} className="w-fit h-fit relative ">
                        <div
                          className="border p-2 w-[240px] rounded-md flex items-center justify-between gap-6 bg-white"
                          onClick={() => {
                            setDropdownOpen((prev) => !prev);
                          }}
                        >
                          <p className=" ">
                            {selectedBuyerName
                              ? selectedBuyerName
                              : "select a buyer"}
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
                              ? { opacity: 1, x: -8, y: 1, display: "block" }
                              : { opacity: 0, x: 0, y: 0, display: "none" }
                          }
                          transition={{
                            type: "spring",
                            duration: 0.8,
                            bounce: 0.35,
                          }}
                          className={`p-2 space-y-3 bg-white w-fit rounded absolute top-12 shadow-2xl z-50`}
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
                          {isGetting?<div className="w-full flex justify-start items-center gap-1">
                          <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500" />
                          <p className=" text-slate-400">Fetching buyers...</p>
                          </div>:<ul className={`list-none  overflow-auto `}>
                            {filteredBuyers.map((buyers, index) => (
                              <li
                                key={index}
                                className=" hover:bg-slate-300 rounded-md p-2"
                                onClick={() => handleBuyerSelect(buyers)}
                              >
                                {buyers.name}
                              </li>
                            ))}
                          </ul>}
                        </motion.div>
                      </div>
                    {/* </div> */}
                    <button
                      className="bg-orange-300 text-gray-800 px-3 py-2 rounded-md"
                      onClick={() => navigate("/add/buyer")}
                    >
                      New buyer
                    </button>
                  </li>

                  <li className=" space-y-1">
                    <p className="pl-1">Buyer name</p>
                    <input
                      type="text"
                      autoComplete="off"
                      className="focus:outline-none p-2 border rounded-md w-full"
                      name="name" value={contractInfo.name ||""} onChange={handleChange}
                    />
                  </li>
                  <li className=" space-y-1">
                    <p className="pl-1">Minerals</p>
                    <input
                      type="text"
                      autoComplete="off"
                      className="focus:outline-none p-2 border rounded-md w-full"
                      name="minerals" value={contractInfo.minerals} onChange={handleChange}
                    />
                  </li>

                  <li className=" space-y-1">
                    <p className="pl-1">Start Date</p>
                    <DatePicker
                    id="contractStartDate"
                     name="contractStartDate" value={
                      contractInfo.contractStartDate ? dayjs(contractInfo.contractStartDate) : null
                    } onChange={(e) => handleStartDate(e)}
                      className=" focus:outline-none p-2 border rounded-md w-full"
                    />
                  </li>

                  <li className=" space-y-1">
                    <p className="pl-1">Expiry Date</p>
                    <DatePicker
                    id="contractExpiryDate"
                     name="contractExpiryDate" value={contractInfo.contractExpiryDate} onChange={handleExpiryDate}
                      className=" focus:outline-none p-2 border rounded-md w-full"
                    />
                  </li>

                  <li className=" space-y-1">
                    <p className="pl-1">Contract</p>
                    <input
                          className="focus:outline-none p-2 border rounded-md w-full hidden"
                          style={{ display: "none" }}
                          autoComplete="off"
                          type="file"
                          name="contract"
                          onChange={handleChange}
                          ref={fileInputRefs.contract}
                        />
                        <button
                          type="button"
                          className=" w-full p-2 rounded-md bg-gradient-to-r from-gray-100 via-blue-100 to-blue-300 shadow-md"
                          onClick={() =>
                            handleCustomUpload("contract")
                          }
                        >
                          Upload Contract
                        </button>
                        <p className="border p-2">
                          {fileNames.contract}
                        </p>
                  </li>

                </ul>
              </div>
            }
            
            Add={handleSubmit}
            Cancel={handleCancel}
            isloading={isLoading}/>}/>
        </>
      
    )
}


export default AddContract