import { createSlice } from "@reduxjs/toolkit";

const initialFeedState = {
  users: [],
  posts: [],
  filteredPosts: [],
  isEstablishingConnection: false,
};

const feedSlice = createSlice({
  name: "feed",
  initialState: initialFeedState,
  reducers: {
    startConnection(state) {
      state.isEstablishingConnection = true;
    },
    setData(state, action) {
      state.posts = action.payload.posts;
      state.users = action.payload.users;
    },
    addNewUser(state, action) {
      state.users.push(action.payload.user);
    },
    updateUser(state, action) {
      const username = action.payload.user.username;
      const existingUserIndex = state.users.findIndex(
        (user) => user.username === username
      );

      if (existingUserIndex !== -1) {
        state.users[existingUserIndex] = action.payload.user;
      }
    },
    addNewPost(state, action) {
      state.posts.push(action.payload.post);
    },
    updatePost(state, action) {
      const postId = action.payload.post.id;
      const existingPostIndex = state.posts.findIndex(
        (post) => post.id === postId
      );

      if (existingPostIndex !== -1) {
        state.posts[existingPostIndex] = action.payload.post;
      }
    },
    setFilteredPosts(state, action) {
      state.filteredPosts = action.payload;
    },
  },
});

export const feedActions = feedSlice.actions;

export default feedSlice.reducer;
