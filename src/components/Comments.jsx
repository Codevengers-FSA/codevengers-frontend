// This file handles individual comments from users.

import React, { useState } from 'react'; 

const Comment = ({ comment, onReply }) => {
  const [replyText, setReplyText] = useState(''); 
  const [showReplyForm, setShowReplyForm] = useState(false);

  const token = localStorage.getItem('token');

  const handleReplySubmit = (e) => {
    e.preventDefault();
    onReply(comment.id, replyText);
    setReplyText('');
    setShowReplyForm(false);
  };

  return (
    <div className="comment">
      <p><strong>{comment.user}</strong>: {comment.text}</p>
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
              placeholder='Write a reply...'
            ></textarea>
            <button type="submit">Submit Reply</button>
          </form>
        )}
        </>
      )
    }
    {comment.replies && (
      <div className="replies">
        {comment.replies.map((reply) => (
          <Comment key={reply.id} comment={reply} onReply={onReply} />
        ))}
      </div>
    )}
    </div>

  );
};

export default Comment;