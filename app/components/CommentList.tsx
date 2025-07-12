"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { IComment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

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

  if (loading) return <p>Loading comments...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{comments.length} Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar>
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{comment.author.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                  {user?._id === comment.author._id && (
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(comment._id)}>Delete</Button>
                  )}
                </div>
                <p className="mt-2">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Be the first to leave a comment!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentList; 