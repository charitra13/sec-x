import React from 'react';
import { BlogTypography } from './BlogTypography';

interface ContentFormatterProps {
  content: string;
}

export const ContentFormatter = ({ content }: ContentFormatterProps) => {
  const sections = content.split(/\n\s*\n/).filter(section => section.trim());

  return (
    <div className="blog-content space-y-6">
      {sections.map((section, index) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('###')) {
          return (
            <BlogTypography key={index} variant="h4">
              {trimmed.replace(/^###\s*/, '')}
            </BlogTypography>
          );
        }
        if (trimmed.startsWith('##')) {
          return (
            <BlogTypography key={index} variant="h3">
              {trimmed.replace(/^##\s*/, '')}
            </BlogTypography>
          );
        }
        if (trimmed.startsWith('#')) {
          return (
            <BlogTypography key={index} variant="h2">
              {trimmed.replace(/^#\s*/, '')}
            </BlogTypography>
          );
        }

        return (
          <BlogTypography key={index} variant="body">
            {trimmed}
          </BlogTypography>
        );
      })}
    </div>
  );
};

