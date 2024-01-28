import React, {useEffect, useState} from "react";
import {DatePicker, Radio, message, Modal} from "antd";
import {ImSpinner2} from "react-icons/im";
import {BsCheck2} from "react-icons/bs";
import {MdClose} from "react-icons/md";
// import {Model} from "echarts/types/src/export/api";
import dayjs from "dayjs";
import { useUpdatePaymentMutation } from "../states/apislice";


const EditPayment = ({editModalOpen, setEditModalOpen, paymentInfo}) => {

    const [updatePayment, {isSuccess, isLoading, isError, error}] = useUpdatePaymentMutation();

    const [payment, setPayment] = useState({beneficiary: "", paymentAmount: "", location: "", phoneNumber: "", paymentMode: "", paymentDate: "", paymentId: ""});

    useEffect(() => {
        if (isSuccess) {
            return message.success("Payment Updated Successfully");
        } else if (isError) {
            const { message: errorMessage } = error.data;
            return message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);

    useEffect(() => {
        if (paymentInfo) {
            setPayment(paymentInfo);
        }
    }, [paymentInfo]);

    const handleChange = (e) => {
        setPayment(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }

    const handleAddDate = (e) => {
        setPayment(prevState => ({ ...prevState, paymentDate: dayjs(e).format('MMM/DD/YYYY') }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {...payment};
        await updatePayment({body, paymentId: payment.paymentId, model: paymentInfo.model});
        setEditModalOpen(false);
    }

    const handleCancel = () => {
        setPayment({beneficiary: "", paymentAmount: "", location: "", phoneNumber: "", paymentMode: "", paymentDate: "", paymentId: ""});
        setEditModalOpen(false);
    }

    return (
        <Modal
            okText={"Submit"}
            width={"80%"}
            okButtonProps={{className: "bg-green-500"}}
            open={editModalOpen}
            title={"Edit Payment"}
            onCancel={() => setEditModalOpen(false)}
            footer={null}
            onOk={() => handleSubmit}
            destroyOnClose={true}
        >
            <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-2 bg-gray-100 rounded-md p-2 shadow-lg shadow-zinc-300">
                <span className=" space-y-1">
                    <p className="pl-1">Date</p>
                    <DatePicker  onChange={handleAddDate} id="paymentDate" name="paymentDate" className=" focus:outline-none p-2 border rounded-md w-full" />
                </span>
                <span className=" space-y-1">
                    <p className="pl-1">Beneficiary</p>
                    <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="beneficiary" id="beneficiary" value={payment.beneficiary || ''} onChange={handleChange} />
                </span>
                <span className=" space-y-1">
                    <p className="pl-1">Amount</p>
                    <input type="number" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="paymentAmount" id="paymentAmount" value={payment.paymentAmount || ''} onWheelCapture={e => { e.target.blur() }} onChange={handleChange} />
                </span>
                <span className=" space-y-1">
                    <p className="pl-1">Location</p>
                    <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="location" id="location" value={payment.location || ''} onChange={handleChange} />
                </span>
                <span className=" space-y-1">
                    <p className="pl-1">Phone number</p>
                    <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="phoneNumber" id="phoneNumber" value={payment.phoneNumber || ''} onChange={handleChange} />
                </span>
                <span className=" space-y-1">
                     <p className="pl-1">Payment mode</p>
                     <Radio.Group name="paymentMode" id="paymentMode" onChange={handleChange} value={payment.paymentMode}>
                      <Radio value={"Cash"}>Cash</Radio>
                      <Radio value={"Bank Transfer"}>Bank Transfer</Radio>
                      <Radio value={"Cheque"}>Cheque</Radio>
                    </Radio.Group>
                </span>
                <span className=" grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-full justify-self-start">
                    {isLoading ?
                        <button type="button" className="bg-green-200 flex items-center gap-2 py-[7.5px] px-[20px] text-green-600  rounded cursor-not-allowed">
                            <ImSpinner2 className="h-[18px] w-[18px] animate-spin text-green-600" />
                            <p className="">Sending</p>
                        </button>:
                        <button onClick={handleSubmit} type="button" className="flex gap-2 items-center justify-center bg-green-500 py-[7.5px] px-[20px] text-slate-50 hover:bg-green-600 rounded">
                            <BsCheck2 className=" text-lg" />
                            <p className="">Confirm</p>
                        </button>}
                    <button onClick={handleCancel} type="button" className="flex gap-2 justify-center items-center border border-shark-800 hover:border-punch-700 hover:text-punch-700 hover:bg-punch-100 text-shark-800 py-[7.5px] px-[20px] rounded transition-all duration-300">
                        <MdClose className=" text-lg" />
                        <p className="">Cancel</p>
                    </button>
                </span>
            </div>
        </Modal>
    )
}

export default EditPayment;