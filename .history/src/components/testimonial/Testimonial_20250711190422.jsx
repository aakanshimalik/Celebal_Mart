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
                                <p style={{color: mode === 'dark' ? 'white' : ''}} className="leading-relaxed">At Celebal Technologies, we don’t just recruit talent—we nurture it. Watching interns and young professionals grow into capable, confident contributors is one of the most rewarding parts of my role. The company fosters a culture where innovation, learning, and collaboration thrive. Every new team member adds a spark to our dynamic work environment, and I’m proud to help shape their journey.</p>
                                <span className="inline-block h-1 w-10 rounded bg-red-500 mt-6 mb-4" />
                                <h2 style={{color: mode === 'dark' ? '#ff4162' : ''}} className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Prerna Kamat</h2>
                                <p style={{color: mode === 'dark' ? 'white' : ''}} className="text-gray-500">Human Resource</p>
                            </div>
                        </div>
                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4">
                            <div className="h-full text-center">
                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src={Aakanshi} />
                                <p  style={{color: mode === 'dark' ? 'white' : ''}}className="leading-relaxed">
                                    Interning a Celebal Mart(e-commerce website for Celebal) was a turning point in my learning journey. I got the chance to build responsive and user-friendly components using React, while being mentored by a skilled and welcoming team. From code reviews to project discussions, every moment was a chance to learn something new. I truly felt like my work mattered.
                                </p>
                                <span className="inline-block h-1 w-10 rounded bg-red-500 mt-6 mb-4" />
                                <h2 style={{color: mode === 'dark' ? '#ff4162' : ''}} className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Aakanshi Malik</h2>
                                <p style={{color: mode === 'dark' ? 'white' : ''}} className="text-gray-500">React Js Intern(CSI'2025)</p>
                            </div>
                        </div>
                        <div className="lg:w-1/3 lg:mb-0 p-4">
                            <div className="h-full text-center">
                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src={testimonial2} />
                                <p style={{color: mode === 'dark' ? 'white' : ''}} className="leading-relaxed">Celebal creates a vibrant space where freshers and interns can gain hands-on experience while working on meaningful projects. From the HR perspective, it's fulfilling to see candidates grow into confident professionals within just a few months. The mentorship, tools, and team culture at Celebal Mart are what make it truly stand out.</p>
                                <span className="inline-block h-1 w-10 rounded bg-pink-500 mt-6 mb-4" />
                                <h2 style={{color: mode === 'dark' ? '#ff4162' : ''}} className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">React Js</h2>
                                <p  style={{color: mode === 'dark' ? 'white' : ''}}className="text-gray-500">CTO</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Testimonial