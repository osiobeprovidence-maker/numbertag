
import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = "" }) => {
  return (
    <div className={`animate-slide-up opacity-0 ${className}`} style={{ animationFillMode: 'forwards' }}>
      {children}
    </div>
  );
};

export default PageWrapper;
