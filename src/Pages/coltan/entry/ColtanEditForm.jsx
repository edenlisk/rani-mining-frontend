import React, { Fragment, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import moment from "moment";
import { motion } from "framer-motion";
import {
  DatePicker,
  TimePicker,
  message,
  Spin,
  notification,
  Checkbox,
  Popover,
  Result,
} from "antd";
import ActionsPagesContainer from "../../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../../components/Actions components/AddComponent";
import {
  useUpdateEntryMutation,
    useGetEntryQuery,
  useGetOneEditRequestQuery,
  useUpdateEditRequestMutation,
  useGetSupplierTagsQuery,
  useGetAllSuppliersQuery,
} from "../../../states/apislice";
import { FiSearch } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { HiPlus, HiMinus, HiOutlineSearch } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import FetchingPage from "../../FetchingPage";
import {
  toCamelCase,
  openNotification,
  validateWeightInEntry,
} from "../../../components/helperFunctions";
import Countdown from "react-countdown";
import { BsChevronDown } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import ExistingMineTags from "../../ExistingMineTags";

const ColtanEditForm = () => {
  let sup = [""];
  const { entryId, requestId } = useParams();

  const navigate = useNavigate();
  const [isRequestAvailable, setIsRequestAvailable] = useState(() => {
    return !!requestId;
  });

  const [supplierId, setSupplierId] = useState("");

  const { data: requestData, isSuccess: isRequestSuccess } =
    useGetOneEditRequestQuery(
      { requestId },
      {
        skip: !isRequestAvailable,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
      }
    );
  const [
    updateEditRequest,
    { isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError },
  ] = useUpdateEditRequestMutation();

  const { data, isLoading, isError, error, isSuccess } =
    useGetEntryQuery(
      { entryId, model: "coltan" },
      {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
      }
    );
  const [
    updateEntry,
    {
      isLoading: isSending,
      isError: isFail,
      error: failError,
      isSuccess: isDone,
    },
  ] = useUpdateEntryMutation();

  const {
    data: supps,
    isLoading: isGetting,
    isError: isFault,
    error: fault,
    isSuccess: isGot,
  } = useGetAllSuppliersQuery();

  if (isGot) {
    const { data: dt } = supps;
    const { suppliers: sups } = dt;
    sup = sups;
  }

  useEffect(() => {
    if (isDone) {
      return message.success("Coltan entry updated successfully");
    } else if (isFail) {
      const { message: errorMessage } = failError.data;
      return message.error(errorMessage);
    }
  }, [isDone, isFail]);
  const [formval, setFormval] = useState({
    weightIn: "",
    companyName: "",
    licenseNumber: "",
    TINNumber: "",
    email: "",
    supplierId: "",
    companyRepresentative: "",
    representativeId: "",
    representativePhoneNumber: "",
    supplyDate: "",
    time: "",
    numberOfTags: "",
    mineTags: "",
    negociantTags: "",
    mineralType: "",
    mineralgrade: "",
    mineralprice: "",
    shipmentnumber: "",
    beneficiary: "",
    isSupplierBeneficiary: false,
  });
  const [lotDetails, setlotDetails] = useState([
    { lotNumber: "", weightOut: "" },
  ]);
  const [mineTags, setmineTags] = useState([
    { weight: null, tagNumber: "", sheetNumber: "", status: "" },
  ]);
  // ////
  const [initialMineTags, setInitialmineTags] = useState([
    { weight: null, tagNumber: "", sheetNumber: "", limit: "" },
  ]);
  const [negociantTags, setnegociantTags] = useState([
    { weight: null, tagNumber: "", sheetNumber: "", status: "" },
  ]);
  const [checked, setchecked] = useState(false);
  const [openlist, setOpenlist] = useState(false);
  const [search, setSearch] = useState("");
  const [model, setModel] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(-1);
  const [beneficial, setBeneficial] = useState("");
  const [admin, setAdmin] = useState({ role: "admin" });
  const [editableFields, setEditableFields] = useState([]);
  const [requestInfo, setRequestInfo] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSupplierName, setSelectedSupplierName] = useState(null);
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

  useEffect(() => {
    if (isRequestSuccess) {
      const { editRequest } = requestData.data;
      if (editRequest) {
        if (new Date(editRequest.editExpiresAt) < new Date()) {
          openNotification({
            message: "Request Expired",
            description: "This request has expired",
            type: "error",
          });
          navigate(-1);
        } else {
          setRequestInfo(editRequest);
          setEditableFields(editRequest.editableFields);
        }
      }
    }
  }, [isRequestSuccess]);

  const decideEditable = (field) => {
    if (editableFields) {
      const editableField = editableFields.find(
        (item) => toCamelCase(item.fieldname) === field
      );
      if (!editableField) {
        return true;
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const { data: dt } = data;
      const { entry: entr } = dt;
      // sup = sups;
      setSupplierId(entr.supplierId);
      setFormval({
        ...formval,
        weightIn: entr.weightIn,
        companyName: entr.companyName,
        licenseNumber: entr.licenseNumber,
        TINNumber: entr.TINNumber,
        email: entr.email,
        supplierId: entr.supplierId,
        companyRepresentative: entr.companyRepresentative,
        representativeId: entr.representativeId,
        representativePhoneNumber: entr.representativePhoneNumber,
        supplyDate: dayjs(entr.supplyDate),
        time: dayjs(entr.time, "HH:mm"),
        numberOfTags: entr.numberOfTags,
        mineralType: entr.mineralType,
        mineralgrade: "",
        mineralprice: "",
        shipmentnumber: "",
        beneficiary: entr.beneficiary,
        isSupplierBeneficiary: false,
      });
      setlotDetails(entr.output);
      if (entr.negociantTags?.length > 0) {
        setnegociantTags(entr.negociantTags);
      };
      
      if(entr.mineTags?.length > 0){
        setmineTags(entr.mineTags);
      };
    }
  }, [isSuccess]);

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
        companyRepresentative:chosenSupplier.companyRepresentative,
        beneficiary:chosenSupplier.companyRepresentative,
      });
      setBeneficial(chosenSupplier.companyRepresentative);
    }
    setchecked(false);
    setFormval((prev) => ({ ...prev, supplierId: supplier._id }));
    setDropdownOpen(false);
    setSearchText("");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const clickedBook = sup.find((sup) => sup._id === e.target.value);
    if (clickedBook) {
      setFormval({
        ...formval,
        companyName: clickedBook.companyName,
        licenseNumber: clickedBook.licenseNumber,
        TINNumber: clickedBook.TINNumber,
        email: clickedBook.email,
        supplierId: clickedBook._id,
      });
      setBeneficial(clickedBook.companyName);
    }
    setchecked(false);
  };
  const handleSearchCancel = () => {
    setSearch("");
    setSearchData([]);
    setSelectedItem(-1);
  };
  const handleSelectedSearch = (e) => {
    setSearch(e);
    setBeneficial(e);
    setOpenlist(false);
  };
  const handleKeydown = (e) => {
    if (selectedItem < searchData.length) {
      if (e.key === "ArrowUp" && selectedItem > 0) {
        setSelectedItem((prev) => prev - 1);
      } else if (
        e.key === "ArrowDown" &&
        selectedItem < searchData.length - 1
      ) {
        setSelectedItem((prev) => prev + 1);
      } else if (e.key === "Enter" && selectedItem >= 0) {
        setBeneficial(searchData[selectedItem].companyName);
        setSearch(searchData[selectedItem].companyName);
        setSelectedItem(-1);
        setSearchData([]);
        setOpenlist(false);
      }
    } else {
      selectedItem(-1);
    }
    if (e.key === "Enter") {
      setSearchData([]);
    }
  };

  const handleEntry = (e) => {
    setFormval((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "mineralType") {
      setModel(e.target.value);
    }
  };

  const handleAddDate = (dateString) => {
    setFormval((prevState) => ({
      ...prevState,
      supplyDate: dateString,
    }));
  };

  const handleAddTime = (timeString) => {
    setFormval((prevState) => ({
      ...prevState,
      time: timeString,
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
    if (editableFields.length > 0) {
      if (decideEditable("output")) return;
    }
    setlotDetails((prevLotDetails) => [
      ...prevLotDetails,
      { lotNumber: "", weightOut: "" },
    ]);
    updateLotNumbers();
  };

  const handleLotEntry = (index, e) => {
    validateWeightInEntry(index, lotDetails, e, formval.weightIn);
    setlotDetails((prevLotDetails) => {
      const updatedLotDetails = prevLotDetails.map((lot, i) => {
        if (i === index) {
          return {
            ...lot,
            [e.target.name]: e.target.value,
          };
        }
        return lot;
      });

      // If the lot doesn't exist in the previous state (i.e., it's a new lot)
      if (index === prevLotDetails.length) {
        return [
          ...updatedLotDetails,
          {
            lotNumber: prevLotDetails.length + 1,
            [e.target.name]: e.target.value,
          },
        ];
      }

      return updatedLotDetails;
    });
  };

  const handleLRemoveLot = (index) => {
    if (editableFields.length > 0) {
      if (decideEditable("output")) return;
    }
    const values = [...lotDetails];
    values.splice(index, 1);
    const updatedValues = values.map((lot, i) => {
      return {
        ...lot,
        lotNumber: i + 1,
      };
    });
    setlotDetails(updatedValues);
  };
  // /////
  const handleInitialMinetagsEntry = (e) => {
    setInitialmineTags({ ...initialMineTags, [e.target.name]: e.target.value });
  };
// //////
  const generateTags = () => {
    const { weight, sheetNumber } = initialMineTags;
    const startingTagNumber = parseInt(initialMineTags.tagNumber, 10) || 0;

    const tags = Array.from({ length:(parseInt(initialMineTags.limit, 10) || 0) }, (_, index) => {
      const tagNumber = startingTagNumber + index;
      return {
        weight,
        tagNumber: isNaN(tagNumber) ? initialMineTags.tagNumber : tagNumber.toString(),
        sheetNumber,
      };
    });
    setmineTags((prev)=>([...tags,...prev]));
    setInitialmineTags([
      { weight: null, tagNumber: "", sheetNumber: "", limit: "" },
    ]);
  };


  const handleAddMinesTag = () => {
    setmineTags((prevLotDetails) => [
      ...prevLotDetails,
      { weight: null, tagNumber: "", status: "", sheetNumber: "" },
    ]);
    updateLotNumbers();
  };

  const handleMinesTagEntry = (index, e) => {
    setmineTags((prevLotDetails) => {
      const updatedLotDetails = prevLotDetails.map((lot, i) => {
        if (i === index) {
          return {
            ...lot,
            [e.target.name]: e.target.value,
          };
        }
        return lot;
      });

      // If the lot doesn't exist in the previous state (i.e., it's a new lot)
      if (index === prevLotDetails.length) {
        return [
          ...updatedLotDetails,
          {
            lotNumber: prevLotDetails.length + 1,
            [e.target.name]: e.target.value,
          },
        ];
      }

      return updatedLotDetails;
    });
  };

  const handleLRemoveMinesTag = (index) => {
    const values = [...mineTags];
    values.splice(index, 1);
    const updatedValues = values.map((lot, i) => {
      return {
        ...lot,
      };
    });
    setmineTags(updatedValues);
  };

  const handleAddNegociantTags = () => {
    setnegociantTags((prevLotDetails) => [
      ...prevLotDetails,
      { weight: null, tagNumber: "", status: "", sheetNumber: "" },
    ]);
    updateLotNumbers();
  };

  const handleNegociantTagsEntry = (index, e) => {
    setnegociantTags((prevLotDetails) => {
      const updatedLotDetails = prevLotDetails.map((lot, i) => {
        if (i === index) {
          return {
            ...lot,
            [e.target.name]: e.target.value,
          };
        }
        return lot;
      });

      // If the lot doesn't exist in the previous state (i.e., it's a new lot)
      if (index === prevLotDetails.length) {
        return [
          ...updatedLotDetails,
          {
            lotNumber: prevLotDetails.length + 1,
            [e.target.name]: e.target.value,
          },
        ];
      }

      return updatedLotDetails;
    });
  };

  const handleLRemoveNegociantTags = (index) => {
    const values = [...negociantTags];
    values.splice(index, 1);
    const updatedValues = values.map((lot, i) => {
      return {
        ...lot,
      };
    });
    setnegociantTags(updatedValues);
  };

  function calculateTotalWeight(arr) {
    // Ensure the input is an array
    if (!Array.isArray(arr)) {
      throw new Error('Input must be an array');
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
  };

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

  const result = isTotalWeightGreater(lotDetails, formval.weightIn);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...formval,
      output: lotDetails,
      mineTags: mineTags,
      negociantTags: negociantTags,
    };
    const newBody = {};
    if (requestId) {
      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          const editable = editableFields.find(
            (item) => toCamelCase(item.fieldname) === `${key}`
          );
          if (editable) {
            newBody[`${key}`] = body[key];
          }
        }
      }
    }
    await updateEntry({ model: "coltan", entryId, body: requestId ? newBody : body });
    setFormval({
      weightIn: "",
      companyName: "",
      licenseNumber: "",
      TINNumber: "",
      email: "",
      supplierId: "",
      companyRepresentative: "",
      representativeId: "",
      representativePhoneNumber: "",
      supplyDate: "",
      time: "",
      numberOfTags: "",
      mineTags: "",
      negociantTags: "",
      mineralType: "",
      mineralgrade: "",
      mineralprice: "",
      shipmentnumber: "",
      beneficiary: "",
      isSupplierBeneficiary: false,
    });
    setlotDetails([{ lotNumber: "", weightOut: "" }]);
    setmineTags([{ weight: null, tagNumber: "", sheetNumber: "", status: "" }]);
    setnegociantTags([
      { weight: null, tagNumber: "", sheetNumber: "", status: "" },
    ]);
    navigate(-1);
  };
  const handleCancel = () => {
    setFormval({});
    setlotDetails([{ lotNumber: "", weightOut: "" }]);
    setmineTags([{ weight: null, tagNumber: "", sheetNumber: "", status: "" }]);
    setnegociantTags([
      { weight: null, tagNumber: "", sheetNumber: "", status: "" },
    ]);
    setchecked(false);
    setBeneficial("");
    navigate(-1);
  };

  const handleUpdate = async (body, record) => {
    await updateEditRequest({ body, requestId: record._id });
  };

  return (
    <>
      {isLoading ? (
        <FetchingPage />
      ) : (
        <ActionsPagesContainer
          title={"Edit coltan entry"}
          subTitle={"Edit/Update coltan entry"}
          actionsContainer={
            <AddComponent
              component={
                <div className="grid grid-cols-1 gap-y-10 pb-10">
                  <div className="flex justify-center">
                    {editableFields?.length > 0 ? (
                      <Countdown
                        date={dayjs(requestInfo?.editExpiresAt).valueOf()}
                        onComplete={() => {
                          if (requestInfo?.requestStatus === "authorized") {
                            handleUpdate(
                              { requestStatus: "expired" },
                              requestInfo
                            );
                            openNotification({
                              message: "Request Expired",
                              description: "This request has expired",
                              type: "error",
                            });
                            navigate(-1);
                          }
                        }}
                        renderer={({ hours, minutes, seconds, completed }) => {
                          if (completed) {
                            return <span>Timeout</span>;
                          } else {
                            return (
                              <span className="text-3xl">
                                {String(hours).padStart(2, "0")}:
                                {String(minutes).padStart(2, "0")}:
                                {String(seconds).padStart(2, "0")}
                              </span>
                            );
                          }
                        }}
                      />
                    ) : null}
                  </div>

                  <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <li className=" space-y-2 flex items-end gap-3 col-span-full ">
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
                            {isGetting ? (
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
                                    onClick={() =>
                                      handleSupplierSelect(supplier)
                                    }
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
                      type="button"
                        className=" bg-custom_blue-500 hover:bg-custom_blue-600 text-white shadow-md shadow-[#A6A6A6] py-[10px] px-[20px] rounded-md"
                        onClick={() => navigate("/add/supplier")}
                      >
                        New supplier
                      </button>
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Company name</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="companyName"
                        id="companyName"
                        disabled={
                          editableFields.length > 0
                            ? decideEditable("companyName")
                            : false
                        }
                        value={formval.companyName || ""}
                        onChange={handleEntry}
                      />
                    </li>

                    <li className=" space-y-1">
                      <p className="pl-1">TIN Number</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="TINNumber"
                        id="TINNumber"
                        disabled={
                          editableFields.length > 0
                            ? decideEditable("TINNumber")
                            : false
                        }
                        value={formval.TINNumber || ""}
                        onChange={handleEntry}
                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Licence number</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="licenseNumber"
                        id="licenseNumber"
                        disabled={
                          editableFields.length > 0
                            ? decideEditable("licenseNumber")
                            : false
                        }
                        value={formval.licenseNumber || ""}
                        onChange={handleEntry}
                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Company representative</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="companyRepresentative"
                        id="companyRepresentative"
                        disabled={
                          editableFields.length > 0
                            ? decideEditable("companyRepresentative")
                            : false
                        }
                        value={formval.companyRepresentative || ""}
                        onChange={handleEntry}
                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Representative ID number</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="representativeId"
                        id="representativeId"
                        disabled={
                          editableFields.length > 0
                            ? decideEditable("representativeId")
                            : false
                        }
                        value={formval.representativeId || ""}
                        onChange={handleEntry}
                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Representative phone nbr</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="representativePhoneNumber"
                        id="representativePhoneNumber"
                        disabled={
                          editableFields.length > 0
                            ? decideEditable("representativePhoneNumber")
                            : false
                        }
                        value={formval.representativePhoneNumber || ""}
                        onChange={handleEntry}
                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Minerals Types</p>
                      <input
                        autoComplete="off"
                        disabled
                        name="mineralType"
                        id="mineralType"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        value={formval.mineralType || ""}
                        onChange={handleEntry}
                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Date</p>
                      <DatePicker
                        value={
                          formval.supplyDate ? dayjs(formval.supplyDate) : null
                        }
                        onChange={handleAddDate}
                        id="supplyDate"
                        name="supplyDate"
                        disabled={
                          editableFields.length > 0
                            ? decideEditable("supplyDate")
                            : false
                        }
                        className=" focus:outline-none p-2 border rounded-md w-full"
                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Time</p>
                      <TimePicker
                        value={
                          formval.time ? dayjs(formval.time, "HH:mm") : null
                        }
                        onChange={handleAddTime}
                        format={"HH:mm"}
                        id="date"
                        name="date"
                        disabled={
                          editableFields.length > 0
                            ? decideEditable("time")
                            : false
                        }
                        className=" focus:outline-none p-2 border rounded-md w-full"
                      />
                    </li>

                    <li className=" space-y-1">
                      <p className="pl-1">Weight in</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="weightIn"
                        id="weightIn"
                        disabled={
                          editableFields.length > 0
                            ? decideEditable("weightIn")
                            : false
                        }
                        value={formval.weightIn || ""}
                        onChange={handleEntry}
                      />
                    </li>
                    <li className=" space-y-1">
                      <p className="pl-1">Number of Tags</p>
                      <input
                        type="number"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="numberOfTags"
                        id="numberOfTags"
                        disabled={
                          editableFields.length > 0
                            ? decideEditable("numberOfTags")
                            : false
                        }
                        value={formval.numberOfTags || ""}
                        onWheelCapture={(e) => {
                          e.target.blur();
                        }}
                        onChange={handleEntry}
                      />
                    </li>
                    <li className=" space-y-1">
                      <span className=" flex gap-2 items-center">
                        <p>Beneficiary</p>
                      </span>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="beneficiary"
                        id="beneficiary"
                        disabled={
                          editableFields.length > 0
                            ? decideEditable("beneficiary")
                            : false
                        }
                        value={formval.beneficiary || ""}
                        onChange={handleEntry}
                      />
                    </li>

                    <li className=" space-y-3 grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 col-span-full shadow-lg rounded-md p-4 mt-4 pb-6 bg-gray-100">
                      <span className=" border  border-b-0 relative col-span-full mb-3">
                        <p className="pl-1 bg-white absolute -top-4 left-2 px-1 rounded-lg font-semibold mx-2">
                          Lots
                        </p>
                      </span>
                      <div className="col-span-1 space-y-3">
                        {lotDetails.map((lot, index) => (
                          <div
                            key={index}
                            className="flex gap-2 items-center w-full"
                          >
                            <p className=" font-semibold">{lot.lotNumber}</p>
                            <input
                              animate={{}}
                              type="number"
                              autoComplete="off"
                              className="focus:outline-none p-2 border rounded-md w-full"
                              name="weightOut"
                              value={lot.weightOut || ""}
                              disabled={
                                editableFields.length > 0
                                  ? decideEditable("output")
                                  : false
                              }
                              onWheelCapture={(e) => {
                                e.target.blur();
                              }}
                              onChange={(e) => handleLotEntry(index, e)}
                            />
                            <HiMinus
                              onClick={() => handleLRemoveLot(index)}
                              type="button"
                              className={`${
                                lotDetails.length - 1 === 0 ? "hidden" : ""
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

                  {/* ///// */}
                  <Popover
                    placement="bottomLeft"
                    className="w-fit"
                    content={
                      <ul className=" col-span-full grid grid-cols-1 mt-3 gap-x-4 gap-y-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit w-full list-none items-center p-2 bg-white rounded-md py-4">
                        <li>
                          <p className="mb-1 font-semibold">Initial sheet number</p>
                          <input
                            type="text"
                            name="sheetNumber"
                            autoComplete="off"
                            className="focus:outline-none p-2 border rounded-lg w-full"
                            value={initialMineTags.sheetNumber || ""}
                            onWheelCapture={(e) => {
                              e.target.blur();
                            }}
                            onChange={handleInitialMinetagsEntry}
                          />
                        </li>

                        <li>
                          <p className="mb-1 font-semibold">Initial tag weight</p>
                          <input
                            type="text"
                            name="weight"
                            autoComplete="off"
                            className="focus:outline-none p-2 border rounded-lg w-full"
                            value={initialMineTags.weight || ""}
                            onWheelCapture={(e) => {
                              e.target.blur();
                            }}
                            onChange={handleInitialMinetagsEntry}
                          />
                        </li>
                        <li>
                          <p className="mb-1 font-semibold">Initial tag number</p>
                          <input
                            type="number"
                            name="tagNumber"
                            autoComplete="off"
                            className="focus:outline-none p-2 border rounded-lg w-full"
                            value={initialMineTags.tagNumber || ""}
                            onWheelCapture={(e) => {
                              e.target.blur();
                            }}
                            onChange={(e)=>{
                              if(e.target.value.toString().length >7){
                                message.warning("tag number can't be more than seven numbers");
                                // return;
                              }else{
                                handleInitialMinetagsEntry(e);
                              }
                            }}
                          />
                        </li>
                        <li>
                          <p className="mb-1 font-semibold">Tags to be generated </p>
                         <Popover placement="bottom" content={<>
                         <p>Enter tags to be generated including the first one</p>
                         </>} title="Tags to be generated limit" trigger="focus">
                         <input
                            type="text"
                            name="limit"
                            autoComplete="off"
                            className="focus:outline-none p-2 border rounded-lg w-full"
                            value={initialMineTags.limit || ""}
                            onWheelCapture={(e) => {
                              e.target.blur();
                            }}
                            onChange={handleInitialMinetagsEntry}
                          />
                         </Popover>
                        </li>
                        <li className=" col-span-full">
                        <button type="button" className="p-2 bg-green-500 shadow-md text-white rounded" onClick={generateTags}>confirm</button>
                        </li>
                      </ul>
                    }
                    title="Generate number of tags needed"
                    trigger="click"
                  >
                    <button type="button" className="bg-custom_blue-500 hover:bg-custom_blue-600 py-[10px] px-[20px] text-white shadow-[#A6A6A6] duration-300 transition-all rounded-md">
                      Select nbr of tags to enter
                    </button>
                  </Popover>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 relative h-fit list-none items-center mt-4 pb-9 border-t p-2 shadow-lg rounded-md bg-gray-100">
                    <p className=" col-span-full absolute -top-[13px] rounded-lg bg-white left-4 px-2 p-0 font-semibold">
                      Mine Tags (tickets)
                    </p>

                    {mineTags.map((tag, index) => (
                      <ul
                        className=" col-span-full grid grid-cols-1 mt-3 gap-x-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center relative p-2 bg-white rounded-md border py-4"
                        key={index}
                      >
                        <span className="flex items-center gap-2 col-span-full justify-end">
                          <p className=" font-semibold justify-self-start">
                            Mine Tag {index + 1}
                          </p>
                          <HiMinus
                            onClick={() => handleLRemoveMinesTag(index)}
                            className={`${
                              mineTags.length - 1 === 0 ? "hidden" : ""
                            }`}
                          />
                          <HiPlus
                            onClick={handleAddMinesTag}
                            className={`${
                              mineTags.length - 1 !== index ? "hidden" : ""
                            }`}
                          />
                        </span>

                        <li>
                          <p className="mb-1">Sheet number</p>
                          <input
                            type="text"
                            name="sheetNumber"
                            autoComplete="off"
                            disabled={
                              editableFields.length > 0
                                ? decideEditable("mineTags")
                                : false
                            }
                            className="focus:outline-none p-2 border rounded-lg w-full"
                            value={tag.sheetNumber || ""}
                            onWheelCapture={(e) => {
                              e.target.blur();
                            }}
                            onChange={(e) => handleMinesTagEntry(index, e)}
                          />
                        </li>

                        <li>
                          <p className="mb-1">Tag weight</p>
                          <input
                            type="text"
                            name="weight"
                            autoComplete="off"
                            disabled={
                              editableFields.length > 0
                                ? decideEditable("mineTags")
                                : false
                            }
                            className="focus:outline-none p-2 border rounded-lg w-full"
                            value={tag.weight || ""}
                            onWheelCapture={(e) => {
                              e.target.blur();
                            }}
                            onChange={(e) => handleMinesTagEntry(index, e)}
                          />
                        </li>
                        <li>
                          <p className="mb-1">Tag number</p>
                          <input
                            type="text"
                            name="tagNumber"
                            autoComplete="off"
                            disabled={
                              editableFields.length > 0
                                ? decideEditable("mineTags")
                                : false
                            }
                            className="focus:outline-none p-2 border rounded-lg w-full"
                            value={tag.tagNumber || ""}
                            onWheelCapture={(e) => {
                              e.target.blur();
                            }}
                            onChange={(e) => {
                              if(e.target.value.toString().length >7){
                                message.warning("tag number can't be more than seven numbers");
                                // return;
                              }else{
                                handleMinesTagEntry(index, e);
                              }
                            }}
                          />
                        </li>
                        <li>
                          <p className="mb-1">Status</p>
                          <select
                            name={`status`}
                            autoComplete="off"
                            disabled={
                              editableFields.length > 0
                                ? decideEditable("mineTags")
                                : false
                            }
                            className="focus:outline-none p-2 border rounded-md w-full"
                            defaultValue={tag.status || "defaultstatus"}
                            onChange={(e) => handleMinesTagEntry(index, e)}
                          >
                            <option value="defaultstatus" hidden>
                              {tag.status ? `${tag.status}` : "status"}
                            </option>
                            <option value="in store">In Store</option>
                            <option value="out of store">Out of Store</option>
                          </select>
                        </li>
                      </ul>
                    ))}
                  </ul>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center mt-4 pb-9 border-t relative p-2 shadow-lg rounded-md bg-gray-100">
                    <p className=" col-span-full absolute -top-[13px] rounded-lg bg-white left-4 px-2 p-0 font-semibold">
                      Negociant Tags (tickets)
                    </p>
                    {negociantTags.map((tag, index) => (
                      <ul
                        className=" col-span-full grid grid-cols-1 mt-3 gap-x-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center relative p-2 bg-white rounded-md border py-4"
                        key={index}
                      >
                        <span className="flex items-center gap-2 col-span-full justify-end">
                          <p className=" font-semibold justify-self-start">
                            Negociant Tag {index + 1}
                          </p>
                          <HiMinus
                            onClick={() => handleLRemoveNegociantTags(index)}
                            className={`${
                              negociantTags.length - 1 === 0 ? "hidden" : ""
                            }`}
                          />
                          <HiPlus
                            onClick={handleAddNegociantTags}
                            className={`${
                              negociantTags.length - 1 !== index ? "hidden" : ""
                            }`}
                          />
                        </span>

                        <li>
                          <p className="mb-1">Sheet number</p>
                          <input
                            type="text"
                            name="sheetNumber"
                            autoComplete="off"
                            disabled={
                              editableFields.length > 0
                                ? decideEditable("negociantTags")
                                : false
                            }
                            className="focus:outline-none p-2 border rounded-lg w-full"
                            value={tag.sheetNumber || ""}
                            onWheelCapture={(e) => {
                              e.target.blur();
                            }}
                            onChange={(e) => handleNegociantTagsEntry(index, e)}
                          />
                        </li>

                        <li>
                          <p className="mb-1">Tag weight</p>
                          <input
                            type="text"
                            name="weight"
                            autoComplete="off"
                            disabled={
                              editableFields.length > 0
                                ? decideEditable("negociantTags")
                                : false
                            }
                            className="focus:outline-none p-2 border rounded-lg w-full"
                            value={tag.weight || ""}
                            onWheelCapture={(e) => {
                              e.target.blur();
                            }}
                            onChange={(e) => handleNegociantTagsEntry(index, e)}
                          />
                        </li>
                        <li>
                          <p className="mb-1">Tag number</p>
                          <input
                            type="text"
                            name="tagNumber"
                            autoComplete="off"
                            disabled={
                              editableFields.length > 0
                                ? decideEditable("negociantTags")
                                : false
                            }
                            className="focus:outline-none p-2 border rounded-lg w-full"
                            value={tag.tagNumber || ""}
                            onWheelCapture={(e) => {
                              e.target.blur();
                            }}
                            onChange={(e) => handleNegociantTagsEntry(index, e)}
                          />
                        </li>
                        <li>
                          <p className="mb-1">Status</p>
                          <select
                            name={`status`}
                            autoComplete="off"
                            disabled={
                              editableFields.length > 0
                                ? decideEditable("negociantTags")
                                : false
                            }
                            className="focus:outline-none p-2 border rounded-md w-full"
                            defaultValue={tag.status || "defaultstatus"}
                            onChange={(e) => handleNegociantTagsEntry(index, e)}
                          >
                            <option value="defaultstatus" hidden>
                              {tag.status ? `${tag.status}` : "status"}
                            </option>
                            <option value="inStock">In stock</option>
                            <option value="exported">Exported</option>
                          </select>
                        </li>
                      </ul>
                    ))}
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
      )}
    </>
  );
};
export default ColtanEditForm;
