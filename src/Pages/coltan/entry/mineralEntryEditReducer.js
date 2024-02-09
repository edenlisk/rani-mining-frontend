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
    representativeId: "",
    representativePhoneNumber: "",
    mineralType: "",
    supplyDate: "",
    time: "",
    weightIn: "",
    numberOfTags: "",
    mineTags: "",
    supplierId: "",
    mineralgrade: "",
    mineralprice: "",
    shipmentnumber: "",
    beneficiary: "",
    isSupplierBeneficiary: false,
  },
  negociantTags: [{ weight: null, tagNumber: "", sheetNumber: "", status: "" }],
  initialMineTags: [
    { weight: null, tagNumber: "", sheetNumber: "", limit: "" },
  ],
  mineTags: [{ weight: null, tagNumber: "", sheetNumber: "", status: "" }],
  lotDetails: [{ lotNumber: "", weightOut: "" }],
};

export const ACTION = {
  HANDLE_ENTRY: "HANDLE_ENTRY",
  ADD_DATE: "ADD_DATE",
  ADD_TIME: "ADD_TIME",
  HANDLE_CHECK: "HANDLE_CHECK",
  HANDLE_SUPPLIER_SELECT: "HANDLE_SUPPLIER_SELECT",
  ADD_LOT: "ADD_LOT",
  REMOVE_LOT: "REMOVE_LOT",
  HANDLE_LOT_ENTRY: "HANDLE_LOT_ENTRY",
  ADD_NEGOTIANT_TAG: "ADD_NEGOTIANT_TAG",
  REMOVE_NEGOTIANT_TAG: "REMOVE_NEGOTIANT_TAG",
  HANDLE_NEGOTIANT_TAG_ENTRY: "HANDLE_NEGOTIANT_TAG_ENTRY",
  DROP_DOWN: "DROP_DOWN",
  DROP_DOWN_OUT: "DROP_DOWN_OUT",
  SEARCH_TEXT: "SEARCH_TEXT",
  RETURN_TO_INITIAL: "RETURN_TO_INITIAL",
  SET_MODEL: "SET_MODEL",
  SET_TO_SERVER_DATA: "SET_TO_SERVER_DATA",
  ADD_NEGOTIANT_TAG_LOT: "ADD_NEGOTIANT_TAG_LOT",
  REMOVE_NEGOTIANT_TAG_LOT: "REMOVE_NEGOTIANT_TAG_LOT",
  HANDLE_LOT_NEGOTIANT_TAG_ENTRY: "HANDLE_LOT_NEGOTIANT_TAG_ENTRY",
  ADD_MINES_TAG_LOT: "ADD_MINES_TAG_LOT",
  REMOVE_MINES_TAG_LOT: "REMOVE_MINES_TAG_LOT",
  HANDLE_LOT_MINES_TAG_ENTRY: "HANDLE_LOT_MINES_TAG_ENTRY",
  HANDLE_INITIAL_MINE_TAGS_ENTRY: "HANDLE_INITIAL_MINE_TAGS_ENTRY",
  GENERATE_MINE_TAGS:"GENERATE_MINE_TAGS",
};

