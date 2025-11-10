import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  ...props 
}) => {
  const paddingSizes = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const hoverClass = hover ? 'card-hover cursor-pointer' : '';
  
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md 
        ${paddingSizes[padding]} 
        ${hoverClass} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;