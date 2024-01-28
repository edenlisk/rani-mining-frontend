import { useState } from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";
import { useAddSupplierMutation } from "../states/apislice";
import { useNavigate } from "react-router-dom";
import { HiPlus, HiMinus } from "react-icons/hi";
 
const AddSuplierPage = () => {
    const navigate = useNavigate();
    const [formval, setFormval] = useState({ companyName: '', TINNumber: '', licenseNumber: '', email: '', nationalId: '', typeOfMinerals: '', phoneNumber: '', mineSites: [{ coordinates: { lat: '', long: '', }, name: '', code: '', }], address: { province: '', district: '', sector: '', cell: '' }, typeOfMining: '', equipmentList: [], surfaceArea: null, categoryOfMine: '', numberOfDiggers: '', numberOfWashers: '', numberOfTransporters: '',companyRepresentative:"" });
    const [mineSitesDetails, setmineSitesDetails] = useState([
        { coordinates: { lat: '', long: '', }, name: '', code: '' },
    ]);
    const [show, setShow] = useState(false);
    const [addressFields, setAddresField] = useState(false);
    const [createNewSupplier, { isSuccess, isLoading, isError, error }] = useAddSupplierMutation();

    const updateLotNumbers = () => {
        setmineSitesDetails((prevmineSitesDetails) => {
            return prevmineSitesDetails.map((lot, index) => ({
                ...lot,
                lotNumber: index + 1,
            }));
        });
    };

    const handleAddSite = () => {
        setmineSitesDetails((prevmineSitesDetails) => [...prevmineSitesDetails, { coordinates: { lat: '', long: '', }, name: '', code: '', }]);
        updateLotNumbers();
    };
    
  const handleRemoveSite = (index) => {
    const values = [...mineSitesDetails];
    values.splice(index, 1);
    values.forEach((lot, i) => {
      lot.lotNumber = i + 1;
    });
    setmineSitesDetails(values);
  };


    const handleSiteEntry =  (index, e) => {
        setmineSitesDetails((prevmineDetails) => {
            const updatedmineDetails = prevmineDetails.map((mine, i) => {
                if (i === index) {
                    if (e.target.name.startsWith("coordinates.")) {
                        const coordField = e.target.name.split(".")[1];
                        return {
                            ...mine,
                            coordinates: {
                                ...mine.coordinates,
                                [coordField]: e.target.value,
                            },
                        };
                    } else {
                        return {
                            ...mine,
                            [e.target.name]: e.target.value,
                        };
                    }
                }
                return mine;
            });
            if (index === prevmineDetails.length) {
                if (e.target.name.startsWith("coordinates.")) {
                    const coordField = e.target.name.split(".")[1];
                    return [
                        ...updatedmineDetails,
                        {
                            coordinates: {
                                [coordField]: e.target.value,
                            },
                        },
                    ];
                } else {
                    return [
                        ...updatedmineDetails,
                        { [e.target.name]: e.target.value },
                    ];
                }
            }

            return updatedmineDetails;
        });
    };
    const handleAddproduct = (e) => {

        if (e.target.name.startsWith("address.")) {
            const addressField = e.target.name.split(".")[1];
            setFormval((prevFormval) => ({
                ...prevFormval,
                address: {
                    ...prevFormval.address,
                    [addressField]: e.target.value,
                },
            }));
        } else if (e.target.name.startsWith("mineSites.")) {
            const minesiteField = e.target.name.split(".")[1];
            if (minesiteField === "coordinates") {
                const coordField = e.target.name.split(".")[2];
                setFormval((prevFormval) => ({
                    ...prevFormval,
                    mineSites: [
                        {
                            ...prevFormval.mineSites[0],
                            coordinates: {
                                ...prevFormval.mineSites[0].coordinates,
                                [coordField]: e.target.value,
                            },
                        },
                    ],
                }));
            } else {
                setFormval((prevFormval) => ({
                    ...prevFormval,
                    mineSites: [
                        {
                            ...prevFormval.mineSites[0],
                            [minesiteField]: e.target.value,
                        },
                    ],
                }));
            }
        } else {
            setFormval((prevFormval) => ({ ...prevFormval, [e.target.name]: e.target.value }));
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const body = { ...formval, mineSites: mineSitesDetails, typeOfMinerals: formval.typeOfMinerals.split(' ') };
        await createNewSupplier({ ...formval, body });
        setFormval({ companyName: '', TINNumber: '', licenseNumber: '', email: '', nationalId: '', typeOfMinerals: '', phoneNumber: '', mineSites: [{ coordinates: { lat: '', long: '', }, name: '', code: '', }], address: { province: '', district: '', sector: '', cell: '' }, typeOfMining: '', equipmentList: [], surfaceArea: null, categoryOfMine: '', numberOfDiggers: '', numberOfWashers: '', numberOfTransporters: '',companyRepresentative:"" });
        setmineSitesDetails([{ coordinates: { lat: '', long: '', }, name: '', code: '' },]);
        navigate(-1);
    }
    const handleCancel = () => {
        setFormval({ companyName: '', TINNumber: '', licenseNumber: '', email: '', nationalId: '', typeOfMinerals: '', phoneNumber: '', mineSites: [{ coordinates: { lat: '', long: '', }, name: '', code: '', }], address: { province: '', district: '', sector: '', cell: '' }, typeOfMining: '', equipmentList: [], surfaceArea: null, categoryOfMine: '', numberOfDiggers: '', numberOfWashers: '', numberOfTransporters: '',companyRepresentative:"" });
        setmineSitesDetails([{ coordinates: { lat: '', long: '', }, name: '', code: '' },]);
        navigate(-1);
    }
    return (
        <div>
            <ActionsPagesContainer title={'Add Supplier'}
                subTitle={'Add/Update supplier'}
                actionsContainer={<AddComponent component={
                    <div className="grid grid-cols-1 gap-y-10 pb-10">
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center">
                            <li>
                                <p className="mb-1">Company Name</p>
                                <input value={formval.companyName || ''} type="text" name="companyName" id="companyName" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"
                                    onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">TIN Number</p>

                                <input type="text" name="TINNumber" id="TINNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.TINNumber || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">License Number</p>

                                <input type="text" name="licenseNumber" id="licenseNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.licenseNumber || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Email</p>
                                <input type="email" name="email" id="email" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.email || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            {/* <li>
                                <p className="mb-1">National ID</p>
                                <input type="text" name="nationalId" id="nationalId" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.nationalId|| ''} onChange={handleAddproduct} />
                            </li> */}
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Phone Number</p>
                                <input type="text" name="phoneNumber" id="phoneNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.phoneNumber || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}

                            <li>
                                <p className="mb-1">Company representative</p>
                                <input type="text" name="companyRepresentative" id="companyRepresentative" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.companyRepresentative || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}

                            <li>
                                <p className="mb-1">Type Of Minerals</p>
                                <input type="text" autoComplete="off" name="typeOfMinerals" id="typeOfMinerals" className="focus:outline-none p-2 border rounded-md w-full" value={formval.typeOfMinerals || ''} onChange={handleAddproduct} />

                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Number Of Diggers</p>
                                <input type="text" name="numberOfDiggers" id="numberOfDiggers" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.numberOfDiggers || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}

                            <li>
                                <p className="mb-1">Number Of Washers</p>
                                <input type="text" name="numberOfWashers" id="numberOfWashers" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.numberOfWashers || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Number Of Transporters</p>
                                <input type="text" name="numberOfTransporters" id="numberOfTransporters" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.numberOfTransporters || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}

                        </ul>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center mt-2 border-t  relative p-2 pb-9 shadow-md rounded-md bg-slate-50">
                            <p className=" col-span-full absolute -top-[13px] bg-white left-4 px-2 p-0 font-semibold">Minesite</p>
                            {mineSitesDetails.map((site, index) => (
                                <ul className=" col-span-full grid grid-cols-1 mt-3 gap-x-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center relative p-2 bg-white rounded-md border py-4" key={index}>
                                    <span className="flex items-center gap-2 col-span-full justify-end">
                                        <p className=" font-semibold justify-self-start">Site {index + 1}</p>
                                        <HiMinus onClick={() => handleRemoveSite(index)} className={`${mineSitesDetails.length - 1 == 0 ? 'hidden' : ''}`} />
                                        <HiPlus onClick={handleAddSite} className={`${mineSitesDetails.length - 1 !== index ? 'hidden' : ''}`} />
                                    </span>
                                    <li>
                                        <p className="mb-1">Name</p>
                                        <input type="text" name="name"  autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={site.name || ''} onChange={e => handleSiteEntry(index, e)} />
                                    </li>
                                    {/* ******* */}
                                    <li>
                                        <p className="mb-1">code</p>
                                        <input type="text" name="code"  autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={site.code || ''} onChange={e => handleSiteEntry(index, e)} />
                                    </li>
                                    {/* ******* */}
                                    <li>
                                        <p className="mb-1">Latitude</p>
                                        <input type="text" name="coordinates.lat"  autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={site.coordinates.lat || ''} onChange={e => handleSiteEntry(index, e)} />
                                    </li>
                                    {/* ******* */}
                                    <li>
                                        <p className="mb-1">Longitude</p>
                                        <input type="text" name="coordinates.long" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={site.coordinates.long || ''} onChange={e => handleSiteEntry(index, e)} />
                                    </li>
                                    {/* ******* */}
                                </ul>
                            ))}

                        </ul>

                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center mt-2 border-t relative p-2 pb-9 shadow-md rounded-md bg-slate-50">
                            <p className=" col-span-full absolute -top-[13px] bg-white left-4 px-2 p-0 font-semibold">Mining Info</p>

                            <li>
                                <p className="mb-1">Type of Mining</p>
                                {/* <input type="text" name="typeOfMining" id="typeOfMining" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.typeOfMining || ''} onChange={handleAddproduct} /> */}
                                <select
                                    name="typeOfMining"
                                    id="typeOfMining"
                                    autoComplete="off"
                                    className="focus:outline-none p-2 border rounded-md w-full"
                                    defaultValue="typeOfMining"
                                    onChange={handleAddproduct}
                                >
                                    <option value="typeOfMining" hidden>
                                        Select a mineral type
                                    </option>
                                    <option value="Underground">Underground</option>
                                    <option value="Open Pits">Open Pits</option>
                                    <option value="Both">Both</option>
                                </select>

                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Surface Area</p>
                                <input type="text" name="surfaceArea" id="surfaceArea" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.surfaceArea || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Equipment List</p>
                                <input type="text" name="equipmentList" id="equipmentList" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.equipmentList || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Category of Mine</p>
                                <input type="text" name="categoryOfMine" id="categoryOfMine" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.categoryOfMine || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                        </ul>

                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center mt-2 border-t relative p-2 pb-9 shadow-md rounded-md bg-slate-50">
                            <p className=" col-span-full absolute -top-[13px] bg-white left-4 px-2 p-0 font-semibold">Address</p>

                            <li>
                                <p className="mb-1">Province</p>
                                <input type="text" name="address.province" id="address.province" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.address.province || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">District</p>
                                <input type="text" name="address.district" id="address.district" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.address.district || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Sector</p>
                                <input type="text" name="address.sector" id="address.sector" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.address.sector || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Cell</p>
                                <input type="text" name="address.cell" id="address.cell" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.address.cell || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                        </ul>

                    </div>
                }
                    Add={handleProductSubmit}
                    Cancel={handleCancel}
                    isloading={isLoading} />} />
        </div>
    )
}
export default AddSuplierPage;