'use client';

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <div className="relative">
                <motion.div
                    layoutId="input-focus-ring"
                    className="absolute -inset-0.5 rounded-lg bg-indigo-500/20 opacity-0 transition-opacity"
                    initial={false}
                    animate={{ opacity: 0 }}
                    whileFocus={{ opacity: 1 }}
                />
                <input
                    type={type}
                    className={cn(
                        "relative flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
