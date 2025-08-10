import React, { useState } from 'react'
import "./CategoryCircle.css"
const CategoryCircle = ({img,name,onClick,category}) => {
    
    const clickHandler = () => {
        onClick(name);
      };

  return (
    <div  className='cat-circle-container'>
        <div  className={ `cat-circle-data ${category === name ? "selected " : " "} `}
        onClick={clickHandler}>
            <div className='cat-circle'>
                <img src={img} alt={name} />
            </div>
        </div>
        <p>{name}</p>
    </div>
  )
}

export default CategoryCircle
