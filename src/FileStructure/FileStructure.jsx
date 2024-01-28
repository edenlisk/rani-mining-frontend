import React, { useEffect, useState } from 'react';
import FileTree from './FileTree';
import { useGetFileStructureMutation } from "../states/apislice";
import {message} from "antd";
import FetchingPage from "../Pages/FetchingPage";

const FileStructure = () => {
    const [getFileStructure, { data, isSuccess, isLoading, isError, error }] = useGetFileStructureMutation();
    const [fileStructure, setFileStructure] = useState([]);
    const [toggledFolders, setToggledFolders] = useState(null);


    useEffect(() => {
        const fetchFileStructure = async () => {
            const response = await getFileStructure({ body: { directory: "/" }});
            if (response.data) {
                const { files } = response.data?.data;
                setFileStructure(files);
            }
        }
        fetchFileStructure();
    }, [])

    // useEffect(() => {
    //     if (isSuccess) {
    //         const { files } = data.data;
    //         setFileStructure(files);
    //     } else if (isError) {
    //         const { message: fetchError } = error.data;
    //         message.error(fetchError);
    //     }
    // }, [isSuccess, isError, error]);

    return (
        <div className="h-full w-full">
            {!fileStructure ? <FetchingPage/> : <FileTree getFileStructure={getFileStructure} data={fileStructure} setFileStructure={setFileStructure} />}
        </div>
    );
};

export default FileStructure;
