// This file handles fetching, displaying, and managing the list of comments for a movie. 

import { useEffect, useState } from "react";

const CommentsSection = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch comments from the API
    fetch(`/api/movies/${movieId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error(err));
  }, [movieId]);

  const handleAddComment = (e) => {
    e.preventDefault();

    // API call to add comment
    fetch(`/api/movies/${movieId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newComment }),
    })
      .then((res) => res.json())
      .then((newComment) => {
        setComments([...comments, newComment]);
        setNewComment('');
      })
      .catch((err) => console.error(err));
  };

  const handleReply = (commentId, replyText) => {
    // API call to add reply
    fetch(`/api/movies/${movieId}/comments/${commentId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: replyText }),
    })
      .then((res) => res.json())
      .then((newReply) => {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? { ...comment, replies: [...comment.replies, newReply] }
              : comment
          )
        );
      })
      .catch((err) => console.error(err));
  };
  
  
  return (
    <div className="comments-section">
      <h2>Comments</h2>
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          ></textarea>
        <button type="submit">Submit Comment</button>
      </form>

    <div className="comments-list">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} onReply={handleReply} />
      ))}
    </div>
  </div>
  );
};

export default CommentsSection; 