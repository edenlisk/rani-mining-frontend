import React, {useEffect, useState} from "react";
import { useNavigate, useParams} from "react-router-dom";
import { useGenerateForwardNoteMutation } from "../states/apislice";
import { message } from "antd";
import DocumentEditorComponent from "./DocumentEditor";
import FetchingPage from "./FetchingPage";



const GenerateForwardNote = () => {
    const { shipmentId } = useParams();
    const [generateForwardNote, {isSuccess, isLoading, isError, error}] = useGenerateForwardNoteMutation();
    const [sfdt, setSfdt] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            return message.success("Forward Note Generated Successfully");
        } else if (isError) {
            const { message: errorMessage } = error.data;
            return message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);


    useEffect(() => {
        if (!shipmentId) return navigate(-1);
        const fetchForwardNote = async () => {
            const response = await generateForwardNote({shipmentId});
            if (response.data) {
                const { sfdt, url, fileId, filePath } = response.data
                if (!sfdt) return navigate(-1);
                setSfdt(sfdt);
                if (url || fileId || filePath) {
                    localStorage.setItem("url", url);
                    localStorage.setItem("fileId", fileId);
                    localStorage.setItem("filePath", filePath);
                }
            }
        }
        fetchForwardNote();
    }, [shipmentId]);



    return (
        <div>
            {!sfdt ? <FetchingPage/> : (
                <DocumentEditorComponent
                    showSave={true}
                    sfdt={sfdt}
                    fileId={localStorage.getItem("fileId")}
                    filePath={localStorage.getItem("filePath")}
                />
            )}
        </div>
    )
}

export default GenerateForwardNote;