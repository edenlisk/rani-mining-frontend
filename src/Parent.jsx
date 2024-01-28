import React from "react";

const Parent = ({ children }) => {
    return (
        <div className="content -translate-x-0 pt-20 px-2 h-full md:px-5 pb-4">
            {children}
        </div>
    )
}
export default Parent;