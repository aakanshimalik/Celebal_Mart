import React from "react";
import { Link } from 'react-router-dom';

function Signup() {
   
    return (
        <div className=' flex justify-center items-center  h-screen w-full bg-cover bg-no-repeat '
        style={{backgroundImage: `url("https://png.pngtree.com/thumb_back/fh260/background/20220807/pngtree-background-of-indonesia-flag-red-and-white-independence-day-theme-image_1441502.jpg")`}}
        >
            <div className=' bg-red-700 px-10 py-50 rounded-xl '>
                <div className="">
                    <h1 className='text-center text-white text-xl mb-4 font-bold'>Signup</h1>
                </div>
                <div>
                    <input type="email"
                        name='email'
                        className=' bg-gray-100 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-red placeholder:text-red-700 outline-none '
                        placeholder='Email'
                       
                    />
                </div>
                <div>
                    <input
                        type="password"
                        className=' bg-gray-100 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-red-700 outline-none'
                        placeholder='Password'
                        autoComplete="off"
                    />
                </div>
                <div className=' flex justify-center mb-3'>
                    <button
                        className=' bg-yellow-500 w-full text-black font-bold  px-2 py-2 rounded-lg'>
                        Signup
                    </button>
                </div>
                <div>
                    <h2 className='text-white ml-12 mt-3'>Already have an account?  <Link className=' text-yellow-500 font-bold' to={'/signup'}>Login</Link></h2>
                </div>
            </div>
        </div>
    )
}

export default Signup;