export const formEditReducer = (state, action) => {
  switch (action.type) {
    case "SET_TO_SERVER_DATA":
      const { entr } = action.payload;
      const isNegotiantTags = entr.negociantTags?.length > 0;
      const isMineTags = entr.mineTags?.length > 0;

      

      return {
        ...state,
        formval: {
          ...state.formval,
          companyName: entr.companyName,
          TINNumber: entr.TINNumber,
          licenseNumber: entr.licenseNumber,
          companyRepresentative: entr.companyRepresentative,
          representativeId: entr.representativeId,
          representativePhoneNumber: entr.representativePhoneNumber,
          mineralType: entr.mineralType,
          supplyDate: dayjs(entr.supplyDate),
          time: dayjs(entr.time, "HH:mm"),
          weightIn: entr.weightIn,
          numberOfTags: entr.numberOfTags,
          beneficiary: entr.beneficiary,
          email: entr.email,
          supplierId: entr.supplierId,
          mineralgrade: "",
          mineralprice: "",
          shipmentnumber: "",
          isSupplierBeneficiary: false,
        },
        lotDetails: entr.output,
        negociantTags: isNegotiantTags
          ? entr.negociantTags
          : state.negociantTags,
        mineTags: isMineTags ? entr.mineTags : state.mineTags,
        selectedSupplierName: entr.companyName,
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
          beneficiary: state.checked ? state.formval.beneficiary : state.beneficial,
          isSupplierBeneficiary: !state.checked,
        },
      };
    case "HANDLE_SUPPLIER_SELECT":
      const { chosenSupplier, supplier } = action.payload;
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
              beneficiary:chosenSupplier.companyRepresentative
            }
          : state.formval,

        selectedSupplierName: supplier ? supplier.companyName : "",
        beneficial: shouldUpdateState
          ? chosenSupplier.companyRepresentative
          : state.beneficial,
        checked: shouldUpdateState ? false : state.checked,
        dropdownOpen: false,
        searchText: "",
      };
    case "ADD_LOT":
      return {
        ...state,
        lotDetails: [...state.lotDetails, { lotNumber: "", weightOut: "" }],
      };
    case "REMOVE_LOT":
      return {
        ...state,
        lotDetails: state.lotDetails.filter((lot, i) => i !== action.payload),
      };
    case "HANDLE_LOT_ENTRY":
      const { index, name, value } = action.payload;
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

    case "ADD_NEGOTIANT_TAG_LOT":
      return {
        ...state,
        negociantTags: [
          ...state.negociantTags,
          { weight: null, tagNumber: "", sheetNumber: "", limit: "" },
        ],
      };
    case "REMOVE_NEGOTIANT_TAG_LOT":
      return {
        ...state,
        negociantTags: state.negociantTags.filter(
          (lot, i) => i !== action.payload
        ),
      };
    case "HANDLE_LOT_NEGOTIANT_TAG_ENTRY":
      const { nIndex, fieldName, nValue } = action.payload;

      return {
        ...state,
        negociantTags: state.negociantTags.map((lot, i) => {
          if (i === nIndex) {
            return {
              ...lot,
              [fieldName]: nValue,
            };
          }
          return lot;
        }),
      };
    case "HANDLE_INITIAL_MINE_TAGS_ENTRY":
      return {
        ...state,
        initialMineTags: {
          ...state.initialMineTags,
          [action.payload.name]: action.payload.value,
        },
      };
    case "GENERATE_MINE_TAGS":
      const { weight, sheetNumber, tagNumber, limit } = state.initialMineTags;
      
      const lastDigitsMatch = tagNumber.match(/\d+$/);
      const startingTagNumber = parseInt(lastDigitsMatch ? lastDigitsMatch[0] : 0, 10);
      
      const tags = Array.from({ length: parseInt(limit, 10) || 0 }, (_, index) => {
        const newTagNumber = startingTagNumber + index;
        const newTagNumberString = tagNumber.replace(/\d+$/, newTagNumber.toString().padStart(lastDigitsMatch[0].length, '0'));
        return {
          weight,
          tagNumber: newTagNumberString,
          sheetNumber,
        };
      });

      return {
        ...state,
        mineTags: [...tags, ...state.mineTags],
        initialMineTags: {
          weight: null,
          tagNumber: "",
          sheetNumber: "",
          limit: "",
        },
      };

    case "ADD_MINES_TAG_LOT":
      return {
        ...state,
        mineTags: [
          ...state.mineTags,
          { weight: null, tagNumber: "", sheetNumber: "", status: "" },
        ],
      };
    case "REMOVE_MINES_TAG_LOT":
      return {
        ...state,
        mineTags: state.mineTags.filter((lot, i) => i !== action.payload),
      };
    case "HANDLE_LOT_MINES_TAG_ENTRY":
      const { mIndex, mFieldName, mValue } = action.payload;

      return {
        ...state,
        mineTags: state.mineTags.map((lot, i) => {
          if (i === mIndex) {
            return {
              ...lot,
              [mFieldName]: mValue,
            };
          }
          return lot;
        }),
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
      throw new Error();
  }
};
