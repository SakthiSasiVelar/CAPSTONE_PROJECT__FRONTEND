import React, { useState, useCallback } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';
import './Search.css';
import { API_BASE_URL } from '../../utils/config';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
   const [resultsVisible, setResultsVisible] = useState(false);
   const navigate = useNavigate();

  const handleSearch = useCallback(
    debounce(async (value) => {
      if (value.trim() !== '') {
        try {
          const response = await fetch(`${API_BASE_URL}toy/search`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchTerm: value })
          });

           const result = await response.json();
          if (result.status === 'success') {
            const results = result.data;
            setSearchResults(results);
            setNoResults(results.length === 0);
            setResultsVisible(results.length > 0 || noResults);
          } else {
            setSearchResults([]);
            setNoResults(true);
            setResultsVisible(true);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
          setSearchResults([]);
          setNoResults(true);
          setResultsVisible(true);
        }
      } else {
        setSearchResults([]);
        setNoResults(false);
        setResultsVisible(false);
      }
    }, 300),
    [] 
  );

   const handleClick = (itemName, itemId) => {
    setResultsVisible(false); 
    navigate(`/${itemName}-${itemId}`);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    handleSearch(value);
  };

  return (
    <div className='search-container'>
      <Input
        placeholder="Search..."
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={handleChange}
        className="search-input"
      />
       {resultsVisible && (
        <>
          {searchResults.length > 0 ? (
            <div className="search-results">
              {searchResults.map((item) => (
                <div
                  key={item.toyId}
                  className="search-result-item"
                  onClick={() => handleClick(item.name, item.toyId)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          ) : noResults ? (
            <div className="search-no-results">
              No results found
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default SearchBox;
