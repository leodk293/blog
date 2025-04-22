"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Popup({
  userId,
  commentId,
  postId,
  content,
  buttonText,
  onUpdate,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedComment, setEditedComment] = useState(content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const openPopup = () => setIsOpen(true);
  const closePopup = () => {
    setIsOpen(false);
  };

  const handleCommentEditing = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/comments?postId=${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          commentId: commentId,
          content: editedComment,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      onUpdate(editedComment);
      //const data = await response.json();

      //router.refresh();
      closePopup();
    } catch (error) {
      console.error("Failed to update comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={openPopup}
        className="w-[65px] cursor-pointer border border-transparent bg-green-900 text-white px-2 py-1 rounded-full"
      >
        {buttonText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000055]">
          <div className="absolute inset-0" onClick={closePopup}></div>
          <form
            onSubmit={handleCommentEditing}
            className="relative w-full max-w-md p-6 mx-4 bg-white flex flex-col gap-3 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={editedComment}
              placeholder="Edit your comment..."
              onChange={(e) => setEditedComment(e.target.value)}
              className="w-full p-2 border-b border-b-gray-900 outline-none"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closePopup}
                className="px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 cursor-pointer text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSubmitting ? "Updating..." : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
