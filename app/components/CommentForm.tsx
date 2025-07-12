"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

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
      <div className="text-center">
        <p className="mb-2">You must be logged in to comment.</p>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Comment</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Input
            placeholder="Write your comment here..."
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
            disabled={loading}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post Comment'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CommentForm; 