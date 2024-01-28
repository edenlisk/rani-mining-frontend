import React, {useEffect, useState} from "react";
import PurchasesListContainer from "../components/Listcomponents/PurchasesListContainer";
import dayjs from "dayjs";
import {Table, Button, message, Modal} from "antd";
import {useGetAllContractsQuery} from "../states/apislice";
import ListContainer from "../components/Listcomponents/ListContainer";
import {useSelector} from "react-redux";
import {HiMiniViewfinderCircle} from "react-icons/hi2";
import {RiFolderDownloadFill} from "react-icons/ri";
import PdfView from "../components/PdfView";
import {getBase64FromServer} from "../components/helperFunctions";

const ContractsistPage = () => {
    const {permissions} = useSelector(state => state.persistedReducer?.global);
    const {data, isLoading, isSuccess} = useGetAllContractsQuery("",
        {
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true
        }
    );
    const [contracts, setContracts] = useState([]);
    const [pdfUrl, setPdfUrl] = useState("");
    const [showPdf, setShowPdf] = useState(false);
    const [base64, setBase64] = useState(null);

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handleClose = () => {
        setPreviewVisible(false);
    };

    useEffect(() => {
        if (isSuccess) {
            const {contracts} = data.data;
            setContracts(contracts);
        }
    }, [isSuccess]);

    const handlePreview = async (url) => {
        const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
        if (!allowedExtensions.includes(url.split('.').pop().toLowerCase())) {
            return message.error("Only pdf or image files are supported");
        }
        if (url.split('.').pop() !== 'pdf') {
            // setPdfUrl(url);
            const previewedUrl = await getBase64FromServer(url);
            setPreviewImage(previewedUrl);
            setPreviewVisible(true);
        }
        // setPdfUrl('https://ik.imagekit.io/mqrq0nywc/contracts/MITSINDO_DIEUDONNE_CV_vfV1EfRuA.pdf');
        //
        // setShowPdf(true);
    }


    const columns = [
        {
            title: "Buyer name",
            dataIndex: "buyerName",
            key: "buyerName",
            sorter: (a, b) => a.buyerName.localeCompare(b.buyerName),
        },
        {
            title: "Mineral type",
            dataIndex: "minerals",
            key: "minerals",
            sorter: (a, b) => a.buyerName.localeCompare(b.buyerName),
            // render: (_, record) => <span>{dayjs(record.).format("llll")}</span>
        },
        {
            title: "Start date",
            dataIndex: "contractStartDate",
            // key: "edit",
            sorter: (a, b) => a.contractStartDate.localeCompare(b.contractStartDate),
            render: (_, record) =>
                <span>{record.contractStartDate ? dayjs(record.contractStartDate).format("YYYY-MM-DD") : null}</span>

        },
        {
            title: "End date",
            dataIndex: "contractExpiryDate",
            // key: "edit",
            sorter: (a, b) => a.contractExpiryDate.localeCompare(b.contractExpiryDate),
            render: (_, record) =>
                <span>{record.contractExpiryDate ? dayjs(record.contractExpiryDate).format("YYYY-MM-DD") : null}</span>
        },
        {
            title: "action",
            dataIndex: "action",
            key: "action",
            // sorter: (a, b) => a.username.localeCompare(b.username),
            render: (_, record) => {
                if (record.filePath) {
                    return (
                        <div className="flex gap-1">
                            <Button onClick={() => handlePreview(record.filePath)} icon={<HiMiniViewfinderCircle size={20}/>}/>
                            <Button  icon={<RiFolderDownloadFill size={20}/>}/>
                        </div>
                    )
                } else {
                    return null;
                }
            }
        },
        // {
        //     title: "Decision",
        //     dataIndex: "editExpiresAt",
        //     // key: "edit",
        //     // sorter: (a, b) => a.username.localeCompare(b.username),
        //     render: (_, record) => {
        //         return (
        //             <span className="flex gap-1">
        //                 <button
        //                     disabled={record.requestStatus !== "pending"}
        //                     className="bg-green-300 p-1 pl-2 pr-2 rounded-[4px]"
        //                     onClick={() => handleUpdate({decision: true}, record)}
        //                 >
        //                     Authorize
        //                 </button>
        //                 <button
        //                     disabled={record.requestStatus !== "pending"}
        //                     className="bg-red-400 p-1 pl-2 pr-2 rounded-[4px]"
        //                     onClick={() => handleUpdate({decision: false}, record)}
        //                 >
        //                     Reject
        //                 </button>
        //             </span>
        //         )
        //     }
        // },

    ]

    const getBase64 = async () => {
        const response = await fetch(pdfUrl);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result;
            setBase64(base64data);
        };
        reader.readAsDataURL(blob);
    }




    return (
        <>
            <ListContainer
                title={'Contracts list'}
                subTitle={'Manage your contracts'}
                navLinktext={'add/contract'}
                navtext={'add new contract'}
                isAllowed={permissions.contracts?.create}
                table={
                    <div>
                        <Table
                            columns={columns}
                            dataSource={contracts}
                            rowKey="_id"
                        />
                        {showPdf && <PdfView pdfUrl={"https://ik.imagekit.io/mqrq0nywc/contracts/MITSINDO_DIEUDONNE_CV_vfV1EfRuA.pdf"}/>}
                        <Modal
                            width={'70%'}
                            open={previewVisible}
                            title="Image Preview"
                            footer={null}
                            onCancel={handleClose}
                        >
                            <img alt="example" style={{width: '100%', height: "100%"}} src={previewImage}/>
                        </Modal>
                    </div>
                }
            />
        </>
    )
}

export default ContractsistPage;