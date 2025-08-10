import React, { useState } from 'react';
import "./Searchbar.css";
import { assets } from '../../assets/assets';

const Searchbar = ({ setSearchText }) => {
  const [inputValue, setInputValue] = useState('');
  const [searchBy, setSearchBy] = useState('name'); // name or location

  const changeHandler = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    setSearchText({ value: inputValue, type: searchBy });
  };

  return (
    <div className='search'>
    <div className="searchbar flex flex-wrap justify-center w-[100%]  gap-2">
        <div className="searchbar-text">
          <input
            type="text"
            name='search'
            placeholder={`Search by ${searchBy}`}
            value={inputValue}
            onChange={changeHandler}
          />
        </div>

        <select
          className='search-type-container '
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="location">Location</option>
        </select>

        <button className='searchbar-btn' onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default Searchbar;
