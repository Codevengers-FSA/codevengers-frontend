import React, { useEffect, useState } from "react";
import Comment from "./Comments";

const CommentsSection = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("token");

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

        // Map comments to ensure replies are nested under their parent
        const commentsMap = new Map();

        data.forEach((comment) => {
          // Add the comment to the map by id (key)
          commentsMap.set(comment.id, { ...comment, replies: [] });

          // Add replies to their parent comment
          if (comment.parentId) {
            const parentComment = commentsMap.get(comment.parentId);
            if (parentComment) {
              parentComment.replies.push(comment);
            }
          }
        });

        // Extract the top-level comments (those without a parentId)
        const topLevelComments = [...commentsMap.values()].filter(
          (comment) => !comment.parentId
        );

        setComments(topLevelComments);
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

    try {
      const response = await fetch(
        `https://codevengers-backend.onrender.com/comments/movies/${movieId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newComment }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const addedComment = await response.json();
      setComments((prevComments) => [...prevComments, addedComment]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Handle updating a comment
  const handleUpdateComment = async (commentId, updatedText) => {
    try {
      const response = await fetch(
        `https://codevengers-backend.onrender.com/comments/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: updatedText,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const updatedComment = await response.json();
      console.log("Comment updated:", updatedComment);
  
      // Update the local state or UI with the updated comment data
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, text: updatedText } : comment
        )
      );
    } catch (error) {
      console.error("Error updating comment:", error);
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

  // Handle replying to a comment
  const handleReply = async (commentId, replyText) => {
    if (!token) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await fetch(
        `https://codevengers-backend.onrender.com/comments/comments/${commentId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: replyText.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add reply");
      }

      const newReply = await response.json();

      // Update the comments state to nest the reply correctly
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        )
      );
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  // Handle deleting a reply
  const handleDeleteReply = async (replyId, parentId) => {
    if (!token) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await fetch(
        `https://codevengers-backend.onrender.com/comments/comments/replies/${replyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete reply");
      }

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === parentId
            ? { ...comment, replies: comment.replies.filter((reply) => reply.id !== replyId) }
            : comment
        )
      );
    } catch (err) {
      console.error("Error deleting reply:", err);
    }
  };

  return (
    <div className="comments-section">
      {token && (
        <form className="add-comment-form" onSubmit={handleAddComment}>
          <textarea
            className="add-comment-textarea"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <button className="btn-submit-comment" type="submit">
            Submit Comment
          </button>
        </form>
      )}

      <div className="comments-list">
        {comments.map((comment) => (
          <Comment
          key={comment.id}
          comment={comment}
          onReply={handleReply}
          onDeleteComment={handleDeleteComment}
          onDeleteReply={handleDeleteReply}
          onUpdateComment={handleUpdateComment}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;