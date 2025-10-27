"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// const categories = [
//   { label: "Function", value: "function" },
//   { label: "Novel", value: "novel" },
//   { label: "Essay", value: "essay" },
//   { label: "Other", value: "other" },
// ];

export default function SelectSearch({
  value,
  onChange,
  categories,
}: {
  value?: string;
  onChange: (value: string) => void;
  categories: { label: string; value: string }[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="w-full min-w-0 overflow-hidden" asChild>
          <Button
            variant="outline"
            role="combobox"
            // aria-expanded={open}
            className={`w-full justify-between min-w-0 overflow-hidden ${
              value ? "text-black" : "text-gray-500"
            }`}
          >
            {value
              ? categories.find((c) => c.value === value)?.label
              : "Select category..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="!w-full p-0 min-w-0">
          <Command className="w-full min-w-0">
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((c) => (
                <CommandItem
                  key={c.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === c.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {c.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
