# EIIP Image Editor Web Application

This is a full-stack image editor web application built with React.js (frontend) and Node.js/Express.js (backend), using the EIIP library for advanced image processing.

## Features
- Fullscreen canvas image editor
- Modern toolbar with image editing tools
- Theming support (light/dark)
- Image upload (drag-and-drop and file picker)
- Live editing using EIIP library
- Download edited images
- Ready for future save-to-server and database integration

## Project Structure
- `/frontend` — React.js app (UI, canvas, EIIP integration)
- `/backend` — Node.js/Express.js API (basic scaffold, ready for future expansion)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Setup
1. Install dependencies for both frontend and backend:
   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. Start the backend server:
   ```sh
   cd backend && npm start
   ```
   Backend runs on `http://localhost:5001`
   
3. Start the frontend app (in a new terminal):
   ```sh
   cd frontend && npm start
   ```
   Frontend runs on `http://localhost:3000`
   
4. Open the app in your browser at `http://localhost:3000`

## Development
- The backend runs on port 5001 by default.
- The frontend (React) runs on port 3000 and proxies API requests to the backend.
- Edit and save images in the browser; future versions will support saving to the server/database.

## Git Repository
- GitHub: git@github.com:SaleemLww/EIIP_EDIT.git

## License
MIT
