import './Filter.css'

const FilterHeader = ({onClear})=>{
    return(
        <div className='filter-header'>
            <div className='filter-title'>Filter Toys</div>
            <div className='clear-filter-btn' onClick={onClear}>Clear all</div>              
        </div>
    )
}

export default FilterHeader;