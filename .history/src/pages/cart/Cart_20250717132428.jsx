// import React, { useState } from 'react';
// import { useEffect, useContext } from 'react';
// import myContext from '../../context/data/myContext';
// import Layout from '../../components/layout/Layout';
// import Modal from '../../components/modal/Modal';
// import { useSelector, useDispatch } from 'react-redux';
// import { toast } from 'react-toastify';
// import { deleteFromCart } from '../../redux/cartSlice';
// import { addDoc, collection } from 'firebase/firestore';
// import {app, fireDB } from '../../firebase/FirebaseConfig';
// import jsPDF from 'jspdf';
// import logo from '../../assets/logo.jpeg';
// import emailjs from 'emailjs-com';
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from '../../firebase/FirebaseConfig';




// function Cart() {

//   const context = useContext(myContext)
//   const { mode } = context;

//   const dispatch = useDispatch();

//   const cartItems = useSelector((state) => state.cart);
//   console.log(cartItems);

//   // delete cart
//   const deleteCart = (item) => {
//     dispatch(deleteFromCart(item));
//     toast.success("Cart Deleted");
//   }

//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cartItems));
//   }, [cartItems]);

//   const [totalAmount, setTotalAmount] = useState(0);
//   useEffect(() => {
//     let temp = 0;
//     cartItems.forEach((cartItem) => {
//       temp = temp + parseInt(cartItem.price);
//     })
//     setTotalAmount(temp);
//     console.log(temp);
//   }, [cartItems]);

//   const shipping = parseInt(100);
//   const grandTotal = shipping + totalAmount;
//   // console.log(grandTotal);




//   //    *****************  PAYMENT INTEGRATION ****************
//   const [name, setName] = useState("");
//   const [address, setAddress] = useState("");
//   const [pincode, setPincode] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [paymentDetails, setPaymentDetails] = useState("");

//   const buyNow = async () => {
//     // validation 
//     if (name === "" || address == "" || pincode == "" || phoneNumber == "") {
//       return toast.error("All fields are required", {
//         position: "top-center",
//         autoClose: 1000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "colored",
//       })
//     }

//     const addressInfo = {
//       name,
//       address,
//       pincode,
//       phoneNumber,
//       date: new Date().toLocaleString(
//         "en-US",
//         {
//           month: "short",
//           day: "2-digit",
//           year: "numeric",
//         }
//       )
//     }
//     // console.log(addressInfo);

//     var options = {
//       key: "rzp_test_1DP5mmOlF5G5ag",
//       key_secret: "",
//       amount: parseInt(grandTotal * 100),
//       currency: "USD",
//       order_receipt: 'order_rcptid_' + name,
//       name: "Celebal-Mart",
//       description: "for testing purpose",
//       handler: function (response) {
//         console.log(response);
//         toast.success('Payment Successful');

//         const paymentId = response.razorpay_payment_id;

//         // store in firebase 
//         const orderInfo = {
//           cartItems,
//           addressInfo,
//           date: new Date().toLocaleString(
//             "en-US",
//             {
//               month: "short",
//               day: "2-digit",
//               year: "numeric",
//             }
//           ),
//           email: JSON.parse(localStorage.getItem("user")).user.email,
//           userid: JSON.parse(localStorage.getItem("user")).user.uid,
//           paymentId
//         }

//         try {

//           const orderRef = collection(fireDB, 'order');
//           addDoc(orderRef, orderInfo);

//         } catch (error) {
//           console.log(error);
//         }

//         setPaymentSuccess(true);
//         setPaymentDetails({
//           paymentId,
//           addressInfo,
//           orderInfo,
//           cartItems,
//           totalAmount,
//           shipping,
//           grandTotal,
//           orderDate: orderInfo.date,
//           email: orderInfo.email,
//         });
//         setTimeout(() => sendPDFReceipts(), 1000);
//       },

//       theme: {
//         color: "#3399cc"
//       }
//     };

//     var pay = new window.Razorpay(options);
//     pay.open();
//     console.log(pay);
//   }



//   //  ************   PDF generate via jsPDF **************
//   const generatePDFReceipts = () => {
//     if (!paymentDetails) return;

//     const { paymentId, addressInfo, orderInfo, cartItems, totalAmount, shipping, grandTotal, orderDate, email } = paymentDetails;

