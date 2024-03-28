import React, {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import {motion} from "framer-motion";
import {Button, Form, Input, message, Modal, Table, Upload} from "antd";
import AddComponent from "../../../components/Actions components/AddComponent";
import {ImSpinner2} from "react-icons/im";
import {FaImage, FaSave} from "react-icons/fa";
import {toast} from "react-toastify";
import {
    useUpdateEntryMutation,
    useGetEntryQuery,
    useDeleteGradeImgMutation,
} from "../../../states/apislice";
import {useNavigate, useParams} from "react-router-dom";
import FetchingPage from "../../FetchingPage";
import {getBase64FromServer, filterColumns, decidePricingGrade, AppUrls} from "../../../components/helperFunctions";
import {IoClose} from "react-icons/io5";
import {UploadOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import {BiSolidEditAlt} from "react-icons/bi";
import {MdOutlineClose, MdPayments} from "react-icons/md";
import {TbReport} from "react-icons/tb";
import {LotExpandable, PricingGrade} from "../../HelpersJsx";
import ConfirmFooter from "../../../components/modalsfooters/ConfirmFooter";
import DetailsPageContainer from "../../../components/Actions components/DetailsComponentscontainer";

const WolframiteEntryCompletePage = ({entryId}) => {
    const { permissions: userPermissions } = useSelector(state => state.persistedReducer?.global);
    // const {entryId} = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [selectedLotNumber, setSelectedLotNumber] = useState(null);
    const {data, isLoading, isError, isSuccess, error} =
    useGetEntryQuery({entryId, model: "wolframite"}, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });
    const [updateEntry, {
        isSuccess: isUpdateSuccess,
        isLoading: isSending,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateEntryMutation();
    const [deleteGradeImg, {
        isSuccess: isImageDeleteSuccess,
        isError: isImageDeleteError,
        error: imageDeleteError
    }] = useDeleteGradeImgMutation();

    let modalRef = useRef();

    const handleClickOutside = (event) => {
        if (!modalRef.current || !modalRef.current.contains(event.target)) {
            setShow(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    useEffect(() => {
        if (isUpdateSuccess) {
            return message.success("Entry updated successfully");
        } else if (isUpdateError) {
            const {message: errorMessage} = updateError.data;
            return message.error(errorMessage);
        }
    }, [isUpdateError, isUpdateSuccess, updateError]);
    const [formval, setFormval] = useState({
        lat: "",
        long: "",
        name: "",
        code: "",
    });
    const [selectedRow, SetSelectedRow] = useState({
        id: null,
        name: "",
        date: "",
    });
    const [suply, setSuply] = useState([]);
    const [lotInfo, setLotInfo] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [editRowKey, setEditRowKey] = useState("");
    const [show, setShow] = useState(false);
    const [showPayModel, setShowPayModel] = useState(false);

    /////////////////////////////
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handleClose = () => {
        setPreviewVisible(false);
    };

    const handlePreview = async (fileUrl) => {
        // const fileUrl = 'https://mining-company-management-system.onrender.com/data/coltan/DSC_0494.jpg';
        const previewedUrl = await getBase64FromServer(fileUrl);
        setPreviewImage(previewedUrl);
        setPreviewVisible(true);
    };

    const props = {
        onChange: (info) => {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                // refetch()
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const customRequest = async ({ file, onSuccess, onError, lotNumber }) => {
        const formData = new FormData();
        formData.append(lotNumber, file);
        await updateEntry({entryId, body: formData, model: "wolframite"});
    };

    const beforeUpload = (file) => {
        const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
        if (!isPNG) {
            message.error(`${file.name} is not a .png or .jpeg file`);
        }
        return isPNG || Upload.LIST_IGNORE;
    }

    const removeFile = async (lotNumber, entryId) => {
        const body = {lotNumber}
        await deleteGradeImg({body, entryId, model: "wolframite"});
    }


    useEffect(() => {
        if (isImageDeleteSuccess) {
            return message.success("File successfully deleted");
        } else if (isImageDeleteError) {
            const { message: deleteError } = imageDeleteError.data;
            return message.error(deleteError);
        }
    }, [isImageDeleteSuccess, isImageDeleteError, imageDeleteError]);

    ////////////////

    useEffect(() => {
        if (isSuccess || isUpdateSuccess) {
            const {data: info} = data;
            const {entry: entr} = info;
            setSuply(entr);
            setLotInfo(entr.output);
        }
    }, [isSuccess, isUpdateSuccess, data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {...suply, output: lotInfo};
        await updateEntry({body, entryId, model: "wolframite"});
        // navigate(-1);
    };
    const handleModelAdvance = async () => {
        const body = {...suply, output: lotInfo};
        await updateEntry({body, entryId, model: "wolframite"});
        navigate(`/payment/wolframite/${suply._id}/${selectedLotNumber}`);
    };

    const handleCancel = () => {
        setFormval({lat: "", long: "", name: "", code: ""});
        navigate(-1);
    };

    const isEditing = (record) => {
        return record._id === editRowKey;
    };
    const edit = (record) => {
        form.setFieldsValue({
            weightOut: record.weightOut,
            rmaFee: record.rmaFee,
            ...record,
        });
        setEditRowKey(record._id);
        setShow(false);
    };
    const calculatePricePerUnit = (MTU, grade) => {
        if (MTU && grade) {
            return ((MTU * grade/100) * 0.1);
        }
    }
    const save = async (key) => {
        const row = await form.validateFields();
        const newData = [...lotInfo];
        const index = newData.findIndex((item) => key === item._id);
        if (index > -1) {
            const item = newData[index];
            const updatedItem = {
                ...item,
                ...row,
            };
            if (item.metricTonUnit !== updatedItem.metricTonUnit) {
                if (Boolean(updatedItem.metricTonUnit) === false)
                    return message.error("MTU cannot be empty or zero", 5);
                if ((Boolean(item.metricTonUnit) === true && Boolean(updatedItem.metricTonUnit) === false))
                    return message.error("MTU cannot be empty or zero", 5);
                updatedItem.metricTonUnit = parseFloat(updatedItem.metricTonUnit);
            }
            // TODO 1: USE BOOLEAN TO INDICATE IF NON SELL OR NOT
            if (item.nonSellAgreement !== updatedItem.nonSellAgreement) {
                if (parseFloat(updatedItem.nonSellAgreement) > parseFloat(updatedItem.cumulativeAmount)) {
                    return message.error("Non Sell Agreement Amount cannot be greater than Weight Out", 5);
                }
                if (Boolean(item.nonSellAgreement) === true && Boolean(updatedItem.nonSellAgreement) === false) {
                    return message.error("Non Sell Agreement Amount cannot be empty", 5);
                }
                if (updatedItem.nonSellAgreement > 0) {
                    updatedItem.nonSellAgreement = {weight: updatedItem.weightOut};
                    updatedItem.cumulativeAmount = 0;
                } else {
                    updatedItem.nonSellAgreement = {weight: 0};
                    updatedItem.cumulativeAmount = updatedItem.weightOut;
                }
            }
            if (item.mineralGrade !== updatedItem.mineralGrade) {
                if (parseFloat(updatedItem.mineralGrade) === 0) return message.error("Mineral Grade cannot be empty or zero", 5);
                if (Boolean(item.mineralGrade) === true && Boolean(updatedItem.mineralGrade) === false)
                    return message.error("Mineral Grade cannot be empty or zero", 5);
            }

            if (item.ASIR !== updatedItem.ASIR) {
                if (parseFloat(updatedItem.ASIR) === 0) return message.error("ASIR cannot be zero", 5);
                if (Boolean(item.ASIR) === true && Boolean(updatedItem.ASIR) === false)
                    return message.error("ASIR cannot be empty or zero", 5);
            }

            if (item.USDRate !== updatedItem.USDRate) {
                if (parseFloat(updatedItem.USDRate) === 0) return message.error("USD rate cannot be empty or zero", 5);
                if (Boolean(item.USDRate) === true && Boolean(updatedItem.USDRate) === false)
                    return message.error("USD rate cannot be empty or zero", 5);
            }
            if (Boolean(updatedItem.metricTonUnit) === true && updatedItem.pricingGrade && Boolean(updatedItem[decidePricingGrade(updatedItem.pricingGrade)]) === true) {
                updatedItem.pricePerUnit = calculatePricePerUnit(parseFloat(updatedItem.metricTonUnit), parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)])).toFixed(5) || null;
            }
            if (Boolean(updatedItem.pricePerUnit) === true) {
                updatedItem.mineralPrice = (updatedItem.pricePerUnit * parseFloat(updatedItem.weightOut)).toFixed(5) || null;
            }
            newData.splice(index, 1, updatedItem);
            setLotInfo(newData);
            setEditRowKey("");
            const body = { output: [updatedItem]};
            await updateEntry({body, entryId, model: "wolframite"});
        }
    };
    const handleActions = (id) => {
        setShow(!show);
        SetSelectedRow(id);
    };
    const restrictedColumns = {
        ASIR: {
            title: "ASIR",
            dataIndex: "ASIR",
            key: "ASIR",
            table: true,
        },
        mineralGrade: {
            title: "Grade-RANI(%)",
            dataIndex: "mineralGrade",
            key: "mineralGrade",
            table: true,
        },
        metricTonUnit: {
            title: "MTU ($)",
            dataIndex: "metricTonUnit",
            key: "metricTonUnit",
            table: true,
        },
        gradeImg: {
            title: "Grade Img",
            dataIndex: "gradeImg",
            key: "gradeImg",
            width: 40,
            table: true,
            // editTable: true,
            render: (_, record) => {
                if (record.gradeImg?.filePath !== null) {
                    return (
                        <div>
                            <div className="flex items-center">
                                <Button onClick={() => handlePreview(record.gradeImg.filePath)}
                                        icon={<FaImage title="Preview" className="text-lg"/>}/>
                                {userPermissions.gradeImg.edit && (<IoClose title="Delete" className="text-lg"
                                                                            onClick={() => removeFile(record.lotNumber, entryId)}/>)}
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <Upload
                            beforeUpload={beforeUpload}
                            // name={record.lotNumber}
                            // action={`${AppUrls.server}/coltan/${entryId}`}
                            // method="PATCH"
                            {...props}
                            customRequest={async ({file, onSuccess, onError}) => customRequest({
                                file,
                                onSuccess,
                                onError,
                                lotNumber: record.lotNumber
                            })}
                            onRemove={() => removeFile(record.lotNumber, entryId)}
                        >
                            <Button icon={<UploadOutlined/>}/>
                        </Upload>
                    )
                }
            }
        },
        pricingGrade: {
            title: "Pricing Grade",
            dataIndex: "pricingGrade",
            key: "pricingGrade",
            table: true,
            width: 80,
            render: (_, record) => {
                return (
                    <PricingGrade
                        value={record.pricingGrade ? record.pricingGrade : ""}
                        lotNumber={record.lotNumber}
                        updateEntry={updateEntry}
                        entryId={entryId}
                        model={"wolframite"}
                    />
                )

            }
        },
        pricePerUnit: {
            title: "price/kg ($)",
            dataIndex: "pricePerUnit",
            key: "pricePerUnit",
            table: true,
        },
        mineralPrice: {
            title: "Price ($)",
            dataIndex: "mineralPrice",
            key: "mineralPrice",
            table: true,
        },
        netPrice: {
            title: "Net Price ($)",
            dataIndex: "netPrice",
            key: "netPrice",
            table: true,
        },
        paid: {
            title: "paid ($)",
            dataIndex: "paid",
            key: "paid",
            table: false,
        },
        rmaFeeRWF: {
            title: "RMA Fee (RWF)",
            dataIndex: "rmaFeeRWF",
            key: "rmaFeeRWF",
            table: false,
        },
        USDRate: {
            title: "USD Rate (rwf)",
            dataIndex: "USDRate",
            key: "USDRate",
            table: false
        },
        rmaFeeUSD: {
            title: "RMA Fee ($)",
            dataIndex: "rmaFeeUSD",
            key: "rmaFeeUSD",
            table: false,
        },
        sampleIdentification: {
            title: "Sample Identification",
            dataIndex: "sampleIdentification",
            key: "sampleIdentification",
            table: false,
        },
        rmaFeeDecision: {
            title: "RMA Fee Decision",
            dataIndex: "rmaFeeDecision",
            key: "rmaFeeDecision",
            table: false,
        },
        nonSellAgreement: {
            title: "non-sell agreement (KG)",
            dataIndex: "nonSellAgreement",
            key: "nonSellAgreement",
            editTable: true,
            table: false,
            render: (_, record) => {
                if (record.nonSellAgreement?.weight) {
                    return <span>{record.nonSellAgreement?.weight}</span>
                }
            }
        }
    }
    const columns = [
        {
            title: "#",
            dataIndex: "lotNumber",
            key: "lotNumber",
        },
        {
            title: "weight out (KG)",
            dataIndex: "weightOut",
            key: "weightOut",
            editable: true,
        },
        {
            title: "balance (KG)",
            dataIndex: "cumulativeAmount",
            key: "cumulativeAmount",
        },
    ];


    if (restrictedColumns && userPermissions && columns) {
        filterColumns(restrictedColumns, userPermissions, columns, "wolframite");
        columns.push({
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, record) => {
                const editable = isEditing(record);
                return (
                    <>
                        <div className="flex items-center gap-2">
                            {editable ? null : (
                                <>
                  <span className="relative">
                    <PiDotsThreeVerticalBold
                        className=" text-xl"
                        onClick={() => handleActions(record._id)}
                    />
                      {selectedRow === record._id && (
                          <motion.ul
                              ref={modalRef}
                              animate={
                                  show
                                      ? {opacity: 1, x: -10, display: "block"}
                                      : {opacity: 0, x: 0, display: "none"}
                              }
                              className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}
                          >
                              <li
                                  className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                  onClick={() => edit(record)}
                              >
                                  <BiSolidEditAlt className=" text-lg"/>
                                  <p>edit</p>
                              </li>

                              { /* // TODO 7: USE CORRECT PERMISSION OBJECT INSTEAD OF ENTRY */ }
                              {userPermissions.entry?.create ? (
                                  <li
                                      className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                      onClick={() => navigate(`/lab-report/wolframite/${entryId}/${record.lotNumber}`)}
                                  >
                                      <TbReport  className=" text-lg"/>
                                      <p>Lab Report</p>
                                  </li>
                              ) : null}

                              {userPermissions.payments?.create ? (
                                  <li
                                      className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                      onClick={() => {
                                          setSelectedLotNumber(record.lotNumber);
                                          setShowPayModel(true);
                                      }}
                                  >
                                      <MdPayments className=" text-lg"/>
                                      <p>Pay</p>
                                  </li>
                              ) : null}
                          </motion.ul>
                      )}
                  </span>
                                </>
                            )}

                            {editable ? (
                                <div className="flex items-center gap-3">
                                    <FaSave
                                        className=" text-xl"
                                        onClick={() => save(record._id)}
                                    />
                                    <MdOutlineClose
                                        className=" text-xl"
                                        onClick={() => setEditRowKey("")}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </>
                );
            },
        });
    }

    // const handleRealTimeChange = (e, record) => {
    //     const {name, value} = e.target;
    //     if (name === "metricTonUnit") {
    //         record["pricePerUnit"] = record["pricePerUnit"]
    //     }
    // }



    const mergedColumns = columns.map((col) => {
        if (!col.editTable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const EditableCell = ({
                              editing,
                              dataIndex,
                              title,
                              record,
                              children,
                              ...restProps
                          }) => {
        const input = (
            <Input
                style={{margin: 0}}
                type={"number"}
                onWheelCapture={(e) => {
                    e.target.blur();
                }}
            />
        );
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item name={dataIndex} style={{margin: 0}}>
                        {input}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    return (
        <>
         {isLoading ? (
        <FetchingPage />
      ) : (
            <DetailsPageContainer
                title={"LOT DETAILS"}
                // subTitle={"View Wolframite detailes"}
                actionsContainer={
                    <AddComponent
                        component={
                            <>
                                {/*{isLoading ? (*/}
                                {/*    <div className="flex h-32 w-full items-center justify-center bg-white">*/}
                                {/*        <ImSpinner2 className=" h-10 w-10 animate-spin text-gray-400"/>*/}
                                {/*    </div>*/}
                                {/*) : (*/}
                                {/*    <div className="flex flex-col gap-6 w-full">*/}
                                {/*        <div*/}
                                {/*            className="w-full  grid grid-cols-2 p-2 border-b items-center justify-between rounded-md">*/}
                                {/*            <p className=" font-semibold text-lg">Entry details</p>*/}
                                {/*        </div>*/}

                                {/*        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full pb-6">*/}
                                {/*            <li>*/}
                                {/*                <p className=" text-md text-indigo-500 pb-[1px] font-semibold">*/}
                                {/*                    Entry details*/}
                                {/*                </p>*/}
                                {/*                <p>Weight in: {suply?.weightIn}</p>*/}
                                {/*                <p>Mineral type: {suply?.mineralType}</p>*/}
                                {/*                /!* <p>Supply date: {dayjs(suply?.supplyDate).format("MMM DD, YYYY")}</p> *!/*/}
                                {/*                <p>Number of tags: {suply?.numberOfTags}</p>*/}
                                {/*                <p>Beneficiary: {suply?.beneficiary}</p>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <p className=" text-md text-indigo-500 pb-[1px] font-semibold">*/}
                                {/*                    Company info*/}
                                {/*                </p>*/}
                                {/*                <p>Name: {suply?.companyName}</p>*/}
                                {/*                <p>Email: {suply.email}</p>*/}
                                {/*                <p>TIN Number: {suply.TINNumber}</p>*/}
                                {/*                <p className=" shrink">*/}
                                {/*                    License Number: {suply.licenseNumber}*/}
                                {/*                </p>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <p className=" text-md text-indigo-500 pb-[1px] font-semibold">*/}
                                {/*                    Representative info*/}
                                {/*                </p>*/}
                                {/*                <p>Phone number: {suply.representativePhoneNumber}</p>*/}
                                {/*                <p>ID: {suply.representativeId}</p>*/}
                                {/*                /!*<p>Nbr of Transporters:{suply.numberOfTransporters}</p>*!/*/}
                                {/*            </li>*/}

                                {/*        </ul>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                                <div className="w-full">
                                    <Form form={form} component={false}>
                                        <Table
                                            className="overflow-x-auto w-full"
                                            loading={{
                                                indicator: (<ImSpinner2 style={{width: "60px", height: "60px"}}
                                                                        className="animate-spin text-gray-500"/>),
                                                spinning: isLoading
                                            }}
                                            dataSource={lotInfo}
                                            columns={mergedColumns}
                                            rowClassName={(record) => {
                                                if (record.status === "non-sell agreement") {
                                                    return "bg-red-200";
                                                }
                                            }}
                                            bordered={true}
                                            expandable={{
                                                expandedRowRender: record => {
                                                    return (
                                                        <LotExpandable
                                                            entryId={entryId}
                                                            record={record}
                                                            restrictedColumns={restrictedColumns}
                                                            userPermissions={userPermissions}
                                                            isProcessing={isSending}
                                                            updateEntry={updateEntry}
                                                            model={"wolframite"}
                                                        />
                                                    )
                                                },
                                                rowExpandable: record => record,
                                            }}
                                            components={{
                                                body: {
                                                    cell: EditableCell,
                                                },
                                            }}
                                            rowKey="_id"
                                        />
                                    </Form>
                                </div>
                                <Modal
                                    open={showPayModel}
                                    onOk={""}
                                    onCancel={() => setShowPayModel(!showPayModel)}
                                    destroyOnClose
                                    footer={[
                     <ConfirmFooter key={"actions"} isSending={isSending} defText={"Confirm"} dsText={"Sending"} handleCancel={() => setShowPayModel(!showPayModel)} handleConfirm={handleModelAdvance}/>
                                    ]}
                                >
                                    <h2 className="modal-title text-center font-bold text-xl">
                                        Proceed Payment
                                    </h2>
                                    <p className="text-center text-lg">
                                        {`Please verify all the information before proceeding`}.
                                    </p>
                                </Modal>

                                <Modal
                                    width={'70%'}

                                    open={previewVisible}
                                    title="Image Preview"
                                    footer={null}
                                    onCancel={handleClose}
                                >
                                    <img alt="example" style={{width: '100%', height: "100%"}} src={previewImage}/>
                                </Modal>
                            </>
                        }
                        Add={handleSubmit}
                        Cancel={handleCancel}
                        isloading={isSending}
                    />
                }
            />)}
        </>
    );
};
export default WolframiteEntryCompletePage;
