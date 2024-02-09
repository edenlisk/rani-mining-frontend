import React, { Fragment, useEffect, useReducer, useRef, useState } from "react";
import dayjs from "dayjs";
import moment from "moment";
import { motion } from "framer-motion";
import {
  message,
  Popover,
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
import { HiPlus, HiMinus, HiOutlineSearch } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import FetchingPage from "../../FetchingPage";
import {
  toCamelCase,
  openNotification,
  validateWeightInEntry,
  isTotalWeightGreater,
} from "../../../components/helperFunctions";
import Countdown from "react-countdown";
import { BsChevronDown } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { formEditReducer,INITIAL_STATE,ACTION } from "./mineralEntryEditReducer";
import RenderFormHelper from "../../../components/RenderHelpersFunctions";

const MineralEntryEdit = () => {
  let sup = [""];
  const { entryId, requestId,model } = useParams();

  const navigate = useNavigate();
//   STAYS
  const [isRequestAvailable, setIsRequestAvailable] = useState(() => {
    return !!requestId;
  });


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
      { entryId, model: model},
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
// STAY
  const [editableFields, setEditableFields] = useState([]);
  //   STAY
    const [requestInfo, setRequestInfo] = useState({});
    const [state, dispatch] = useReducer(formEditReducer, INITIAL_STATE);
  
    let modalRef = useRef();
    const nullcases=['email','mineralgrade','shipmentnumber','mineralprice','mineTags','supplierId','isSupplierBeneficiary'];

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
  console.log(editableFields)
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
      // console.log(dt)
      // sup = sups;
      dispatch({type:ACTION.SET_TO_SERVER_DATA,payload:{entr}});
    }
  }, [isSuccess]);

  const filteredSuppliers = sup.filter((supplier) => {
    const companyName = supplier.companyName || "";
    return companyName.toLowerCase().includes(state.searchText.toLowerCase());
  });

  const handleSearchInputChange = (e) => {
    dispatch({ type: ACTION.SEARCH_TEXT, payload: e.target.value });
  };

  const handleSupplierSelect = (supplier) => {
    // setSelectedSupplierName(supplier.companyName);
    const chosenSupplier = sup.find((sup) => sup._id === supplier._id);
    dispatch({
        type: ACTION.HANDLE_SUPPLIER_SELECT,
        payload: { chosenSupplier, supplier },
      });
  };

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
    if (editableFields.length > 0) {
      if (decideEditable("output")) return;
    };
    dispatch({ type: ACTION.ADD_LOT });
  };

  const handleLotEntry = (index, e) => {
    validateWeightInEntry(index, state.lotDetails, e, state.formval.weightIn);
    dispatch({
      type: ACTION.HANDLE_LOT_ENTRY,
      payload: { name: e.target.name, value: e.target.value, index: index },
    });
  };

  const handleLRemoveLot = (index) => {
    if (editableFields.length > 0) {
      if (decideEditable("output")) return;
    };
    dispatch({ type: ACTION.REMOVE_LOT, payload: index });
  };
  // /////
  const handleInitialMinetagsEntry = (e) => {
    dispatch({type:ACTION.HANDLE_INITIAL_MINE_TAGS_ENTRY, payload:{name:e.target.name, value:e.target.value}});
    // console.log(state.initialMineTags)
  };
