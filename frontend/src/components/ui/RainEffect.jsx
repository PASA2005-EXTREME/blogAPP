import React from 'react';

const RainDrop = () => {
  const randomLeft = Math.random() * 100;
  const animationDuration = 0.8 + Math.random() * 0.5;
  const size = 1.5 + Math.random() *2 ;
  const opacity = 0.3 + Math.random() * 0.2;

  return (
    <div
      className="absolute bg-indigo-400 rounded-full"
      style={{
        left: `${randomLeft}%`,
        width: `${size}px`,
        height: `${size * 3}px`,
        opacity: opacity,
        animation: `fall ${animationDuration}s linear infinite`,
      }}
    />
  );
};

export function RainEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>
        {`
          @keyframes fall {
            0% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(100vh);
            }
          }
        `}
      </style>
      {Array.from({ length: 100 }).map((_, i) => (
        <RainDrop key={i} />
      ))}
    </div>
  );
}

export default RainEffect;
