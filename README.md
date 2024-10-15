# Eventful

This is a web application built for managing event registrations, allowing users to sign up, register for events, and make payments through PayPal, and even add events to their Google Calendar. The app uses Firebase for authentication, Firestore for data storage, and Tailwind CSS for styling, inspired by Airbnb's user interface for a clean and intuitive experience.
Eventful is fully responsive and designed to work seamlessly on both desktop and mobile devices.

## Features

- **User Authentication**: Users can sign up, log in, and log out securely.
- **Event Creation**: Staff members can create new events with details like name, date, description, and price.
- **Event Registration**: Non-staff users can browse and sign up for events.
- **Google Calendar Integration via OAuth**: After signing up for an event, users can add it to their Google Calendar through a Google OAuth flow.
- **Payment Integration**: Events that require payment are processed through PayPal’s SDK.
- **Role-Based Access**: Different functionalities are available based on user roles (staff or non-staff).
- **Responsive Design**: The platform is designed to be fully responsive and accessible across devices, including mobile.

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Calendar Integration**: Google Calendar URL (via OAuth)
- **Payments**: PayPal SDK
- **Deployment**: Netlify

## Live Demo
The project is hosted at: https://eventful-events.netlify.app/

### Test Accounts
Use the following test accounts to explore the platform:

**Test Staff Account**:
- Email: ```staff@test.com```
- Password: ```Staff123!```

**Test User Account**:
- Email: ```johndoe@test.com```
- Password: ```Johndoe123!```

**Test User Paypal Account**:
- Email: ```sb-pweuc33250105@personal.example.com```
- Password: ```wQ3&2e<}```

## Running Locally
### Prerequisites
To run the project locally, you need the following:
- **Node.js** (version 14 or higher)
- **Firebase**: Create a project and configure Firebase authentication and Firestore.
- **Google Calendar API**: Set up a developer account with Google and configure OAuth 2.0 for calendar integration.
- **PayPal Developer Account**: Set up PayPal API credentials for handling payments.
- **Git**: To clone the repository.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ginnytruong/event-platform.git
    cd event-platform
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

## Configuration

Before running the app, you need to configure Firebase, Google PayPal SDK. Follow the steps below:

### Firebase Configuration

1. Create a Firebase project on [Firebase Console](https://console.firebase.google.com/).
2. Enable Firebase Authentication (Email/Password).
3. Create a Firestore database.
4. Copy your Firebase config object and replace the placeholder values in the `.env` file:

    ```bash
    VITE_FIREBASE_API_KEY=your-firebase-api-key
    VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
    VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
    VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
    VITE_FIREBASE_APP_ID=your-firebase-app-id
    ```

### Google OAuth Configuration
1. Go to the Google Developers Console at [Google Developer](https://console.developers.google.com/project).
2. Create a new project and configure OAuth 2.0 credentials.
3. Add the credentials to your .env file:

    ```bash
    VITE_GOOGLE_CLIENT_ID=your-google-client-id
    ```

### PayPal Configuration

1. Create a PayPal sandbox account at [PayPal Developer](https://developer.paypal.com/).
2. Generate a `Client ID` from the PayPal dashboard and add it to the `.env` file:

    ```bash
    VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
    ```

### Important: Add .env to .gitignore
To protect sensitive credentials like Firebase API keys, PayPal Client IDs, and Google OAuth Client IDs, ensure that the .env file is added to your .gitignore file. This prevents it from being committed to version control.

1. Open or create a .gitignore file in the root of your project.
2. Add the following line:

    ``` bash
    .env
    ```
This will ensure that your .env file, which contains sensitive environment variables, is not accidentally pushed to your repository.

## Running the App

Once the configuration is done, you can run the app locally with the following command:

``` bash
npm run dev
```

This will start the development server, and you can access the app at http://localhost:5173/

## Role-Based Access
- **Staff Role**: The ability to create and manage events is restricted to staff members.
- **User Role**: Regular users can browse events and sign up for them.
- **How to Set Staff Role**: The staff role is manually assigned through Firebase. To set a user as staff, you must manually update the user's role field in the Firebase Firestore database to "staff".

## Security Considerations
- **Password Security**: User passwords are securely handled via Firebase Authentication.
- **Payment Security**: Payments are processed through PayPal’s secure SDK.
- **Role-Based Access**: Different levels of access ensure that only staff can create and manage events.

## Accessibility & Responsive Design
- The app is designed with accessibility in mind, featuring clear labels, error messages, and intuitive navigation.
- Responsive: The design adapts to different screen sizes, ensuring usability on mobile, tablet, and desktop.

## Future Extensions
- **API Integration**: Integration with a free API for event data to enhance event discovery.
- **Confirmation Emails**: Send email confirmations when users sign up for events.
- **Social Media Integration**: Expand OAuth to include additional social login options (e.g., Facebook, Twitter).
- **Mobile App**: Extend the project to include a mobile app using React Native.
- **Event Reminders**: Send notifications or emails to users reminding them of upcoming events.
