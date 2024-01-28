import React from "react";
import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../components/Actions components/AddComponent";
import { Divider } from "antd";



const ColtanEditRequestPage=()=>{

    return(
        <ActionsPagesContainer
        title={'Edit coltan Entry'}
                subTitle={'Edit the entry before 2 minutes'}
                actionsContainer={
                    <AddComponent component={
                        <div>

                        </div>
                    }/>
                }
        
        />
    )
};
 export default ColtanEditRequestPage;