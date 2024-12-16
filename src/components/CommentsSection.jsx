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

    console.log("Submitting comment with username:", username);

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
      console.log("Added Comment:", addedComment);
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

  // Handle adding a reply to a comment
  const handleReply = async (commentId, replyText) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error("User not logged in");
      return;
    }
  
    if (!replyText || typeof replyText !== "string" || replyText.trim() === "") {
      console.error("Invalid reply text");
      return;
    }
  
    console.log("Submitting reply with username:", username);
  
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
        const errorResponse = await response.json();
        throw new Error(`Failed to add reply: ${errorResponse.message}`);
      }
  
      const newReply = await response.json();
      console.log("Added Reply:", newReply);
  
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

  const handleUpdateComment = async (id, newText) =>{
   // const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token');
    if(!token) {
      console.error('User not logged in');
      return;
    }

    try {
      const response = await fetch (`https://codevengers-backend.onrender.com/comments/comments/${id}`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            text: newText, 
            // id: id,
            // userid: userId,
           }),
        }
      );
      if(!response.ok){
        throw new Error("Failed to update comment");
      }
      const updatedComment = await response.json();
      setComments((prevComments)=>
        prevComments.map((comment)=>
        comment.id === id ? updatedComment: comment
        )
      );
    } catch (err) {
      console.error("Error updating comment", err);
    }}

  

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
          <button className="btn-submit-comment" type="submit">Submit Comment</button>
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
            username={username}
            onUpdateComment={handleUpdateComment}
          />
        ))}
      </div>
    </div>
    
  );
};

export default CommentsSection;