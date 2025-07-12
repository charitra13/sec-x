import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
      <p className="text-lg mb-8">You do not have permission to view this page.</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go back to the homepage
      </Link>
    </div>
  );
} 