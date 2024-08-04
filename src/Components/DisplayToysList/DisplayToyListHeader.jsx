import './DisplayToysList.css'
import { useLocation } from 'react-router-dom'

const DisplayToysListHeader = () => {


    const getLastValueInUrl = () =>{
        const location = useLocation();
        const pathSnippets = location.pathname.split('/').filter(i => i);
        const lastValue = pathSnippets[pathSnippets.length - 1];
        return lastValue;
     }
    const lastValueInUrl = getLastValueInUrl();

     function capitalizeFirstLetter(string) {
    if (!string) return string; 
    return string.charAt(0).toUpperCase() + string.slice(1);
}


    return (
        <div>
            <div className='display-toys-list-title'>{capitalizeFirstLetter(lastValueInUrl)}</div>
        </div>
    )
}

export default DisplayToysListHeader;