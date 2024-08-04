import React from 'react';
import './Filter.css'

const FilterValues = ({ values, selected, onCheckboxChange }) => {
    return (
        <div className='filter-values-container'>
            {values.map((value, index) => (
                <div key={index} className='filter-value-label-checkbox-container'>
                    <input
                        type="checkbox"
                        className='filter-checkbox'
                        checked={selected === value}
                        onChange={() => onCheckboxChange(value)}
                    />
                    <div>{value}</div>
                </div>
            ))}
        </div>
    );
};

export default FilterValues;
