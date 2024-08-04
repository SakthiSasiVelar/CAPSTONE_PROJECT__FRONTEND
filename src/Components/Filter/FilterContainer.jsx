import React, { useEffect, useState } from 'react';
import FilterCategory from './FilterCategory';
import FilterHeader from './FilterHeader';
import FilterValues from './FilterValues';
import'./Filter.css'
import { useDispatch } from 'react-redux';
import { setSelectedFilteredValues , clearFilterValues } from '../../Slices/filterSlice';
import {useLocation} from 'react-router-dom'

const FilterContainer = (props) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const categoryItems = props.categoryList;
    const brandItems = props.brandList;

    const [selectedFilterValues, setSelectedFilterValues] = useState({
        Category: (pathSnippets.length > 1 && pathSnippets[0] === 'category') ? pathSnippets[1] : null,
        Brand: (pathSnippets.length > 1 && pathSnippets[0]==='brand') ? pathSnippets[1] : null,
        Price: null,
        Age: null
    });
  

    const [filterValuesVisibility , setFilterValuesVisibility] = useState({
        Category: (pathSnippets.length == 1)? true: false,
        Brand: false,
        Price: false,
        Age: false
    })

    const filterValues = {};
    if(pathSnippets.length == 1 || pathSnippets[0] !== 'category'){
        filterValues.Category = categoryItems.map((category) =>category.categoryName)
        
    }
    if(pathSnippets.length == 1 || pathSnippets[0] !== 'brand'){
        filterValues.Brand = brandItems.map((brand)=>brand.brandName);
    }

    filterValues.Price = ['0-500' , '500-1000' , '1000-2000' , '2000-5000' ,'5000-100000'];
    filterValues.Age = ['0-18months','2-5years','5-7years','8-10years','10-12years','12-14years']

    useEffect(()=>{
        dispatch(setSelectedFilteredValues(selectedFilterValues))
    },[selectedFilterValues])

    const handleToggleVisibility = (category) => {
        setFilterValuesVisibility(prevFilterValuesVisibility => ({
            ...prevFilterValuesVisibility,
            [category]: !prevFilterValuesVisibility[category]
        }));
    };

    const handleCheckboxChange = (category, value) => {
        setSelectedFilterValues(prevSelectedFilterValues => {
            const newSelection = prevSelectedFilterValues[category] === value ? null : value;
            return{
                ...prevSelectedFilterValues,
                [category]: newSelection
            };
            
        });
       
    };

     const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!initialized && pathSnippets.length === 1) {
            handleClear();
            setInitialized(true);
        }
    }, [pathSnippets, initialized]);

    const handleClear = () =>{
        setFilterValuesVisibility(
            {
                Category: false,
                Brand: false,
                Price: false,
                Age: false,
            }
        )
        setSelectedFilterValues({
            Category: (pathSnippets.length > 1 && pathSnippets[0] === 'category') ? pathSnippets[1] : null,
            Brand: (pathSnippets.length > 1 && pathSnippets[0]==='brand') ? pathSnippets[1] : null,
            Price: null,
            Age: null
        })
        dispatch(clearFilterValues());
    }

    return (
        <div className='filter-container'>
            <FilterHeader 
             onClear = {handleClear}
            />
            {Object.keys(filterValues).map(category => (
                <FilterCategory
                    key={category}
                    category={category}
                    visible={filterValuesVisibility[category]}
                    onToggle={() => handleToggleVisibility(category)}
                >
                    <FilterValues
                        values={filterValues[category]}
                        selected={selectedFilterValues[category]}
                        onCheckboxChange={(value) => handleCheckboxChange(category, value)}    
                    />
                </FilterCategory>
            ))}
        </div>
    );
};

export default FilterContainer;
