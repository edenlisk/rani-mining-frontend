import React, { useState, useEffect } from 'react';
import { useGetExpensesQuery, useUpdateExpenseMutation } from "../../states/apislice";
import ListContainer from "../../components/Listcomponents/ListContainer";
import {Space, Table, DatePicker, Upload, Button, message} from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {UploadOutlined} from "@ant-design/icons";
import {FaExternalLinkSquareAlt} from "react-icons/fa";
dayjs.extend(isBetween);

const Expenses = () => {

    const { data, isSuccess } = useGetExpensesQuery("", {refetchOnMountOrArgChange: true});
    const [updateExpense, {isSuccess: isUpdateSuccess, isError, error}] = useUpdateExpenseMutation();
    const [expenses, setExpenses] = useState([]);
    const { RangePicker } = DatePicker;
    const [beneficiaries, setBeneficiaries] = useState([
        {
            text: '',
            value: ''
        }
    ]);
    const [typeOfExpenses, setTypeOfExpenses] = useState([]);



    useEffect(() => {
        if (isSuccess || isUpdateSuccess) {
            const { expenses: expensesData } = data.data;
            setExpenses(expensesData);
            const beneficiariesData = expensesData.map(expense => expense.name);
            const typeOfExpensesData = expensesData.map(expense => expense.typeOfExpense);
            const sortedTypeOfExpenses = [...new Set(typeOfExpensesData)].map(typeOfExpense => {
                return {
                    text: typeOfExpense,
                    value: typeOfExpense
                }
            })
            const sortedBeneficiary = [...new Set(beneficiariesData)].map(beneficiary => {
                return {
                    text: beneficiary,
                    value: beneficiary
                }
            });
            setBeneficiaries(sortedBeneficiary);
            setTypeOfExpenses(sortedTypeOfExpenses);
        }
    },[isSuccess, data]);

    useEffect(() => {
        if (isUpdateSuccess) {
            message.success("Expense updated Successfully");
        } else if (isError) {
            message.error(error.data?.message);
        }
    }, [isUpdateSuccess, isError, error]);


    const customRequest = async ({file, onSuccess, onError, expenseId}) => {
        const formData = new FormData();
        formData.append("supportingDocument", file);
        await updateExpense({body: formData, expenseId});
    };

    // const beforeUpload = (file) => {
    //     if (file.type)
    //     const isPNG = file.type === "image/png" || file.type === "image/jpeg";
    //     if (!isPNG) {
    //         message.error(`${file.name} is not a .png, .jpeg, .docx, .doc, .pdf file`);
    //     }
    //     return isPNG || Upload.LIST_IGNORE;
    // };


    const removeFile = async (expenseId) => {
        const body = {
            "supportingDocument": {fileId: '', filePath: ''}
        };
        await updateExpense({body, expenseId});
    };

    const props = {
        onChange: (info) => {
            if (info.file.status === "done") {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };


    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text) => {
                return <span>{dayjs(text).format("MMM DD, YYYY")}</span>
            },
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Space>
                        <RangePicker
                            value={selectedKeys}
                            onChange={(dates) => setSelectedKeys(dates)}
                        />
                        <button
                            className="px-6 py-1 bg-orange-300 rounded-md"
                            type= "button"
                            onClick={() => {
                                if (isSuccess && selectedKeys.length > 0) {
                                    const {expenses: expensesData} = data.data;
                                    if (expensesData) {
                                        setExpenses(expensesData);
                                    }
                                    const startDate = selectedKeys[0] || dayjs();
                                    const endDate = selectedKeys[1] || dayjs();
                                    const sortedData = expensesData.filter(dt => dayjs(dt.date).isBetween(startDate, endDate, null, '[]'))
                                    setExpenses(sortedData);
                                }
                                confirm();
                            }}
                        >
                            OK
                        </button>
                        <button
                            className="px-6 py-1 bg-red-300 rounded-md"
                            type= "button"
                            onClick={() => {
                                if (isSuccess) {
                                    const { expenses: expensesData } = data.data;
                                    if (expensesData) {
                                        setExpenses(expensesData)
                                    }
                                }
                                clearFilters()
                            }}>
                            Reset
                        </button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => {
                const startDate = value[0];
                const endDate = value[1];
                return dayjs(record.date).isBetween(startDate, endDate, null, '[]');
            },
            filterIcon: (filtered) => (
                <span>{filtered ? '📅' : '📅'}</span>
            ),
        },
        {
            title: "Name / Company",
            dataIndex: "name",
            key: "name",
            filters: [...beneficiaries],
            filterSearch: true,
            onFilter: (value, record) => {
                const lowerCasedValue = value.toLowerCase();
                return record.name.toLowerCase().includes(lowerCasedValue);
            },
        },
        {
            title: "Type of Expense",
            dataIndex: "typeOfExpense",
            key: "typeOfExpense",
            filters: [...typeOfExpenses],
            onFilter: (value, record) => {
                const lowerCasedValue = value.toLowerCase();
                return record.typeOfExpense.toLowerCase().includes(lowerCasedValue);
            },
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Supporting Doc",
            dataIndex: "supportingDocument",
            key: "supportingDocument",
            render: (_, record) => {
                if (record.supportingDocument?.filePath) {
                    return (
                        <a target='_blank' className="text-white p-1 bg-blue-400 border rounded-[4px]" rel='noopener noreferrer'
                                           href={record.supportingDocument?.filePath}>Download Doc</a>
                    )
                } else {
                    return (
                        <Upload
                            // beforeUpload={beforeUpload}
                            accept=".png, .pdf, .docx, .doc, .jpeg, .jpg"
                            {...props}
                            customRequest={async ({file, onSuccess, onError}) => customRequest({
                                file,
                                onSuccess,
                                onError,
                                expenseId: record._id
                            })}
                            onRemove={() => removeFile(record._id)}
                        >
                            <Button icon={<UploadOutlined/>}/>
                        </Upload>
                    )
                }
            }
        }
    ]


    return (
        <>
            <ListContainer
                title={"Expenses"}
                navLinktext={"expenses/add"}
                navtext={"Add Expense"}
                subTitle={"Expenses List"}
                isAllowed={true}
                table={
                    <>
                        <Table
                            columns={columns}
                            dataSource={expenses}
                            rowKey="_id"
                            footer={(currentPageData) => {
                                return (
                                    <div>
                                        <h3>Total: {currentPageData.reduce((acc, current) => acc + current.amount, 0)}</h3>
                                    </div>
                                )
                            }}
                        />
                    </>
                }
            />
        </>
    )
}

export default Expenses;