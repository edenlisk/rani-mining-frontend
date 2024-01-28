import ViewDocumentEditor from "../ViewDocumentEditor";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {message} from "antd";
import {useUpdateAdvancePaymentMutation, useGetOneAdvancePaymentQuery} from "../../states/apislice";
import FetchingPage from "../FetchingPage";


const EditAdvancePayment = () => {
    const { paymentId } = useParams();
    const [updateAdvancePayment, {isLoading, isSuccess: isSaveSuccess, isError: isSaveError, error: saveError}] = useUpdateAdvancePaymentMutation();
    const { data, isSuccess } = useGetOneAdvancePaymentQuery(paymentId, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    })
    const [documentEditor, setDocumentEditor] = useState(null);
    const [sfdt, setSfdt] = useState(null);


    useEffect(() => {
        if (isSuccess) {
            const { payment } = data.data;
            if (payment && payment.sfdt) {
                setSfdt(payment.sfdt);
            }
        }
    }, [isSuccess, data]);

    const onSave = async () => {
        if (documentEditor.documentEditor) {
            const file = await documentEditor.documentEditor.saveAsBlob('Docx');
            const formData = new FormData();
            formData.append('data', file, "Advanced Payment Contract.docx");
            return formData;
        }
    }

    const handleSubmit = async () => {
        const formData = await onSave();
        await updateAdvancePayment({body: {formData}, paymentId});
    }


    const onDownload = () => {
        if (documentEditor.documentEditor) {
            documentEditor.documentEditor.save("Advanced Payment Contract", 'Docx');
        }
    }

    useEffect(() => {
        if (isSaveSuccess) {
            return message.success("Document saved successfully");
        } else if (isSaveError) {
            const { message: errorMessage } = saveError.data;
            return message.error(errorMessage);
        }
    }, [isSaveSuccess, isSaveError, saveError]);


    return (
        <div>
            {!sfdt ? <FetchingPage/> :
                <ViewDocumentEditor
                onDownload={onDownload}
                onSave={handleSubmit}
                documentEditor={documentEditor}
                setDocumentEditor={setDocumentEditor}
                isLoading={isLoading}
                sfdt={sfdt}
            />}
        </div>
    )
}

export default EditAdvancePayment;