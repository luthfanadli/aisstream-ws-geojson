# WebSocket AIS Stream to GeoJSON

This application connects to an AIS (Automatic Identification System) stream via WebSocket, converts the received data into GeoJSON format, and broadcasts it to connected WebSocket clients.

## Prerequisites

Before running the application, make sure to set up your environment by installing **Node.js** and **npm**, then configuring the required dependencies and environment variables.

### Steps to Set Up and Run the Application

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure .env File**

   ```bash
   AIS_API_KEY=your-ais-api-key-here
   ```

4. **Run the Application**

   ```
   node index.js
   ```

5. **Testing the WebSocket with wscat**

   ```
   wscat -c ws://localhost:xxxx
   ```
