# 🔑 Step-by-Step Guide: How to Get API Credentials

This guide provides step-by-step instructions on how to set up and retrieve the necessary API credentials for the FitCraft platform.

---

## 📑 Table of Contents
1. [MongoDB Atlas URI](#1-mongodb-atlas-uri)
2. [Cloudinary API Credentials](#2-cloudinary-api-credentials)
3. [Razorpay API Keys](#3-razorpay-api-keys)
4. [Gmail SMTP App Password](#4-gmail-smtp-app-password)
5. [Ngrok Auth Token](#5-ngrok-auth-token)

---

## 1. MongoDB Atlas URI
MongoDB Atlas hosts the application's database in the cloud.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and click **Start Free** to register an account.
2. Once logged in, click **Create** to deploy a new database cluster.
3. Select the **M0 Free** tier (shared database cluster), choose your preferred cloud provider (e.g., AWS) and region, and click **Create**.
4. Under the Security Quickstart:
   * Create a **Database User** by choosing a username and a strong password (keep these safe!).
   * Under **IP Access List**, click **Add My Current IP Address**. For local development and testing across networks, you can add `0.0.0.0/0` to allow connections from anywhere.
5. Click **Finish and Close**, then go to the Databases dashboard.
6. Click the **Connect** button next to your database cluster.
7. Select **Drivers** as the connection method.
8. Choose **Node.js** as your driver and copy the provided connection string.
9. Paste it into your backend `.env` as `MONGO_URI`, replacing `<password>` with the database user's password you created in Step 4.

---

## 2. Cloudinary API Credentials
Cloudinary is used for uploading and hosting customized product images on a secure CDN.

1. Go to [Cloudinary](https://cloudinary.com/) and click **Sign Up for Free**.
2. Complete the onboarding questionnaire and navigate to the main **Cloudinary Dashboard**.
3. Under the **Dashboard** tab, locate the section labeled **Product Environment Credentials**.
4. Here you will see:
   * **Cloud Name**
   * **API Key**
   * **API Secret** (Click "View" or hover to reveal)
5. Copy these values and paste them into your backend `.env` as `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.

---

## 3. Razorpay API Keys
Razorpay handles the online payment processing in test/sandbox mode.

1. Go to [Razorpay](https://razorpay.com/) and sign up for a free merchant account.
2. In the top-right corner of the Razorpay Dashboard, ensure that the toggle is set to **Test Mode** (to avoid processing real transactions).
3. In the left navigation sidebar, click on **Account & Settings**.
4. Scroll down to the **Developer Section** and click on **API Keys**.
5. Click the **Generate Key** button.
6. A modal will pop up displaying your:
   * **Key ID**
   * **Key Secret**
7. Copy both keys immediately into your backend `.env` as `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. Note: Once you close this modal, you cannot view the Secret key again and will need to regenerate it if lost.

---

## 4. Gmail SMTP App Password
FitCraft uses Gmail's secure SMTP server to send confirmation emails. Since Google does not allow apps to log in directly with your primary password, you must create a secure Google App Password.

1. Go to your [Google Account Console](https://myaccount.google.com/).
2. Select **Security** from the left navigation menu.
3. Under **How you sign in to Google**, ensure that **2-Step Verification** is turned ON.
4. Click on the **2-Step Verification** row, scroll to the bottom of the page, and select **App Passwords**.
5. Choose an app name (e.g., "FitCraft") and click **Create**.
6. Google will display a **16-character passcode** inside a yellow box (e.g., `rjgp fdre obpq yytv`).
7. Copy this code (without spaces) and configure your backend `.env` variables:
   * `SMTP_USER=your_gmail_address@gmail.com`
   * `SMTP_PASS=the_16_character_code`
   * `SMTP_HOST=smtp.gmail.com`
   * `SMTP_PORT=587`

---

## 5. Ngrok Auth Token
Ngrok is used to securely expose localhost endpoints so you can test webhooks or browse the web app on mobile devices.

1. Go to [Ngrok](https://ngrok.com/) and register for a free account.
2. Log in and navigate to the **Ngrok Dashboard**.
3. In the left-side menu under **Getting Started**, click on **Your Authtoken**.
4. Copy the long token string shown on the page.
5. Paste it into your backend `.env` as `NGROK_AUTHTOKEN`.
