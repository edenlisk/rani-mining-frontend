import React, { useEffect, useState, useRef, useReducer } from "react";
import { formReducer, INITIAL_STATE, ACTION } from "./mineralRawEntryReducer";
import { motion } from "framer-motion";
import ActionsPagesContainer from "../../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../../components/Actions components/AddComponent";
import {
  useGetAllSuppliersQuery,
  useCreateEntryMutation,
} from "../../../states/apislice";
import { ImSpinner2 } from "react-icons/im";
import { HiPlus, HiMinus,HiOutlineSearch } from "react-icons/hi";
import { BsChevronDown } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import {
  isTotalWeightGreater,
  validateWeightInEntry,
} from "../../../components/helperFunctions";
import RenderFormHelper from "../../../components/RenderHelpersFunctions";
import {message} from "antd";

const MineralRawEntry = () => {
  const { model } = useParams();
  let sup = [""];
  const navigate = useNavigate();
  const { data, isLoading, isError, error, isSuccess } =
    useGetAllSuppliersQuery();
  const [
    createColtanEntry,
    {
      isLoading: isSending,
      isError: isCreatingError,
      error: createError,
      isSuccess: isCreated,
    },
  ] = useCreateEntryMutation();

  useEffect(() => {
    if (isCreated) {
      return message.success(`${model} entry created successfully`);
    } else if (isCreatingError) {
      const { message: errorMessage } = createError.data;
      return message.error(errorMessage);
    }
  }, [isCreated, isCreatingError, createError]);

  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);

  let modalRef = useRef();

  const handleClickOutside = (event) => {
    if (!modalRef.current || !modalRef.current.contains(event.target)) {
      dispatch({ type: ACTION.DROP_DOWN_OUT });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    // Update state when the route parameter changes
    dispatch({ type: ACTION.SET_MODEL, payload: model });
  }, [model]);

  if (isSuccess) {
    const { data: dt } = data;
    const { suppliers: sups } = dt;
    sup = sups;
  }

  const handleEntry = (e) => {
    dispatch({
      type: ACTION.HANDLE_ENTRY,
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleAddDate = (e) => {
    dispatch({ type: ACTION.ADD_DATE, payload: e });
  };

  const handleAddTime = (e) => {
    dispatch({ type: ACTION.ADD_TIME, payload: e });
  };

  const handleAddLot = () => {
    dispatch({ type: ACTION.ADD_LOT });
  };

  // TODO: validate weightIn entry
  const handleLotEntry = (index, e) => {
    validateWeightInEntry(index, state.lotDetails, e, state.formval.weightIn);
    dispatch({
      type: ACTION.HANDLE_LOT_ENTRY,
      payload: { name: e.target.name, value: e.target.value, index: index },
    });
  };

  const handleLRemoveLot = (index) => {
    dispatch({ type: ACTION.REMOVE_LOT, payload: index });
  };

  const handleCheck = () => {
    dispatch({ type: ACTION.HANDLE_CHECK });
  };

  const result = isTotalWeightGreater(state.lotDetails, state.formval.weightIn);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...state.formval, output: state.lotDetails };
    await createColtanEntry({ body, model });
    dispatch({ type: ACTION.RETURN_TO_INITIAL });
    navigate(-1);
  };
  const handleCancel = () => {
    dispatch({ type: ACTION.RETURN_TO_INITIAL });
  };

  const filteredSuppliers = sup.filter((supplier) => {
    const companyName = supplier.companyName || "";
    return companyName.toLowerCase().includes(state.searchText.toLowerCase());
  });

  const handleSearchInputChange = (e) => {
    dispatch({ type: ACTION.SEARCH_TEXT, payload: e.target.value });
  };

  const handleSupplierSelect = (supplier) => {
    const chosenSupplier = sup.find((sup) => sup._id === supplier._id);
    dispatch({
      type: ACTION.HANDLE_SUPPLIER_SELECT,
      payload: { chosenSupplier, supplier },
    });
  };

  return (
    <>
      <ActionsPagesContainer
        title={`Register ${model} entry`}
        subTitle={`Add new ${model} entry test`}
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
                            dispatch({ type: ACTION.DROP_DOWN });
                          }}
                        >
                          <p className=" ">
                            {state.selectedSupplierName
                              ? state.selectedSupplierName
                              : "select a supplier"}
                          </p>
                          <BsChevronDown
                            className={`text-md transition ease-in-out duration-500 ${
                              state.dropdownOpen ? "rotate-180" : null
                            }`}
                          />
                        </div>
                        <motion.div
                          animate={
                            state.dropdownOpen
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
                              value={state.searchText}
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
                  {Object.keys(state.formval).map((key) => (
                    <RenderFormHelper
                      key={key}
                      kase={key}
                      state={state}
                      handleAddDate={handleAddDate}
                      handleAddTime={handleAddTime}
                      handleCheck={handleCheck}
                      handleEntry={handleEntry}
                    />
                  ))}

                  <li className=" space-y-3 grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 col-span-full ">
                    {/* CONTAINER HAVING LOTS DYNAMICY FORM */}
                    <span className=" bg-slate-800 p-[0.5px] relative col-span-full mb-3">
                      <p className="pl-1 bg-white absolute -top-4 left-2 font-semibold">
                        Lots
                      </p>
                    </span>
                    <div className="col-span-1 space-y-3">
                      {state.lotDetails.map((lot, index) => (
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
                              state.lotDetails.length - 1 == 0 ? "hidden" : ""
                            }`}
                          />
                          <HiPlus
                            onClick={handleAddLot}
                            className={`${
                              state.lotDetails.length - 1 !== index
                                ? "hidden"
                                : ""
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
export default MineralRawEntry;
