"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ReactNode } from "react";
import { Logo } from "./logo";

export function DialogMain({
  open,
  children,
  textHeader,
  textDesc = "",
  onOpenChange,
}: {
  open: boolean;
  textDesc?: string;
  textHeader: string;
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl px-6 pt-4 pb-6 shadow-xl">
        <div className="relative">
          <DialogHeader>
            <div className="flex justify-center">
              <Logo size={40} />
            </div>
            <DialogTitle className="text-center text-xl">
              {textHeader}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center">
            {textDesc}
          </DialogDescription>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
