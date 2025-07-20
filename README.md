# CELEBAL MART 

The name "Celebal Mart" was chosen to reflect both the organization behind the project (Celebal Technologies) and the nature of the platform (an online marketplace).

"Celebal" acknowledges the company that provided the internship opportunity and under which this project was developed and  "Mart" signifies a digital shopping experience — an online store offering a variety of products to users.


## Description

Celebal Mart is an e-commerce web app built as an internship project for Celebal Technologies. It allows users to browse, purchase products, and manage orders, with admin features for product management—all powered by React and Firebase.

## Features

- Customizable products view (List/Grid)
- Product listings
- Search & Filter products  functionality
- Cart management
- Checkout process
- Payment gateway integration(Razorpay test mode)
- Generation of downloadable PDF receipts after order payment
- Seamless navigation and smooth user experience
- User registration & secure sign-in
- Password recovery
- Automatically email receipts to registered users(via Emailjs)
- Customizable AI generated Celebal product images and stored in Cloudinary.
- Separate sections for Products page and Tech Store of Celebal(Not for sale, only showcase)
- Add , Edit and Delete Product feature
- Admin dashboard with analytics view (orders, users, stock, etc.)
- Responsive design 
- Wishlist or Like/Heart feature to mark favorite products
- Toast notifications for real-time feedback (e.g., add to cart, login success)
- Firestore-based product and order management
- Error handling and form validations throughout the app
- Dark mode support 
- Social media links integration in product pages (Facebook, Twitter, Instagram)


## Tech Stack

- Frontend: React.js, Redux

- Backend: Firebase (Firestore, Authentication)

- Storage: Cloudinary (for AI-generated Celebal product images)

- Email Service: EmailJS (for sending receipts to registered emails)

- Payment Gateway: Razorpay (test mode)

- Others: React Router (for routing), React Toastify (notifications)


## Screenshot 
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/9a8a1009-f821-4ab6-87dc-c5143628176b" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3b14e1da-05ad-406b-9253-d907f0d2eed1" />


### API Keys and Security
For ease of review and to avoid setup issues, all API keys are currently included directly in the project. After the review period (10 days), these keys will be secured properly using environment variables or other best practices to ensure safety and confidentiality.

## Installation 

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/celebal-mart.git  
2. Navigate to the project directory:
   ```
   cd celebal-mart
3. Install dependencies:
   ```
   npm install
4. All necessary API keys (Firebase, Cloudinary, EmailJS) are already configured within the project for easy setup and testing.
5. Start the server:
   ```
    npm start

## Usage
- When you open the app, the Home page loads by default.

- The navigation bar contains links to different pages, along with your profile picture.

- Clicking on the profile picture will redirect users to the Login/Signup page.

- After logging in:
   - Browse and search for products.
   - Add products to your cart.
   - View and manage your cart items.
   - Proceed to checkout and make payments via Razorpay in test mode.
   - Download a PDF receipt after successful payment.
   - Receive an email receipt automatically (powered by EmailJS).

- Admin users (using the provided credentials) can access additional features such as:

   - Adding new products.
   - Editing existing products.
   - Deleting products from the catalog.

- Payment Gateway: Razorpay is integrated in test mode. Use Razorpay test credentials for payment testing.

  ### Admin Credentials for Review:

     Email: aakanshimalik54@gmail.com

     Password: aakanshi

   ### Razorpay Test Payment Credentials:

     You can use any test card provided by Razorpay’s official docs (e.g., card number: 4111 1111 1111 1111, expiry: any future date, CVV: 123, OTP: 1111).



## Deployment 
 Render : https://celebal-mart.onrender.com


## 🧪 Testing
To test the full functionality of Celebal Mart, follow these steps:

- Browse Products: Navigate to the home or all products page to view items.

- Product Details: Click on any product to view its detailed info page.

- Search & Filter: Use the search bar or filters to narrow down products.

- Cart Functionality:

    - Add multiple products to your cart.

    - Update or remove items from the cart.

- Checkout & Payment:

    - Proceed to checkout from the cart page.
    - Use Razorpay's test credentials to simulate payment:
    - Card Number: 4111 1111 1111 1111
    - Expiry: Any future date (e.g., 12/26)
    - CVV: 123
    - OTP: 1111

- Order Confirmation:

  - After successful payment, a downloadable PDF receipt is generated.
  - A receipt is also emailed to the user via EmailJS.

- Admin Testing:

   - Login using provided admin credentials to access the admin dashboard.

   - Test add, update, and delete product features.

- 🛠 No additional testing libraries are required—just use the app’s built-in flows.

## 📬 Contact
For any questions, feedback, or collaboration inquiries, feel free to reach out:

- Name: Aakanshi Malik

- Email: aakanshimalik54@gmail.com

- LinkedIn: www.linkedin.com/in/aakanshi-malik-996738298
