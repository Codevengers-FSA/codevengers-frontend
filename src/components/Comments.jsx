import React, { useState } from 'react';

const Comment = ({ comment, onReply, onDeleteComment, onDeleteReply, username, onUpdateComment }) => {
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [ isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText]= useState(comment.text);
  //const [ comment, setComment] = useState();
  const token = localStorage.getItem('token');

  const handleEditCLick = () => {
    setIsEditing(true)
  };

  const handleSaveClick = () => {
    const userId = localStorage.getItem('userId')
    if( editedText.trim() === "") {
      console.error("Comment text cannot be empty");
      return;
    }
    onUpdateComment( comment.id, editedText.trim());
    setIsEditing(false)
  }

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
          <strong>{username || 'Anonymous'}</strong>:{" "}
      { isEditing ? (
        <input 
        type='text'
        value={editedText}
        onChange={(e)=>setEditedText(e.target.value)}
        />
      ) : (
        comment.text
      )}
        </p>

      {token && (
        <>
        { isEditing ?(
          <button onClick={handleSaveClick}>Save</button>
        ) : (
          <>
          <button onClick={handleEditCLick}>Edit</button>
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