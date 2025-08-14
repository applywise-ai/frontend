"use client"

"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Calendar } from "@/app/components/ui/calendar"
import { Input } from "@/app/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"

function formatDate(date: string | undefined) {
  if (!date) {
    return ""
  }

  // Parse the date string and format as mm/dd/yyyy
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) {
    return ""
  }

  return dateObj.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

interface DatePickerProps {
  date: string | undefined
  setDate: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function DatePicker({ date, setDate, disabled, placeholder = "Pick a date" }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(date ? new Date(date) : undefined)
  const [value, setValue] = React.useState(formatDate(date))

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          className="bg-white pr-12 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          onChange={(e) => {
            const date = new Date(e.target.value)
            setValue(e.target.value)
            if (isValidDate(date)) {
              setDate(date)
              setMonth(date)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="outline"
              className="absolute top-1/2 right-2 h-7 px-1.5 -translate-y-1/2 bg-gray-100 border-gray-400 text-white hover:bg-gray-200 hover:border-gray-400 shadow-sm"
            >
              <CalendarIcon className="size-3.5 text-black" />
              {/* <span className="text-sm font-medium">Date</span> */}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0 bg-white border border-gray-200 shadow-lg"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date ? new Date(date) : undefined}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(selectedDate) => {
                setDate(selectedDate)
                setValue(selectedDate ? formatDate(selectedDate.toISOString()) : "")
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
