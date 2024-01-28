import { useEffect, useState } from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";
import { MdOutlineAdd } from "react-icons/md";
import { HiMinus, HiPlus } from "react-icons/hi";
import { useUpdateSupplierMutation, useGetOneSupplierQuery } from "../states/apislice";
import { useNavigate, useParams } from "react-router-dom";
import FetchingPage from "./FetchingPage";

const EditSuplierPage = () => {
    const { supplierId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isSuccess, isError } = useGetOneSupplierQuery({ supplierId });
    const [formval, setFormval] = useState({ companyName: '', TINNumber: '', licenseNumber: '', email: '', nationalId: '', typeOfMinerals: '', phoneNumber: '', mineSites:null, address: { province: '', district: '', sector: '' }, numberOfDiggers: '', numberOfWashers: '', numberOfTransporters: '',companyRepresentative:"" });
    const [mineSites, SetMineSites] = useState([{ coordinates: { lat: '', long: '', }, name: '', code: '' }]);
    const [show, setShow] = useState(false);
    const [addressFields, setAddresField] = useState(false);
    const [updateSupplier, { isSuccess: isDone, isLoading: isUpdating, isError: isFailed, error: problem }] = useUpdateSupplierMutation();


    useEffect(() => {
        if (isSuccess) {
            const { data: dt } = data;
            const { supplier: sup } = dt;
            const { address: adr } = sup;
            setFormval({ companyName: sup.companyName, TINNumber: sup.TINNumber, licenseNumber: sup.licenseNumber, email: sup.email, nationalId: sup.nationalId, typeOfMinerals: sup.typeOfMinerals.join(' '), phoneNumber: sup.phoneNumber, address: { province: adr.province, district: adr.district, sector: adr.sector, cell: adr.cell }, numberOfDiggers: sup.numberOfDiggers, numberOfWashers: sup.numberOfWashers, numberOfTransporters: sup.numberOfTransporters,companyRepresentative:sup.companyRepresentative });
            SetMineSites(sup.mineSites)
        }

    }, [isSuccess]);

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
    // const updateLotNumbers = () => {
    //     SetMineSites((prevmineSites) => {
    //       return prevmineSites.map((mine, index) => ({
    //         ...mine,
    //       }));
    //     });
    //   };


    const handleAddLot = () => {
        SetMineSites((prevmineSites) => [...prevmineSites, { coordinates: { lat: '', long: '', }, name: '', code: '', }]);
        // updateLotNumbers();
    };

    const handleLRemoveLot = (index) => {
        const values = [...mineSites];
        values.splice(index, 1);
        values.forEach((lot, i) => {
            // lot.lotNumber = i + 1;
        });
        SetMineSites(values);
    };

    const handleMineEntry = (index, e) => {
        SetMineSites((prevmineDetails) => {
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

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const body = { ...formval,mineSites:mineSites,typeOfMinerals: formval.typeOfMinerals.split(' ') };
        await updateSupplier({ body, supplierId });
        setFormval({ companyName: '', TINNumber: '', licenseNumber: '', email: '', nationalId: '', typeOfMinerals: '', phoneNumber: '', mineSites: [{ coordinates: { lat: '', long: '', }, name: '', code: '', }], address: { province: '', district: '', sector: '', cell: '' }, numberOfDiggers: '', numberOfWashers: '', numberOfTransporters: '',companyRepresentative:"" });
        SetMineSites([{ coordinates: { lat: '', long: '', }, name: '', code: '' }]);
        navigate(-1);
    }
    const handleCancel = () => {
        setFormval({ companyName: '', TINNumber: '', licenseNumber: '', email: '', nationalId: '', typeOfMinerals: '', phoneNumber: '', mineSites: [{ coordinates: { lat: '', long: '', }, name: '', code: '', }], address: { province: '', district: '', sector: '', cell: '' }, numberOfDiggers: '', numberOfWashers: '', numberOfTransporters: '',companyRepresentative:"" })
    }

    return (
        <>
                {isLoading ? (
            <FetchingPage/>
          ) :             <ActionsPagesContainer title={'Edit Supplier'}
          subTitle={'Edit/Update supplier'}
          actionsContainer={<AddComponent component={
              <div className="flex flex-col gap-4">  
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
                      {/* <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center mt-2 border-t  relative p-2">
                      <p className=" col-span-full absolute -top-[13px] bg-white left-4 px-2 p-0 font-semibold">Minesite</p>

                      <li>
                          <p className="mb-1">Name</p>
                          <input type="text" name="mineSites.name" id="mineSites.name" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.mineSites[0].name || ''} onChange={handleAddproduct} />
                      </li>
                      
                      <li>
                          <p className="mb-1">code</p>
                          <input type="text" name="mineSites.code" id="mineSites.code" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.mineSites[0].code || ''} onChange={handleAddproduct} />
                      </li>
                      
                      <li>
                          <p className="mb-1">Latitude</p>
                          <input type="text" name="mineSites.coordinates.lat" id="mineSites.coordinates.lat" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.mineSites[0].coordinates.lat || ''} onChange={handleAddproduct} />
                      </li>
                      
                      <li>
                          <p className="mb-1">Longitude</p>
                          <input type="text" name="mineSites.coordinates.long" id="mineSites.coordinates.long" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.mineSites[0].coordinates.long || ''} onChange={handleAddproduct} />
                      </li>
                      
                  </ul> */}

                      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center mt-2 border-t  relative p-2 pb-9 shadow-lg rounded-md bg-gray-100">
                          <p className=" col-span-full absolute -top-[13px] bg-white left-4 px-2 rounded-md p-0 font-semibold">Minesite</p>
                          {mineSites.map((site, index) => (
                              <ul className=" col-span-full grid grid-cols-1 mt-3 gap-x-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center relative p-2 bg-white rounded-md border py-4" key={index}>
                                  <span className="flex items-center gap-2 col-span-full justify-end">
                                      <p className=" font-semibold justify-self-start">Site {index + 1}</p>
                                      <HiMinus onClick={() => handleLRemoveLot(index)} className={`${mineSites.length - 1 == 0 ? 'hidden' : ''}`} />
                                      <HiPlus onClick={handleAddLot} className={`${mineSites.length - 1 !== index ? 'hidden' : ''}`} />
                                  </span>
                                  <li>
                                      <p className="mb-1">Name</p>
                                      <input type="text" name="name"  autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={site.name || ''} onChange={e => handleMineEntry(index, e)} />
                                  </li>

                                  <li>
                                      <p className="mb-1">code</p>
                                      <input type="text" name="code" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={site.code || ''} onChange={e => handleMineEntry(index, e)} />
                                  </li>

                                  <li>
                                      <p className="mb-1">Latitude</p>
                                      <input type="text" name="coordinates.lat" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={site.coordinates.lat || ''} onChange={e => handleMineEntry(index, e)} />
                                  </li>

                                  <li>
                                      <p className="mb-1">Longitude</p>
                                      <input type="text" name="coordinates.long" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={site.coordinates.long || ''} onChange={e => handleMineEntry(index, e)} />
                                  </li>

                              </ul>
                          ))}

                      </ul>
                      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center mt-2 border-t relative p-2 pb-9 shadow-lg rounded-md bg-gray-100">
                          <p className=" col-span-full absolute -top-[13px] bg-white rounded-md left-4 px-2 p-0 font-semibold">Address</p>

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
              </div>
          }
              Add={handleProductSubmit}
              Cancel={handleCancel}
              isloading={isUpdating} />} />}
        </>
    )
}
export default EditSuplierPage;