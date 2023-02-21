import axios from "axios";

export async function resetPassword(newPassword, resetToken, userId) {
  if (newPassword.trim().length < 6 || newPassword.trim().length > 30) {
    // eslint-disable-next-line
    throw { message: "Invalid password (must be between 6-30).", status: 422 };
  }

  const payload = {
    newPassword,
    resetToken,
    userId,
  };
  const authURL = process.env.REACT_APP_AUTH_URL;

  await axios.post(`${authURL}/resetPassword`, payload);
}

export async function toggleLike(postId, username, likeStatus, commentId) {
  let postLikesUrl = `${process.env.REACT_APP_POST_URL}/likes/${postId}`;

  const payload = {
    userId: username,
    likeType: likeStatus ? -1 : 1,
    commentId,
  };

  await axios.patch(postLikesUrl, payload);
}
