import React from 'react';

import Hero from "../../assets/1000156086.png";

function HeroSection() {
  return (
    <div>
        <img src={Hero} alt="img" className='w-full min-h-[80vh] ' />
    </div>
  )
}

export default HeroSection;