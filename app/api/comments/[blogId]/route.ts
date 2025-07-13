import { NextResponse } from 'next/server';
import { IComment } from '@/types';

// Mock comments data
const mockComments: Record<string, IComment[]> = {
  '1': [
    {
      _id: 'comment1',
      text: 'Great article! The LOTL techniques are particularly interesting and relevant to current threat landscapes.',
      author: {
        _id: 'user1',
        name: 'John Smith',
        email: 'john@example.com',
        role: 'reader' as const,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        newsletter: false,
        isEmailVerified: true,
        isActive: true
      },
      blog: '1',
      createdAt: '2024-01-16T10:30:00Z'
    },
    {
      _id: 'comment2',
      text: 'Thanks for sharing this comprehensive overview. The cloud-specific attack vectors section was particularly enlightening.',
      author: {
        _id: 'user2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'reader' as const,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6e6b3a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        newsletter: true,
        isEmailVerified: true,
        isActive: true
      },
      blog: '1',
      createdAt: '2024-01-16T14:45:00Z'
    }
  ],
  '2': [
    {
      _id: 'comment3',
      text: 'Excellent breakdown of adversarial attacks. The defense strategies section provides practical guidance for implementation.',
      author: {
        _id: 'user3',
        name: 'Mike Chen',
        email: 'mike@example.com',
        role: 'reader' as const,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        newsletter: true,
        isEmailVerified: true,
        isActive: true
      },
      blog: '2',
      createdAt: '2024-01-11T09:15:00Z'
    }
  ]
};

export async function GET(
  request: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const { blogId } = params;
    
    // Get comments for the specific blog post
    const comments = mockComments[blogId] || [];
    
    // Simulate API response structure that the frontend expects
    const response = {
      success: true,
      data: {
        comments: comments
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const { blogId } = params;
    const body = await request.json();
    
    // Create a new comment
    const newComment: IComment = {
      _id: `comment_${Date.now()}`,
      text: body.text,
      author: {
        _id: 'guest_user',
        name: body.name || 'Anonymous',
        email: body.email || 'anonymous@example.com',
        role: 'reader' as const,
        newsletter: false,
        isEmailVerified: false,
        isActive: true
      },
      blog: blogId,
      createdAt: new Date().toISOString()
    };
    
    // Add to mock comments (in a real app, this would go to a database)
    if (!mockComments[blogId]) {
      mockComments[blogId] = [];
    }
    mockComments[blogId].push(newComment);
    
    // Simulate API response structure that the frontend expects
    const response = {
      success: true,
      data: {
        comment: newComment
      },
      message: 'Comment posted successfully'
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to post comment' },
      { status: 500 }
    );
  }
} 