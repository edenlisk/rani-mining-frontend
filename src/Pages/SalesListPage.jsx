import React from "react";
import SalesListContainer from "../components/Listcomponents/ListContainer";

const SalesListPage=()=>{
    return(
        <>
        <SalesListContainer title={'Sales list'}
        subTitle={'Manage your sales'}
        navLinktext={'add/sale'}
        navtext={'Add sales'}
        table={''}/>
        </>
    )
}
export default SalesListPage;