//     console.log('Generating PDF with paymentDetails:', paymentDetails);

//     const date = orderInfo?.date || "N/A";  // safer fallback

//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const imgWidth = 40;
//     const imgHeight = 20;
//     const paddingRight = 15;
//     const paddingTop = 10;
//     doc.addImage(logo, 'JPEG', pageWidth - imgWidth - paddingRight, paddingTop, imgWidth, imgHeight);
//     doc.setFontSize(18);
//     doc.text("Celebal-Mart - Payment Receipt", 20, 20);

//     doc.setFontSize(12);
//     doc.text(`Payment ID: ${paymentId}`, 20, 35);
//     doc.text(`Customer Name: ${addressInfo.name}`, 20, 45);
//     doc.text(`Address: ${addressInfo.address}`, 20, 55);
//     doc.text(`Pincode: ${addressInfo.pincode}`, 20, 65);
//     doc.text(`Phone: ${addressInfo.phoneNumber}`, 20, 75);
//     doc.text(`Date: ${orderDate}`, 20, 85);
//     doc.text(`Email: ${email}`, 20, 95);

//     doc.text("Purchased Items:", 20, 110);
//     let y = 120;

//     cartItems.forEach((item, index) => {
//       doc.text(`${index + 1}. ${item.title} - $${item.price}`, 25, y);
//       y += 10;
//     });

//     doc.text(`Subtotal: $${totalAmount}`, 20, y + 10);
//     doc.text(`Shipping: $${shipping}`, 20, y + 20);
//     doc.setFont("helvetica", "bold");
//     doc.text(`Grand Total: $${grandTotal}`, 20, y + 35);

//     doc.save(`CelebalMart_Receipt_${paymentId}.pdf`);

//     const pdfBlob = doc.output('blob');
//   return pdfBlob;

//   }

//   //   ************ Emailing payment receipt **************
//   // Initialize storage
// const storage = getStorage(app);

//   const sendPDFReceipts = async (pdfBlob) => {
//     if (!paymentDetails) return;

//     const { paymentId, email } = paymentDetails;

//     const doc = new jsPDF();
//     doc.text("Celebal-Mart - Payment Receipt", 20, 20);
//     doc.text(`Payment ID: ${paymentId}`, 20, 30);
//     // Add rest of the receipt...

//     // const pdfBlob = doc.output('blob');

//      // Create a storage ref
//   const storageRef = ref(storage, `receipts/${paymentId}.pdf`);
//   console.log(email);
//     try {
//     // Upload the blob
//     await uploadBytes(storageRef, pdfBlob);

//     // Get the download URL
//     const pdf_link = await getDownloadURL(storageRef);

//     // Now send the email with this link
//     emailjs.send("service_oto8pcs", "template_1tqqra7", {
//       name: "Aakanshi Malik",
//       to_email: email,
//       message: `Thanks for shopping with Celebal-Mart! Download your receipt here: ${pdf_link}`,
//       time: new Date().toLocaleString(),
//       pdf_link: pdf_link,
//     }, "-EHsXdNkEnADENJ8W")
//       .then(() => {
//         toast.success("Receipt sent to your email");
//       })
//       .catch((error) => {
//         console.error("Email send failed", error);
//         toast.error("Failed to send email");
//       });

//   } catch (error) {
//     console.error("Failed to upload PDF and send email", error);
//     toast.error("Failed to send receipt");
//   }
//   };




//   return (
//     <Layout >
//       <div className="h-auto bg-gray-100  pt-5 " style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '', }}>
//         <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
//         <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0 ">
//           <div className="rounded-lg md:w-2/3 ">
//             {cartItems.map((item, index) => {
//               const { title, price, description, imageUrl } = item;
//               return (
//                 <div className="justify-between mb-6 rounded-lg border  drop-shadow-xl bg-white p-6  sm:flex  sm:justify-start" style={{ backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '', color: mode === 'dark' ? 'white' : '', }}>
//                   <img src={imageUrl} alt="product-image" className="w-full rounded-lg sm:w-40" />
//                   <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
//                     <div className="mt-5 sm:mt-0">
//                       <h2 className="text-lg font-bold text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{title}</h2>
//                       <h2 className="text-sm  text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{description}</h2>
//                       <p className="mt-1 text-xs font-semibold text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>${price}</p>
//                     </div>
//                     <div onClick={() => deleteCart(item)} className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
//                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
//                       </svg>

