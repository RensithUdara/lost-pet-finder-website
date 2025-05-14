"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { sriLankaDistricts } from "@/lib/sri-lanka-data"

interface DistrictSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function DistrictSelector({ value, onChange, className }: DistrictSelectorProps) {
  const [open, setOpen] = useState(false)
  const [districts, setDistricts] = useState(sriLankaDistricts)

  // Ensure districts are loaded
  useEffect(() => {
    if (districts.length === 0) {
      console.log("Loading districts from data file")
      setDistricts(sriLankaDistricts)
    }
  }, [districts.length])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? districts.find((district) => district.name === value)?.name || "Select district..."
            : "Select district..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search district..." />
          <CommandList>
            <CommandEmpty>No district found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {districts.map((district) => (
                <CommandItem
                  key={district.name}
                  value={district.name}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === district.name ? "opacity-100" : "opacity-0")} />
                  {district.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
