import React, { useState } from 'react';

const CarDetails = ({ selectedCars }) => {
  const carDetails = {
    volvo: {
      name_of_sites: 'Volvo Site',
      code_of_sites: 'V001',
      // Add other relevant details
    },
    saab: {
      name_of_sites: 'Saab Site',
      code_of_sites: 'S002',
      // Add other relevant details
    },
    opel: {
      name_of_sites: 'Opel Site',
      code_of_sites: 'O003',
      // Add other relevant details
    },
    audi: {
      name_of_sites: 'Audi Site',
      code_of_sites: 'A004',
      // Add other relevant details
    },
  };

  return (
    <div>
      {selectedCars.map((car, index) => (
        <div key={index}>
          <h3>Details for {car}</h3>
          <p>Name of Site: {carDetails[car].name_of_sites}</p>
          <p>Code of Site: {carDetails[car].code_of_sites}</p>
          {/* Display other details */}
        </div>
      ))}
    </div>
  );
};

const DynamicForm = () => {
  const [selectedCars, setSelectedCars] = useState([]);
  const [minesiteInfo, setMinesiteInfo] = useState([]);

  const carDetails = {
    volvo: {
      name_of_sites: 'Volvo Site',
      code_of_sites: 'V001',
      // Add other relevant details
    },
    saab: {
      name_of_sites: 'Saab Site',
      code_of_sites: 'S002',
      // Add other relevant details
    },
    opel: {
      name_of_sites: 'Opel Site',
      code_of_sites: 'O003',
      // Add other relevant details
    },
    audi: {
      name_of_sites: 'Audi Site',
      code_of_sites: 'A004',
      // Add other relevant details
    },
  };

  const handleSelectChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedCars(selectedOptions);

    const updatedMinesiteInfo = selectedOptions.map((car) => ({
      name_of_sites: carDetails[car].name_of_sites,
      code_of_sites: carDetails[car].code_of_sites,
      // Add other details as needed
    }));

    setMinesiteInfo(updatedMinesiteInfo);
  };

  const handleInputChange = (index, event) => {
    const updatedInfo = [...minesiteInfo];
    updatedInfo[index] = {
      ...updatedInfo[index],
      [event.target.name]: event.target.value,
    };
    setMinesiteInfo(updatedInfo);
  };

  return (
    <div>
      <select name="cars" id="cars" multiple onChange={handleSelectChange}>
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="opel">Opel</option>
        <option value="audi">Audi</option>
      </select>

      {/* Render dynamic form based on minesiteInfo state */}
      <form>
        {minesiteInfo.map((site, index) => (
          <div key={index}>
            <input
              type="text"
              name="name_of_sites"
              value={site.name_of_sites}
              onChange={(e) => handleInputChange(index, e)}
            />
            <input
              type="text"
              name="code_of_sites"
              value={site.code_of_sites}
              onChange={(e) => handleInputChange(index, e)}
            />
            {/* Add other input fields for the additional site information */}
          </div>
        ))}
      </form>
    </div>
  );
};

export default DynamicForm;
