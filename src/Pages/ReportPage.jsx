import React, { useState,useRef,useEffect } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { HiPlus, HiMinus } from "react-icons/hi";
import { ImSpinner2 } from "react-icons/im";
import { BsChevronDown } from "react-icons/bs";
import { HiOutlineSearch } from "react-icons/hi";
import { motion } from "framer-motion";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import { useGenerateDDReportMutation, useGetAllSuppliersQuery } from "../states/apislice";
import { useParams } from "react-router-dom";

const ReportPage = () => {
  const{supplierId}=useParams();
  let sup = [""];
  let sites = [""];
  const { data, isLoading, isError, error, isSuccess } =
  useGetAllSuppliersQuery();
  const[GenerateReport,{isLoading:isGenerating,isError:isFailed,isSuccess:isGenerated,error:fail}]=useGenerateDDReportMutation();
 const [minesiteInfo,setMinesiteInfo]=useState([{name_of_sites:'',code_of_sites:'',sites_district:'',sites_sector:'',sites_cell:'',sites_coordinates:'',date_of_visit:'',time_of_visit:''}]);
 const [personsInterviewedAndRole,setPersonsInterviewedAndRole]=useState([{name:"",role:""}]);
 const [interviewedRepresentative,setInterviewedRepresentative]=useState([{name:"",role:""}]);
 const [selectedReasons, setSelectedReasons] = useState([]);
 const [reportInfo,setReportInfo]=useState({name_of_consultant:'',email_of_consultant:'',purpose_of_visit:"",when_training:"",name_of_processor:"",company_visited:"",company_license_number:"",number_of_minesites:"",number_of_minesites_visited:"",sites_visited:"",number_of_diggers_observations_men:"",number_of_diggers_observations_women:"",number_of_diggers_representative_men:"",number_of_diggers_representative_women:"",number_of_washers_observations_men:"",number_of_washers_observations_women:"",number_of_washers_representative_men:"",number_of_washers_representative_women:"",number_of_transporters:"",number_of_transporters_observations_women:"",number_of_transporters_representative_men:"",number_of_transporters_representative_women:"",number_of_persons_per_team_observations:"",number_of_washers_per_team_observations:"",number_of_transporters_per_team_observations:"",number_of_diggers_per_team_observations:"",number_of_persons_per_team_representative:"",number_of_washers_per_team_representative:"",number_of_transporters_per_team_representative:"",number_of_diggers_per_team_representative:"",do_they_use_temporary_workers_observations:"",number_of_temporary_workers_observations:"",number_of_times_observations:"",do_they_use_temporary_workers_representative:"",number_of_temporary_workers_representative:"",number_of_times_representative:"",equipments_used_observations:"",equipment_used_representative:"",production_per_day_observations:"",production_per_day_representative:"",production_per_day_records:"",number_of_washing_times_observations:"",days_of_mineral_washing_observations:"",number_of_washing_times_representative:"",days_of_mineral_washing_representative:"",number_of_washing_times_records:"",days_of_mineral_washing_records:"",type_of_minerals_observations:"",type_of_minerals_representative:"",type_of_minerals_records:"",list_of_persons_interviewed_and_role:null});
//  
 const [dropdownOpen, setDropdownOpen] = useState(false);
 const [selectedSupplierName, setSelectedSupplierName] = useState(null);
 const [searchText, setSearchText] = useState("");
 
 const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
 const [selectedSupplierSite, setSelectedSupplierSite] = useState(null);
 const [siteSearchText, setSSiteearchText] = useState("");
 const [mineSites, setMineSites] = useState([]);
const [filteredMineSites, setFilteredMineSites] = useState([]);
// 
 
 if (isSuccess) {
  const { data: dt } = data;
  const { suppliers: sups } = dt;
  sup = sups;
}  
// 
 let modalRef = useRef();

 const handleClickOutside = (event) => {
   if (!modalRef.current || !modalRef.current.contains(event.target)) {
     setDropdownOpen(false);
   }
 };

 useEffect(() => {
   document.addEventListener("click", handleClickOutside, true);
   return () => {
     document.removeEventListener("click", handleClickOutside, true);
   };
 }, []);

 useEffect(() => {
  if (selectedSupplierName) {
    const chosenSupplier = sup.find((sup) => sup.companyName === selectedSupplierName);
    if (chosenSupplier) {
      setMineSites(chosenSupplier.mineSites);
      setFilteredMineSites(chosenSupplier.mineSites);
    }
  }
}, [selectedSupplierName, sup]);

 const filteredSuppliers = sup.filter((supplier) => {
  const companyName = supplier.companyName || "";
  return companyName.toLowerCase().includes(searchText.toLowerCase());
});

const handleSupplierSelect = (supplier) => {
  setSelectedSupplierName(supplier.companyName);
  const chosenSupplier = sup.find((sup) => sup._id === supplier._id);
  if (chosenSupplier) {
    setReportInfo((prevInfo)=>({...prevInfo,
      company_visited:chosenSupplier.companyName,
      company_license_number:chosenSupplier.licenseNumber,
      number_of_minesites:chosenSupplier.mineSites.length,
    }));
    sites=chosenSupplier.mineSites;
  }
  setReportInfo((prev) => ({ ...prev, supplierId: supplier._id }));
  setDropdownOpen(false);
  setSearchText("");
};

 const handleSearchInputChange = (e) => {
  setSearchText(e.target.value);
};
// 
// 
 let modalSitelRef = useRef();

 const handleClickOutsideSite = (event) => {
   if (!modalSitelRef.current || !modalSitelRef.current.contains(event.target)) {
    setSiteDropdownOpen(false);
   }
 };

 useEffect(() => {
   document.addEventListener("click", handleClickOutsideSite, true);
   return () => {
     document.removeEventListener("click", handleClickOutsideSite, true);
   };
 }, []);

 const filteredSuppliersSite = sites.map((supplier) => {
  const companyName = supplier.name || "";
  return companyName;

});

const reasons = [
  'Scenic Beauty',
  'Cultural Experience',
  'Adventure Activities',
  'Historical Sites',
];
const handleCheckboxChange = (event) => {
  const text = event.target.value;
  const isChecked = event.target.checked;

  if (isChecked) {
    setSelectedReasons((prevReasons) => (prevReasons ? prevReasons + '\n' : '') + text);
  } else {
    const updatedReasons = selectedReasons.replace(text + '\n', '');
    setSelectedReasons(updatedReasons);
  }

  setReportInfo((prev) => ({
    ...prev,
    purpose_of_visit: isChecked ? (prev.purpose_of_visit ? prev.purpose_of_visit + '\n' : '') + text : updatedReasons,
  }));
};


useEffect(() => {
}, [selectedReasons]);


const handleSupplierSiteSelect = (supplier, index) => {
  // Create a copy of the current minesiteInfo array
  const updatedMinesiteInfo = [...minesiteInfo];

  // Update the data for the selected dynamic form (formIndex)
  updatedMinesiteInfo[index] = {
    name_of_sites: supplier.name,
    code_of_sites: supplier.code,
    sites_coordinates: `Lat: ${supplier.coordinates.lat}, Long: ${supplier.coordinates.long}`,
    date_of_visit: "",
    time_of_visit: "",
  };

  // Set the updated minesiteInfo array
  setMinesiteInfo(updatedMinesiteInfo);

  // Set the selected supplier site
  setSelectedSupplierSite(supplier.name);

  // Set other states as needed
  setReportInfo((prev) => ({ ...prev, supplierId: supplier._id }));

  // Close the dropdown menu
  setSiteDropdownOpen(false);

  // Clear the search text
  setSearchText("");
};

 const handleSearchSiteInputChange = (e) => {
  setSearchText(e.target.value);
};

const handleAddDate = (e) => {
  setReportInfo((prevState) => ({
    ...prevState,
    date_of_report: dayjs(e).format("MMM/DD/YYYY"),
  }));
};

const handleAddTrainingDate = (e) => {
  setReportInfo((prevState) => ({
    ...prevState,
    when_training: dayjs(e).format("MMM/DD/YYYY"),
  }));
};

// 

const handleFormInput = (e) => {
  if (e.target.type === 'checkbox') {
    setReportInfo((prevState) => ({
      ...prevState,
      [e.target.name]: !prevState[e.target.name],
    }));
  } else {

    setReportInfo((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }
};

 const AddPersonsInterviewedAndRole=()=>{
  setPersonsInterviewedAndRole((prevSite)=>[...prevSite,{name:"",role:""}]);
 };

 const RemovePersonsInterviewedAndRole=(index)=>{
  const values = [...personsInterviewedAndRole];
  values.splice(index,1)
  setPersonsInterviewedAndRole(values)
 };

 const handlePersonsInterviewedAndRoleInput=(index,e)=>{
  const values=[...personsInterviewedAndRole];
  values[index][e.target.name] = e.target.value;
  setPersonsInterviewedAndRole(values);
 };
// 

const AddInterviewedRepresentative=()=>{
  setInterviewedRepresentative((prevSite)=>[...prevSite,{name:"",role:""}]);
 };

 const RemoveInterviewedRepresentative=(index)=>{
  const values = [...interviewedRepresentative];
  values.splice(index,1)
  setInterviewedRepresentative(values)
 };

 const handleInterviewedRepresentativeInput=(index,e)=>{
  const values=[...interviewedRepresentative];
  values[index][e.target.name] = e.target.value;
  setInterviewedRepresentative(values);
 };

//  

 const AddSiteFields=()=>{
  setMinesiteInfo((prevSite)=>[...prevSite,{name_of_sites:'',code_of_sites:'',sites_district:'',sites_sector:'',sites_cell:'',sites_coordinates:'',date_of_visit:'',time_of_visit:''}]);
 };

 const RemoveSiteFields=(index)=>{
  const values = [...minesiteInfo];
  values.splice(index,1)
  setMinesiteInfo(values)
 };

 const handleSiteInput=(index,e)=>{
  const values=[...minesiteInfo];
  values[index][e.target.name] = e.target.value;
  setMinesiteInfo(values);
 };
 const updateRoleList = (newList) => {
  setReportInfo(prevState => ({
    ...prevState,
    list_of_persons_interviewed_and_role: newList
  }));
};

 const handleFormSubmit=async(e)=>{
  e.preventDefault();
  updateRoleList(personsInterviewedAndRole);
  const body={...minesiteInfo,...interviewedRepresentative,...reportInfo};
  await GenerateReport({body,supplierId});
 };

  return (
    <ActionsPagesContainer
      title={`Report page`}
      subTitle={`Make report `}
      actionsContainer={
        <div className="w-full col-span-full space-y-6 p-2 relative mb-6">
          <div className="p-2 w-fit rounded-full bg-gray-400 shadow-2xl flex justify-center items-center absolute right-0 -bottom-4"><HiPlus className=" text-xl text-white"/></div>
          <p className="text-lg font-bold pl-1">Summary of report</p>
          <ul className=" list-none w-full bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-[4px] shadow-xl shadow-zinc-400 px-3 py-4 ">
            <li className=" space-y-1">
              <p className="pl-1">Name of processor</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name="name_of_processor"
                id=""
                onChange={handleFormInput}
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">Name of consultant</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name="name_of_consultant"
                id=""
                onChange={handleFormInput}
              />
            </li>
            <li className=" space-y-1">
              <p className="pl-1">Email of consultant</p>
              <input
                type="email"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name="email_of_consultant"
                id=""
                onChange={handleFormInput}
              />
            </li>
            <li className=" space-y-1">
              <p className="pl-1">Date of report</p>
              <DatePicker
              onChange={handleAddDate}
                id=""
                name="date_of_report"
                className="focus:outline-none p-2 border  rounded-[4px] w-full"
              />
            </li>
            <li className=" space-y-1">
              <p className="pl-1">Is individual trained </p>
              <input
                        type="checkbox"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px]  border-gray-300"
                        name="is_person_trained"
                        id=""
                        onChange={handleFormInput}
                      />

              <DatePicker
              onChange={handleAddTrainingDate}
                id=""
                name="when_training"
                className="focus:outline-none p-2 border  rounded-[4px] w-full"
              />
            </li>
            <li className="space-y-2 col-span-full bg-white p-2">
              <p className="">Purpose of visit</p>

              {reasons.map((reason, index) => (
          <div className="flex gap-2 items-center" key={index}>
            
              <input
                type="checkbox"
                value={reason}
                onChange={handleCheckboxChange}
                checked={selectedReasons.includes(reason)}
               style={{width:"17px",height:"17px"}}
              />
            <p>{reason}</p>
            
          </div>
        ))}
              
            </li>
          </ul>

          <p className="text-lg font-bold pl-1">Mine company info</p>
          <ul className=" list-none w-full bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-[4px] shadow-xl shadow-zinc-400 px-3 py-4 ">
            <li className="space-y-1 col-span-full">
            <p className="pl-1">Choose company</p>
            <div ref={modalRef} className="w-fit h-fit relative ">
                        <div
                          className="border p-2 w-[240px] rounded-md flex items-center justify-between gap-6 bg-white"
                          onClick={() => {
                            setDropdownOpen((prev) => !prev);
                          }}
                        >
                          <p className=" ">
                            {selectedSupplierName
                              ? selectedSupplierName
                              : "select a supplier"}
                          </p>
                          <BsChevronDown
                            className={`text-md transition ease-in-out duration-500 ${
                              dropdownOpen ? "rotate-180" : null
                            }`}
                          />
                        </div>
                        <motion.div
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
                          className={`p-2 space-y-3 bg-white w-fit rounded absolute top-12 shadow-2xl z-40 `}
                        >
                          <div className="w-full flex items-center gap-2 px-2 py-1 rounded border">
                            <HiOutlineSearch className={`text-lg `} />
                            <input
                              type="text"
                              name="searchTextInput"
                              id="searchTextInput"
                              placeholder="Search"
                              className="w-full focus:outline-none"
                              value={searchText}
                              onChange={handleSearchInputChange}
                            />
                          </div>
                          {isLoading?<div className="w-full flex justify-start items-center gap-1">
                          <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500" />
                          <p className=" text-slate-400">Fetching suppliers...</p>
                          </div>:<ul className={`list-none  overflow-auto `}>
                            {filteredSuppliers.map((supplier, index) => (
                              <li
                                key={index}
                                className=" hover:bg-slate-300 rounded-md p-2"
                                onClick={() => handleSupplierSelect(supplier)}
                              >
                                {supplier.companyName}
                              </li>
                            ))}
                          </ul>}
                        </motion.div>
                      </div>
            </li>
            <li className=" space-y-1">
              <p className="pl-1">Company visited</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name="company_visited"
                id=""
                value={reportInfo.company_visited||""}
                onChange={handleFormInput}
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">company license number</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name="company_license_number"
                id=""
                value={reportInfo.company_license_number||""}
                onChange={handleFormInput}
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">Number of minesites</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name="number_of_minesites"
                id=""
                value={reportInfo.number_of_minesites||""}
                onChange={handleFormInput}
              />
            </li>
            <li className=" space-y-1">
              <p className="pl-1">Number of minesites visited</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name="number_of_minesites_visited"
                id=""
                value={reportInfo.number_of_minesites_visited||""}
                onChange={handleFormInput}
              />
            </li>
            <li className=" space-y-1 col-span-full">
              <p className="pl-1">Last visit date and sites</p>
              <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DatePicker
                // onChange={handleLastvisitDate}
                  id=""
                  name="date_of_last_visit"
                  className="focus:outline-none p-2 border  rounded-[4px] w-full z-0"
                />
                <input
                  type="text"
                  autoComplete="off"
                  className="focus:outline-none p-2 border rounded-[4px] w-full"
                  name="sites_visited"
                  id=""
                  value={reportInfo.sites_visited||""}
                  onChange={handleFormInput}
                />
              </div>
            </li>
            <li className=" space-y-1 col-span-full">
              <p className="pl-1">List of interviewed person and role</p>
              {/*//// */}
            {personsInterviewedAndRole.map(({name,role},index)=>{
              return (
                <div key={index} className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className=" justify-self-end col-span-full flex items-center gap-2">
                  <p> {`person ${index+1}`}</p>
                  <div className="flex gap-1 items-center">
                <HiPlus className="text-md" onClick={AddPersonsInterviewedAndRole}/>
               {personsInterviewedAndRole.length>1?<HiMinus className="text-md" onClick={()=>RemovePersonsInterviewedAndRole(index)}/>:null}
                </div>
                </div>

                <span className=" space-y-1">
                  <p className="pl-1">name</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name="name"
                    id=""
                    value={name||""}
                    onChange={e=>handlePersonsInterviewedAndRoleInput(index,e)}
                  />
                </span>
                <span className=" space-y-1">
                  <p className="pl-1">role</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name="role"
                    id=""
                    value={role||""}
                    onChange={e=>handlePersonsInterviewedAndRoleInput(index,e)}
                  />
                </span>
              </div>
              )
            })  }
            </li>
          </ul>

          <p className="text-lg font-bold pl-1">Information per sites</p>
          <ul className=" list-none w-full bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-[4px] shadow-xl shadow-zinc-400 px-3 py-4 ">
            {/* // */}
            {minesiteInfo.map(({name_of_sites,code_of_sites,sites_district,sites_sector,sites_cell,sites_coordinates,date_of_visit,time_of_visit},index)=>{
              return(
                <ul key={index} className=" list-none col-span-full bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-[4px] shadow-xl shadow-zinc-400 px-3 py-4 ">
                <div className="col-span-full justify-between items-center flex">
                <p className="col-span-full text-lg font-semibold">{`Site ${index+1}`}</p>
                <div className="flex gap-1 items-center">
                <HiPlus className="text-lg" onClick={AddSiteFields}/>
               {minesiteInfo.length>1?<HiMinus className="text-lg" onClick={()=>RemoveSiteFields(index)}/>:null}
                </div>
                </div>
                {/*  */}
{    selectedSupplierName?            <li className="space-y-1 col-span-full">
            <p className="pl-1">Choose company</p>
            <div ref={modalSitelRef} className="w-fit h-fit relative ">
                        <div
                          className="border p-2 w-[240px] rounded-md flex items-center justify-between gap-6 bg-white"
                          onClick={() => {
                            setSiteDropdownOpen((prev) => !prev);
                          }}
                        >
                          <p className=" ">
                            {selectedSupplierSite
                              ? selectedSupplierSite
                              : "select a site"}
                          </p>
                          <BsChevronDown
                            className={`text-md transition ease-in-out duration-500 ${
                              siteDropdownOpen ? "rotate-180" : null
                            }`}
                          />
                        </div>
                        <motion.div
                          animate={
                            siteDropdownOpen
                              ? { opacity: 1, x: -8, y: 1, display: "block" }
                              : { opacity: 0, x: 0, y: 0, display: "none" }
                          }
                          transition={{
                            type: "spring",
                            duration: 0.8,
                            bounce: 0.35,
                          }}
                          className={`p-2 space-y-3 bg-white w-fit rounded absolute top-12 shadow-2xl z-40 `}
                        >
                          <div className="w-full flex items-center gap-2 px-2 py-1 rounded border">
                            <HiOutlineSearch className={`text-lg `} />
                            <input
                              type="text"
                              name={`searchTextInput2${index}`}
                              id={`searchTextInput2${index}`}
                              placeholder="Search"
                              className="w-full focus:outline-none"
                              value={siteSearchText}
                              onChange={handleSearchSiteInputChange}
                            />
                          </div>
                          {isLoading?<div className="w-full flex justify-start items-center gap-1">
                          <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500" />
                          <p className=" text-slate-400">Fetching suppliers...</p>
                          </div>:
                          <ul className={`list-none  overflow-auto `}>
                            {filteredMineSites.map((site, index) => (
                              <li
                                key={index}
                                className=" hover:bg-slate-300 rounded-md p-2"
                                onClick={() => handleSupplierSiteSelect(site,index)}
                              >
                                {site.name}
                              </li>
                            ))}
                          </ul>}
                        </motion.div>
                      </div>
            </li>:null}
            {/*  */}
                <li className=" space-y-1">
                  <p className="pl-1">Name of the site</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name="name_of_sites"
                    id=""
                    value={name_of_sites||""}
                    onChange={e=>handleSiteInput(index,e)}
                  />
                </li>
    
                <li className=" space-y-1">
                  <p className="pl-1">Code of the site</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name="code_of_sites"
                    id=""
                    value={code_of_sites||""}
                    onChange={e=>handleSiteInput(index,e)}
                  />
                </li>
    
                <li className=" space-y-1">
                  <p className="pl-1">GPS coordinates</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name="sites_coordinates"
                    id=""
                    value={sites_coordinates||""}
                    onChange={e=>handleSiteInput(index,e)}
                  />
                </li>
    
                <li className=" space-y-1">
                  <p className="pl-1">District</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name="sites_district"
                    id=""
                    value={sites_district||""}
                    onChange={e=>handleSiteInput(index,e)}
                  />
                </li>
    
                <li className=" space-y-1">
                  <p className="pl-1">Sector</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name="sites_sector"
                    id=""
                    value={sites_sector||""}
                    onChange={e=>handleSiteInput(index,e)}
                  />
                </li>
                <li className=" space-y-1">
                  <p className="pl-1">Cell</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name="sites_cell"
                    id=""
                    value={sites_cell||""}
                    onChange={e=>handleSiteInput(index,e)}
                  />
                </li>
    
                <li className=" space-y-1">
                  <p className="pl-1">Date of visit</p>
                  <DatePicker
                    id=""
                    name="date_of_visit"
                    className="focus:outline-none p-2 border  rounded-[4px] w-full"
                  />
                </li>
    
                </ul>
              )
            })}


            <li className=" space-y-1 col-span-full">
              <p className="pl-1 font font-semibold text-md">
                Name and position of representative
              </p>
              {/*  */}
            {interviewedRepresentative.map(({name,role},index)=>{
              return(
                <div key={index} className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className=" justify-self-end col-span-full flex items-center gap-2">
                <p> {`person ${index+1}`}</p>
                  <div className="flex gap-1 items-center">
                <HiPlus className="text-md" onClick={AddInterviewedRepresentative}/>
               {interviewedRepresentative.length>1?<HiMinus className="text-md" onClick={()=>RemoveInterviewedRepresentative(index)}/>:null}
                </div>
                </div>

                <span className=" space-y-1">
                  <p className="pl-1">name</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name="name"
                    id=""
                    value={name||""}
                    onChange={e=>handleInterviewedRepresentativeInput(index,e)}
                  />
                </span>
                <span className=" space-y-1">
                  <p className="pl-1">position</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name="role"
                    id=""
                    value={role||""}
                    onChange={e=>handleInterviewedRepresentativeInput(index,e)}
                  />
                </span>
              </div>
              )
            })}
            </li>

            <li className=" space-y-1 col-span-full shadow-2xl rounded-[4px] p-2 pb-6 mt-8">
              <p className="pl-1 font font-bold text-lg ">
                Level of activities at the mine site
              </p>
              <ul className="grid grid-cols-1 gap-12 ">
                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Number of digers
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on owns observation at the site
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Men</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_diggers_observations_men"
                        id=""
                        value={reportInfo.number_of_diggers_observations_men||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Women</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_diggers_observations_women"
                        id=""
                        value={reportInfo.number_of_diggers_observations_women||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Men</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_diggers_representative_men"
                        id=""
                        value={reportInfo.number_of_diggers_representative_men||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Women</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_diggers_representative_women"
                        id=""
                        value={reportInfo.number_of_diggers_representative_women||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                </ul>

                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Number of washers
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on owns observation at the site
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Men</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_washers_observations_men"
                        id=""
                        value={reportInfo.number_of_washers_observations_men||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Women</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_washers_observations_women"
                        id=""
                        value={reportInfo.number_of_washers_observations_women||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Men</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_washers_representative_men"
                        id=""
                        value={reportInfo.number_of_washers_representative_men||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Women</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_washers_representative_women"
                        id=""
                        value={reportInfo.number_of_washers_representative_women||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                </ul>

                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Number of transporters
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on owns observation at the site
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Men</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_transporters"
                        id=""
                        value={reportInfo.number_of_transporters||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Women</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_transporters_observations_women"
                        id=""
                        value={reportInfo.number_of_transporters_observations_women||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Men</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_transporters_representative_men"
                        id=""
                        value={reportInfo.number_of_transporters_representative_men||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Women</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_transporters_representative_women"
                        id=""
                        value={reportInfo.number_of_transporters_representative_women||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                </ul>

                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Number of teams
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r items-center border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on owns observation at the site
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Number of person per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_persons_per_team_observations"
                        id=""
                        value={reportInfo.number_of_persons_per_team_observations||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Number of washers per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_washers_per_team_observations"
                        id=""
                        value={reportInfo.number_of_washers_per_team_observations||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Number of transporters per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_transporters_per_team_observations"
                        id=""
                        value={reportInfo.number_of_transporters_per_team_observations||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Number of diggers per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_diggers_per_team_observations"
                        id=""
                        value={reportInfo.number_of_diggers_per_team_observations||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">Number of person per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_persons_per_team_representative"
                        id=""
                        value={reportInfo.number_of_persons_per_team_representative||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Number of washers per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_washers_per_team_representative"
                        id=""
                        value={reportInfo.number_of_washers_per_team_representative||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Number of transporters per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_transporters_per_team_representative"
                        id=""
                        value={reportInfo.number_of_transporters_per_team_representative||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Number of diggers per team</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_diggers_per_team_representative"
                        id=""
                        value={reportInfo.number_of_diggers_per_team_representative||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                </ul>

                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Temporary workers
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1  gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on owns observation at the site
                    </p>
                    <span className="space-y-1 flex items-center justify-start gap-2">
                      <p className="pl-1">Do they use temporary workers?</p>
                      <input
                        type="checkbox"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px]  border-gray-300"
                        name="do_they_use_temporary_workers_observations"
                        id=""
                        value={reportInfo.do_they_use_temporary_workers_observations||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">number of temporary workers</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_temporary_workers_observations"
                        id=""
                        value={reportInfo.number_of_temporary_workers_observations||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">number of times</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_times_observations"
                        id=""
                        value={reportInfo.number_of_times_observations||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1  gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1 flex items-center justify-start gap-2">
                      <p className="pl-1">Do they use temporary workers?</p>
                      <input
                        type="checkbox"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px]  border-gray-300"
                        name="do_they_use_temporary_workers_representative"
                        id=""
                        value={reportInfo.do_they_use_temporary_workers_representative||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">number of temporary workers</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_temporary_workers_representative"
                        id=""
                        value={reportInfo.number_of_temporary_workers_representative||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">number of times</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_times_representative"
                        id=""
                        value={reportInfo.number_of_times_representative||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                </ul>
                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Equipment used
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on owns observation at the site
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">List</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="equipments_used_observations"
                        id=""
                        value={reportInfo.equipments_used_observations||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">List</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="equipment_used_representative"
                        id=""
                        value={reportInfo.equipment_used_representative||""}
                        onChange={handleFormInput}
                        // aha niho nagarukiye kuri report info
                      />
                    </span>
                  </li>
                </ul>
              </ul>
            </li>

            <li className=" space-y-1 col-span-full shadow-2xl rounded-[4px] p-2 pb-6 mt-8">
              <p className="pl-1 font font-bold text-lg ">
                Information on level of production at site
              </p>
              <ul className="grid grid-cols-1 gap-12 ">
                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Production per day
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info collected from miners
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Production per day</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="production_per_day_observations"
                        id=""
                        value={reportInfo.production_per_day_observations||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Production per day</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="production_per_day_representative"
                        id=""
                        value={reportInfo.production_per_day_representative||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info from company's or cooperative's own records
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Production per day</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="production_per_day_records"
                        id=""
                        value={reportInfo.production_per_day_records||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                </ul>

                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4 ">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Mineral wash frequency
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 items-center gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info collected from miners
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">times washed</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_washing_times_observation"
                        id=""
                        value={reportInfo.number_of_washing_times_observations||""}  
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Days of mineral washing</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="days_of_mineral_washing_observations"
                        id=""
                        value={reportInfo.days_of_mineral_washing_observations||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">times washed</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_washing_times_representative"
                        id=""
                        value={reportInfo.number_of_washing_times_representative||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Days of mineral washing</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="days_of_mineral_washing_representative"
                        id=""
                        value={reportInfo.days_of_mineral_washing_representative||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info from company's or cooperative's own records
                    </p>
                    <span className="space-y-1">
                      <p className="pl-1">times washed</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="number_of_washing_times_records"
                        id=""
                        value={reportInfo.number_of_washing_times_records||""}
                        onChange={handleFormInput}
                      />
                    </span>
                    <span className="space-y-1">
                      <p className="pl-1">Days of mineral washing</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="days_of_mineral_washing_records"
                        id=""
                        value={reportInfo.days_of_mineral_washing_records||""}
                        onChange={handleFormInput}
                      />
                    </span>
                  </li>
                </ul>
                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4 ">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                    Type of mined minerals
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info collected from miners
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Type of minerals</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="type_of_minerals_observations"
                        id=""
                        value={reportInfo.type_of_minerals_observations||""}
                        onChange={handleFormInput}
                      />
                    </span>

                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Type of minerals</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="type_of_minerals_representative"
                        id=""
                        value={reportInfo.type_of_minerals_representative||""}
                        onChange={handleFormInput}
                      />
                    </span>

                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info from company's or cooperative's own records
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Type of minerals</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="type_of_minerals_records"
                        id=""
                        value={reportInfo.type_of_minerals_records||""}
                        onChange={handleFormInput}
                      />
                    </span>

                  </li>
                </ul>
                {/* DOES COMPANY KEEP THEIR OWN RECORD */}
                <ul className=" space-y-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-span-full shadow-lg bg-zinc-200 rounded-sm border border-l-[3px] border-l-gray-400 pb-4 ">
                  <p className=" py-1 border-b-2 border-b-gray-300 px-2 text-lg font-semibold col-span-full">
                   Company record tracking
                  </p>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info collected from miners
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Type of minerals</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="type_of_minerals_observations"
                        id=""
                        value={reportInfo.type_of_minerals_observations||""}
                        onChange={handleFormInput}
                      />
                    </span>

                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info based on mine company representative
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Type of minerals</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="type_of_minerals_representative"
                        id=""
                        value={reportInfo.type_of_minerals_representative||""}
                        onChange={handleFormInput}
                      />
                    </span>

                  </li>
                  <li className="space-y-1 pt-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-2 border-r border-r-gray-300">
                    <p className="col-span-full p-1 font-semibold bg-zinc-300">
                      Info from company's or cooperative's own records
                    </p>
                    <span className="space-y-1 col-span-full">
                      <p className="pl-1">Type of minerals</p>
                      <input
                        type="text"
                        autoComplete="off"
                        className="focus:outline-none p-2 border rounded-[4px] w-full border-gray-300"
                        name="type_of_minerals_records"
                        id=""
                        value={reportInfo.type_of_minerals_records||""}
                        onChange={handleFormInput}
                      />
                    </span>

                  </li>
                </ul>


              </ul>
            </li>
          </ul>

          <p className="text-lg font-bold pl-1">Mine company records tracking</p>
          {/* <ul className=" list-none w-full bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-[4px] shadow-xl shadow-zinc-400 px-3 py-4 ">
            <li className=" space-y-1">
              <p className="pl-1">Company visited</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name=""
                id=""
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">company license number</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name=""
                id=""
              />
            </li>

            <li className=" space-y-1">
              <p className="pl-1">Number of minesites</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name=""
                id=""
              />
            </li>
            <li className=" space-y-1">
              <p className="pl-1">Number of minesites visited</p>
              <input
                type="text"
                autoComplete="off"
                className="focus:outline-none p-2 border rounded-[4px] w-full"
                name=""
                id=""
              />
            </li>
            <li className=" space-y-1 col-span-full">
              <p className="pl-1">Last visit date and sites</p>
              <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DatePicker
                  id=""
                  name=""
                  className="focus:outline-none p-2 border  rounded-[4px] w-full"
                />
                <input
                  type="text"
                  autoComplete="off"
                  className="focus:outline-none p-2 border rounded-[4px] w-full"
                  name=""
                  id=""
                />
              </div>
            </li>
            <li className=" space-y-1 col-span-full">
              <p className="pl-1">List of interviewed person and role</p>
              <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className=" justify-self-end col-span-full flex items-center gap-2">
                  <p> person 1</p>
                  <HiPlus />
                </div>

                <span className=" space-y-1">
                  <p className="pl-1">name</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name=""
                    id=""
                  />
                </span>
                <span className=" space-y-1">
                  <p className="pl-1">role</p>
                  <input
                    type="text"
                    autoComplete="off"
                    className="focus:outline-none p-2 border rounded-[4px] w-full"
                    name=""
                    id=""
                  />
                </span>
              </div>
            </li>
          </ul> */}
          <div className="flex gap-1 items-center" >
           {isGenerating? <button className="p-2 bg-orange-100 rounded-md w-fit" >Sending</button> :<button className="p-2 bg-orange-200 rounded-md w-fit" onClick={handleFormSubmit}>Submit</button> }
            <button className="p-2 bg-blue-200 rounded-md w-fit">Cancel</button> 
          </div>
        </div>
      }
    />
  );
};

export default ReportPage;
