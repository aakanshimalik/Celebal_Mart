import React, {useContext} from 'react';
import myContext from '../../../context/data/myContext';

function UpdateProduct() {
    const context = useContext(myContext);
        const {products,setProducts, updateProduct} = context;
    return (
        <div>
            <div className=' bg-gradient-to-br from-red-600 via-white to gray-100 flex justify-center items-center h-screen'
            >
                <div className=' bg-gray-900 px-10 py-10 rounded-xl '>
                    <div className="">
                        <h1 className='text-center text-white text-xl mb-4 font-bold'>Update Product</h1>
                    </div>

                    {/*  PRICE  */}
                    <div>
                        <input type="text"
                            value={products.price}
                            onChange={(e)=> setProducts({...products, price: e.target.value})}
                            name='price'
                            className=' bg-gray-50 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-black placeholder:text-black outline-none'
                            placeholder='Product price'
                        />
                    </div>

                    {/* IMAGE  */}
                    <div>
                        <input type="text"
                            value={products.imageUrl}
                            onChange={(e)=> setProducts({...products, imageUrl: e.target.value})}
                            name='imageurl'
                            className=' bg-gray-50 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-black placeholder:text-black outline-none'
                            placeholder='Product imageUrl'
                        />
                    </div>

                    {/* CATEGORY */}
                    <div>
                        <input type="text"
                            value={products.category}
                            onChange={(e)=> setProducts({...products, category: e.target.value})}
                            name='category'
                            className=' bg-gray-50 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-black placeholder:text-black outline-none'
                            placeholder='Product category'
                        />
                    </div>

                    {/*  DESCRIPTION */}
                    <div>
                       <textarea cols="30" rows="10" name='title'
                            value={products.description}
                            onChange={(e)=> setProducts({...products, description: e.target.value})}
                            className=' bg-gray-50 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-black placeholder:text-black outline-none'
                            placeholder='Product Description'>

                       </textarea>
                    </div>

                    {/*  UPDATE PRODUCT BUTTON  */}
                    <div className=' flex justify-center mb-3'>
                        <button
                            onClick={updateProduct}
                            className=' bg-red-600 w-full text-white font-bold  px-2 py-2 rounded-lg hover:bg-red-500'>
                            Update Product
                        </button>
                    </div>
                 
                </div>
            </div>
        </div>
    )
}

export default UpdateProduct;