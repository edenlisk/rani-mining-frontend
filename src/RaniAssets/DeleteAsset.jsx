import React, { useState, useEffect } from "react";
import { message, Modal } from "antd";
import { useDeleteAssetMutation } from "../states/apislice";


const DeleteAsset = ({assetId}) => {
    const [open, setOpen] = useState(false);
    const [deleteAsset, {isSuccess, isError, error}] = useDeleteAssetMutation();

    useEffect(() => {
        if (isSuccess) {
            message.success("Asset deleted successfully");
            setOpen(false);
        } else if (isError) {
            message.error(error.data?.message);
        }
    }, [isSuccess, isError, error]);

    const handleDeleteAsset = async () => {
        console.log("Delete an asset");
        await deleteAsset({assetId});
        setOpen(false);
    }

    return (
        <>
            <button className="bg-red-500 text-white p-2 rounded-md" onClick={() => setOpen(true)}>Delete</button>
            <Modal
                title="Confirm Delete"
                centered
                open={open}
                onOk={handleDeleteAsset}
                onCancel={() => setOpen(false)}
                okButtonProps={{className: "bg-red-500 text-white p-2 rounded-md"}}
            >
                <p>Do you want to delete selected asset?. If you click OK, it will be deleted permanently</p>
            </Modal>
        </>

    )
}

export default DeleteAsset;