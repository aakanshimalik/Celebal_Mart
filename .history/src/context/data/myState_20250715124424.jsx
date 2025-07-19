import React, { useEffect, useState } from 'react'
import MyContext from './myContext';
import { addDoc, collection, Timestamp, onSnapshot, orderBy, query } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { fireDB } from '../../firebase/FirebaseConfig';

function MyState(props) {
    const [mode, setMode] = useState('light');

    const toggleMode = () => {
        if(mode === 'light'){
            setMode('dark');
            document.body.style.backgroundColor = "rgb(17, 24, 39)"
        }
        else {
            setMode('light');
            document.body.style.backgroundColor = "white"
        }
    }

    const [loading, setLoading] = useState(false);

    const [products, setproducts] = useState({
      title: null,
      price: null,
      imageUrl: null,
      category: null,
      description: null,
      time: Timestamp.now(),
      date: new Date().toLocaleString(
        "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
      )
    });

    const addProduct = async () => {
      if(products.title == null || products.price == null || products.imageUrl == null || products.category == null || products.description == null ){
        return toast.error("All fields are required")
      }

      setLoading(true);

      try{
         const productRef = collection(fireDB, 'products');

         await addDoc(productRef, products);
         toast.success("Added product successfully");
         setLoading(false);

      }
      catch(error){
        console.log(error);
        setLoading(false);
      }
    }


    const [product, setProduct] = useState([]);

  // ****** get product
  const getProductData = async () => {

    setLoading(true);

    try {
      const q = query(
        collection(fireDB, "products"),
        orderBy("time"),
        // limit(5)
      );

      const data = onSnapshot(q, (QuerySnapshot) => {
        let productsArray = [];
        QuerySnapshot.forEach((doc) => {
          productsArray.push({ ...doc.data(), id: doc.id });
        });
        setProduct(productsArray)
        setLoading(false);
      });

      return () => data;
    } 
    
    catch (error) {
      console.log(error)
      setLoading(false);
    }
  }

  useEffect(() => {
    getProductData();
  }, []);

    
  return (
    <MyContext.Provider value={{mode, toggleMode, loading, setLoading , products, setProduct, addProduct, product}}>
       {props.children}
    </MyContext.Provider>
  )
}

export default MyState;