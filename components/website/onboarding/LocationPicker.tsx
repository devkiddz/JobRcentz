'use client';

import { useState } from 'react';
import { Check, MapPin } from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { COUNTRIES, Country } from '@/server/utils/countriesLists';

interface LocationPickerProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function LocationPicker({
  value,
  onValueChange,
  placeholder = 'Select country...'
}: LocationPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedCountry = COUNTRIES.find(c => c.name === value || c.areaCode === value);

  // Helper to render Icon or Flag Image
  const renderFlagOrIcon = (country: Country) => {
    if (country.icon) {
      const IconComponent = country.icon;
      return <IconComponent className="h-5 w-5 shrink-0 text-primary" />;
    }

    if (country.flagUrl) {
      return (
        <img
          src={country.flagUrl}
          alt={country.name}
          className="h-4 w-5 shrink-0 rounded-xs object-cover shadow-xs"
        />
      );
    }

    return null;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        className="inline-flex h-12 w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-3 text-sm font-normal shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground">
        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />

        {selectedCountry ? (
          <span className="flex items-center gap-2.5 text-foreground">
            {renderFlagOrIcon(selectedCountry)}
            <span className="font-medium">{selectedCountry.name}</span>
            {selectedCountry.phoneCode && (
              <span className="text-xs text-muted-foreground">({selectedCountry.phoneCode})</span>
            )}
          </span>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search country or phone code..." />

          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>

            <CommandGroup heading="Countries">
              {COUNTRIES.map(country => {
                const isSelected = value === country.name || value === country.areaCode;

                return (
                  <CommandItem
                    key={country.areaCode}
                    value={`${country.name} ${country.phoneCode} ${country.areaCode}`}
                    onSelect={() => {
                      onValueChange(country.name);
                      setOpen(false);
                    }}>
                    <div className="mr-2.5 flex h-4 w-5 items-center justify-center">
                      {renderFlagOrIcon(country)}
                    </div>

                    <span className="flex-1 truncate">{country.name}</span>

                    {country.phoneCode && (
                      <span className="mr-2 text-xs text-muted-foreground">{country.phoneCode}</span>
                    )}

                    {isSelected && <Check className="ml-auto h-4 w-4 shrink-0" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
