# Customer Support Form App

A mobile application developed using **React Native and Expo** that allows users to submit customer support concerns through a digital form. Users can provide their contact information, select an issue category, write a message, and attach a screenshot for reference.

The application uses **Cloudinary** to upload screenshots and **EmailJS** to send support requests to the designated support team.

## Features

- Enter name and email address.
- Select an issue category:
  - Account Problem
  - Technical Issue
  - Payment Concern
  - Other
- Write a customer support message.
- Select a screenshot from the device gallery.
- Preview, change, or remove the selected screenshot.
- Upload screenshots to Cloudinary.
- Send support requests through EmailJS.
- Include a clickable screenshot link in the support email.
- Validate form inputs before submission.
- Display a loading indicator while processing a request.
- Prevent duplicate submissions during processing.
- Display success or error notifications.

## Technologies Used

- **React Native** – For building the application interface.
- **Expo** – For developing and running the application.
- **TypeScript** – For programming language support.
- **Expo Image Picker** – For selecting screenshots from the device gallery.
- **Cloudinary** – For uploading and storing screenshots.
- **EmailJS** – For sending customer support requests through email.

## Installation and Setup

Follow these steps to run the application locally.

### 1. Clone the Repository

```bash
git clone https://github.com/milagracediane/CustomerSupportApp.git
```

### 2. Navigate to the Project Folder

```bash
cd CustomerSupportApp
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project's root directory.

Use the `.env.example` file as a reference and provide your own configuration values.

Required environment variables:

```env
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
EXPO_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
EXPO_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
EXPO_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Replace the placeholder values with your actual Cloudinary and EmailJS configuration details.

**Important:** Do not upload your actual `.env` file or private credentials to GitHub. Each developer must configure their own local `.env` file.

### 5. Run the Application

Start the Expo development server:

```bash
npx expo start
```

- **Android:** Scan the QR code using Expo Go on a compatible device.
- **Web:** Press `w` in the Expo terminal to open the application in a web browser.

## Application Workflow

1. The user enters their name, email address, issue category, and support message.
2. The user selects a screenshot from the device gallery.
3. The application displays a preview of the selected screenshot.
4. The application validates the required form inputs.
5. The selected screenshot is uploaded to Cloudinary.
6. After a successful upload, the application retrieves the screenshot's public URL.
7. EmailJS sends the support request and screenshot link to the designated support team.
8. The application displays a success or error notification.

The application prevents duplicate submissions while processing a request. If the screenshot upload fails, the support email is not sent.

## Security and Configuration

- Environment variables are configured through a local `.env` file.
- The `.env` file is excluded from Git tracking using `.gitignore`.
- The `.env.example` file provides placeholder configuration values for other developers.
- Cloudinary uses an unsigned upload preset for screenshot uploads.
- Actual configuration values must not be committed or uploaded to the public repository.

**Note:** Expo public environment variables (`EXPO_PUBLIC_`) are included in the application bundle and should not contain private secrets.

## Developers

- **Milagrace Diane Rubio Obongen**
- **Juliana Jane E. Jumawan**

## Project Repository

[Customer Support Form App – GitHub](https://github.com/milagracediane/CustomerSupportApp)