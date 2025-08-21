"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

import { RadioGroup, RadioGroupItem } from "./radio-group";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormRadioProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  options: RadioOption[];
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export const FormRadio = React.forwardRef<HTMLDivElement, FormRadioProps>(
  (
    {
      name,
      label,
      description,
      required,
      options,
      className,
      orientation = "vertical",
    },
    ref
  ) => {
    const form = useFormContext();

    if (!form) {
      throw new Error("FormRadio must be used within a Form component");
    }

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn("space-y-3", className)}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className={cn(
                  orientation === "horizontal"
                    ? "flex flex-row space-x-4"
                    : "flex flex-col space-y-2"
                )}
                ref={ref}
              >
                {options.map((option) => (
                  <FormItem
                    key={option.value}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem
                        value={option.value}
                        disabled={option.disabled}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

FormRadio.displayName = "FormRadio";
