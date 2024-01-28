import React from "react";
import {DatePicker, TimePicker} from "antd";
import dayjs from "dayjs";
import {FormatTolabelCase, toCamelCase} from "./helperFunctions";

const RenderFormHelper = ({
                              kase,
                              state,
                              nullCases,
                              handleAddDate,
                              handleAddTime,
                              handleEntry,
                              handleCheck,
                              editableFields,
                          }) => {
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

    if (nullCases?.includes(kase)) {
        return null;
    }
    switch (kase) {
        case "beneficiary":
            return (
                <li className=" space-y-1" key="beneficiary">
          <span className=" flex gap-2 items-center">
            <p>{FormatTolabelCase("beneficiary")}</p>
            <span
                className={`border h-4 w-9 rounded-xl p-[0.5px] duration-200 transform ease-in-out flex ${
                    state.checked
                        ? " justify-end bg-green-400"
                        : " justify-start bg-slate-400"
                }`}
                onClick={handleCheck}
            >
              <span className={` w-4 h- border bg-white rounded-full `}/>
            </span>
          </span>
                    <input
                        type="text"
                        autoComplete="off"
                        disabled={
                            (state.checked) || (editableFields?.length > 0
                                ? decideEditable("beneficiary")
                                : false)
                        }
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name="beneficiary"
                        id="beneficiary"
                        value={state.formval.beneficiary || ""}
                        onChange={handleEntry}
                    />
                </li>
          );
        case "supplierId":
          return null;
        case "isSupplierBeneficiary":
            return null;
        case "time":
            return (
                <li className=" space-y-1" key="time">
                    {<p className="pl-1">{FormatTolabelCase("time")}</p>}
                    <TimePicker
                        value={
                            state.formval.time ? dayjs(state.formval.time, "HH:mm") : null
                        }
                        disabled={
                            editableFields?.length > 0 ? decideEditable("time") : false
                        }
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
                        value={
                            state.formval.supplyDate ? dayjs(state.formval.supplyDate) : null
                        }
                        disabled={
                            editableFields?.length > 0 ? decideEditable("supplyDate") : false
                        }
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
                        value={state.formval.mineralType || ""}
                        disabled
                        onChange={handleEntry}
                    />
                </li>
            );
        default:
            return (
                <li className=" space-y-1" key={kase}>
                    {<p className="pl-1">{FormatTolabelCase(kase)}</p>}
                    <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-md w-full"
                        name={kase}
                        value={state.formval[kase] || ""}
                        disabled={
                            editableFields?.length > 0 ? decideEditable(kase) : false
                        }
                        onChange={handleEntry}
                    />
                </li>
            );
    }
};
export default RenderFormHelper;
