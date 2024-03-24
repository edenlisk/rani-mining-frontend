import React, { useState, useEffect } from "react";
import { message, Modal } from "antd";
import { useDeleteBeneficiaryMutation } from "../../states/apislice";


const DeleteBeneficiary = ({beneficiaryId}) => {
    const [open, setOpen] = useState(false);
    const [deleteBeneficiary, {isSuccess, isError, error}] = useDeleteBeneficiaryMutation();

    useEffect(() => {
        if (isSuccess) {
            message.success("Beneficiary deleted successfully");
            setOpen(false);
        } else if (isError) {
            message.error(error.data?.message);
        }
    }, [isSuccess, isError, error]);

    const handleDeleteBeneficiary = async () => {
        await deleteBeneficiary({beneficiaryId});
        setOpen(false);
    }

    return (
        <>
            <button className="bg-red-500 text-white p-2 rounded-md" onClick={() => setOpen(true)}>Delete</button>
            <Modal
                title="Confirm Delete"
                centered
                open={open}
                onOk={handleDeleteBeneficiary}
                onCancel={() => setOpen(false)}
                okButtonProps={{className: "bg-red-500 text-white p-2 rounded-md"}}
            >
                <p>Do you want to delete selected beneficiary ?. If you click OK, it will be deleted permanently</p>
            </Modal>
        </>

    )
}

export default DeleteBeneficiary;