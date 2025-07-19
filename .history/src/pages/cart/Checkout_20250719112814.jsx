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

function Checkout() {
  const { mode } = useContext(myContext);
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart);
  const [totalAmount, setTotalAmount] = useState(0);
  const shipping = 100;
  const grandTotal = totalAmount + shipping;

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => (temp += parseInt(item.price)));
    setTotalAmount(temp);
  }, [cartItems]);

  const buyNow = async () => {
    if (!name || !address || !pincode || !phoneNumber) {
      return toast.error("All fields are required");
    }

    const addressInfo = {
      name,
      address,
      pincode,
      phoneNumber,
      date: new Date().toLocaleDateString(),
    };

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag",
      amount: grandTotal * 100,
      currency: "USD",
      name: "Celebal-Mart",
      description: "Dummy Payment",
      handler: async (response) => {
        toast.success('Payment Successful');
        const paymentId = response.razorpay_payment_id;

        const orderInfo = {
          cartItems,
          addressInfo,
          date: new Date().toLocaleString(),
          email: JSON.parse(localStorage.getItem("user")).user.email,
          userid: JSON.parse(localStorage.getItem("user")).user.uid,
          paymentId
        };

        try {
          await addDoc(collection(fireDB, 'order'), orderInfo);
        } catch (err) {
          console.error(err);
          toast.error("Error saving order");
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
        color: "#f56565"
      }
    };

    const pay = new window.Razorpay(options);
    pay.open();
  };

  const generatePDFReceipts = () => {
    if (!paymentDetails) return;

    const {
      paymentId,
      addressInfo,
      orderDate,
      email
    } = paymentDetails;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.addImage(logo, 'JPEG', pageWidth - 50, 10, 40, 20);
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

    doc.text("Items:", 20, 110);
    let y = 120;

    cartItems.forEach((item, idx) => {
      doc.text(`${idx + 1}. ${item.title} - $${item.price}`, 25, y);
      y += 10;
    });

    doc.text(`Subtotal: $${totalAmount}`, 20, y + 10);
    doc.text(`Shipping: $${shipping}`, 20, y + 20);
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: $${grandTotal}`, 20, y + 35);

    doc.save(`CelebalMart_Receipt_${paymentId}.pdf`);

    return doc.output('blob');
  };

  useEffect(() => {
    if (paymentDetails) {
      sendEmailWithPDF();
    }
  }, [paymentDetails]);

  const sendEmailWithPDF = async () => {
    const pdfBlob = generatePDFReceipts();
    if (!pdfBlob || !paymentDetails) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];

      const payload = {
        to: paymentDetails.email,
        subject: "Your Celebal-Mart Receipt",
        message: "Thanks for shopping with Celebal-Mart. Please find your receipt attached.",
        filename: `Receipt_${paymentDetails.paymentId}.pdf`,
        base64pdf: base64,
      };

      try {
        const res = await fetch("https://functions-fnwoaiedk-aakanshi-maliks-projects.vercel.app/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          toast.success("Receipt emailed successfully!");
        } else {
          toast.error("Failed to email receipt.");
        }
      } catch (err) {
        toast.error("Error sending receipt email");
        console.error(err);
      }
    };

    reader.readAsDataURL(pdfBlob);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4 text-gray-800" style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '' }}>
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 mb-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full p-2 mb-2 border rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Pincode"
            className="w-full p-2 mb-2 border rounded"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full p-2 mb-2 border rounded"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <p>Subtotal: ${totalAmount}</p>
          <p>Shipping: ${shipping}</p>
          <p className="font-bold">Total: ${grandTotal}</p>
        </div>

        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
          onClick={buyNow}
        >
          Pay Now
        </button>

        {paymentSuccess && (
          <div className="text-center mt-6">
            <button
              onClick={generatePDFReceipts}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-3"
            >
              Download Receipt
            </button>
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
