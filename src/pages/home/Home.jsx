import React from 'react';
import Layout from '../../components/layout/Layout';
import HeroSection from '../../components/heroSection/HeroSection';
import Filter from '../../components/filter/Filter';
import TechCard from '../../components/productCard/TechCard';
import ProductCard from '../../components/productCard/ProductCard';
import Testimonial from '../../components/testimonial/Testimonial';
import { useDispatch, useSelector } from 'react-redux';

function Home() {
  const cartItem = useSelector((state)=> state.cart);

  console.log(cartItem);

  return (
    <Layout>
      <HeroSection/>
      <Filter/>
      <ProductCard/>
      <TechCard/>
      <Testimonial/>
    </Layout>
  )
}

export default Home;