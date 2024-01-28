import React from 'react';

const ChildFormComponent = ({ formData, onChange }) => {
  const handleChange = (e) => {
    onChange({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </label>
      <label>
        Age:
        <input type="text" name="age" value={formData.age} onChange={handleChange} />
      </label>
    </div>
  );
};

export default ChildFormComponent;
