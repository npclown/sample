const CommentReplyButton = ({ handleReplyClick }: { handleReplyClick: Function }) => {
  return (
    <button
      type="button"
      onClick={() => handleReplyClick()}
      className="flex select-none items-center gap-1 rounded-md bg-transparent px-2 py-1 text-xs text-gray-600 transition hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600 xl:text-sm"
    >
      <span>답글쓰기</span>
    </button>
  );
};

export default CommentReplyButton;
