'use client';

import React from 'react';

const MeshBackground: React.FC = () => {
  return (
    <>
      <style jsx>{`
        @keyframes mesh1 {
          0%   { transform: translate(-20%, -30%) rotate(12deg) scale(1); }
          14%  { transform: translate(-70%, -40%) rotate(20deg) scale(1.2); }
          33%  { transform: translate(30%, -50%) rotate(15deg) scale(0.9); }
          51%  { transform: translate(-40%, 10%) rotate(28deg) scale(1.4); }
          72%  { transform: translate(60%, -70%) rotate(10deg) scale(0.8); }
          100% { transform: translate(-20%, -30%) rotate(12deg) scale(1); }
        }

        @keyframes mesh2 {
          0%   { transform: translate(25%, -40%) rotate(-15deg) scale(1); }
          18%  { transform: translate(75%, -65%) rotate(-30deg) scale(1.3); }
          39%  { transform: translate(-10%, -20%) rotate(-10deg) scale(0.7); }
          60%  { transform: translate(50%, 30%) rotate(-24deg) scale(1.2); }
          85%  { transform: translate(-60%, -50%) rotate(-5deg) scale(1); }
          100% { transform: translate(25%, -40%) rotate(-15deg) scale(1); }
        }

        @keyframes mesh3 {
          0%   { transform: translate(-40%, 30%) scale(1); }
          15%  { transform: translate(-85%, -20%) scale(1.25); }
          38%  { transform: translate(60%, 50%) scale(0.6); }
          55%  { transform: translate(-20%, 70%) scale(1.5); }
          78%  { transform: translate(40%, -40%) scale(0.8); }
          100% { transform: translate(-40%, 30%) scale(1); }
        }

        @keyframes mesh4 {
          0%   { transform: translate(35%, 20%) rotate(5deg) scale(1); }
          20%  { transform: translate(95%, -60%) rotate(18deg) scale(1.3); }
          43%  { transform: translate(-50%, 60%) rotate(-12deg) scale(0.6); }
          66%  { transform: translate(80%, 30%) rotate(25deg) scale(1.1); }
          90%  { transform: translate(-30%, -30%) rotate(8deg) scale(0.9); }
          100% { transform: translate(35%, 20%) rotate(5deg) scale(1); }
        }
        
        .mesh1 {
          animation: mesh1 7.4s cubic-bezier(0.4, 0.1, 0.6, 0.9) infinite alternate;
          animation-delay: 0s;
        }
        .mesh2 {
          animation: mesh2 9.1s cubic-bezier(0.3, 0.2, 0.7, 0.8) infinite alternate;
          animation-delay: 1.1s;
        }
        .mesh3 {
          animation: mesh3 6.3s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite alternate;
          animation-delay: 2.3s;
        }
        .mesh4 {
          animation: mesh4 10.2s cubic-bezier(0.2, 0.3, 0.8, 0.7) infinite alternate;
          animation-delay: 0.8s;
        }
        
        @media (max-width: 767px) {
          .mesh1, .mesh2, .mesh3, .mesh4 {
            width: 22vmin;
            height: 22vmin;
            transform-origin: center center;
            opacity: 0.35;
            filter: blur(2.5vmin);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .mesh1, .mesh2, .mesh3, .mesh4 {
            animation: none !important;
          }
        }
      `}</style>
      
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-950 to-neutral-900" />
        
        {/* Mesh container */}
        <div className="absolute inset-0 w-full h-full">
          {/* Mesh1: Starts from top-left quadrant */}
          <div 
            className="absolute top-1/4 left-1/4 w-[34vmin] h-[31vmin] rounded-full pointer-events-none mesh1"
            style={{
              background: 'linear-gradient(97deg, #2563eb 80%, transparent 100%)',
              filter: 'blur(3vmin)',
              opacity: 0.45
            }}
          />
          
          {/* Mesh2: Starts from top-right quadrant */}
          <div 
            className="absolute top-1/4 right-1/4 w-[28vmin] h-[35vmin] rounded-full pointer-events-none mesh2"
            style={{
              background: 'linear-gradient(120deg, #6366f1 95%, transparent 100%)',
              filter: 'blur(2vmin)',
              opacity: 0.45
            }}
          />
          
          {/* Mesh3: Starts from bottom-left quadrant */}
          <div 
            className="absolute bottom-1/4 left-1/4 w-[27vmin] h-[25vmin] rounded-full bg-white mix-blend-overlay pointer-events-none mesh3"
            style={{
              filter: 'blur(2vmin)',
              opacity: 0.10
            }}
          />
          
          {/* Mesh4: Starts from bottom-right quadrant */}
          <div 
            className="absolute bottom-1/4 right-1/4 w-[25vmin] h-[25vmin] rounded-full pointer-events-none mesh4"
            style={{
              background: 'linear-gradient(105deg, #fb923c 85%, transparent 100%)',
              filter: 'blur(1.5vmin)',
              opacity: 0.45
            }}
          />
        </div>
      </div>
    </>
  );
};

export default MeshBackground; 