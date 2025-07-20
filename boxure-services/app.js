// app.js
const express   = require('express');
const session   = require('express-session');
const cors      = require('cors');
const http      = require('http');
const { Server } = require('socket.io');

// your routers
const itemsRouter    = require('./routers/items');
const authRouter     = require('./routers/auth');
const usersRouter    = require('./routers/users');
const messagesRouter = require('./routers/messages');

const app = express();

// ——————————————————————————————
// Middleware
// ——————————————————————————————
app.use(express.json());
app.use(cors({
  origin:      'http://localhost:3000',
  credentials: true,
}));

// create session middleware instance
const sessionMiddleware = session({
  secret:            'your-secret-key',
  resave:            false,
  saveUninitialized: true,
  cookie:            { secure: false },  // set secure:true in prod over HTTPS
});
app.use(sessionMiddleware);

// ——————————————————————————————
// Routers
// ——————————————————————————————
app.use('/api/items',    itemsRouter);
app.use('/api/auth',     authRouter);
app.use('/api/users',    usersRouter);
app.use('/api/messages', messagesRouter);

// ——————————————————————————————
// Create HTTP server + Socket.IO
// ——————————————————————————————
const server = http.createServer(app);
const io     = new Server(server, {
  cors: {
    origin:      'http://localhost:3000',
    methods:     ['GET','POST'],
    credentials: true,
  }
});

// share session with Socket.IO
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// simple auth for sockets
io.use((socket, next) => {
  const sess = socket.request.session;
  if (sess && sess.user) {
    socket.userId = sess.user.id;
    return next();
  }
  next(new Error('Unauthorized'));
});

io.on('connection', (socket) => {
  socket.join(`user:${socket.userId}`);
});

// make io available to your routes
app.set('io', io);

server.listen(5000, () => {
  console.log('Backend is running on http://localhost:5000');
});
