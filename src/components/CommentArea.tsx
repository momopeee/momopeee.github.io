
import React, { useEffect, useRef } from 'react';
import { Comment } from '@/context/AppContext';

interface CommentAreaProps {
  comments: Comment[];
}

const CommentArea: React.FC<CommentAreaProps> = ({ comments }) => {
  const commentAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new comments
  useEffect(() => {
    if (commentAreaRef.current) {
      commentAreaRef.current.scrollTop = commentAreaRef.current.scrollHeight;
    }
  }, [comments]);

  return (
    <div 
      ref={commentAreaRef}
      className="rounded-md p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent h-full"
    >
      <div className="flex flex-col gap-2">
        {comments.map((comment, index) => (
          <div key={index} className={`flex items-start gap-2 ${comment.isSystem ? 'text-yellow-300' : 'text-white'}`}>
            {!comment.isSystem && (
              <>
                <img 
                  src={comment.author === "とおる＠経営参謀" ? "/lovable-uploads/c1b2b6d0-3acd-4ea0-b336-0631411ff128.png" : 
                       comment.author === "そーそー＠狂犬ツイート" ? "/lovable-uploads/b62bfeb2-59a1-4f1b-976a-d026638e0416.png" : 
                       "/lovable-uploads/656bd67f-53fe-4f15-86f3-0db149cc7285.png"}
                  alt={comment.author}
                  className="w-8 h-8 rounded-full mt-1"
                />
                <div className="flex-1">
                  <span className="font-bold">{comment.author}</span>
                  <div className="bg-black/75 p-2 rounded-md mt-1 mb-1">{comment.text}</div>
                </div>
              </>
            )}
            {comment.isSystem && (
              <span className="bg-black/75 w-full p-2 rounded">{comment.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentArea;
