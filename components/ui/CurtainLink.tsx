'use client';

import React from 'react';

interface CurtainLinkProps {
  href: string;
  isRoute?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CurtainLink: React.FC<CurtainLinkProps> = ({ href, isRoute = true, className, children }) => {
  return (
    <a 
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('navigate-curtain', { detail: { href, isRoute } }));
      }}
    >
      {children}
    </a>
  );
};
