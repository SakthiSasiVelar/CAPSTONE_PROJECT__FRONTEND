import React from 'react';
import { FaPlus } from 'react-icons/fa';
import './Filter.css'

const FilterCategory = ({ category, onToggle, children,visible }) => {
    return (
        <div>
            <hr className='filter-divider'/>
            <div className='filter-label-btn-container'>
                <div className='filter-title'>{category}</div>
                <FaPlus className='plus-btn' onClick={onToggle} />
            </div>
            {visible && children}
        </div>
    );
};

export default FilterCategory;
