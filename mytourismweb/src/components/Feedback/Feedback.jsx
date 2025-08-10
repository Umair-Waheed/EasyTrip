import React,{ useRef } from 'react'
import "./Feedback.css"
import Review from '../../components/Review/Review'
import { assets } from '../../assets/assets';
const Feedback = () => {
  const feedbackContainerRef = useRef(null);

  const scrollLeft = () => {
    if (feedbackContainerRef.current) {
      feedbackContainerRef.current.scrollBy({
        left: -feedbackContainerRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (feedbackContainerRef.current) {
      feedbackContainerRef.current.scrollBy({
        left: feedbackContainerRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };
  return (
    <div className='Feedback text-white'>
        <h1>Traveler Testimonials</h1>

        <div className="arrow-buttons">
        <button onClick={scrollLeft}><img src={assets.left_arrow} alt="" /></button>
        <button onClick={scrollRight}><img src={assets.right_arrow} alt="" /></button>
      </div>

        <div className="Feedback-container" ref={feedbackContainerRef}>
            <div className='person-feedback'><Review/></div>
            <div className='person-feedback'><Review/></div>
            <div className='person-feedback'><Review/></div>
           
        </div>
      
      
    </div>
  )
}

export default Feedback 