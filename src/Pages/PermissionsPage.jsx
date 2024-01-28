import React from "react";
import { useSelector } from "react-redux";

const PermissionsPage = () => {

    const existingPermissions = useSelector(state => {
    });

    if (existingPermissions) {
    }



    return (
        <div>
            <p>ASSIGN PERMISSIONS</p>
        </div>
    )
}

export default PermissionsPage;