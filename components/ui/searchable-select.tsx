"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchableSelectOption {
  value?: string | number;
  label?: string;
  id?: string | number;
  name?: string;
  subLabel?: string;
  badge?: string;
  platform?: string;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  size?: "sm" | "default";
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled = false,
  className,
  triggerClassName,
  size = "default",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const getOptionValue = (opt: SearchableSelectOption): string => {
    if (opt.value !== undefined) return opt.value.toString();
    if (opt.id !== undefined) return opt.id.toString();
    return "";
  };

  const getOptionLabel = (opt: SearchableSelectOption): string => {
    return opt.label || opt.name || getOptionValue(opt);
  };

  const selectedOption = options.find(
    (opt) => getOptionValue(opt).toLowerCase() === (value ?? "").toString().toLowerCase()
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm("");
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const label = getOptionLabel(opt).toLowerCase();
    const val = getOptionValue(opt).toLowerCase();
    const sub = (opt.subLabel || "").toLowerCase();
    const badge = (opt.badge || "").toLowerCase();
    const platform = (opt.platform || "").toLowerCase();
    return (
      label.includes(term) ||
      val.includes(term) ||
      sub.includes(term) ||
      badge.includes(term) ||
      platform.includes(term)
    );
  });

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-[10px] border border-slate-200 bg-white font-medium text-slate-800 transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-left shadow-2xs",
          size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-xs sm:text-sm",
          disabled ? "cursor-not-allowed opacity-50 bg-slate-50" : "cursor-pointer hover:border-slate-300",
          isOpen && "border-indigo-500 ring-4 ring-indigo-100",
          triggerClassName
        )}
      >
        <div className="flex items-center gap-1.5 truncate">
          {selectedOption ? (
            <>
              {selectedOption.badge && (
                <span className="font-mono text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.2 rounded text-[10px] shrink-0 border border-indigo-100">
                  {selectedOption.badge}
                </span>
              )}
              <span className="truncate">{getOptionLabel(selectedOption)}</span>
              {selectedOption.platform && (
                <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-100 px-1 py-0.2 rounded border border-slate-200 shrink-0">
                  {selectedOption.platform}
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-400 font-normal">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-[100] mt-1.5 w-full min-w-[240px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="border-b border-slate-100 bg-slate-50/60 p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-7 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const optVal = getOptionValue(opt);
                const isSelected = (value ?? "").toString().toLowerCase() === optVal.toLowerCase();

                return (
                  <button
                    key={optVal}
                    type="button"
                    onClick={() => {
                      onChange(optVal);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={cn(
                      "flex w-full cursor-pointer items-start justify-between rounded-lg p-2 text-left text-xs transition-colors",
                      isSelected
                        ? "bg-indigo-50/80 text-indigo-950 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {opt.badge && (
                          <span className="font-mono text-[10px] text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded border border-indigo-100 font-bold shrink-0">
                            {opt.badge}
                          </span>
                        )}
                        {opt.platform && (
                          <span className="text-[9px] uppercase font-mono text-slate-500 bg-slate-100 px-1 py-0.2 rounded border border-slate-200 shrink-0">
                            {opt.platform}
                          </span>
                        )}
                        <span className="truncate">{getOptionLabel(opt)}</span>
                      </div>
                      {opt.subLabel && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 font-normal">
                          {opt.subLabel}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-6 text-center text-xs text-slate-400">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
