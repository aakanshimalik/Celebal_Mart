import React from 'react';

import Hero from "../../assets/1000156086.png";

function HeroSection() {
  return (
    <div>
        <img src={Hero} alt="img" className='w-90% ' style={{ height: 'calc(100vh - 95px)'}} />
    </div>
  )
}

export default HeroSection;