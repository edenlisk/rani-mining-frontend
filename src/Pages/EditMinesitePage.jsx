import { useState, useEffect } from "react";
import { Spin } from 'antd';
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import { useGetOneSupplierQuery } from "../states/apislice";
import { useNavigate, useParams } from "react-router-dom";


const EditMinesitePage = () => {
    const { supplierId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError, isSuccess, error } = useGetOneSupplierQuery({ supplierId });
    const [formval, setFormval] = useState({ lat: '', long: '', name: '', code: '' });
    const [suply, setSuply] = useState([]);
    const [show, setShow] = useState(false);
    const handleAddSite = (e) => {
        setFormval({ ...formval, [e.target.name]: e.target.value })
    }
    const handleSiteSubmit = async (e) => {
        e.preventDefault();
        const body = { ...formval };
        // await updateBuyer({ body, buyerId });²²
        setFormval({ lat: '', long: '', name: '', code: '' });
        // navigate(-1);
    }
    const handleCancel = () => {
        setFormval({ lat: '', long: '', name: '', code: '' });
        navigate(-1);
    }

    useEffect(() => {
        if (isSuccess) {
            const { data: info } = data;
            const { supplier: sup } = info;
            setSuply(sup);

        }
    }, [isSuccess]);
    return (
        <div>
            <ActionsPagesContainer title={'Edit Suplier Minesite'}
                subTitle={'Update Supplier Minesite'}
                actionsContainer={
                    <>
                        {isLoading ? <Spin /> : (<div className="grid grid-cols-1 gap-3 w-full">



                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 w-full gap-3">

                                <form onSubmit={handleSiteSubmit} action="" className="grid grid-cols-1 sm:grid-cols-2 col-span-full gap-3 pb-9">
                                    <span>
                                        <label htmlFor="code">name</label>
                                        <input type="text" autoComplete="off" name="name" id="name" value={formval.name || ''} onChange={handleAddSite} className="focus:outline-none p-2 border rounded-lg w-full" />
                                    </span>
                                    <span>
                                        <label htmlFor="code">code</label>
                                        <input type="text" autoComplete="off" name="code" id="code" value={formval.code || ''} onChange={handleAddSite} className="focus:outline-none p-2 border rounded-lg w-full" />
                                    </span>
                                    <span>
                                        <label htmlFor="code">latitude</label>
                                        <input type="text" autoComplete="off" name="lat" id="latitude" value={formval.lat || ''} onChange={handleAddSite} className="focus:outline-none p-2 border rounded-lg w-full" />
                                    </span>
                                    <span>
                                        <label htmlFor="code">longitude</label>
                                        <input type="text" autoComplete="off" name="long" id="longitude" value={formval.long || ''} onChange={handleAddSite} className="focus:outline-none p-2 border rounded-lg w-full" />
                                    </span>
                                    <button type="submit" className="w-fit py-1 px-3 bg-orange-300 border rounded-md">Update</button>
                                </form>


                            </div>
                        </div>)}

                    </>} />
        </div>
    )
}
export default EditMinesitePage;