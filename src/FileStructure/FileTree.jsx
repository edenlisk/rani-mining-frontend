import React, {useEffect, useState} from 'react';
import { BsFolderFill, BsFillFileEarmarkWordFill, BsFillFileEarmarkPdfFill, BsImageFill } from "react-icons/bs";
import {FaFolderOpen, FaRegFile, FaDownload, FaRegEdit} from "react-icons/fa";
import {HiChevronDown, HiChevronRight, HiOutlineDownload} from "react-icons/hi";
import { useDownloadFileMutation } from "../states/apislice";
import {toast} from "react-toastify";
import {Link} from 'react-router-dom'
import {FcDownload, FcFolder} from "react-icons/fc";
import {ImDownload3} from "react-icons/im";
import { useNavigate } from "react-router-dom";

const FileTree = ({ data, getFileStructure, setFileStructure }) => {
    const [openDirectories, setOpenDirectories] = useState([]);
    const navigate = useNavigate();
    // TODO 5: ADD EDIT BUTTON ON WORD DOCUMENTS -> DONE

    const toggleDirectory = async (directory, fileId) => {
        const findAndUpdateDirectory = (files, fileIdToUpdate, updatedFiles) => {
            return files.map((file) => {
                if (file.fileId === fileIdToUpdate) {
                    return { ...file, content: updatedFiles };
                } else if (file.content) {
                    return { ...file, content: findAndUpdateDirectory(file.content, fileIdToUpdate, updatedFiles) };
                } else {
                    return file;
                }
            });
        };

        if (directory) {
            const response = await getFileStructure({ body: { directory } });
            if (response.data) {
                const { files } = response.data?.data;
                if (files?.length === 0) return;
                setFileStructure((prevState) => {
                    return findAndUpdateDirectory(prevState, fileId, files);
                });
            }
        }

        if (openDirectories.includes(fileId)) {
            // If the directory is open, close it
            setOpenDirectories(openDirectories.filter((dir) => dir !== fileId));
        } else {
            // If the directory is closed, open it
            setOpenDirectories([...openDirectories, fileId]);
        }
    };

    // useEffect(() => {
    //     if (isSuccess) {
    //         toast.success("File Successfully downloaded");
    //     } else if (isError) {
    //         // const { message } = error.data;
    //         // toast.error(message);
    //     }
    // }, [isSuccess, isError, error]);


    const getFileIcon = (name) => {
        const ext = name.split('.').pop();
        if (ext.toLowerCase() === "png" || ext.toLowerCase() === "jpg" || ext.toLowerCase() === "jpeg") {
            return <BsImageFill color="#28aae5" size={25} style={{ marginRight: 5, marginLeft: 10}}/>
        } else if (ext.toLowerCase() === "docx" || ext.toLowerCase() === "doc") {
            return <BsFillFileEarmarkWordFill color="#2b579a" size={25} style={{ marginRight: 5, marginLeft: 10, marginBottom: 4}}/>
        } else if (ext.toLowerCase() === "pdf") {
            return <BsFillFileEarmarkPdfFill color="#c20a0a" size={25} style={{ marginRight: 5, marginLeft: 10, marginBottom: 4}}/>
        }
    }

    const getDocxFile = (node) => {
        if(node.type === "file") {
            const ext = node.name.split('.').pop();
            if (ext.toLowerCase() === "docx" || ext.toLowerCase() === "doc") {
                return true;
            }
        }
    }

    const handleEditFile = async (url, filePath, fileId, name) => {
        navigate(`/structure/${encodeURIComponent(url)}/${encodeURIComponent(filePath)}/${encodeURIComponent(fileId)}`);
    }


    const isDirectoryOpen = (fileId) => openDirectories.includes(fileId);

    const renderNode = (node, level) => {
        const isDirectory = node.type === 'folder';
        const isOpen = isDirectory && isDirectoryOpen(node.fileId);

        const fileIcon = getFileIcon(node.name);

        return (
            <ul key={node.fileId}>
                <li>
                <span style={{ marginLeft: level * 20 }} className="flex items-center">
                    {isDirectory && (
                        <span
                            style={{ marginRight: 3 }}
                            onClick={() => toggleDirectory(node.filePath, node.fileId)}
                        >
                            {isOpen ? (
                                <HiChevronDown />
                            ) : (
                                <HiChevronRight />
                            )}
                        </span>
                    )}
                    {isDirectory ? (
                        isOpen ? (
                            <FaFolderOpen color="#ffca28" size={40} style={{ marginRight: 5,}} />
                        ) : (
                            <FcFolder color="#ffca28" size={40} style={{ marginRight: 5,}} />
                        )
                    ) : fileIcon
                    }
                    {node.name.replace(/_/g, ' ')}
                    {node.type === "file" && node.name.split('.').pop() !== "pdf" && (
                        <Link to={node.url} target="_blank" rel="noopener noreferrer" download>
                            <HiOutlineDownload size={25} color="#2b579a" style={{ marginLeft: 8}} className="text-lg text-[#7393B3]" />
                        </Link>
                    )}
                    {node.type === "file" && node.name.split('.').pop() === "pdf" && (
                        <ImDownload3 onClick={() => navigate(`/pdf-viewer/${encodeURIComponent(node.url)}`)} color="#2b579a" style={{ marginLeft: 8 }} className="text-lg text-[#7393B3" />
                    )}
                    {getDocxFile(node) && (
                        <FaRegEdit size={20} color="#2b579a" className="ml-2"  onClick={() => handleEditFile(node.url, node.filePath, node.fileId, node.name.replace(/_/g, ' '))}/>
                    )}

                </span>
                    {isDirectory && isOpen && node.content && (
                        renderChildren(node.content, level + 1)
                    )}
                </li>
            </ul>
        );
    };

    const renderChildren = (children, level) => {
        return (
            <ul>
                {children.map((child) => (
                    <li key={`${child.type}-${child.name}`}>
                        {renderNode(child, level)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            {renderChildren(data, 0)}
        </div>
    );
};

export default FileTree;
