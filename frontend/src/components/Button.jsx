import React from 'react';


const Button = ({ children, onClick, variant = 'primary', className = '', style = {} }) => {
  // Map legacy variants to Tailwind classes if needed, or rely on global directives
  const baseClasses = "inline-block font-medium rounded-sm cursor-pointer";
  let variantClasses = "";
  
  if (variant === 'primary') variantClasses = "btn-primary";
  else if (variant === 'outline') variantClasses = "btn-outline";
  else if (variant === 'text') variantClasses = "text-brand-espresso px-4 py-2";

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} onClick={onClick} style={style}>
      {children}
    </button>
  );
};

export default Button;
