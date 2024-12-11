// This file handles fetching, displaying, and managing the list of comments for a movie. 

import React, { useEffect, useState } from "react";
import Comment from "./Comments";

const CommentsSection = ({ movieId, onDeleteReply }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const token = localStorage.getItem('token');

  console.log('token:', token)

  useEffect(() => {
    fetch(`https://codevengers-backend.onrender.com/comments/movies/${movieId}/comments`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => setComments(data))
      .catch((err) => console.error('Failed to fetch comments: ', err));
  }, [movieId]);

  const handleAddComment = (e) => {
    e.preventDefault();

    fetch(`https://codevengers-backend.onrender.com/comments/movies/${movieId}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
       },
      body: JSON.stringify({ text: newComment }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((addedComment) => {
        setComments([...comments, addedComment]);
        setNewComment('');
      })
      .catch((err) => console.error('Failed to submit a comment: ', err));
  };

  const handleDeleteComment = (id) => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      return;
    }

    fetch(`https://codevengers-backend.onrender.com/comments/comments/${id}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
       },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== id)
        );
      })
      .catch((err) => console.error('Failed to delete comment: ', err));
  };

  const handleReply = (id, replyText) => {
    fetch(`https://codevengers-backend.onrender.com/comments/comments/${id}/replies`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: replyText,
        parentId: id,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((newReply) => {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === id
              ? { ...comment, replies: [...comment.replies, newReply] }
              : comment
          )
        );
      })
      .catch((err) => console.error('Failed to submit a reply: ', err));
  };

  return (
    <>
      {token && (
        <div className="comments-section">
          <h2>Comments</h2>
          <form onSubmit={handleAddComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <button type="submit">Submit Comment</button>
          </form>
        </div>
      )}

      <div className="comments-list">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onDeleteComment={handleDeleteComment}
            onDeleteReply={onDeleteReply}
          />
        ))}
      </div>
    </>
  );
};

export default CommentsSection;