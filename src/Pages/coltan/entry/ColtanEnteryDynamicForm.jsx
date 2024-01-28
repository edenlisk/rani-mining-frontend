import React, { Fragment, useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { DatePicker, TimePicker, Spin, message } from "antd";
import { BsChevronDown } from "react-icons/bs";
import { HiOutlineSearch } from "react-icons/hi";
import ActionsPagesContainer from "../../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../../components/Actions components/AddComponent";
import {
  useGetAllSuppliersQuery,
  useCreateEntryMutation,
} from "../../../states/apislice";
import { FiSearch } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { HiPlus, HiMinus } from "react-icons/hi";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import {
  FormatTolabelCase,
  validateWeightInEntry,
} from "../../../components/helperFunctions";

const ColtanEntryDynamicForm = () => {
  let sup = [""];
  const navigate = useNavigate();
  const { data, isLoading, isError, error, isSuccess } =
    useGetAllSuppliersQuery();
  const [
    createColtanEntry,
    {
      isLoading: isSending,
      isError: isFail,
      error: failError,
      isSuccess: isDone,
    },
  ] = useCreateEntryMutation();
  const [formval, setFormval] = useState({
    companyName: "",
    email: "",
    TINNumber: "",
    licenseNumber: "",
    companyRepresentative: "",
    representativeId: "",
    representativePhoneNumber: "",
    mineralType: "coltan",
    supplyDate: "",
    time: "",
    weightIn: "",
    numberOfTags: "",
    beneficiary: "",
    mineTags: "",
    supplierId: "",
    //   negociantTags: "",
    //   mineralgrade: "",
    //   mineralprice: "",
    //   shipmentnumber: "",
    //   beneficiary: "",
    isSupplierBeneficiary: false,
  });
  const [lotDetails, setlotDetails] = useState([
    { lotNumber: "", weightOut: "" },
  ]);
  const [checked, setchecked] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSupplierName, setSelectedSupplierName] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [model, setModel] = useState("");
  const [beneficial, setBeneficial] = useState("");
  const [admin, setAdmin] = useState({ role: "admin" });

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

  if (isSuccess) {
    const { data: dt } = data;
    const { suppliers: sups } = dt;
    sup = sups;
  }

  const handleEntry = (e) => {
    setFormval((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "mineralType") {
      setModel(e.target.value);
    }
  };

  const handleAddDate = (e) => {
    setFormval((prevState) => ({
      ...prevState,
      supplyDate: dayjs(e).format("MMM/DD/YYYY"),
    }));
  };

  const handleAddTime = (e) => {
    setFormval((prevState) => ({
      ...prevState,
      time: dayjs(e).format("HH:mm"),
    }));
  };
  const updateLotNumbers = () => {
    setlotDetails((prevLotDetails) => {
      return prevLotDetails.map((lot, index) => ({
        ...lot,
        lotNumber: index + 1,
      }));
    });
  };
  const handleAddLot = () => {
    setlotDetails((prevLotDetails) => [
      ...prevLotDetails,
      { lotNumber: "", weightOut: "" },
    ]);
    updateLotNumbers();
  };

  // TODO: validate weightIn entry
  const handleLotEntry = (index, e) => {
    validateWeightInEntry(index, lotDetails, e, formval.weightIn);
    const values = [...lotDetails];
    values[index][e.target.name] = e.target.value;
    values[index].lotNumber = index + 1;
    setlotDetails(values);
  };

  const handleLRemoveLot = (index) => {
    const values = [...lotDetails];
    values.splice(index, 1);
    values.forEach((lot, i) => {
      lot.lotNumber = i + 1;
    });
    setlotDetails(values);
  };

  const handleCheck = () => {
    setchecked((prev) => !prev);
    if (Boolean(checked) === false) {
      setFormval({
        ...formval,
        beneficiary: beneficial,
        isSupplierBeneficiary: true,
      });
    } else if (Boolean(checked) === true) {
      setFormval({ ...formval, beneficiary: "", isSupplierBeneficiary: false });
    }
  };

  function calculateTotalWeight(arr) {
    // Ensure the input is an array
    if (!Array.isArray(arr)) {
      throw new Error("Input must be an array");
    }

    // Use reduce to sum the weightOut values
    const totalWeight = arr.reduce((sum, entry) => {
      // Convert the weightOut value to a number before adding
      const weight = parseFloat(entry.weightOut);

      // Check if the conversion is successful and add to the sum
      if (!isNaN(weight)) {
        return sum + weight;
      } else {
        return sum;
      }
    }, 0);

    return totalWeight;
  }

  function isTotalWeightGreater(data, weightIn) {
    const totalWeight = calculateTotalWeight(data);

    // Convert weightIn to a number
    const numericWeightIn = parseFloat(weightIn);

    // Check if the conversion is successful and compare totalWeight with weightIn
    if (!isNaN(numericWeightIn) && totalWeight > numericWeightIn) {
      // message.error("Weight out can't be greater than weight in")
      return true;
    } else {
      return false;
    }
  }

  const renderInputByType = (key) => {
    switch (key) {
      case "beneficiary":
        return (
          <li className=" space-y-1" key="beneficiary">
            <span className=" flex gap-2 items-center">
              <p>{FormatTolabelCase("beneficiary")}</p>
              <span
                className={`border h-4 w-9 rounded-xl p-[0.5px] duration-200 transform ease-in-out flex ${
                  checked
                    ? " justify-end bg-green-400"
                    : " justify-start bg-slate-400"
                }`}
                onClick={handleCheck}
              >
                <span className={` w-4 h- border bg-white rounded-full `} />
              </span>
            </span>
            <input
              type="text"
              autoComplete="off"
              disabled={checked}
              className="focus:outline-none p-2 border rounded-md w-full"
              name="beneficiary"
              id="beneficiary"
              value={formval.beneficiary || ""}
              onChange={handleEntry}
            />
          </li>
        );
      case "time":
        return (
          <li className=" space-y-1" key="time">
            {<p className="pl-1">{FormatTolabelCase("time")}</p>}
            <TimePicker
              value={formval.time ? dayjs(formval.time, "HH:mm") : null}
              onChange={handleAddTime}
              format={"HH:mm"}
              id="time"
              name="time"
              className=" focus:outline-none p-2 border rounded-md w-full"
            />
          </li>
        );
      case "supplyDate":
        return (
          <li className=" space-y-1" key="supplyDate">
            {<p className="pl-1">{FormatTolabelCase("supplyDate")}</p>}
            <DatePicker
              value={formval.supplyDate ? dayjs(formval.supplyDate) : null}
              onChange={handleAddDate}
              id="supplyDate"
              name="supplyDate"
              className=" focus:outline-none p-2 border rounded-md w-full"
            />
          </li>
        );
      case "mineralType":
        return (
          <li className=" space-y-1" key="mineralType">
            {<p className="pl-1">{FormatTolabelCase("mineralType")}</p>}
            <input
              type="text"
              autoComplete="off"
              className="focus:outline-none p-2 border rounded-md w-full"
              name="mineralType"
              value={formval.mineralType || ""}
              disabled
              onChange={handleEntry}
            />
          </li>
        );
      case "mineTags":
      case "supplierId":
      case "isSupplierBeneficiary":
        return null;
      default:
        return (
          <li className=" space-y-1" key={key}>
            {<p className="pl-1">{FormatTolabelCase(key)}</p>}
            <input
              type="text"
              autoComplete="off"
              className="focus:outline-none p-2 border rounded-md w-full"
              name={key}
              value={formval[key] || ""}
              onChange={handleEntry}
            />
          </li>
        );
    }
  };

  const result = isTotalWeightGreater(lotDetails, formval.weightIn);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...formval, output: lotDetails };
    console.log(body);
    // await createColtanEntry({ body, model: "coltan" });
    // navigate(-1);
  };
  const handleCancel = () => {
    setFormval({
      companyName: "",
      email: "",
      TINNumber: "",
      licenseNumber: "",
      companyRepresentative: "",
      representativeId: "",
      representativePhoneNumber: "",
      mineralType: "coltan",
      supplyDate: "",
      time: "",
      weightIn: "",
      numberOfTags: "",
      beneficiary: "",
      mineTags: "",
      supplierId: "",
      //   negociantTags: "",
      //   mineralgrade: "",
      //   mineralprice: "",
      //   shipmentnumber: "",
      //   beneficiary: "",
      isSupplierBeneficiary: false,
    });
    setlotDetails([{ lotNumber: "", weightOut: "" }]);
  };

  const filteredSuppliers = sup.filter((supplier) => {
    const companyName = supplier.companyName || "";
    return companyName.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplierName(supplier.companyName);
    const chosenSupplier = sup.find((sup) => sup._id === supplier._id);
    if (chosenSupplier) {
      setFormval({
        ...formval,
        companyName: chosenSupplier.companyName,
        licenseNumber: chosenSupplier.licenseNumber,
        TINNumber: chosenSupplier.TINNumber,
        email: chosenSupplier.email,
        supplierId: chosenSupplier._id,
        companyRepresentative: chosenSupplier.companyRepresentative,
        representativePhoneNumber: chosenSupplier.phoneNumber,
      });
      setBeneficial(chosenSupplier.companyRepresentative);
    }
    setchecked(false);
    setFormval((prev) => ({ ...prev, supplierId: supplier._id }));
    setDropdownOpen(false);
    setSearchText("");
  };

  return (
    <>
      <ActionsPagesContainer
        title={"Register coltan entry test"}
        subTitle={"Add new coltan entry test"}
        actionsContainer={
          <AddComponent
            component={
              <div className="grid grid-cols-1 gap-1">
                {/* PARENT CONTAINER */}
                <ul className="grid grid-cols-1 items-center gap-1 gap-x-2 md:grid-cols-2 lg:grid-cols-3 pb-12">
                  <li className=" space-y-2 flex items-end gap-3 col-span-full ">
                    {/* CONTAINER CONTAINING BUILT DROPDOWN */}
                    <div>
                      <p>Trade in Company</p>

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
                          {isLoading ? (
                            <div className="w-full flex justify-start items-center gap-1">
                              <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500" />
                              <p className=" text-slate-400">
                                Fetching suppliers...
                              </p>
                            </div>
                          ) : (
                            <ul className={`list-none  overflow-auto `}>
                              {filteredSuppliers.map((supplier, index) => (
                                <li
                                  key={index}
                                  className=" hover:bg-slate-300 rounded-md p-2"
                                  onClick={() => handleSupplierSelect(supplier)}
                                >
                                  {supplier.companyName}
                                </li>
                              ))}
                            </ul>
                          )}
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

                <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {/* CONTAINER WITH THE INITIAL DATA FORM */}
                  {Object.keys(formval).map((key) => renderInputByType(key))}

                  <li className=" space-y-3 grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 col-span-full ">
                    {/* CONTAINER HAVING LOTS DYNAMICY FORM */}
                    <span className=" bg-slate-800 p-[0.5px] relative col-span-full mb-3">
                      <p className="pl-1 bg-white absolute -top-4 left-2 font-semibold">
                        Lots
                      </p>
                    </span>
                    <div className="col-span-1 space-y-3">
                      {lotDetails.map((lot, index) => (
                        <div
                          key={index}
                          className="flex gap-2 items-center w-full"
                        >
                          <p className=" font-semibold">{index + 1}</p>
                          <input
                            animate={{}}
                            type="number"
                            autoComplete="off"
                            className="focus:outline-none p-2 border rounded-md w-full"
                            name="weightOut"
                            value={lot.weightOut || ""}
                            onWheelCapture={(e) => {
                              e.target.blur();
                            }}
                            onChange={(e) => handleLotEntry(index, e)}
                          />
                          <HiMinus
                            onClick={() => handleLRemoveLot(index)}
                            className={`${
                              lotDetails.length - 1 == 0 ? "hidden" : ""
                            }`}
                          />
                          <HiPlus
                            onClick={handleAddLot}
                            className={`${
                              lotDetails.length - 1 !== index ? "hidden" : ""
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </li>
                </ul>
              </div>
            }
            Add={handleSubmit}
            Cancel={handleCancel}
            isloading={isSending}
            isvalid={result}
          />
        }
      />
    </>
  );
};
export default ColtanEntryDynamicForm;
