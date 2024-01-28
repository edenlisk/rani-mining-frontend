// ParentComponent.js
import React, { useState } from 'react';
import ChildFormComponent from './ChildComponentTest'
const ParentComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
  });

  const handleFormChange = (newFormData) => {
    setFormData(newFormData);
  };

  const handleFormSubmit = () => {
    console.log('Form data received in parent component:', formData);
    // Add your logic for submitting the form data
  };

  return (
    <div>
      <h1>Parent Component</h1>
      <ChildFormComponent formData={formData} onChange={handleFormChange} />
      <button onClick={handleFormSubmit}>Submit home</button>
    </div>
  );
};

export default ParentComponent;
