import React, {useContext} from 'react';
import Layout from '../../components/layout/Layout';
import myContext from '../../context/data/myContext';
import HeroSection from '../../components/heroSection/HeroSection';
import Filter from '../../components/filter/Filter';
import TechCard from '../../components/productCard/TechCard';
import ProductCard from '../../components/productCard/ProductCard';
import Testimonial from '../../components/testimonial/Testimonial';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, deleteFromCart } from '../../redux/cartSlice';

function Home() {
  const dispatch = useDispatch();
  const cartItem = useSelector((state)=> state.cart);

  const addCart = () => {
    dispatch(addToCart("shirt"));
  }

  const deleteCart = () => {
    dispatch(addToCart("shirt"));
  }
  return (
    <Layout>
      <HeroSection/>
      <Filter/>
      <TechCard/>
      <ProductCard/>
      <Testimonial/>
    </Layout>
  )
}

export default Home;