🟢 Real-Time Chat App
A full-stack real-time chat application that supports instant messaging, user authentication, and seamless communication using Stream API for chat services.

✅ Backend completed
🛠️ Frontend in progress

📂 Project Structure
bash
Copy
Edit
RealtimeChatApp/
├── backend/     # Node.js + Express + MongoDB
└── frontend/    # (Coming Soon) React + Tailwind + Stream SDK
🚀 Backend Features
User Registration & Login (JWT Auth)

Contact management

Real-time messaging logic

MongoDB integration with Mongoose

REST API architecture

Environment-based configuration

💬 Chat Powered by Stream
We're using Stream's Chat API to power real-time communication, offering:

Ultra-fast message delivery

Scalable infrastructure

Channel-based messaging

Webhook support

🛠️ Tech Stack
Backend: Node.js, Express.js, MongoDB, Mongoose

Chat: Stream Chat API

Auth: JWT

Frontend: React, Tailwind CSS (coming soon)

📦 How to Run Locally
bash
Copy
Edit
# Clone the repo
git clone https://github.com/Adhithyapranave07/real-time-chat-app.git

# Navigate into backend
cd realtime-chat-app/backend

# Install dependencies
npm install

# Set environment variables
Environment Variables Setup
Create a .env file in the root of the project and add the following variables:

PORT = 5001
MONGO_URL = your_mongodb_connection_string
STREAM_API_KEY = your_stream_api_key
STREAM_API_SECRET = your_stream_api_secret
JWT_SECRET = your_jwt_secret

Note: Do not share your .env file or commit it to GitHub. Make sure .env is included in your .gitignore file.

# Run the server
npm start
🧪 API Documentation
Coming soon via Swagger/Postman after full backend integration.

👨‍💻 Author
Adhithya Pranave
