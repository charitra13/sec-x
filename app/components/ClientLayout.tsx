'use client';

import { useEffect, useLayoutEffect } from 'react';

// Create a safe version of useLayoutEffect that falls back to useEffect on the server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useIsomorphicLayoutEffect(() => {
    const removeVSCodeClasses = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const element = mutation.target as HTMLElement;
            if (element.className.includes('vsc-')) {
              const classNames = element.className.split(' ').filter(className => 
                !className.includes('vsc-') && 
                !className.includes('initialized') && 
                className !== ''
              );
              element.className = classNames.join(' ');
            }
          }
        });
      });

      // Start observing the document with the configured parameters
      observer.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['class']
      });

      // Initial cleanup
      document.querySelectorAll('*').forEach(element => {
        if (element instanceof HTMLElement && element.className) {
          const classNames = element.className.split(' ').filter(className => 
            !className.includes('vsc-') && 
            !className.includes('initialized') && 
            className !== ''
          );
          element.className = classNames.join(' ');
        }
      });

      return () => observer.disconnect();
    };

    return removeVSCodeClasses();
  }, []);

  useEffect(() => {
    // Aurora Comet Background Animation
    let scene: any, camera: any, renderer: any, particles: any;
    
    function initAurora() {
      if (typeof window === 'undefined' || !(window as any).THREE) {
        // Wait for Three.js to load
        setTimeout(initAurora, 100);
        return;
      }

      const THREE = (window as any).THREE;
      const canvas = document.getElementById('aurora-canvas') as HTMLCanvasElement;
      if (!canvas) return;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true 
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      
      // Create aurora particles
      const particleCount = 800;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      const auroraColors = [
        new THREE.Color(1, 1, 1),
        new THREE.Color(0.8, 0.9, 1),
        new THREE.Color(0.9, 0.8, 1),
        new THREE.Color(1, 0.9, 0.8),
        new THREE.Color(0.8, 1, 0.9)
      ];
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        positions[i3] = (Math.random() - 0.5) * 2000;
        positions[i3 + 1] = (Math.random() - 0.5) * 1000;
        positions[i3 + 2] = (Math.random() - 0.5) * 1000;
        
        const color = auroraColors[Math.floor(Math.random() * auroraColors.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        sizes[i] = Math.random() * 8 + 2;
      }
      
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const material = new THREE.ShaderMaterial({
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vAlpha;
          uniform float time;
          
          void main() {
            vColor = color;
            vec3 pos = position;
            
            // Wave motion
            pos.x += sin(time * 0.001 + position.y * 0.01) * 50.0;
            pos.y += cos(time * 0.0015 + position.x * 0.008) * 30.0;
            
            // Fade based on distance
            float dist = length(pos);
            vAlpha = 1.0 - (dist / 1000.0);
            vAlpha = clamp(vAlpha, 0.0, 0.8);
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = (1.0 - dist * 2.0) * vAlpha;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        uniforms: {
          time: { value: 0 }
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      particles = new THREE.Points(geometry, material);
      scene.add(particles);
      
      camera.position.z = 500;
      
      animate();
    }
    
    function animate() {
      if (!renderer || !scene || !camera || !particles) return;
      
      requestAnimationFrame(animate);
      
      const time = Date.now();
      particles.material.uniforms.time.value = time;
      
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;
      
      renderer.render(scene, camera);
    }

    function handleResize() {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Initialize the animation
    initAurora();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return children;
} 