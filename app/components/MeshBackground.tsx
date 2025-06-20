'use client';

import React from 'react';

const MeshBackground: React.FC = () => {
  // Define keyframe animations as CSS strings
  const meshAnimations = `
    @keyframes mesh1 {
      0%   { transform: translate(-63%, -57%) rotate(12deg) scale(0.95); }
      18%  { transform: translate(-85%, -78%) rotate(35deg) scale(1.42); }
      41%  { transform: translate(-31%, -44%) rotate(4deg) scale(0.58); }
      67%  { transform: translate(-78%, -89%) rotate(28deg) scale(1.23); }
      89%  { transform: translate(-45%, -62%) rotate(41deg) scale(0.87); }
      100% { transform: translate(-63%, -57%) rotate(12deg) scale(0.95); }
    }
    
    @keyframes mesh2 {
      0%   { transform: translate(-48%, -41%) rotate(-15deg) scale(1.08); }
      22%  { transform: translate(-72%, -23%) rotate(-38deg) scale(1.31); }
      45%  { transform: translate(-29%, -67%) rotate(-7deg) scale(0.64); }
      71%  { transform: translate(-84%, -74%) rotate(-42deg) scale(1.47); }
      93%  { transform: translate(-39%, -56%) rotate(-21deg) scale(0.73); }
      100% { transform: translate(-48%, -41%) rotate(-15deg) scale(1.08); }
    }
    
    @keyframes mesh3 {
      0%   { transform: translate(-44%, -52%) rotate(8deg) scale(1.12); }
      28%  { transform: translate(-76%, -37%) rotate(33deg) scale(0.72); }
      54%  { transform: translate(-18%, -71%) rotate(19deg) scale(1.38); }
      79%  { transform: translate(-67%, -28%) rotate(47deg) scale(0.91); }
      100% { transform: translate(-44%, -52%) rotate(8deg) scale(1.12); }
    }
    
    @keyframes mesh4 {
      0%   { transform: translate(-51%, -59%) rotate(-18deg) scale(0.88); }
      31%  { transform: translate(-27%, -83%) rotate(-45deg) scale(1.29); }
      58%  { transform: translate(-79%, -34%) rotate(-9deg) scale(0.67); }
      83%  { transform: translate(-42%, -76%) rotate(-32deg) scale(1.41); }
      100% { transform: translate(-51%, -59%) rotate(-18deg) scale(0.88); }
    }
    
    .mesh-blob-1 { 
      animation: mesh1 5.3s cubic-bezier(0.4, 0.0, 0.6, 1.0) infinite alternate;
      animation-delay: 0s;
    }
    .mesh-blob-2 { 
      animation: mesh2 6.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite alternate;
      animation-delay: 0.8s;
    }
    .mesh-blob-3 { 
      animation: mesh3 7.1s cubic-bezier(0.17, 0.67, 0.83, 0.67) infinite alternate;
      animation-delay: 1.6s;
    }
    .mesh-blob-4 { 
      animation: mesh4 6.4s cubic-bezier(0.55, 0.06, 0.68, 0.19) infinite alternate;
      animation-delay: 2.3s;
    }
    
    @media (max-width: 767px) {
      .mesh-blob-1, .mesh-blob-2, .mesh-blob-3, .mesh-blob-4 {
        transform-origin: center;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: meshAnimations }} />
      
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-950 to-neutral-900" />
        
        {/* Mesh container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full bg-neutral-900/20 overflow-hidden">
            {/* Animated Mesh gradient blobs - Enhanced size for immersive experience */}
            <div 
              className="absolute top-1/2 left-1/2 w-[34vmin] h-[31vmin] rounded-full pointer-events-none mesh-blob-1"
              style={{
                background: 'linear-gradient(97deg, #2563eb 80%, transparent 100%)',
                filter: 'blur(3vmin)',
                opacity: 0.55
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 w-[28vmin] h-[35vmin] rounded-full pointer-events-none mesh-blob-2"
              style={{
                background: 'linear-gradient(120deg, #6366f1 95%, transparent 100%)',
                filter: 'blur(2vmin)',
                opacity: 0.55
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 w-[27vmin] h-[25vmin] rounded-full bg-white mix-blend-overlay pointer-events-none mesh-blob-3"
              style={{
                filter: 'blur(2vmin)',
                opacity: 0.12
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 w-[25vmin] h-[25vmin] rounded-full pointer-events-none mesh-blob-4"
              style={{
                background: 'linear-gradient(105deg, #fb923c 85%, transparent 100%)',
                filter: 'blur(1.5vmin)',
                opacity: 0.55
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MeshBackground; 