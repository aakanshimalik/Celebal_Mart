import def from "ajv/dist/vocabularies/discriminator";
import React from "react";

function Privacy(){
    return (
        <div className=" min-h-screen bg-gradient-to-r from-red-500 cia-white to-white p-7">
            <h1 className="flex flex-row justify-center text-3xl font-bold mb-16 ">Privacy Policy</h1>
            <div className="border h-auto w-auto p-10 border-gray-500">
                <p className="ml-24 mr-24">This is a sample privacy for Celebal-Mart.
                <span>
                    At Celebal-Mart, a project by <b>Aakanshi Malik(React JS Intern , CSI'25)</b>, we value your privacy and are committed to protecting your personal information. We collect basic user details such as name, email, address, and order history to process transactions, improve our services, and send receipts or updates via email using secure third-party tools like Firebase and EmailJS. Your data is never sold or misused, and all interactions follow standard privacy and security practices. By using our platform, you agree to this policy. For any concerns, contact me at <a href="https://mail.google.com" className="hover:text-blue">aakanshimalik54@gmail.com</a>
                </span>
            </p>
            </div>
           
        </div>
    )
}
export default Privacy;