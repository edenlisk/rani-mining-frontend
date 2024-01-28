import React from "react";
import ListContainerHeader from "./ListContainerHeader";



const UsersListContainer = ({ title, subTitle, navLinktext, table, navtext }) => {

    return (
        <>
            <section className="">
                <ListContainerHeader title={title}
                    subTitle={subTitle}
                    navtext={navtext}
                    navLinktext={navLinktext} />
                <div className="bg-white p-4 m-0 border rounded-lg h-fit">
                    {table}

                </div>
            </section>
        </>
    )

}
export default UsersListContainer;