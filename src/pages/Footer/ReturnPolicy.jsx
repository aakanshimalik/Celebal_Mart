import def from "ajv/dist/vocabularies/discriminator";
import React from "react";

function ReturnPolicy(){
    return (
        <div className=" min-h-screen bg-gradient-to-r from-red-500 cia-white to-white p-7">
            <h1 className="flex flex-row justify-center text-3xl font-bold mb-16 ">Return Policy</h1>
            <div className="border h-auto w-auto p-10 border-gray-500">
                <p className="ml-24 mr-24">This is a sample privacy for Celebal-Mart.
                <span>
                    At Celebal-Mart, customer satisfaction is our priority. If you are not completely satisfied with your purchase, you may request a return within 7 days of delivery, provided the item is unused, in its original packaging, and accompanied by a valid receipt. We do not accept returns for digital products or items marked as non-returnable. Once the return is approved, a replacement or refund will be processed within 5–7 business days. For any return-related queries, please reach out to returns@celebaltech.com
                </span>
            </p>
            </div>
           
        </div>
    )
}
export default ReturnPolicy;