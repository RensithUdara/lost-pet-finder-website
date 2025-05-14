"use client"

import { useState, useEffect, useRef } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Loader2 } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { getSriLankaLocationSuggestions } from "@/lib/sri-lanka-data"

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (address: string, latitude: number, longitude: number) => void
  placeholder?: string
  className?: string
}

interface Suggestion {
  address: string
  latitude: number
  longitude: number
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Enter an address",
  className,
}: AddressAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedValue = useDebounce(inputValue, 500)
  const commandRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    if (!debouncedValue || debouncedValue.length < 3) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        // First, check Sri Lanka local suggestions
        const sriLankaSuggestions = getSriLankaLocationSuggestions(debouncedValue)

        if (sriLankaSuggestions.length > 0) {
          setSuggestions(
            sriLankaSuggestions.map((suggestion) => ({
              address: `${suggestion.name}, Sri Lanka`,
              latitude: suggestion.latitude,
              longitude: suggestion.longitude,
            })),
          )
          setLoading(false)
          return
        }

        // If no local suggestions, fetch from Nominatim
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedValue + " Sri Lanka",
          )}&limit=5`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch address suggestions")
        }

        const data = await response.json()

        const formattedSuggestions = data.map((item: any) => ({
          address: item.display_name,
          latitude: Number.parseFloat(item.lat),
          longitude: Number.parseFloat(item.lon),
        }))

        setSuggestions(formattedSuggestions)
      } catch (error) {
        console.error("Error fetching address suggestions:", error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedValue])

  const handleInputChange = (value: string) => {
    setInputValue(value)
    onChange(value)
    if (value.length > 0) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setInputValue(suggestion.address)
    onChange(suggestion.address)
    onSelect(suggestion.address, suggestion.latitude, suggestion.longitude)
    setOpen(false)
  }

  return (
    <div className="relative w-full">
      <Command ref={commandRef} className={`rounded-lg border ${className}`}>
        <CommandInput
          value={inputValue}
          onValueChange={handleInputChange}
          placeholder={placeholder}
          onFocus={() => inputValue.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
        />
        {open && (
          <CommandList className="absolute z-10 w-full bg-background shadow-md rounded-b-lg max-h-64 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <p className="text-sm text-muted-foreground">Searching for addresses...</p>
              </div>
            )}
            {!loading && suggestions.length === 0 && (
              <CommandEmpty>No addresses found. Try a different search.</CommandEmpty>
            )}
            {!loading && suggestions.length > 0 && (
              <CommandGroup heading="Suggestions">
                {suggestions.map((suggestion, index) => (
                  <CommandItem
                    key={index}
                    value={suggestion.address}
                    onSelect={() => handleSelectSuggestion(suggestion)}
                    className="cursor-pointer"
                  >
                    {suggestion.address}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  )
}
