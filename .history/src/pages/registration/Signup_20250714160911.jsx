import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import myContext from '../../context/data/myContext';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, fireDB } from '../../firebase/FirebaseConfig';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import Loader from '../../components/loader/Loader';

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const signup = async () => {
        if (name === "" || email === "" || password === "") {
            return toast.error("All fields are required")
        }
        try {
            const users = await createUserWithEmailAndPassword(auth, email, password);

            console.log(users);

            // const user = {
            //     name: name,
            //     uid: users.user.uid,
            //     email: users.user.email,
            //     time : Timestamp.now()
            // }
            // const userRef = collection(fireDB, "users")
            // await addDoc(userRef, user);
            // toast.success("Signup Succesfully")
            // setName("");
            // setEmail("");
            // setPassword("");
            // setLoading(false)
            
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    
   
    return (
        <div className='bg-gradient-to-br from-red-600 via-white to gray-100 flex justify-center items-center  h-screen w-full bg-cover bg-no-repeat '
        
        >
            <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
                <div className="">
                    <h1 className='text-center text-white text-xl mb-4 font-bold'>Signup</h1>
                </div>
                <div>
                    <input type="text"
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                        name='name'
                        className=' bg-gray-100 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-red placeholder:text-red-700 outline-none '
                        placeholder='Full Name'
                       
                    />
                </div>
                <div>
                    <input type="email"
                    value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        name='email'
                        className=' bg-gray-100 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-red placeholder:text-red-700 outline-none '
                        placeholder='Email'
                       
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className=' bg-gray-100 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-red-700 outline-none'
                        placeholder='Password'
                        autoComplete="off"
                    />
                </div>
                <div className=' flex justify-center mb-3'>
                    <button
                        onClick={signup}
                        className=' bg-red-600 w-full text-white font-bold  px-2 py-2 rounded-lg hover:bg-red-400'>
                        Signup
                    </button>
                </div>
                <div>
                    <h2 className='text-white ml-12 mt-3'>Already have an account?  <Link className=' text-red-500 font-bold' to={'/signup'}>Login</Link></h2>
                </div>
            </div>
        </div>
    )
}

export default Signup;