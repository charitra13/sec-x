import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function handler(req: NextRequest) {
  const { pathname, search } = new URL(req.url);
  const path = pathname.replace(/^\/api/, '');
  const destination = `${backendUrl}${path}${search}`;

  const headers = new Headers(req.headers);
  headers.delete('host');

  try {
    const response = await fetch(destination, {
      method: req.method,
      headers: headers,
      body: req.body,
      // @ts-ignore
      duplex: 'half',
      redirect: 'manual',
    });

    return response;
  } catch (error) {
    console.error('Proxy failed:', error);
    return new Response('Proxy failed', { status: 500 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH, handler as HEAD, handler as OPTIONS }; 