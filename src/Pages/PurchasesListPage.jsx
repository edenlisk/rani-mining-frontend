import React from "react";
import PurchasesListContainer from "../components/Listcomponents/PurchasesListContainer";

const PurchasesListPage=()=>{
return(
    <>
    <PurchasesListContainer title={'Purchase list'}
    subTitle={'Manage your purchases'}
    navLinktext={'add/purchase'}
    navtext={'add new purchase'}
    table={''}/>
    </>
)
}
export default PurchasesListPage;