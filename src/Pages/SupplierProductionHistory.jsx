import React, {useEffect, useState} from "react";
import { useGetSupplierProductionHistoryMutation } from "../states/apislice";
import {toast} from "react-toastify";

const SupplierProductionHistory = () => {
    const [getSupplierProductionHistory, {data, isLoading, isSuccess, isError, error}] = useGetSupplierProductionHistoryMutation();

    const [productionHistory, setProductionHistory] = useState([]);

    useEffect(() => {
        if (isSuccess) {
            const { supplierHistory } = data.data;
            setProductionHistory(supplierHistory);
        } else if (isError) {
            const { message } = error.data;
            toast.error(message);
        }
    }, [isSuccess, isError, error]);

    const handleFetching = async () => {
        await getSupplierProductionHistory();
    }

    return (
        <div>
            {
                /*
                1. Dropdown menu containing available suppliers
                2. Table that will display the production history after fetching data
                */
            }
            <h2>PRODUCTION HISTORY</h2>
        </div>
    )
}

export default SupplierProductionHistory;