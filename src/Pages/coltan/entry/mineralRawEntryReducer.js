import dayjs from "dayjs";

export const INITIAL_STATE = {
  checked: false,
  dropdownOpen: false,
  selectedSupplierName: null,
  searchText: "",
  model: "",
  beneficial: "",
  formval: {
    companyName: "",
    email: "",
    TINNumber: "",
    licenseNumber: "",
    companyRepresentative: "",
    // representativeId: "",
    representativePhoneNumber: "",
    mineralType: "",
    supplyDate: "",
    time: "",
    weightIn: "",
    numberOfTags: "",
    beneficiary: "",
    // mineTags: "",
    supplierId: "",
    //   negociantTags: "",
    //   mineralgrade: "",
    //   mineralprice: "",
    //   shipmentnumber: "",
    //   beneficiary: "",
    isSupplierBeneficiary: false,
  },
  lotDetails: [{ lotNumber: "", weightOut: "" }],
};

export const ACTION={
  HANDLE_ENTRY:"HANDLE_ENTRY",
  ADD_DATE:"ADD_DATE",
  ADD_TIME:"ADD_TIME",
  HANDLE_CHECK:"HANDLE_CHECK",
  HANDLE_SUPPLIER_SELECT:"HANDLE_SUPPLIER_SELECT",
  ADD_LOT:"ADD_LOT",
  REMOVE_LOT:"REMOVE_LOT",
  HANDLE_LOT_ENTRY:"HANDLE_LOT_ENTRY",
  DROP_DOWN:"DROP_DOWN",
  DROP_DOWN_OUT:"DROP_DOWN_OUT",
  SEARCH_TEXT:"SEARCH_TEXT",
  RETURN_TO_INITIAL:"RETURN_TO_INITIAL",
  SET_MODEL:"SET_MODEL",
}

export const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_MODEL":
      return {
        ...state,
        formval: {
          ...state.formval,
          mineralType:action.payload,
        },
      };
    case "HANDLE_ENTRY":
      return {
        ...state,
        formval: {
          ...state.formval,
          [action.payload.name]: action.payload.value,
        },
      };
    case "ADD_DATE":
      return {
        ...state,
        formval: {
          ...state.formval,
          supplyDate: dayjs(action.payload).format("MMM/DD/YYYY"),
        },
      };
    case "ADD_TIME":
      return {
        ...state,
        formval: {
          ...state.formval,
          time: dayjs(action.payload).format("HH:mm"),
        },
      };
    case "HANDLE_CHECK":
      return {
        ...state,
        checked: !state.checked,
        formval: {
          ...state.formval,
          beneficiary: state.checked ? "" : state.beneficial,
          isSupplierBeneficiary: !state.checked,
        },
      };
    case "HANDLE_SUPPLIER_SELECT":
      const { chosenSupplier,supplier } = action.payload;
      const shouldUpdateState = chosenSupplier !== null || "";
      return {
        ...state,
        formval: shouldUpdateState
          ? {
              ...state.formval,
              companyName: chosenSupplier.companyName,
              licenseNumber: chosenSupplier.licenseNumber,
              TINNumber: chosenSupplier.TINNumber,
              email: chosenSupplier.email,
              supplierId: chosenSupplier._id,
              companyRepresentative: chosenSupplier.companyRepresentative,
              representativePhoneNumber: chosenSupplier.phoneNumber,
            }
          : state.formval,
          
          selectedSupplierName:supplier?supplier.companyName:"",
        beneficial: shouldUpdateState
          ? chosenSupplier.companyRepresentative
          : state.beneficial,
        checked: shouldUpdateState ? false : state.checked,
        dropdownOpen:false,
        searchText:"",

      };
    case "ADD_LOT":
      return {
        ...state,
        lotDetails: [...state.lotDetails, { lotNumber: "", weightOut: "" }],
      };
      case 'REMOVE_LOT':
        return {
          ...state,
          lotDetails: state.lotDetails.filter((lot, i) => i !== action.payload),
        };  
      case 'HANDLE_LOT_ENTRY':
        const { index, name, value} = action.payload;
        const updatedLotDetailsEntry = [...state.lotDetails];
        updatedLotDetailsEntry[index] = {
          ...updatedLotDetailsEntry[index],
          [name]: value,
          lotNumber: index + 1,
        };
  
        return {
          ...state,
          lotDetails: updatedLotDetailsEntry,
        };  
    case "DROP_DOWN":
      return { ...state, dropdownOpen: !state.dropdownOpen };
    case "DROP_DOWN_OUT":
      return { ...state, dropdownOpen: false };
    case "SEARCH_TEXT":
      return { ...state, searchText: action.payload };
    case "RETURN_TO_INITIAL":
      return INITIAL_STATE;
    default:
      return state;
  }
};
