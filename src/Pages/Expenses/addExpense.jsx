import React, {useEffect, useState, useRef} from 'react';
import {DatePicker, message} from "antd";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {useAddExpenseMutation} from "../../states/apislice";

const AddExpense = () => {

    const [addExpense, { isSuccess, isLoading, isError, error }] = useAddExpenseMutation();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const supportingDocumentRef = useRef(null);
    const [expense, setExpense] = useState({
        date: '',
        name: '',
        typeOfExpense: '',
        amount: 0,
        description: '',
    });

    useEffect(() => {
        if (isSuccess) {
            message.success("Expense added successfully");
        } else if (isError) {
            message.error(error.data?.message);
        }
    }, [isSuccess, isError, error]);

    const handleChange = (e) => {
        setExpense((prevState) => ({...prevState, [e.target.name]: e.target.value}));
    }

    const handleAddDate = (e) => {
        setExpense((prevState) => ({
            ...prevState,
            date: dayjs(e).format("MMM DD, YYYY"),
        }));
    };

    const handleAddFile = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setSelectedFile(files[0]);
        }
    }

    const handleAddExpense = async () => {
        const formData = new FormData();
        formData.append("supportingDocument", selectedFile);
        for (const key in expense) {
            formData.append(key, expense[key]);
        }
        await addExpense({body: formData});
        handleCancel();
    }

    const handleCancel = () => {
        setExpense({
            date: '',
            name: '',
            typeOfExpense: '',
            amount: 0,
            description: ''
        });
        navigate(-1);
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-y-10 pb-10">
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center">
                        <li className=" space-y-1">
                            <p className="pl-1">Date</p>
                            <DatePicker
                                onChange={handleAddDate}
                                id="date"
                                name="date"
                                className=" focus:outline-none p-2 border rounded-md w-full"
                            />
                        </li>
                        {/* ******* */}
                        <li>
                            <p className="mb-1">Name / Company</p>
                            <input type="text" name="name" id="name" autoComplete="off"
                                   className="focus:outline-none p-2 border rounded-lg w-full"
                                   value={expense.name || ''} onChange={handleChange}/>
                        </li>
                        {/* ******* */}
                        <li>
                            <p className="mb-1">Description</p>
                            <input type="text" name="description" id="description" autoComplete="off"
                                   className="focus:outline-none p-2 border rounded-lg w-full"
                                   value={expense.description || ''} onChange={handleChange}/>
                        </li>
                        {/* ******* */}
                        <li>
                            <p className="mb-1">Amount</p>
                            <input type="number" name="amount" id="amount" autoComplete="off"
                                   className="focus:outline-none p-2 border rounded-lg w-full"
                                   value={expense.amount || ''} onChange={handleChange}/>
                        </li>
                        {/* ******* */}

                        <li>
                            <p className="mb-1 pl-1">Type</p>
                            <select value={expense.typeOfExpense || ''}
                                    required name="typeOfExpense" id="typeOfExpense"
                                    className="focus:outline-none p-2 border rounded-md w-full" onChange={handleChange}>
                                <option value="workers food">Workers Food</option>
                                <option value="transport">Transport</option>
                                <option value="marketing commission">Marketing Commission</option>
                                <option value="driver mission">Driver Mission</option>
                                <option value="transport minerals">Transport Minerals</option>
                                <option value="workers transport">Workers Transport</option>
                                <option value="salary">Salary</option>
                                <option value="casual payment">Casual Payment</option>
                                <option value="sample fees">Sample Fees</option>
                                <option value="sample payment">Sample Payment</option>
                                <option value="expense boss">Expense Boss</option>
                                <option value="RRA">RRA (Taxes)</option>
                                <option value="bank equity">Bank Equity</option>
                            </select>
                        </li>
                        {/* ******* */}
                        <li>
                            <p className="mb-1">Upload Supporting document</p>
                            <input type="file" name="supportingDocument"
                                   ref={supportingDocumentRef}
                                   id="supportingDocument" autoComplete="off"
                                   className="focus:outline-none p-2 border rounded-lg w-full" onChange={handleAddFile}/>
                        </li>
                        {/* ******* */}
                    </ul>
                </div>
                <div className="flex justify-center gap-2">
                    <button
                        type="button"
                        className="p-2 bg-blue-500 shadow-md text-white rounded"
                        disabled={isLoading}
                        onClick={handleAddExpense}
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        className="p-2 bg-red-500 shadow-md text-white rounded"
                        disabled={isLoading}
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    )
}

export default AddExpense;