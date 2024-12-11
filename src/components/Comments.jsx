import React, { useState, useEffect } from 'react';

const Comment = ({ comment, onReply, onDeleteComment, onDeleteReply }) => {
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [user, setUser] = useState(comment.user);
  
  const token = localStorage.getItem('token');

  const handleReplySubmit = (e) => {
    e.preventDefault();
    onReply(comment.id, replyText);
    setReplyText('');
    setShowReplyForm(false);
  };

  const handleDeleteComment = () => {
    onDeleteComment(comment.id);
  };

  const handleDeleteReply = (replyId) => {
    onDeleteReply(replyId);
  };

  return (
    <div className="comment">
      <p>
        <strong>{user?.username || 'Anonymous'}</strong>: {comment.text}
      </p>
      {token && (
        <>
          <button onClick={() => setShowReplyForm(!showReplyForm)}>
            {showReplyForm ? 'Cancel' : 'Reply'}
          </button>

          {showReplyForm && (
            <form onSubmit={handleReplySubmit}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
              ></textarea>
              <button type="submit">Submit Reply</button>
            </form>
          )}

          <button onClick={handleDeleteComment}>Delete Comment</button>
        </>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="reply">
              <p>
                <strong>{reply.user?.username || 'Anonymous'}</strong>: {reply.text}
              </p>

              {token && (
                <>
                  <button onClick={() => handleDeleteReply(reply.id)}>Delete Reply</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;