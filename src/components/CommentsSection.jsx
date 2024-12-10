// This file handles fetching, displaying, and managing the list of comments for a movie. 

import React, { useEffect, useState } from "react";
import Comment from "./Comments";

const CommentsSection = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
   const token = localStorage.getItem('token');


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
      headers: { 'Content-Type': 'application/json' },
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

  const handleReply = (commentId, replyText) => {
    fetch(`https://codevengers-backend.onrender.com/comments/movies/${movieId}/comments/${commentId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: replyText }),
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
            comment.id === commentId
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
              <Comment key={comment.id} comment={comment} onReply={handleReply} />
            ))}
          </div>
        </>
    );
};

export default CommentsSection;