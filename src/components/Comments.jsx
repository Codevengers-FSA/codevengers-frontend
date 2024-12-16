import React, { useState } from 'react';

const Comment = ({ comment, onReply, onDeleteComment, onDeleteReply, onUpdateComment }) => {
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (editedText.trim() === "") {
      console.error("Comment text cannot be empty");
      return;
    }
    onUpdateComment(comment.id, editedText.trim());
    setIsEditing(false);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      console.error("Reply text cannot be empty");
      return;
    }
    onReply(comment.id, replyText.trim());
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
    <div className="comment-container" id={`comment-${comment.id}`}>
      <p className="comment-text">
        <strong className="comment-author">{comment.user?.username || "Anonymous"}</strong>:{" "}
        {isEditing ? (
          <input
            className="edit-input"
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        ) : (
          comment.text
        )}
      </p>

      <div className="comment-actions">
        {isEditing ? (
          <button className="btn-save" onClick={handleSaveClick}>
            Save
          </button>
        ) : (
          <>
            <button className="btn-edit" onClick={handleEditClick}>
              Edit
            </button>
            <button
              className="btn-reply"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              {showReplyForm ? "Cancel" : "Reply"}
            </button>

            {showReplyForm && (
              <form className="reply-form" onSubmit={handleReplySubmit}>
                <textarea
                  className="reply-textarea"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                ></textarea>
                <button className="btn-submit-reply" type="submit">
                  Submit Reply
                </button>
              </form>
            )}

            <button className="btn-delete" onClick={handleDeleteComment}>
              Delete Comment
            </button>
          </>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-container">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="reply" id={`reply-${reply.id}`}>
              <p className="reply-text">
                <strong className="reply-author">
                  {reply.user?.username || "Anonymous"}
                </strong>
                : {reply.text}
              </p>
              <button
                className="btn-delete-reply"
                onClick={() => handleDeleteReply(reply.id)}
              >
                Delete Reply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;