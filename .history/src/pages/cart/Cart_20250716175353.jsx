import React, { useState } from 'react';
import { useEffect, useContext } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/modal/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteFromCart } from '../../redux/cartSlice';
import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
import jsPDF from 'jspdf';
import logo from '../../assets/logo.jpeg';

function Cart() {

  const context = useContext(myContext)
  const { mode } = context;

  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart);
  console.log(cartItems);

  // delete cart
  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Cart Deleted");
  }

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    let temp = 0;
    cartItems.forEach((cartItem) => {
      temp = temp + parseInt(cartItem.price);
    })
    setTotalAmount(temp);
    console.log(temp);
  }, [cartItems]);

  const shipping = parseInt(100);
  const grandTotal = shipping + totalAmount;
  // console.log(grandTotal);




  //    *****************  PAYMENT INTEGRATION ****************
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState("");

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

        const paymentId = response.razorpay_payment_id;

        // store in firebase 
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

  }

  //  ********* Automatic mail receipt to registered email ********
  const functions = require('firebase-functions');
  const nodemailer = require('nodemailer');
  const cors = require('cors')({ origin: true });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "aakanshimalik54@gmail.com",
      password: "aakanshi"
    }
  });

  exports.sendReceipt = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
      const { email, pdfBase64, paymentId } = req.body;

      if (!email || !pdfBase64 || !paymentId) {
        return res.status(400).send("Missing email, pdf, or paymentId");
      }

      const mailOptions = {
        from: 'Celebal Mart aakanshimalik54@gmail.com',
        to: email,
        subject: `Your Celebal-Mart Receipt [${paymentId}]`,
        html: `<p>Thank you for shopping with Celebal-Mart! Shop again</p><p>Your receipt is attached.</p>`,
        attachments: [
          {
            filename: `CelebalMart_Receipt_${paymentId}.pdf`,
            content: pdfBase64.split("base64,")[1],
            encoding: "base64",
          },
        ],
      };

      try {
        await transporter.sendMail(mailOptions);
        return res.status(200).send("Email sent successfully");
      } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Email failed to send");
      }
    });
  });


  return (
    <Layout >
      <div className="h-auto bg-gray-100  pt-5 " style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '', }}>
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0 ">
          <div className="rounded-lg md:w-2/3 ">
            {cartItems.map((item, index) => {
              const { title, price, description, imageUrl } = item;
              return (
                <div className="justify-between mb-6 rounded-lg border  drop-shadow-xl bg-white p-6  sm:flex  sm:justify-start" style={{ backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '', color: mode === 'dark' ? 'white' : '', }}>
                  <img src={imageUrl} alt="product-image" className="w-full rounded-lg sm:w-40" />
                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2 className="text-lg font-bold text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{title}</h2>
                      <h2 className="text-sm  text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{description}</h2>
                      <p className="mt-1 text-xs font-semibold text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>${price}</p>
                    </div>
                    <div onClick={() => deleteCart(item)} className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>

                    </div>
                  </div>
                </div>
              )
            })}

          </div>

          <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3" style={{ backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '', color: mode === 'dark' ? 'white' : '', }}>
            <div className="mb-2 flex justify-between">
              <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Subtotal</p>
              <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>${totalAmount}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Shipping</p>
              <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>${shipping}</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between mb-3">
              <p className="text-lg font-bold" style={{ color: mode === 'dark' ? 'white' : '' }}>Total</p>
              <div className>
                <p className="mb-1 text-lg font-bold" style={{ color: mode === 'dark' ? 'white' : '' }}>${grandTotal}</p>
              </div>
            </div>
            {/* <Modal  /> */}
            {/* <button
              type="button"
              className="w-full  bg-red-600 py-2 text-center rounded-lg text-white font-bold "
            >
              Buy Now
            </button> */}
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

            {paymentSuccess && (
              <div className="text-center mt-4">
                <button
                  onClick={generatePDFReceipts}
                  className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
                >
                  Download Receipt
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}


export default Cart;