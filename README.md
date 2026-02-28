# E‑Learning‑Platform

A modular e‑learning system built with a **micro‑service inspired architecture**.  
The frontend is a React/Vite SPA, while the backend is split into two independent services:

- **CoreService** – handles core business logic, REST APIs, database, course/user management, etc.
- **RealTimeService** – powers real‑time features over WebSocket (chat, notifications, etc.).

## 📁 Project Structure

```
Backend/
  CoreService/          # Spring Boot (Maven) REST service
  RealTimeService/      # Node.js/Express service with socket.io
Frontend/               # React + TypeScript + Vite SPA
```

Each service has its own configuration file (`pom.xml` or `package.json`) and can be built/deployed independently.

## ⚙️ Technologies Used

- **Backend**
  - CoreService: Java, Spring Boot, Spring Data JPA, Spring Security, PostgreSQL
  - RealTimeService: Node.js, Express, socket.io, mongoose, MongoDB
- **Frontend**
  - React, TypeScript, Vite
  - Related libraries: axios, Zustand, socket.io-client.

## 🚀 Running the Services

1. **Backend/CoreService**
   ```bash
   cd Backend/CoreService
   ./mvnw spring-boot:run
   ```
2. **Backend/RealTimeService**
   ```bash
   cd Backend/RealTimeService
   npm install
   npm start
   ```
3. **Frontend**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

> 💡 Each component can be deployed on a separate server/container, supporting a micro‑services architecture.

## 🔗 Communication

- CoreService: REST API (`/api/...`)
- RealTimeService: WebSocket/Socket.IO
- Frontend consumes APIs via pre‑configured Axios instances (`AxiosCoreService.ts`, `AxiosRealtimeService.ts`).

## 🎯 Key Features

- Course and lesson management
- User registration/login and profile management
- Real‑time chat between students and instructors
- View, add, edit courses
- Role‑based access control (helper `CheckRole.ts`)
