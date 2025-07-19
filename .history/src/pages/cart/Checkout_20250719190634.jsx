import React, { useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
import jsPDF from 'jspdf';
import logo from '../../assets/logo.jpeg';
import { useNavigate } from 'react-router-dom';
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/modal/Modal';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/cartSlice';
import emailjs from 'emailjs-com';

function Checkout() {
    const { mode } = useContext(myContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cartItems = useSelector((state) => state.cart);
    const [totalAmount, setTotalAmount] = useState(0);
    const shipping = 100;
    const grandTotal = totalAmount + shipping;

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState("");

    useEffect(() => {
        let temp = 0;
        cartItems.forEach((item) => (temp += parseInt(item.price)));
        setTotalAmount(temp);
    }, [cartItems]);


    useEffect(() => {
        if (cartItems.length === 0) {
            toast.info("Cart is empty after payment. Redirecting...");
            navigate('/');
        }
    }, []);

    
    // buy now
    const buyNow = async () => {
        // validation 
        if (name === "" || address == "" || pincode == "" || phoneNumber == "") {
            return toast.error("All fields are required", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
        }

        const addressInfo = {
            name,
            address,
            pincode,
            phoneNumber,
            date: new Date().toLocaleString(
                "en-US",
                {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }
            )
        }
        // console.log(addressInfo);


        //  ***********   PAYMENT INTERGRATION VIA RAZORPAY     ***************
        var options = {
            key: "rzp_test_1DP5mmOlF5G5ag",
            key_secret: "",
            amount: parseInt(grandTotal * 100),
            currency: "USD",
            order_receipt: 'order_rcptid_' + name,
            name: "Celebal-Mart",
            description: "for testing purpose",
            handler: function (response) {
                console.log(response);
                toast.success('Payment Successful');
                dispatch(clearCart());
                localStorage.removeItem('cart');

                const paymentId = response.razorpay_payment_id;

                // store ORDER in firebase 
                const orderInfo = {
                    cartItems,
                    addressInfo,
                    date: new Date().toLocaleString(
                        "en-US",
                        {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                        }
                    ),
                    email: JSON.parse(localStorage.getItem("user")).user.email,
                    userid: JSON.parse(localStorage.getItem("user")).user.uid,
                    paymentId
                }

                try {

                    const orderRef = collection(fireDB, 'order');
                    addDoc(orderRef, orderInfo);

                } catch (error) {
                    console.log(error);
                }

                setPaymentSuccess(true);
                setPaymentDetails({
                    paymentId,
                    addressInfo,
                    orderInfo,
                    cartItems,
                    totalAmount,
                    shipping,
                    grandTotal,
                    orderDate: orderInfo.date,
                    email: orderInfo.email,
                });
            },

            theme: {
                color: "#3399cc"
            }
        };

        var pay = new window.Razorpay(options);
        pay.open();
        console.log(pay);
    }



    //  ************   PDF generate via jsPDF **************
    const generatePDFReceipts = () => {
        if (!paymentDetails) return;

        const { paymentId, addressInfo, orderInfo, cartItems, totalAmount, shipping, grandTotal, orderDate, email } = paymentDetails;

        console.log('Generating PDF with paymentDetails:', paymentDetails);

        const date = orderInfo?.date || "N/A";  // safer fallback

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgWidth = 40;
        const imgHeight = 20;
        const paddingRight = 15;
        const paddingTop = 10;
        doc.addImage(logo, 'JPEG', pageWidth - imgWidth - paddingRight, paddingTop, imgWidth, imgHeight);
        doc.setFontSize(18);
        doc.text("Celebal-Mart - Payment Receipt", 20, 20);

        doc.setFontSize(12);
        doc.text(`Payment ID: ${paymentId}`, 20, 35);
        doc.text(`Customer Name: ${addressInfo.name}`, 20, 45);
        doc.text(`Address: ${addressInfo.address}`, 20, 55);
        doc.text(`Pincode: ${addressInfo.pincode}`, 20, 65);
        doc.text(`Phone: ${addressInfo.phoneNumber}`, 20, 75);
        doc.text(`Date: ${orderDate}`, 20, 85);
        doc.text(`Email: ${email}`, 20, 95);

        doc.text("Purchased Items:", 20, 110);
        let y = 120;

        cartItems.forEach((item, index) => {
            doc.text(`${index + 1}. ${item.title} - $${item.price}`, 25, y);
            y += 10;
        });

        doc.text(`Subtotal: $${totalAmount}`, 20, y + 10);
        doc.text(`Shipping: $${shipping}`, 20, y + 20);
        doc.setFont("helvetica", "bold");
        doc.text(`Grand Total: $${grandTotal}`, 20, y + 35);

        doc.save(`CelebalMart_Receipt_${paymentId}.pdf`);

        return doc.output('blob');

    }

    useEffect(() => {
        if (paymentDetails) {
            sendEmailWithPDF();
        }
    }, [paymentDetails]);


    //  CREATE TEXT RECEIPT FOR SENDING IN EMAIL VIA EMAILJS
    const createTextReceipt = () => {
        return `
            Celebal-Mart Payment Receipt

            Customer: ${paymentDetails.addressInfo.name}
            Email: ${paymentDetails.email}
            Payment ID: ${paymentDetails.paymentId}
            Order Date: ${paymentDetails.orderDate}

            Items:
                ${paymentDetails.cartItems.map((item, i) => `${i + 1}. ${item.title} - $${item.price}`).join("\n")}
                Subtotal: $${paymentDetails.totalAmount}
                Shipping: $${paymentDetails.shipping}
                Total: $${paymentDetails.grandTotal}
        `;
    };

    //  Sending receipt to registered email via Emailjs
    const sendEmailWithPDF = async () => {
        const textReceipt = createTextReceipt();

        // template of email
        const templateParams = {
            to_email: paymentDetails.email,
            subject: "Your Celebal-Mart Receipt",
            message: textReceipt,
        };

        emailjs.send(
            'service_oto8pcs',
            'template_1tqqra7',
            templateParams,
            '-EHsXdNkEnADENJ8W'
        )
            .then((res) => {
                console.log('Email sent:', res.status);
                toast.success('Receipt sent to email successfully!');
            })
            .catch((err) => {
                console.error('Email error:', err);
                toast.error('Failed to send receipt to email.');
            });
    };


    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-10 px-4 text-gray-800" style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '' }}>

                <div className="mb-6 w-full max-w-sm mx-auto p-6 rounded-xl shadow-md bg-white dark:bg-gray-800">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2">Order Summary</h2>
                    
                    {/* Payment Amount details  */}
                    <div className="flex justify-between text-gray-600 dark:text-gray-300 mb-2">
                        <span>Subtotal</span>
                        <span>${totalAmount}</span>
                    </div>

                    <div className="flex justify-between text-gray-600 dark:text-gray-300 mb-2">
                        <span>Shipping</span>
                        <span>${shipping}</span>
                    </div>

                    <div className="flex justify-between text-gray-900 dark:text-white text-base font-bold border-t pt-3 mt-4">
                        <span>Total</span>
                        <span>${grandTotal}</span>
                    </div>
                </div>

                {/* Buy Now button */}
                <Modal
                    name={name}
                    address={address}
                    pincode={pincode}
                    phoneNumber={phoneNumber}
                    setName={setName}
                    setAddress={setAddress}
                    setPincode={setPincode}
                    setPhoneNumber={setPhoneNumber}
                    buyNow={buyNow}
                />

               {/*  Upon successful payment downloadable pdf receipt button */}
                {paymentSuccess && (
                    <div className="text-center mt-6">
                        <button
                            onClick={generatePDFReceipts}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-3"
                        >
                            Download Receipt
                        </button>

                        {/* Back to home after successful payment */}
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-600 text-white ml-4 px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Back to Home
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Checkout;
