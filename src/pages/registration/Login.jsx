import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import myContext from '../../context/data/myContext';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../firebase/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Loader from '../../components/loader/Loader';
import { sendPasswordResetEmail } from "firebase/auth";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const navigate = useNavigate();

    // login
    const login = async () => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            toast.success('Login Successfull', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            localStorage.setItem('user', JSON.stringify(result));
            navigate('/');
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error('Login Failed', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setLoading(loading);
        }
    }
 
    //  Password recovery
    const handlePasswordRecovery = async (email) => {
        if (!email) {
            toast.warn("Please enter your email first");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to send reset email");
        }
    };

    return (
        <div className='bg-gradient-to-br from-red-600 via-white to gray-100 flex justify-center items-center  h-screen w-full bg-cover bg-no-repeat '
        >
            {loading && <Loader />}
            <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
                <div className="">
                    <h1 className='text-center text-white text-xl mb-4 font-bold'>Login</h1>
                </div>

                {/* input email */}
                <div>
                    <input type="email"
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className=' bg-gray-100 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-red placeholder:text-red-700 outline-none '
                        placeholder='Email'

                    />
                </div>

                {/* input password */}
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className=' bg-gray-100 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-black placeholder:text-red-700 outline-none'
                        placeholder='Password'
                        autoComplete="off"
                    />
                </div>

                {/* password recovery via firebase/auth  */}
                <div className="text-right mb-3">
                    <button
                        onClick={() => handlePasswordRecovery(email)}
                        className="text-sm text-red-400 hover:underline"
                    >
                        Forgot Password?
                    </button>
                </div>

                {/* login button */}
                <div className=' flex justify-center mb-3'>
                    <button
                        className=' bg-red-600 w-full text-white font-bold  px-2 py-2 rounded-lg hover:bg-red-500'
                        onClick={login}
                    >
                        Login
                    </button>
                </div>

                {/*  Signup route connected  */}
                <div className="flex justify-center">
                    <h2 className='text-white mt-3 text-center'>Don't have an account? <Link className=' text-red-500 font-bold' to={'/signup'}>Signup</Link></h2>
                </div>
            </div>
        </div>
    )
}

export default Login;