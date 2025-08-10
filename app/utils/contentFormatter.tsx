import React from 'react';
import { BlogTypography } from '@/components/blog';

// Function to detect if content is HTML
const isHTMLContent = (content: string): boolean => {
  return /<[^>]+>/.test(content);
};

// Function to sanitize and style HTML content
const sanitizeAndStyleHTML = (html: string): string => {
  return html
    // Add classes to HTML elements for styling
    .replace(/<p>/g, '<p class="text-white/80 leading-relaxed text-lg mb-4">')
    .replace(/<h1>/g, '<h1 class="text-3xl font-bold text-white mb-6">')
    .replace(/<h2>/g, '<h2 class="text-2xl font-bold text-white mb-5">')
    .replace(/<h3>/g, '<h3 class="text-xl font-bold text-white mb-4">')
    .replace(/<h4>/g, '<h4 class="text-lg font-bold text-white mb-3">')
    .replace(/<h5>/g, '<h5 class="text-base font-bold text-white mb-2">')
    .replace(/<h6>/g, '<h6 class="text-sm font-bold text-white mb-2">')
    .replace(/<strong>/g, '<strong class="text-white font-semibold">')
    .replace(/<em>/g, '<em class="text-blue-300 italic">')
    .replace(/<ul>/g, '<ul class="space-y-2 mb-4">')
    .replace(/<ol>/g, '<ol class="space-y-2 mb-4 list-decimal list-inside">')
    .replace(/<li>/g, '<li class="text-white/80 leading-relaxed flex items-start"><span class="w-2 h-2 rounded-full bg-blue-400 mt-2 mr-3 flex-shrink-0"></span><span>')
    .replace(/<\/li>/g, '</span></li>')
    .replace(/<blockquote>/g, '<blockquote class="bg-blue-500/10 border-l-4 border-blue-400 rounded-r-lg p-4 mb-4 italic text-white/80">')
    .replace(/<a /g, '<a class="text-blue-400 hover:text-blue-300 underline transition-colors" ')
    .replace(/<code>/g, '<code class="bg-black/40 text-blue-300 px-2 py-1 rounded text-sm font-mono">')
    .replace(/<pre>/g, '<pre class="bg-black/60 rounded-lg p-4 overflow-x-auto mb-4">')
    .replace(/<pre([^>]*)><code>/g, '<pre$1><code class="text-sm font-mono text-white/90">')
    // Handle line breaks
    .replace(/<br\s*\/?>/g, '<br />')
    // Clean up empty paragraphs
    .replace(/<p[^>]*>[\s]*<\/p>/g, '<div class="mb-2"></div>');
};

export const formatBlogContent = (content: string) => {
  // Check if content is HTML from rich text editor
  if (isHTMLContent(content)) {
    const styledHTML = sanitizeAndStyleHTML(content);
    return (
      <div 
        className="blog-content prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: styledHTML }}
      />
    );
  }

  // Handle markdown-style content (existing logic)
  const sections = content.split(/\n\s*\n/).filter(section => section.trim());
  
  return sections.map((section, index) => {
    const trimmedSection = section.trim();
    if (!trimmedSection) return null;
    
    // Handle headings
    if (trimmedSection.startsWith('###')) {
      return (
        <BlogTypography key={index} variant="h4">
          {trimmedSection.replace(/^###\s*/, '')}
        </BlogTypography>
      );
    } else if (trimmedSection.startsWith('##')) {
      return (
        <BlogTypography key={index} variant="h3">
          {trimmedSection.replace(/^##\s*/, '')}
        </BlogTypography>
      );
    } else if (trimmedSection.startsWith('#')) {
      return (
        <BlogTypography key={index} variant="h2">
          {trimmedSection.replace(/^#\s*/, '')}
        </BlogTypography>
      );
    }
    
    // Handle bullet points
    const lines = trimmedSection.split('\n');
    const bulletLines = lines.filter(line => 
      line.trim().startsWith('•') || 
      line.trim().startsWith('*') || 
      line.trim().startsWith('-') ||
      /^\d+\./.test(line.trim())
    );
    
    if (bulletLines.length > 0 && bulletLines.length === lines.length) {
      // All lines are bullet points
      return (
        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
          <ul className="space-y-3">
            {bulletLines.map((bullet, bulletIndex) => (
              <li key={bulletIndex} className="flex items-start text-white/85 leading-relaxed">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 mr-3 flex-shrink-0" />
                <span>{bullet.replace(/^[•*-]\s*/, '').replace(/^\d+\.\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    
    // Handle mixed content (some bullets, some regular text)
    if (bulletLines.length > 0) {
      return (
        <div key={index} className="space-y-3">
          {lines.map((line, lineIndex) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;
            
            if (trimmedLine.startsWith('•') || trimmedLine.startsWith('*') || trimmedLine.startsWith('-') || /^\d+\./.test(trimmedLine)) {
              return (
                <div key={lineIndex} className="flex items-start text-white/80 leading-relaxed ml-4">
                  <svg className="w-2 h-2 rounded-full bg-white/40 mt-2 mr-3 flex-shrink-0" />
                  {trimmedLine.replace(/^[•*-]\s*/, '').replace(/^\d+\.\s*/, '')}
                </div>
              );
            } else {
              return (
                <p key={lineIndex} className="text-white/80 leading-relaxed text-lg">
                  {trimmedLine}
                </p>
              );
            }
          })}
        </div>
      );
    }
    
    // Handle code blocks
    if (trimmedSection.startsWith('```')) {
      const codeContent = trimmedSection.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
      return (
        <div key={index} className="bg-black/60 rounded-lg border border-white/20 overflow-hidden">
          <div className="bg-white/5 px-4 py-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/50"></div>
              <span className="text-white/60 text-xs font-mono ml-auto">CODE</span>
            </div>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm font-mono text-white/90">
              {codeContent}
            </code>
          </pre>
        </div>
      );
    }
    
    // Handle quotes
    if (trimmedSection.startsWith('>')) {
      const quoteContent = trimmedSection.replace(/^>\s*/, '');
      return (
        <div key={index} className="bg-blue-500/10 border-l-4 border-blue-400 rounded-r-lg p-4">
          <svg className="w-6 h-6 text-blue-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 1.414L9.414 5H11a3 3 0 013 3v4a3 3 0 01-3 3H8a3 3 0 01-3-3V8a3 3 0 013-3h1.586l-1.293-1.293z" clipRule="evenodd" />
          </svg>
          <BlogTypography variant="body" className="italic mb-0">
            {quoteContent}
          </BlogTypography>
        </div>
      );
    }
    
    // Regular paragraph
    return (
      <BlogTypography key={index} variant="body">
        {trimmedSection}
      </BlogTypography>
    );
  });
};

export const formatExcerpt = (content: string, maxLength: number = 150) => {
  // Remove any markdown formatting for clean excerpt
  const cleanContent = content
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/[*_`]/g, '') // Remove formatting
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  return cleanContent.substring(0, maxLength).trim() + '...';
}; 