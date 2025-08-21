"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options: SelectOption[];
  className?: string;
}

export const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    { name, label, description, placeholder, required, options, className },
    ref
  ) => {
    const form = useFormContext();

    if (!form) {
      throw new Error("FormSelect must be used within a Form component");
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger
                  ref={ref}
                  className={cn("w-full min-w-0", className)}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

FormSelect.displayName = "FormSelect";
