import React, { useState, useEffect } from 'react';
import { useGetOneEditRequestQuery } from '../states/apislice';


const EditRequestForm = () => {
  const [formData, setFormData] = useState({});
  const [editRequest, setEditRequest] = useState({});
  const requestId="6541e446983dc8332984b7b3"; 
  const {data,isLoading,isSuccess,isError,error}= useGetOneEditRequestQuery({requestId});
  useEffect(() => {
    if (isSuccess) {
      const { data: dt } = data;
      setEditRequest(dt);
    }
  }, [isSuccess]);
  
  // Further down in the component...
  
  if (!editRequest || !editRequest.editableFields) {
    return <div>Loading...</div>;
  }
  

  const { editableFields } = editRequest;


  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here, for example, you might want to send the edited data back to the server.
  };

  useEffect(() => {
    // Set initial form data based on editable fields
    const initialData = {};
    editableFields.forEach(field => {
      initialData[field.fieldname] = field.initialValue;
    });
    setFormData(initialData);
  }, [editableFields]);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Request for {editRequest.model}</h2>
      {editableFields.map(field => (
        <div key={field._id}>
          <label htmlFor={field.fieldname}>{field.fieldname}</label>
          {Array.isArray(field.initialValue) ? (
            // If the field is an array (like 'Mine Tags'), render a select or multi-select input
            <select
              multiple
              id={field.fieldname}
              name={field.fieldname}
              value={formData[field.fieldname]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field.fieldname]: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
            >
              {/* Options for multi-select */}
              {/* You might populate this dynamically */}
            </select>
          ) : (
            // For other fields, render a regular input
            <input
              type="text"
              id={field.fieldname}
              name={field.fieldname}
              value={formData[field.fieldname]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field.fieldname]: e.target.value,
                })
              }
            />
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>

  );
};

export default EditRequestForm;
