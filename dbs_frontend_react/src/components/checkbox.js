/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';

function Checkbox({ label = "Default Checkbox", onChangeParent, row }) {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
      const checkedStatus = event.target.checked;
      console.log("checkbox checked to", checkedStatus)
      console.log(row)
      setIsChecked(checkedStatus);
      onChangeParent(checkedStatus, row); 
    
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