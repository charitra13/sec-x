"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BlogGlassCard, BlogTypography } from '@/components/blog';

interface CommentFormProps {
  blogId: string;
  onCommentPosted: () => void;
}

const CommentForm = ({ blogId, onCommentPosted }: CommentFormProps) => {
  const { user, isAuthenticated } = useAuth();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await api.post(`/blogs/${blogId}/comments`, { text });
      setText('');
      onCommentPosted();
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <BlogGlassCard variant="default" className="rounded-xl p-6 text-center">
        <svg className="w-12 h-12 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <BlogTypography variant="body" className="mb-4">
          Join the conversation! Sign in to share your thoughts.
        </BlogTypography>
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Sign In to Comment
          </Button>
        </Link>
      </BlogGlassCard>
    );
  }

  return (
    <BlogGlassCard variant="default" className="rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <BlogTypography variant="caption" className="font-medium mb-0">
            {user.name}
          </BlogTypography>
          <BlogTypography variant="meta" className="mb-0">
            Share your thoughts
          </BlogTypography>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            placeholder="Write your comment here... Share your insights, ask questions, or start a discussion!"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors resize-none"
          />
          {error && (
            <BlogTypography variant="caption" className="text-red-400 mt-2 mb-0">
              {error}
            </BlogTypography>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <BlogTypography variant="meta" className="mb-0">
            {text.length}/500 characters
          </BlogTypography>
          <Button 
            type="submit" 
            disabled={loading || !text.trim() || text.length > 500}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Posting...
              </div>
            ) : (
              'Post Comment'
            )}
          </Button>
        </div>
      </form>
    </BlogGlassCard>
  );
};

export default CommentForm;