/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';

function Checkbox({ label = "Default Checkbox", onChange, row }) {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
      const checkedStatus = event.target.checked;
      setIsChecked(checkedStatus);
      if (onChange) {
        onChange(checkedStatus, row); 
      }
    };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        
      </label>
      <p>{isChecked ? 'Checked' : 'Unchecked'}</p>
    </div>
  );
}

export default Checkbox;