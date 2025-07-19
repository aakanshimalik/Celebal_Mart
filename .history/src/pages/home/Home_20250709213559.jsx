import React, {useContext} from 'react';
import Layout from '../../components/layout/Layout';
import myContext from '../../context/data/myContext';
import HeroSection from '../../components/heroSection/HeroSection';
import Filter from '../../components/filter/Filter';
import ProductCard from '../../components/productCard/ProductCard';

function Home() {
  return (
    <Layout>
      <HeroSection/>
      <Filter/>
    </Layout>
  )
}

export default Home;