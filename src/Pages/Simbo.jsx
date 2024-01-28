import React, {useState} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {Button, Modal, Upload} from 'antd';

const getBase64FromServer = (fileUrl) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = fileUrl;
        img.onload = () => {
            resolve(fileUrl);
        };
    });
};

const SingleImageUpload = () => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [file, setFile] = useState(null);

    const handleCancel = () => {
        setPreviewVisible(false);
        setFile(null);
    };

    const handlePreview = async () => {
        if (file) {
            // Replace 'fileUrl' with the actual URL of the image on your Express.js server
            const fileUrl = 'https://mining-company-management-system.onrender.com/data/coltan/DSC_0494.jpg';
            const previewedUrl = await getBase64FromServer(fileUrl);
            setPreviewImage(previewedUrl);
            setPreviewVisible(true);
        }
    };

    const customRequest = ({file}) => {
        setFile(file);
    };

    return (
        <>
            <Upload
                customRequest={customRequest}
                showUploadList={false}
                accept=".jpg,.png"
            >
                {file ? (
                    <Button onClick={handlePreview}>Preview Image</Button>
                ) : (
                    <Button icon={<PlusOutlined/>}/>
                )}
            </Upload>
            <Modal
                visible={previewVisible}
                title="Image Preview"
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{width: '100%'}} src={previewImage}/>
            </Modal>
        </>
    );
}

export default SingleImageUpload;
