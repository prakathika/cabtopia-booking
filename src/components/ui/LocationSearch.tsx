
import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
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

const LocationSearch: React.FC<LocationSearchProps> = ({
  label,
  value,
  onChange,
  placeholder = "Enter location",
  className,
  required = false,
}) => {
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
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
          required={required}
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={18}
        />
      </div>
    </div>
  );
};

export default LocationSearch;
