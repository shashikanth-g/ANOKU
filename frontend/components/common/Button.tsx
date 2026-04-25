import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:scale-[1.02] hover:shadow-md duration-300",
  {
    variants: {
      variant: {
        default: "bg-[#0B6E6E] text-white hover:bg-[#0B6E6E]/90 shadow-sm",
        destructive:
          "bg-[#EF4444] text-white hover:bg-[#EF4444]/90",
        outline:
          "border border-[#E5E7EB] dark:border-[#374151] bg-transparent hover:bg-[#F8F7F5] dark:hover:bg-[#1F2937] text-foreground",
        secondary:
          "bg-[#D4A574] text-white hover:bg-[#D4A574]/80",
        ghost: "hover:bg-[#F8F7F5] dark:hover:bg-[#1F2937] text-foreground hover:text-foreground",
        link: "text-[#0B6E6E] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-14 rounded-md px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, href, ...props }, ref) => {
    if (href) {
      return (
        <Link 
          href={href} 
          className={cn(buttonVariants({ variant, size, className }))}
        >
          {props.children}
        </Link>
      );
    }
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
