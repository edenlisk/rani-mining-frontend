import React, { useState } from "react";

const YourFormComponent = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: {
            city: "",
            province: "",
        },
        mineSites: [
            {
                coordinates: {
                    longitude: "",
                    latitude: "",
                },
                name: "",
                code: "",
            },
        ],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1];
            setFormData((prevFormData) => ({
                ...prevFormData,
                address: {
                    ...prevFormData.address,
                    [addressField]: value,
                },
            }));
        } else if (name.startsWith("mineSites")) {
            const [fieldName, index, key] = name.split(".")[3];
            setFormData((prevFormData) => {
                const updatedMineSites = prevFormData.mineSites.map((site, i) => {
                    if (i === Number(index)) {
                        return {
                            ...site,
                            [key]: value,
                        };
                    }
                    return site;
                });
                return {
                    ...prevFormData,
                    mineSites: updatedMineSites,
                };
            });
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit} className=" block space-y-2">
            {/* Your form inputs */}
            <input
                className=" p-2 border"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
            />
            {/* ... Other form inputs ... */}
            {/* Address fields */}
            <input
                className=" p-2 border"
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
            />
            <input
                className=" p-2 border"
                type="text"
                name="address.province"
                value={formData.address.province}
                onChange={handleChange}
                placeholder="Province"
            />
            {/* ... Other address fields ... */}
            {/* MineSites fields */}
            <div className="block space-y-2">
                {formData.mineSites.map((site, index) => (
                    <div key={index} className=" block space-y-2">
                        <input
                            className=" p-2"
                            type="text"
                            name={`mineSites.${index}.name`}
                            value={site.name}
                            onChange={handleChange}
                            placeholder="Mine Site Name"
                        />
                        <input
                            className=" p-2"
                            type="text"
                            name={`mineSites.${index}.code`}
                            value={site.code}
                            onChange={handleChange}
                            placeholder="Mine Site Code"
                        />
                        <input
                            className=" p-2"
                            type="text"
                            name={`mineSites.${index}.coordinates.longitude`}
                            value={site.coordinates.longitude}
                            onChange={handleChange}
                            placeholder="Longitude"
                        />
                        <input
                            className=" p-2"
                            type="text"
                            name={`mineSites.${index}.coordinates.latitude`}
                            value={site.coordinates.latitude}
                            onChange={handleChange}
                            placeholder="Latitude"
                        />
                    </div>
                ))}
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default YourFormComponent;





