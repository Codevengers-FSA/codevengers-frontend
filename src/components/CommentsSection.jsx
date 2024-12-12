import React, { useEffect, useState } from "react";
import Comment from "./Comments";

const CommentsSection = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");
  const token = localStorage.getItem("token");

  // Retrieve the username from local storage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    console.log("Username retrieved from localStorage:", storedUsername);
  }, []);

  // Fetch comments for the movie
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `https://codevengers-backend.onrender.com/comments/movies/${movieId}/comments`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [movieId]);

  // Handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!token) {
      console.error("User not logged in");
      return;
    }

    console.log("Submitting comment with username:", username); // Add this line

    try {
      const response = await fetch(
        `https://codevengers-backend.onrender.com/comments/movies/${movieId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newComment, user: { username: username || "Anonymous" } }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const addedComment = await response.json();
      console.log("Added Comment:", addedComment); // Add this line
      setComments((prevComments) => [...prevComments, addedComment]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (id) => {
    if (!token) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await fetch(
        `https://codevengers-backend.onrender.com/comments/comments/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleReply = async (id, replyText) => {
    if (!token) {
      console.error("User not logged in");
      return;
    }

    console.log("Submitting reply with username:", username); // Add this line

    try {
      const response = await fetch(
        `https://codevengers-backend.onrender.com/comments/comments/${id}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: replyText, parentId: id, user: { username: username || "Anonymous" } }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add reply");
      }

      const newReply = await response.json();
      console.log("Added Reply:", newReply); // Add this line
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        )
      );
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  return (
    <div className="comments-section">
      {token && (
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <button type="submit">Submit Comment</button>
        </form>
      )}

      <div className="comments-list">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onDeleteComment={handleDeleteComment}
            username={username}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;