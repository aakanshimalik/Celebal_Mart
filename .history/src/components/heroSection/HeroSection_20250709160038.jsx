import React from 'react';

import Hero from "../../assets/Hero.png";

function HeroSection() {
  return (
    <div>
        <img src={Hero} alt="img" className='cover' />
    </div>
  )
}

export default HeroSection;