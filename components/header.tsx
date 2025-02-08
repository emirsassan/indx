"use client";
import type React from "react";
import { useState, useCallback, useRef, RefObject } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { SearchResults } from "./search-results";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import Link from "next/link";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(true);
  };

  const handleCloseSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  useOnClickOutside(
    searchRef as unknown as RefObject<HTMLElement>,
    handleCloseSearch
  );

  return (
    <header className="bg-background shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
        <h1 className="text-2xl font-bold text-primary">Indx</h1>
        </Link>
        <div className="flex-1 max-w-md mx-4 relative" ref={searchRef}>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search mods..."
              className="w-full pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={18}
            />
          </div>
          <SearchResults term={searchQuery} onClose={handleCloseSearch} />
        </div>
        <nav className="flex items-center space-x-4">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
