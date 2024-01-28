import React from "react";

const DetailsPageContainer = ({title,subTitle,actionsContainer}) => {
    return (
        <>
            <section className="space-y-3">
                <span>
            <h4 className=" text-[18px] font-bold pl-1">{title}</h4>
            <h6 className="text-[14px] pl-1 ">{subTitle}</h6>
                </span>
                <div className="bg-white p-4 m-0 border rounded-lg h-fit">
                {actionsContainer}
                </div>
            </section>
        </>
    )
}
export default DetailsPageContainer;