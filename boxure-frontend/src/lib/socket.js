// src/socket.js
import { io } from "socket.io-client";

const URL = "http://localhost:5000";
const socket = io(URL, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;