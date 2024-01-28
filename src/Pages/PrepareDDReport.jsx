import React, {useEffect, useState} from 'react';

import { useGenerateDDReportMutation } from "../states/apislice";
import {useParams} from "react-router-dom";
import { message } from "antd";
import DocumentEditorComponent from "./DocumentEditor";
import FetchingPage from "./FetchingPage";


const PrepareDDReport = () => {
    const { supplierId, startDate, endDate } = useParams();
    const [generateDDReport, {isSuccess, isLoading, isError, error}] = useGenerateDDReportMutation();
    const [sfdt, setSfdt] = useState('');
    const [fileInfo, setFileInfo] = useState({fileId: "", filePath: ""});

    useEffect(() => {
        if (isSuccess) {
            return message.success("DD Report Generated Successfully");
        } else if (isError) {
            const { message: errorMessage } = error.data;
            return message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);

    useEffect(() => {
        const fetchDDReport = async () => {
            const body = {supplierId, startMonth: startDate, endMonth: endDate};
            const response = await generateDDReport({body, supplierId});
            if (response.data) {
                const { sfdt, fileId, filePath } = response.data;
                if (sfdt) {
                    setSfdt(sfdt);
                }
                if (fileId && filePath) {
                    setFileInfo({fileId, filePath});
                }
            }
        }
        fetchDDReport();
    }, [supplierId]);

    return (
        <div>
            {!sfdt ? <FetchingPage/> : (
                <DocumentEditorComponent
                    sfdt={sfdt}
                    fileId={fileInfo.fileId}
                    filePath={fileInfo.filePath}
                    showSave={true}
                />
            )}
        </div>
    )
}

export default PrepareDDReport;