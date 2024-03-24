import React, {useEffect, useState} from "react";
import {message, Modal} from "antd";
import {useGetOneBeneficiaryQuery, useUpdateBeneficiaryMutation} from "../../states/apislice.js";


const EditAsset = ({beneficiaryId}) => {
    const [open, setOpen] = useState(false);
    const [beneficiary, setBeneficiary] = useState(
        {
            name: "",
            category: "",
            address: {
                province: "",
                district: "",
                sector: ""
            },
            phoneNumber: "",
        }
    )

    const {
        data,
        isLoading: isFetchingBeneficiary,
        isSuccess: isBeneficiarySuccess
    } = useGetOneBeneficiaryQuery({beneficiaryId});
    const [updateBeneficiary, {isLoading, isSuccess, isError, error}] = useUpdateBeneficiaryMutation();


    useEffect(() => {
        if (isBeneficiarySuccess) {
            const {beneficiary} = data.data;
            console.log(beneficiary)
            setBeneficiary(beneficiary);
        }
    }, [data, isBeneficiarySuccess]);


    useEffect(() => {
        if (isSuccess) {
            message.success("Beneficiary updated successfully");
            setOpen(false);
        } else if (isError) {
            message.error(error.data?.message);
        }
    }, [isSuccess, isError, error]);

    const onChange = (e) => {
        const { name, value } = e.target;
        if (name.startswith(".address")) {
            const fieldName = name.split('.')[1];
            setBeneficiary(prevState => ({
                ...prevState, address: { ...prevState.address, [fieldName]: value}
            }))
        } else {
            setBeneficiary(prevState => ({...prevState, [e.target.name]: e.target.value}));
        }
    }

    const handleUpdateBeneficiary = async () => {
        await updateBeneficiary({beneficiaryId, body: beneficiary});
        setOpen(false);
    }


    return (
        <>
            <button className={"bg-green-500 text-white p-2 rounded-md"} onClick={() => setOpen(true)}>
                Edit
            </button>
            <Modal
                title="Edit Beneficiary"
                centered
                open={open}
                onOk={handleUpdateBeneficiary}
                onCancel={() => setOpen(false)}
                cancelButtonProps={{
                    className: "bg-red-500 text-white p-2 rounded-md",
                    disabled: isLoading || isFetchingBeneficiary
                }}
                okButtonProps={{
                    className: "bg-green-500 text-white p-2 rounded-md",
                    disabled: isLoading || isFetchingBeneficiary
                }}
                width={1000}
            >
                <div className="grid grid-cols-1 gap-y-10 pb-10">
                    <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <li className=" space-y-1">
                            <p className="pl-1">Beneficiary Name</p>
                            <input
                                type="text"
                                autoComplete="off"
                                className="focus:outline-none p-2 border rounded-md w-full"
                                name="name"
                                id="name"
                                value={beneficiary.name || ""}
                                onChange={onChange}
                                required
                            />
                        </li>
                        <li className=" space-y-1">
                            <p className="pl-1">Category</p>
                            <input
                                type="text"
                                autoComplete="off"
                                className="focus:outline-none p-2 border rounded-md w-full"
                                name="category"
                                id="category"
                                value={beneficiary.category || ""}
                                onChange={onChange}
                            />
                        </li>
                        <li className=" space-y-1">
                            <p className="pl-1">Phone Number</p>
                            <input
                                type="text"
                                autoComplete="off"
                                className="focus:outline-none p-2 border rounded-md w-full"
                                name="phoneNumber"
                                id="phoneNumber"
                                value={beneficiary.phoneNumber || ""}
                                onChange={onChange}
                            />
                        </li>
                        <li className=" space-y-1">
                            <p className="pl-1">Province</p>
                            <input
                                type="text"
                                autoComplete="off"
                                className="focus:outline-none p-2 border rounded-md w-full"
                                name="address.province"
                                id="province"
                                value={beneficiary.address.province || ""}
                                onChange={onChange}
                            />
                        </li>
                        <li className=" space-y-1">
                            <p className="pl-1">District</p>
                            <input
                                type="text"
                                autoComplete="off"
                                className="focus:outline-none p-2 border rounded-md w-full"
                                name="address.district"
                                id="district"
                                value={beneficiary.address.district || ""}
                                onChange={onChange}
                            />
                        </li>
                        <li className=" space-y-1">
                            <p className="pl-1">Sector</p>
                            <input
                                type="text"
                                autoComplete="off"
                                className="focus:outline-none p-2 border rounded-md w-full"
                                name="address.sector"
                                id="sector"
                                value={beneficiary.address.sector || ""}
                                onChange={onChange}
                            />
                        </li>
                    </ul>
                </div>
            </Modal>
        </>
    )
}

export default EditAsset;