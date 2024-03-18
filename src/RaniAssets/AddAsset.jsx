import React, {useEffect, useState} from 'react';
import {Button, Modal, message, DatePicker} from 'antd';
import { useCreateAssetMutation } from "../states/apislice";
import {PiPlus} from "react-icons/pi";
import dayjs from "dayjs";

const AddAsset = () => {
    const [open, setOpen] = useState(false);
    const [asset, setAsset] = useState(
        {
            name: "",
            category: "",
            value: "",
            currency: "",
            status: "",
            numberOfItems: 0,
            type: "",
            acquisitionDate: "",
        }
    )

    const [createAsset, {isLoading, isSuccess, isError, error}] = useCreateAssetMutation();


    useEffect(() => {
        if (isSuccess) {
            message.success("Asset added successfully");
            setOpen(false);
        } else if (isError) {
            message.error(error.data?.message);
        }
    }, [isSuccess, isError, error]);

    const onChange = (e) => {
        setAsset({...asset, [e.target.name]: e.target.value});
    }

    const handleAddAsset = async () => {
        console.log("Create an asset");
        await createAsset({body: asset});
        setOpen(false);
    }

    const handleAddDate = (e) => {
        setAsset((prevState) => ({
            ...prevState,
            acquisitionDate: dayjs(e).format("MMM/DD/YYYY"),
        }));
    };


    return (
        <>
            <Button className={"py-[10px] px-[20px] rounded shadow-md shadow-[#A6A6A6] bg-custom_blue-500  hover:bg-custom_blue-600 flex items-center gap-3 text-white"} type="ghost" onClick={() => setOpen(true)}>
                <PiPlus className="text-white text-2xl" />
                Add Asset
            </Button>
            <Modal
                title="Add New Asset"
                centered
                open={open}
                onOk={handleAddAsset}
                onCancel={() => setOpen(false)}
                cancelButtonProps={{className: "bg-red-500 text-white p-2 rounded-md"}}
                okButtonProps={{className: "bg-green-500 text-white p-2 rounded-md"}}
                width={1000}
            >
                <div className="grid grid-cols-1 gap-y-10 pb-10">
                    <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <li className=" space-y-1">
                            <p className="pl-1">Asset Name</p>
                            <input
                                type="text"
                                autoComplete="off"
                                className="focus:outline-none p-2 border rounded-md w-full"
                                name="name"
                                id="name"
                                value={asset.name || ""}
                                onChange={onChange}
                                required
                            />
                        </li>
                        <li>
                            <p className="mb-1 pl-1">Category</p>
                            <select value={asset.category || ''}
                                    required name="category" id="category"
                                    className="focus:outline-none p-2 border rounded-md w-full" onChange={onChange}>
                                <option value="machinery">Machinery</option>
                                <option value="electronics">Electronics</option>
                                <option value="furniture">Furniture</option>
                                <option value="equipment">Equipment</option>
                                <option value="vehicle">Vehicle</option>
                            </select>
                        </li>
                        <li className=" space-y-1">
                            <p className="pl-1">Number of Items</p>
                            <input
                                type="text"
                                autoComplete="off"
                                className="focus:outline-none p-2 border rounded-md w-full"
                                name="numberOfItems"
                                id="numberOfItems"
                                value={asset.numberOfItems || ""}
                                onChange={onChange}
                            />
                        </li>
                        <li className=" space-y-1">
                            <p className="pl-1">Value</p>
                            <input
                                type="text"
                                autoComplete="off"
                                className="focus:outline-none p-2 border rounded-md w-full"
                                name="value"
                                id="value"
                                value={asset.value || ""}
                                onChange={onChange}
                            />
                        </li>
                        <li>
                            <p className="mb-1 pl-1">Currency</p>
                            <select value={asset.currency || 'RWF'}
                                    required name="currency" id="currency"
                                    className="focus:outline-none p-2 border rounded-md w-full" onChange={onChange}>
                                <option value="RWF">RWF</option>
                                <option value="USD">USD</option>
                            </select>
                        </li>
                        <li className=" space-y-1">
                            <p className="pl-1">Acquisition Date</p>
                            <DatePicker
                                onChange={handleAddDate}
                                id="acquisitionDate"
                                name="acquisitionDate"
                                className=" focus:outline-none p-2 border rounded-md w-full"
                            />
                        </li>
                        <li>
                            <p className="mb-1 pl-1">Status</p>
                            <select value={asset.status || ''}
                                    required name="status" id="status"
                                    className="focus:outline-none p-2 border rounded-md w-full" onChange={onChange}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="damaged">Damaged</option>
                                <option value="lost">Lost</option>
                            </select>
                        </li>
                        <li>
                            <p className="mb-1 pl-1">Type</p>
                            <select value={asset.type || ''}
                                    required name="type" id="type"
                                    className="focus:outline-none p-2 border rounded-md w-full" onChange={onChange}>
                                <option value="fixed">Fixed Asset</option>
                                <option value="current">Current Asset</option>
                            </select>
                        </li>
                    </ul>
                </div>
            </Modal>
        </>
    )
}

export default AddAsset;