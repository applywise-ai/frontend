"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/app/utils/cn"
import { Button } from "@/app/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"

interface MonthPickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function MonthPicker({
  date,
  setDate,
  placeholder = "Pick a month",
  className,
}: MonthPickerProps) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 66 }, (_, i) => 2000 + i); // 2000 to 2025

  // Derive selected month/year from date
  const selectedMonth = date ? months[date.getMonth()] : undefined;
  const selectedYear = date ? String(date.getFullYear()) : undefined;

  // State to track if year is selected
  const [yearSelected, setYearSelected] = React.useState(!!selectedYear);
  const [open, setOpen] = React.useState(false);

  // Handlers
  const handleMonthChange = (month: string) => {
    const monthIdx = months.indexOf(month);
    if (selectedYear) {
      setDate(new Date(Number(selectedYear), monthIdx, 1));
      setOpen(false);
    } else {
      setDate(undefined);
    }
  };

  const handleYearChange = (year: string) => {
    setYearSelected(true);
    if (selectedMonth) {
      const monthIdx = months.indexOf(selectedMonth);
      setDate(new Date(Number(year), monthIdx, 1));
    } else {
      setDate(new Date(Number(year), 0, 1));
    }
  };

  const handleBack = () => {
    setYearSelected(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date instanceof Date && !isNaN(date.getTime()) ? format(date, "MMMM yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-3 max-h-[300px] overflow-y-auto" align="start">
        {!yearSelected ? (
          <div>
            <div className="grid grid-cols-4 gap-2">
              {years.map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === String(year) ? "default" : "ghost"}
                  className="h-8 text-sm whitespace-nowrap"
                  onClick={() => handleYearChange(String(year))}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={handleBack}
              >
                ← Back
              </Button>
              <span className="text-sm font-medium">{selectedYear}</span>
              <div className="w-[70px]"></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {months.map((month) => (
                <Button
                  key={month}
                  variant={selectedMonth === month ? "default" : "ghost"}
                  className="h-8 text-sm"
                  onClick={() => handleMonthChange(month)}
                >
                  {month.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
} 