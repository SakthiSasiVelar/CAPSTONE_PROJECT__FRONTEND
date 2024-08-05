import React from 'react'
import SidebarShimmer from './SideBarShimmer'
import ToyListShimmer from './ToyListShimmer'
import '../../Pages/Pages.css'

const CategoryShimmer = () => {
  return (
    <div className="display-filter-list-body-container">
            <SidebarShimmer />
            <ToyListShimmer />
        </div>
  )
}

export default CategoryShimmer