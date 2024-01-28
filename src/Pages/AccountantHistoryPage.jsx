import React from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";


const AccountantHistoryPage=()=>{

    return (
        <>
        <ActionsPagesContainer 
        title={'Financial Transactions'}
        subTitle={'Transactions History'}
        actionsContainer={
            <div className="flex flex-col gap-3 w-full">
                
            </div>
        }/>
        </>
    )

};

export default AccountantHistoryPage;
