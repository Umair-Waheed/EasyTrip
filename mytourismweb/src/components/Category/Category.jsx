import React,{useState} from 'react'
import "./Category.css"
import { assets } from "../../assets/assets";
import CategoryCircle from '../CategoryCircle/categoryCircle';
const Category = () => {

  const[category,setCategory]=useState("");

  const categoryHandler=(name)=>{
    // console.log(category);
    if(category == name ){
      setCategory(" ");
    }else{
    setCategory(name);
  }
  }

  return (
    <>
    <div className="categories-container">
        <CategoryCircle name={"Destination"} img={assets.destination}  onClick={categoryHandler}  category={category}/>
        <CategoryCircle name={"Hotel"} img={assets.hotel} onClick={categoryHandler}  category={category}/>
        <CategoryCircle name={"Transport"} img={assets.transport} onClick={categoryHandler}  category={category}/>
    </div>
    </>
  )
}

export default Category