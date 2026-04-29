"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "./Button";

interface AlertDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AlertDialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function AlertDialog({ children, open: controlledOpen, onOpenChange }: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogTrigger({
  children,
  render,
  asChild = false,
}: {
  children?: React.ReactNode;
  render?: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  asChild?: boolean;
}) {
  const context = React.useContext(AlertDialogContext);
  if (!context) return null;

  const handleClick = () => context.setOpen(true);

  if (render) {
    return React.cloneElement(render, { onClick: handleClick });
  }

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: React.MouseEventHandler<HTMLElement>;
    }>;

    return React.cloneElement(
      child,
      {
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(event);
          handleClick();
        },
      }
    );
  }

  return <div onClick={handleClick} className="inline-block">{children}</div>;
}

export function AlertDialogContent({ children }: { children: React.ReactNode }) {
  const context = React.useContext(AlertDialogContext);
  const mounted = typeof document !== "undefined";

  React.useEffect(() => {
    if (context?.open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [context?.open]);

  if (!mounted || !context?.open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#0D0F1A]/80 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={() => context.setOpen(false)} 
      />
      
      {/* Content */}
      <div className="relative bg-[#1A1F35] border border-[#8B92B8]/10 w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 fade-in duration-200">
        <button 
          onClick={() => context.setOpen(false)}
          className="absolute top-4 right-4 text-[#8B92B8] hover:text-[#F0F2FF] transition-colors"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

export function AlertDialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2 mb-6">{children}</div>;
}

export function AlertDialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-[#F0F2FF]">{children}</h2>;
}

export function AlertDialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[#8B92B8] leading-relaxed">{children}</p>;
}

export function AlertDialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col sm:flex-row justify-end gap-3">{children}</div>;
}

export function AlertDialogAction({
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(AlertDialogContext);
  return (
    <Button 
      variant="default"
      onClick={(event) => {
        onClick?.(event);
        context?.setOpen(false);
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

export function AlertDialogCancel({ children }: { children: React.ReactNode }) {
  const context = React.useContext(AlertDialogContext);
  return (
    <Button 
      variant="outline" 
      onClick={() => context?.setOpen(false)}
    >
      {children}
    </Button>
  );
}
