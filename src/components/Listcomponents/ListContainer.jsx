import React from "react";
import ListContainerHeader from "./ListContainerHeader";



const ListContainer = ({ title, subTitle, navLinktext, table, navtext,isAllowed }) => {

    return ( 
        <>
            <section className="">
                <ListContainerHeader title={title}
                    subTitle={subTitle}
                    navtext={navtext}
                    navLinktext={navLinktext}
                    isAlowed={isAllowed} />
                <div className="bg-white p-4 m-0 border rounded-lg h-fit">
                    {table}

                </div>
            </section>
        </>
    )

}
export default ListContainer;