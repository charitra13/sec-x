"use client";

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';
import { useState } from 'react';
import { BlogGlassCard, BlogTypography } from '@/components/blog';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

const SocialShareButtons = ({ url, title, description }: SocialShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareData = {
    title,
    text: description || title,
    url
  };

  const handleNativeShare = async () => {
    if (navigator.share && (navigator as any).canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Failed to share:', err);
      }
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' &&
    (navigator as any).share &&
    (navigator as any).canShare &&
    (navigator as any).canShare(shareData);

  return (
    <div className="space-y-4">
      {/* Social platforms */}
      <div className="flex flex-wrap items-center gap-3">
        <TwitterShareButton url={url} title={title} className="transition-transform hover:scale-110">
          <TwitterIcon size={40} round />
        </TwitterShareButton>

        <FacebookShareButton url={url} title={title} className="transition-transform hover:scale-110">
          <FacebookIcon size={40} round />
        </FacebookShareButton>

        <LinkedinShareButton url={url} title={title} className="transition-transform hover:scale-110">
          <LinkedinIcon size={40} round />
        </LinkedinShareButton>

        <WhatsappShareButton url={url} title={title} className="transition-transform hover:scale-110">
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>

        <EmailShareButton
          url={url}
          subject={title}
          body={description}
          className="transition-transform hover:scale-110"
        >
          <EmailIcon size={40} round />
        </EmailShareButton>

        {/* Copy link button */}
        <button
          onClick={handleCopyLink}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110"
          aria-label="Copy link"
        >
          {copied ? (
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>

        {/* Native share button (mobile) */}
        {canNativeShare && (
          <button
            onClick={handleNativeShare}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110"
            aria-label="Share via system"
          >
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        )}
      </div>

      {/* Copy feedback */}
      {copied && (
        <BlogTypography variant="caption" className="text-green-400 mb-0">
          Link copied to clipboard!
        </BlogTypography>
      )}
    </div>
  );
};

export default SocialShareButtons; 