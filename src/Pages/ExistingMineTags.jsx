import {motion} from "framer-motion";
import {ImSpinner2} from "react-icons/im";
import {Checkbox} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {useGetSupplierTagsQuery} from "../states/apislice";


const ExistingMineTags = ({setmineTags, mineTags, supplierId}) => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const {data: supplierTags, isLoading, isSuccess: isSupplierTagsSuccess} = useGetSupplierTagsQuery({supplierId},{skip: supplierId === ""});
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const tagModalRef = useRef();
    const handleClickOutside = (event) => {
        if (!tagModalRef.current || !tagModalRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    const handleOpenTagModal = () => {
        setDropdownOpen(!dropdownOpen);
    }

    useEffect(() => {
        if (isSupplierTagsSuccess) {
            const { tags } = supplierTags.data;
            setTags(tags);
        }
    }, [supplierTags, isSupplierTagsSuccess])

    const handleSelectedTag = (tag) => {
        if (selectedTags.some((selected) => selected._id === tag._id)) {
            setSelectedTags((prevSelectedData) =>
                prevSelectedData.filter((selected) => selected._id !== tag._id)
            );
          } else {
            setSelectedTags((prevSelectedData) => [...prevSelectedData, tag]);
          }
    };

    return (

    <div ref={tagModalRef} className="w-fit h-fit ">
        {/*<button type="button" className="px-3 py-1 bg-orange-300 rounded-md" onClick={handleOpenTagModal}>Existing Tags</button>*/}
        <motion.div
            style={{zIndex: 100}}
            initial={{ opacity: 0, x: 0, y: 0, display: "none" }}
            animate={
                dropdownOpen
                    ? { opacity: 1, x: -8, y: 1, display: "block" }
                    : { opacity: 0, x: 0, y: 0, display: "none" }
            }
            transition={{
                type: "spring",
                duration: 0.8,
                bounce: 0.35,
            }}
            className={`p-2 space-y-3 bg-white w-fit rounded absolute top-12 shadow-2xl `}
        >

            {isLoading?<div className="w-full flex justify-start items-center gap-1">
                <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500" />
                <p className=" text-slate-400">Fetching Tags...</p>
            </div>:<ul className={`list-none  overflow-auto `}>
                <li>
                    <div className="flex items-center justify-between gap-12">
                        <p className="font-semibold">#</p>
                        <p className="font-semibold">Tag Number</p>
                        <p className="font-semibold">Weight</p>
                        <p className="font-semibold">Sheet Number</p>
                    </div>
                </li>
                {tags.map((tag, index) => (
                    <li
                        key={index}
                        className=" hover:bg-slate-100 rounded-md p-2"
                        // onClick={() => handleSelectedTag(tag)}
                    >
                        <div className="flex items-center justify-between gap-12">
                            <Checkbox
                                name="checkbox"
                                checked={
                                    selectedTags.length > 0 &&
                                    selectedTags.some((selected) => selected._id === tag._id)
                                  }
                                onChange={() => handleSelectedTag(tag)}
                            />
                            <p className="font-semibold">{tag.tagNumber}</p>
                            <p className="font-semibold">{tag.weight}</p>
                            <p className="font-semibold">{tag.sheetNumber}</p>
                        </div>
                    </li>
                ))}
                <div className="flex gap-3 justify-end">
                    <button type="button" className="px-3 py-1 bg-orange-300 rounded-md" onClick={() => {
                        // if (selectedTags.size === 0) return;
                        const newSet = [...selectedTags, mineTags];
                        setmineTags([...newSet]);
                        // setSelectedTags(new Set());
                        // setDropdownOpen(false);
                    }}>Submit</button>
                    <button type="button" className="px-3 py-1 bg-blue-200 rounded-md" onClick={() => {
                        // setSelectedTags(new Set());
                        setDropdownOpen(false);
                    }}>Cancel</button>
                </div>
            </ul>}
        </motion.div>
    </div>
    )
}

export default ExistingMineTags;