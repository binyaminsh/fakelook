import { Server as httpServer } from "http";
import { Server, Socket, Namespace } from "socket.io";
import { toPostDto } from "./mapper/postMapper";
import { toUserDto } from "./mapper/userMapper";
import { Post } from "./models/post.schema";
import { User } from "./models/user.schema";

let io: Server;
let nsp: Namespace;

export function initSocketIo(httpServer: httpServer, corsOrigin: string) {
  io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,

      // credentials: true,
    }
  });
  nsp = io.of('/feed');
}

function socketConnection() {
  if (!io) return;

  nsp.on("connection", (socket: Socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on("dataRequest", () => sendPostsAndUsers(socket));
  });

  nsp.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
}

async function sendPostsAndUsers(socket: Socket) {
  const posts = await Post.find();
  const users = await User.find();

  const postsDto = await Promise.all(posts.map(toPostDto));
  const usersDto = users.map(toUserDto);

  socket.emit("data", { postsDto, usersDto });
}

// TODO: Add DTOs
export async function onPostAdded(post: any) {
  nsp.emit("post-added", post);
}

export async function onPostUpdated(post: any) {
  nsp.emit("post-updated", post);
}

export async function onUserAdded(user: any) {
  nsp.emit("user-added", user);
}

export async function onUserUpdated(user: any) {
  nsp.emit("user-updated", user);
}

export default socketConnection;
