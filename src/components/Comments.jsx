import React, { useState } from 'react';

const Comment = ({ comment, onReply, onDeleteComment, onDeleteReply, username }) => {
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const token = localStorage.getItem('token');

  const handleReplySubmit = (e) => {
    e.preventDefault();

    if (!replyText.trim()) {
      console.error("Reply text cannot be empty");
      return;
    }

    console.log("Submitting reply with username:", username);
    onReply(comment.id, replyText.trim()); // Pass replyText as a string
    setReplyText("");
    setShowReplyForm(false);
  };

  const handleDeleteComment = () => {
    onDeleteComment(comment.id);
  };

  const handleDeleteReply = (replyId) => {
    onDeleteReply(replyId, comment.id); // Pass the parent comment ID
  };

  return (
    <div className="comment" id={`comment-${comment.id}`}>
      <p>
        <strong>{comment.user?.username || 'Anonymous'}</strong>: {comment.text}
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
            <div key={reply.id} className="reply" id={`reply-${reply.id}`}>
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