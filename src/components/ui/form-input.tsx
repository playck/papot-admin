"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

import { Input } from "./input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

interface FormInputProps extends React.ComponentProps<typeof Input> {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ name, label, description, required, className, ...props }, ref) => {
    const form = useFormContext();

    if (!form) {
      throw new Error("FormInput must be used within a Form component");
    }

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <Input
                {...field}
                {...props}
                ref={ref}
                className={cn(className)}
                value={field.value || ""}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

FormInput.displayName = "FormInput";