// //////
  const generateTags = () => {
    dispatch({ type: ACTION.GENERATE_MINE_TAGS });
  };


  const handleAddMinesTag = () => {
    dispatch({ type:ACTION.ADD_MINES_TAG_LOT });
  };

  const handleMinesTagEntry = (index, e) => {
    dispatch({
      type: ACTION.HANDLE_LOT_MINES_TAG_ENTRY,
      payload: { mFieldName: e.target.name, mValue: e.target.value, mIndex: index },
    });
  };

  const handleLRemoveMinesTag = (index) => {
    dispatch({ type: ACTION.REMOVE_MINES_TAG_LOT, payload: index });
  };

  const handleAddNegociantTags = () => {
    dispatch({ type: ACTION.ADD_NEGOTIANT_TAG_LOT });
  };

  const handleNegociantTagsEntry = (index, e) => {
    dispatch({
      type: ACTION.HANDLE_LOT_NEGOTIANT_TAG_ENTRY,
      payload: { fieldName: e.target.name, nValue: e.target.value, nIndex: index },
    });
  };

  const handleLRemoveNegociantTags = (index) => {
    dispatch({ type: ACTION.REMOVE_NEGOTIANT_TAG_LOT, payload: index });
  };

  const result = isTotalWeightGreater(state.lotDetails, state.formval.weightIn);

  const handleCheck = () => {
    dispatch({ type: ACTION.HANDLE_CHECK });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...state.formval,
      output: state.lotDetails,
      mineTags: state.mineTags,
      negociantTags: state.negociantTags,
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
    };
    // console.log({ model: model, entryId, body: requestId ? newBody : body })
    console.log(body);
    await updateEntry({ model: "coltan", entryId, body: requestId ? newBody : body });
    dispatch({type:ACTION.RETURN_TO_INITIAL});
    navigate(-1);
  };
  const handleCancel = () => {
    dispatch({type:ACTION.RETURN_TO_INITIAL});
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
          title={`Edit ${model} entry`}
          subTitle={`Edit/Update ${model} entry`}
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
                                value={state.searchText}
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
                    {/* TO MAKE COMPONENT WITH RENDERFORM  */}
                    {Object.keys(state.formval).map((key) => (
                    <RenderFormHelper
                      key={key}
                      kase={key}
                      state={state}
                      handleAddDate={handleAddDate}
                      handleAddTime={handleAddTime}
                      handleCheck={handleCheck}
                      handleEntry={handleEntry}
                      editableFields={editableFields}
                      nullCases={nullcases}
                    />
                  ))}

                    {/* TO MAKE COMPONENT */}

                    <li className=" space-y-3 grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 col-span-full shadow-lg rounded-md p-4 mt-4 pb-6 bg-gray-100">
                      <span className=" border  border-b-0 relative col-span-full mb-3">
                        <p className="pl-1 bg-white absolute -top-4 left-2 px-1 rounded-lg font-semibold mx-2">
                          Lots
                        </p>
                      </span>
                      <div className="col-span-1 space-y-3">
                        {state.lotDetails.map((lot, index) => (
                          <div
                            key={index}
                            className="flex gap-2 items-center w-full"
                          >
                            <p className=" font-semibold">{index+1}</p>
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
                                state.lotDetails.length - 1 === 0 ? "hidden" : ""
                              }`}
                            />
                            <HiPlus
                              onClick={handleAddLot}
                              className={`${
                                state.lotDetails.length - 1 !== index ? "hidden" : ""
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
                            value={state.initialMineTags.sheetNumber || ""}
                            onWheelCapture={(e) => {
                              e.target.blur();
                            }}
                            onChange={handleInitialMinetagsEntry}
                          />
                        </li>

                        <li>
                          <p className="mb-1 font-semibold">Initial tag weight</p>
                          <input
                            type="number"
                            name="weight"
                            autoComplete="off"
                            className="focus:outline-none p-2 border rounded-lg w-full"
                            value={state.initialMineTags.weight || ""}
                            onWheelCapture={(e) => {
                              e.target.blur();
                            }}
                            onChange={(e)=>{
                              if(parseFloat(e.target.value) >71){
                                message.warning("tag weight can't be more than 71 kilograms");
                                // return;
                              }else{
                                handleInitialMinetagsEntry(e);
                              }
                            }}
                          />
                        </li>
                        <li>
                          <p className="mb-1 font-semibold">Initial tag number</p>
                          <input
                            type="text"
                            name="tagNumber"
                            autoComplete="off"
                            className="focus:outline-none p-2 border rounded-lg w-full"
                            value={state.initialMineTags.tagNumber || ""}
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
                            }
                          }
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
                            value={state.initialMineTags.limit || ""}
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

                    {state.mineTags.map((tag, index) => (
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
                              state.mineTags.length - 1 === 0 ? "hidden" : ""
                            }`}
                          />
                          <HiPlus
                            onClick={handleAddMinesTag}
                            className={`${
                              state.mineTags.length - 1 !== index ? "hidden" : ""
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
                    {state.negociantTags.map((tag, index) => (
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
                              state.negociantTags.length - 1 === 0 ? "hidden" : ""
                            }`}
                          />
                          <HiPlus
                            onClick={handleAddNegociantTags}
                            className={`${
                              state.negociantTags.length - 1 !== index ? "hidden" : ""
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
export default MineralEntryEdit;
