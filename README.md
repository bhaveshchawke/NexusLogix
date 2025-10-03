# Urban Express Logistics - A Modern Logistics & Shipment Tracking Platform

## 1. Project Overview

This project is a full-featured, responsive web application for a fictional logistics company, "Urban Express Logistics". It provides a premium, dark-themed user interface for customers to track shipments and for administrators (hosts) to manage core logistics operations. The application is built with a modern tech stack, focusing on a dynamic, interactive, and professional user experience across all devices.

## 2. Features

*   **Modern & Professional UI:** A dark-themed, futuristic design with "glassmorphism" effects and glowing elements for a premium feel.
*   **Fully Responsive Design:** The entire application is optimized for a seamless experience on desktop, tablet, and mobile devices.
*   **Shipment Tracking:** Customers can track their shipments in real-time using a unique tracking ID, which displays a visual timeline of the package's journey.
*   **User Authentication:** Secure login, registration, and session management for both clients and hosts (administrators).
*   **Role-Based Access Control:** The application differentiates between regular clients and hosts, providing an exclusive dashboard and administrative features for hosts.
*   **Admin Dashboard:** A dedicated dashboard for hosts to:
    *   Create and add new shipments.
    *   View and manage all user-submitted contact messages.
    *   Oversee fleet management, including driver status (Available, On-trip, etc.).
*   **Dynamic Content:** Built with Node.js, Express, and EJS for dynamic page rendering and a modular structure using partials.
*   **Interactive Animations:** Smooth entrance animations and high-quality Lottie animations enhance user engagement and provide a polished look.

## 3. Technologies Used

The project is built using the following technologies:

*   **Backend:** Node.js, Express.js
*   **Templating Engine:** EJS (Embedded JavaScript) for server-side rendering and creating reusable partials.
*   **Frontend:** HTML5, CSS3, JavaScript (ES6)
*   **Authentication:** Express Session, `connect-mongodb-session` for secure user authentication and session management.
*   **Database:** MongoDB with Mongoose for data modeling and persistence.
*   **Animation:** LottieFiles for high-quality vector animations.
*   **Version Control:** Git & GitHub

## 4. Setup and Installation

To run this project locally, please follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bhaveshchawke/NexusLogix.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd NexusLogix
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```
    MONGO_URL="your_mongodb_connection_string"
    SECRET="your_session_secret_key"
    ```
5.  **Start the server:**
    ```bash
    npm run dev
    ```
    (This uses `nodemon` to automatically restart the server on file changes).

6.  **Open your browser** and go to `http://localhost:3000` (or the port specified in your `app.js`).

## 5. Usage and Access Control

The application has two main user roles: **Client** and **Host** (Admin).

### Accessing Host Features
To access the administrative (host) pages, you need to log in with a specific user account that is designated as a host. In the current implementation, this is determined by the user's email address upon login.

1.  Navigate to the `controllers/storeController.js` file.
2.  Find the `postLogin` function.
3.  Inside this function, locate the logic that checks the user's email. It will look similar to this:
    ```javascript
    if (user.email === 'host@example.com') {
      req.session.isHost = true;
    }
    ```
4.  You can change `'host@example.com'` to any email you want to use for the host account. After registering and logging in with that email, you will have access to all host features.

## 6. Application Flow (How It Works)

1.  **User Interaction:**
    *   A user lands on the homepage and can browse public pages like Services, About, and Contact.
    *   They can use the tracking form on the homepage or the dedicated tracking page to look up a shipment by its ID.
    *   If the shipment is found, a detailed status page with a visual timeline is displayed.

2.  **Authentication:**
    *   Users can register for a new account or log in with existing credentials.
    *   The session is managed using `express-session`, and session data is stored in MongoDB.

3.  **Host (Admin) Workflow:**
    *   When a user with the designated "host" email logs in, the system sets an `isHost` flag in their session.
    *   The UI dynamically updates to show additional navigation links in the header, such as "Add Shipment", "View Messages", and "Fleet Mgmt".
    *   The host can access a protected dashboard to perform administrative tasks, which are inaccessible to regular clients.

## 7. Pages and Functionality
*   **Public Pages:**
    *   `Home`: Main landing page with a tracking form.
    *   `Services`: Details of the services offered.
    *   `Tracking`: A dedicated page for shipment tracking.
    *   `About Us`: Information about the company and team.
    *   `Contact Us`: A functional form for users to send messages.
    *   `Pricing`: Details on different pricing plans.
*   **Authentication Pages:**
    *   `Client Login`: For existing users to log in.
    *   `Register`: For new users to create an account.
*   **User/Host Pages (Protected):**
    *   `Dashboard`: A central hub for logged-in users.
    *   `Add Shipment`: (Host only) A form to create new shipments.
    *   `View Messages`: (Host only) Displays all messages from the contact form.
    *   `Fleet Management`: (Host only) A view to manage drivers and vehicles.
*   **Utility Pages:**
    *   `404 Not Found`: A custom, animated 404 error page.
    *   `Shipment Success`: A confirmation page displayed after a new shipment is created.