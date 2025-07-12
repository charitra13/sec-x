import React from 'react';

export const formatBlogContent = (content: string) => {
  // Split content into sections by double line breaks
  const sections = content.split(/\n\s*\n/).filter(section => section.trim());
  
  return sections.map((section, index) => {
    const trimmedSection = section.trim();
    if (!trimmedSection) return null;
    
    // Handle headings
    if (trimmedSection.startsWith('###')) {
      return (
        <h4 key={index} className="text-lg text-white mb-2 font-medium">
          {trimmedSection.replace(/^###\s*/, '')}
        </h4>
      );
    } else if (trimmedSection.startsWith('##')) {
      return (
        <h3 key={index} className="text-xl text-white mb-3 font-medium">
          {trimmedSection.replace(/^##\s*/, '')}
        </h3>
      );
    } else if (trimmedSection.startsWith('#')) {
      return (
        <h2 key={index} className="text-2xl text-white mb-4 font-medium">
          {trimmedSection.replace(/^#\s*/, '')}
        </h2>
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
        <ul key={index} className="space-y-3 ml-4">
          {bulletLines.map((bullet, bulletIndex) => (
            <li key={bulletIndex} className="flex items-start text-white/80 leading-relaxed">
              <svg className="w-2 h-2 rounded-full bg-white/40 mt-2 mr-3 flex-shrink-0" />
              {bullet.replace(/^[•*-]\s*/, '').replace(/^\d+\.\s*/, '')}
            </li>
          ))}
        </ul>
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
        <pre key={index} className="bg-black/60 text-white/90 p-4 rounded-lg overflow-x-auto">
          <code className="text-sm font-mono">
            {codeContent}
          </code>
        </pre>
      );
    }
    
    // Handle quotes
    if (trimmedSection.startsWith('>')) {
      const quoteContent = trimmedSection.replace(/^>\s*/, '');
      return (
        <blockquote key={index} className="border-l-4 border-white/20 pl-6 py-2 bg-white/5 rounded-r-lg">
          <p className="text-white/80 italic leading-relaxed text-lg">
            {quoteContent}
          </p>
        </blockquote>
      );
    }
    
    // Regular paragraph
    return (
      <p key={index} className="text-white/80 leading-relaxed text-lg">
        {trimmedSection}
      </p>
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