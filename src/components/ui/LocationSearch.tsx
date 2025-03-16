
import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LocationSearchProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

// Indian locations data for the demo
const DEMO_LOCATIONS = [
  "New Delhi Railway Station, New Delhi",
  "Indira Gandhi International Airport, Delhi",
  "Mumbai Central, Mumbai",
  "Chhatrapati Shivaji Terminus, Mumbai",
  "Bangalore City Junction, Bangalore",
  "Kempegowda International Airport, Bangalore",
  "Chennai Central, Chennai",
  "Chennai International Airport, Chennai",
  "Kolkata Railway Station, Kolkata",
  "Netaji Subhash Chandra Bose Airport, Kolkata",
  "Hyderabad Railway Station, Hyderabad",
  "Rajiv Gandhi International Airport, Hyderabad",
  "Pune Railway Station, Pune",
  "Ahmedabad Junction, Ahmedabad",
  "Jaipur Junction, Jaipur",
];

const LocationSearch: React.FC<LocationSearchProps> = ({
  label,
  value,
  onChange,
  placeholder = "Enter location",
  className,
  required = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Update suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    // Filter Indian locations based on search term
    const filteredLocations = DEMO_LOCATIONS.filter((location) =>
      location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSuggestions(filteredLocations);
  }, [searchTerm]);

  // Handle document click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        suggestionsRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={cn("relative", className)}>
      <label
        htmlFor={`location-${label.replace(/\s+/g, "-").toLowerCase()}`}
        className="block text-sm font-medium mb-1"
      >
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        <Input
          id={`location-${label.replace(/\s+/g, "-").toLowerCase()}`}
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10"
          onFocus={() => setShowSuggestions(true)}
          required={required}
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={18}
        />
      </div>
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto border border-border"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin size={16} className="text-muted-foreground mr-2" />
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
