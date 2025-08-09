"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { IComment } from '@/types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { BlogGlassCard, BlogTypography } from '@/components/blog';

interface CommentListProps {
  blogId: string;
  refreshKey: number;
}

const CommentList = ({ blogId, refreshKey }: CommentListProps) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/blogs/${blogId}/comments`);
        const list = Array.isArray(data?.data) ? data.data : [];
        setComments(list as IComment[]);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [blogId, refreshKey]);

  const handleDelete = async (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.delete(`/comments/${commentId}`);
        setComments(comments.filter(c => c._id !== commentId));
      } catch (error) {
        alert('Failed to delete comment.');
      }
    }
  }

  if (loading) {
    return (
      <BlogGlassCard variant="default" className="rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <BlogTypography variant="body" className="ml-3 mb-0">
            Loading comments...
          </BlogTypography>
        </div>
      </BlogGlassCard>
    );
  }

  return (
    <BlogGlassCard variant="default" className="rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <BlogTypography variant="h3" className="mb-0">
          {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </BlogTypography>
      </div>

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
              {comment.author.avatar ? (
                <img 
                  src={comment.author.avatar} 
                  alt={comment.author.name} 
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-white">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <BlogTypography variant="caption" className="font-medium mb-0">
                      {comment.author.name}
                    </BlogTypography>
                    <BlogTypography variant="meta" className="mb-0">
                      {new Date(comment.createdAt!).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </BlogTypography>
                  </div>
                  {user?._id === comment.author._id && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(comment._id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </Button>
                  )}
                </div>
                <BlogTypography variant="body" className="mb-0 leading-relaxed">
                  {comment.text}
                </BlogTypography>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <BlogTypography variant="body" className="text-white/60 mb-0">
              No comments yet. Be the first to share your thoughts!
            </BlogTypography>
          </div>
        )}
      </div>
    </BlogGlassCard>
  );
};

export default CommentList; 