//                     </div>
//                   </div>
//                 </div>
//               )
//             })}

//           </div>

//           <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3" style={{ backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '', color: mode === 'dark' ? 'white' : '', }}>
//             <div className="mb-2 flex justify-between">
//               <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Subtotal</p>
//               <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>${totalAmount}</p>
//             </div>
//             <div className="flex justify-between">
//               <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Shipping</p>
//               <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>${shipping}</p>
//             </div>
//             <hr className="my-4" />
//             <div className="flex justify-between mb-3">
//               <p className="text-lg font-bold" style={{ color: mode === 'dark' ? 'white' : '' }}>Total</p>
//               <div className>
//                 <p className="mb-1 text-lg font-bold" style={{ color: mode === 'dark' ? 'white' : '' }}>${grandTotal}</p>
//               </div>
//             </div>
//             {/* <Modal  /> */}
//             {/* <button
//               type="button"
//               className="w-full  bg-red-600 py-2 text-center rounded-lg text-white font-bold "
//             >
//               Buy Now
//             </button> */}
//             <Modal
//               name={name}
//               address={address}
//               pincode={pincode}
//               phoneNumber={phoneNumber}
//               setName={setName}
//               setAddress={setAddress}
//               setPincode={setPincode}
//               setPhoneNumber={setPhoneNumber}
//               buyNow={buyNow}
//             />

//             {paymentSuccess && (
//               <div className="text-center mt-4">
//                 <button
//                   onClick={async () => {
//     const pdfBlob = await generatePDFReceipts(); 
//     if (pdfBlob) {
//       await sendPDFReceipts(pdfBlob);
//     }
//   }}
//                   className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
//                 >
//                   Download Receipt
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   )
// }


// export default Cart;






import React, { useState } from 'react';
import { useEffect, useContext } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/modal/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteFromCart } from '../../redux/cartSlice';
import { addDoc, collection } from 'firebase/firestore';
import {app, fireDB } from '../../firebase/FirebaseConfig';
import jsPDF from 'jspdf';
import logo from '../../assets/logo.jpeg';
import emailjs from 'emailjs-com';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase/FirebaseConfig';




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
        // sendPDFReceipts(response.razorpay_payment_id);

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
        // setTimeout(() => sendPDFReceipts(), 1000);
      },

      theme: {
        color: "#3399cc"
      },
      useEffect(() => {
  if (paymentDetails) {
    sendPDFReceipts();
  }
}, [paymentDetails]);
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

    const pdfBlob = doc.output('blob');
  return pdfBlob;

  }

  //   ************ Emailing payment receipt **************
  // Initialize storage
const storage = getStorage(app);

  const sendPDFReceipts = async (pdfBlob) => {
    if (!paymentDetails) return;

    const { paymentId, email } = paymentDetails;

    const doc = new jsPDF();
    doc.text("Celebal-Mart - Payment Receipt", 20, 20);
    doc.text(`Payment ID: ${paymentId}`, 20, 30);
    // Add rest of the receipt...

    // const pdfBlob = doc.output('blob');

     // Create a storage ref
  const storageRef = ref(storage, `receipts/${paymentId}.pdf`);
  console.log(email);
    try {
    // Upload the blob
    await uploadBytes(storageRef, pdfBlob);

    // Get the download URL
    const pdf_link = await getDownloadURL(storageRef);

    // Now send the email with this link
    emailjs.send("service_oto8pcs", "template_1tqqra7", {
      name: "Aakanshi Malik",
      to_email: email,
      message: `Thanks for shopping with Celebal-Mart! Download your receipt here: ${pdf_link}`,
      time: new Date().toLocaleString(),
      pdf_link: pdf_link,
    }, "-EHsXdNkEnADENJ8W")
      .then(() => {
        toast.success("Receipt sent to your email");
      })
      .catch((error) => {
        console.error("Email send failed", error);
        toast.error("Failed to send email");
      });

  } catch (error) {
    console.error("Failed to upload PDF and send email", error);
    toast.error("Failed to send receipt");
  }
  };




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
                  onClick={ () => {
                        generatePDFReceipts(); 
                        }}
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



