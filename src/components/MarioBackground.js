import React, { useEffect, useState } from 'react';
import '../styles/mario-theme.css';

const MarioBackground = () => {
  const [clouds, setClouds] = useState([]);
  
  useEffect(() => {
    // Create clouds with random sizes and positions
    const generateClouds = () => {
      const newClouds = [];
      const cloudCount = 5;
      
      for (let i = 0; i < cloudCount; i++) {
        const startPosition = -Math.random() * window.innerWidth;
        const topPosition = 50 + Math.random() * 150;
        const scale = 0.7 + Math.random() * 0.5;
        const speed = 30 + Math.random() * 60;
        
        newClouds.push({
          id: i,
          style: {
            left: `${startPosition}px`,
            top: `${topPosition}px`,
            transform: `scale(${scale})`,
            animationDuration: `${speed}s`
          }
        });
      }
      
      setClouds(newClouds);
    };
    
    generateClouds();
    
    // Recreate clouds when window is resized
    window.addEventListener('resize', generateClouds);
    return () => window.removeEventListener('resize', generateClouds);
  }, []);
  
  return (
    <div className="mario-background">
      {clouds.map(cloud => (
        <div key={cloud.id} className="mario-cloud" style={cloud.style}>
          <svg width="100" height="60" viewBox="0 0 100 60" fill="white">
            <path d="M90,30 C90,46.57 80.37,60 68.57,60 C59.95,60 52.5,53.25 50,45 C50,45 50,45 50,45 C47.5,53.25 40.05,60 31.43,60 C19.63,60 10,46.57 10,30 C10,13.43 19.63,0 31.43,0 C40.05,0 47.5,6.75 50,15 C52.5,6.75 59.95,0 68.57,0 C80.37,0 90,13.43 90,30 Z" stroke="black" strokeWidth="2" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default MarioBackground;