import React, {useEffect, useState} from 'react';
import DocumentEditorComponent from "./DocumentEditor";
import { useGenerateLabReportMutation } from "../states/apislice";
import FetchingPage from "./FetchingPage";
import { useNavigate, useParams} from "react-router-dom";
import {message} from "antd";

const GenerateLabReport = () => {
    const { entryId, lotNumber, model } = useParams();
    const [generateLabReport, {isSuccess, isLoading, isError, error}] = useGenerateLabReportMutation();
    const [sfdt, setSfdt] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        if (isSuccess) {
            return message.success("Lab Report Generated Successfully");
        } else if (isError) {
            const { message: errorMessage } = error.data;
            return message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);

    useEffect(() => {
        const fetchLabReport = async () => {
            if (!entryId || !lotNumber) return navigate(-1);
            const body = {entryId, lotNumber}
            const response = await generateLabReport({body, model});
            if (response.data) {
                const { sfdt } = response.data
                if (sfdt) {
                    setSfdt(sfdt);
                }
            }
        }
        fetchLabReport();
    }, [entryId, lotNumber])
    return (
        <div>
            {!sfdt ? <FetchingPage/> : (
                <DocumentEditorComponent
                    showSave={false}
                    sfdt={sfdt}
                    fileId={""}
                    filePath={""}
                />
            )}
        </div>
    )
}

export default GenerateLabReport;

