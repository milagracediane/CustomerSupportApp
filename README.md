# Customer Support Form App

A mobile application developed using React Native and Expo that allows users to submit customer support concerns through a form. Users can provide their contact information, select an issue category, write a message, and attach a screenshot.

## Features

- Enter name and email address.
- Select an issue category:
  - Account Problem
  - Technical Issue
  - Payment Concern
  - Other
- Write a support message.
- Select and preview a screenshot from the device gallery.
- Upload screenshots to Cloudinary.
- Send support requests through EmailJS.
- Receive success or error notifications.
- Display a loading indicator during submission.
- Validate form inputs before submission.

## Technologies Used

- React Native
- Expo
- TypeScript
- Expo Image Picker
- Cloudinary
- EmailJS

## Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project folder:

   ```bash
   cd CustomerSupportApp
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root and add the required configuration variables.

## Environment Configuration

Create a `.env` file using the variable names provided in `.env.example`.

Required variables:

```env
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
EXPO_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
EXPO_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
EXPO_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Replace the placeholder values with your own configuration details.

**Important:** Never upload your actual `.env` file or private credentials to GitHub.

## Running the Application

Start the Expo development server:

```bash
npx expo start
```

Scan the QR code using Expo Go to open the application on a compatible mobile device.

## Application Workflow

1. The user fills out the customer support form.
2. The user selects a screenshot from the gallery.
3. The application validates the required information.
4. The selected screenshot is uploaded to Cloudinary.
5. The application retrieves the screenshot's public URL.
6. EmailJS sends the support request and screenshot URL to the configured recipient.
7. The application displays the submission result.

## Security

- Environment variables are stored in `.env`.
- The `.env` file is excluded through `.gitignore`.
- The `.env.example` file provides placeholder configuration values.
- Cloudinary uses an unsigned upload preset.

## Developers

- Milagrace Diane Rubio Obongen
- Juliana [Add Last Name]

## Project Repository

[Add your GitHub repository link here]
