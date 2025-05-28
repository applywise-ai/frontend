"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/app/utils/cn"
import { Button } from "@/app/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/app/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"

export interface Option {
  readonly value: string
  readonly label: string
}

interface MultiSelectProps {
  options: readonly Option[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
  itemName?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
  itemName
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (value: string) => {
    console.log(value)
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white hover:bg-white hover:text-black hover:border-gray-400 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            selected.length > 0 ? "h-auto" : "h-10",
            className
          )}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length === 0 ? (
              <span className="text-sm text-gray-500">{placeholder}</span>
            ) : (
              <span className="text-sm text-gray-900 font-">
                {selected.length} {itemName}{selected.length > 1 && 's' } selected
              </span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-white border border-gray-200 shadow-md" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command className="w-full bg-white">
          <CommandInput placeholder="Search..." className="h-9 bg-white text-black placeholder-gray-500" />
          <CommandEmpty className="text-black">No results found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto bg-white">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50",
                  selected.includes(option.value) && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                )}
                onClick={() => handleSelect(option.value)}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selected.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </span>
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 