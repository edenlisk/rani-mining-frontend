import React, { useState, useEffect } from 'react';
import { useGetExpensesQuery } from "../../states/apislice";
import ListContainer from "../../components/Listcomponents/ListContainer";
import {Space, Table, DatePicker} from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const Expenses = () => {

    const { data, isSuccess } = useGetExpensesQuery();
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
        if (isSuccess) {
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