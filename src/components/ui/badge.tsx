import * as React from "react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const getVariantClasses = (variant: BadgeVariant = "default"): string => {
  const variants = {
    default: "border-transparent bg-teal-600 text-white hover:bg-teal-700",
    secondary: "border-transparent bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100",
    destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
    outline: "border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300",
  };
  return variants[variant] || variants.default;
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClasses = getVariantClasses(variant);
  
  return (
    <div 
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantClasses} ${className || ""}`} 
      {...props} 
    />
  );
}

export { Badge };

