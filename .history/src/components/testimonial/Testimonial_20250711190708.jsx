import React, { useContext } from 'react'
import myContext from '../../context/data/myContext';

import testimonial1 from '../../assets/Testimonial1.jpeg';
import Aakanshi from '../../assets/Aakanshi.jpg';
import testimonial2 from '../../assets/Testimonial2.jpeg';


function Testimonial() {
    const context = useContext(myContext)
    const { mode } = context
    return (
        <div>
            <section className="text-gray-600 body-font mb-10">
                <div className="container px-5 py-10 mx-auto">
                    <h1 className=' text-center text-3xl font-bold text-black' style={{color: mode === 'dark' ? 'white' : ''}}>Testimonial</h1>
                    <h2 className=' text-center text-2xl font-semibold mb-10' style={{color: mode === 'dark' ? 'white' : ''}}>What our <span className=' text-red-500'>employees</span> are saying</h2>
                    <div className="flex flex-wrap -m-4">
                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4">
                            <div className="h-full text-center">
                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src={testimonial1} />
                                <p style={{color: mode === 'dark' ? 'white' : ''}} className="leading-relaxed">It’s always inspiring to see interns take initiative and bring their ideas to life. Aakanshi’s work on Celebal Mart—a simulated e-commerce platform—reflects creativity, attention to detail, and a strong grasp of frontend technologies. Projects like these are a great way for interns to explore real-world problem solving in a tech-driven environment like ours.</p>
                                <span className="inline-block h-1 w-10 rounded bg-red-500 mt-6 mb-4" />
                                <h2 style={{color: mode === 'dark' ? '#ff4162' : ''}} className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Prerna Kamat</h2>
                                <p style={{color: mode === 'dark' ? 'white' : ''}} className="text-gray-500">Human Resource</p>
                            </div>
                        </div>
                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4">
                            <div className="h-full text-center">
                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src={Aakanshi} />
                                <p  style={{color: mode === 'dark' ? 'white' : ''}}className="leading-relaxed">
                                    As part of my internship, I created Celebal Mart, an e-commerce website built using React. The project allowed me to apply what I’ve learned in a practical setting—from building dynamic UI components to integrating product and cart logic. I’m thankful to Celebal Technologies for fostering a learning environment where interns are encouraged to innovate and challenge themselves.
                                </p>
                                <span className="inline-block h-1 w-10 rounded bg-red-500 mt-6 mb-4" />
                                <h2 style={{color: mode === 'dark' ? '#ff4162' : ''}} className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Aakanshi Malik</h2>
                                <p style={{color: mode === 'dark' ? 'white' : ''}} className="text-gray-500">React Js Intern(CSI'2025)</p>
                            </div>
                        </div>
                        <div className="lg:w-1/3 lg:mb-0 p-4">
                            <div className="h-full text-center">
                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src={testimonial2} />
                                <p style={{color: mode === 'dark' ? 'white' : ''}} className="leading-relaxed">We strongly encourage our interns to take on independent projects that demonstrate their technical abilities and creativity. Celebal Mart is a great example of this spirit—combining UI/UX design, React development, and e-commerce logic into a functional and well-structured assignment. We’re proud of Aakanshi’s initiative and growth during her time with us.</p>
                                <span className="inline-block h-1 w-10 rounded bg-pink-500 mt-6 mb-4" />
                                <h2 style={{color: mode === 'dark' ? '#ff4162' : ''}} className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Priyanshi Jain</h2>
                                <p  style={{color: mode === 'dark' ? 'white' : ''}}className="text-gray-500"> Marketing & HR Executive</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Testimonial