"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Dropdown from "./dropdown";
import SearchDropdown from "./search-dropdown";
import DatePicker from "./date-picker";
import { DateRange } from "@daypicker/react";

interface SearchBarProps {
  className?: string;
}

const difficultyOptions =
  // Object.entries(TREK_ATTR_SEARCH_FIELDS[TREK_ATTR_SEARCH_FIELDS_KEYS.grade]).map(([key, value]) => ({ id: key, label: value })) || [];
  [
    { id: "all", label: "All levels" },
    { id: "easy", label: "Easy" },
    { id: "moderate", label: "Moderate" },
    { id: "difficult", label: "Difficult" },
    { id: "pro", label: "Pro" }
  ];

const searchInTrek = [
  { id: "triund-trek", label: "Triund Trek" },
  { id: "hampta-pass-trek", label: "Hampta Pass Trek" },
  { id: "chopta-tungnath-chandrashila-trek", label: "Chopta-Tungnath-Chandrashila Trek" },
  { id: "kedarkantha-trek", label: "Kedarkantha Trek" },
  { id: "beas-kund-trek", label: "Beas Kund Trek" },
]

export function SearchBar({ className }: SearchBarProps) {
  const [trekSearch, setTrekSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [date, setDate] = useState<DateRange | undefined>();
  const filteredSearchInTrek = searchInTrek.filter(item => item.label.toLowerCase().includes(trekSearch.toLowerCase()));

  return (
    <div
      className={cn(
        "relative z-30 max-w-[1100px] mx-auto w-[85%] lg:w-[80%]",
        className
      )}
    >
      <div className="bg-white rounded-xl md:rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch pl-0 pr-0 pb-1.5 md:pb-0 md:pl-4 md:pr-1">
          {/* Treks */}
          {/* <div className="flex-1 px-6 py-5 border-b md:border-b-0 md:border-r border-zinc-100">
            <p className="text-sm font-bold text-zinc-800 ">Treks</p>
            <input
              type="text"
              placeholder="Find your next trek"
              value={trekSearch}
              onChange={(e) => setTrekSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-zinc-500 placeholder:text-zinc-400 border-none p-0 focus:ring-0 focus:outline-none"
            />
          </div> */}

          <SearchDropdown
            value={trekSearch}
            onValueChange={(value) => setTrekSearch(searchInTrek.find((item) => item.id === value)?.label || "")}
            options={filteredSearchInTrek}
            sideOffset={5}
            classname="flex-1 px-6 py-5 border-b md:border-b-0 md:border-r border-zinc-100"
          >
            <p className="text-sm font-bold text-zinc-800 ">Treks</p>
            <input
              type="text"
              placeholder="Find your next trek"
              value={trekSearch}
              onChange={(e) => setTrekSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-zinc-500 placeholder:text-zinc-400 border-none p-0 focus:ring-0 focus:outline-none"
            />
          </SearchDropdown>

          <Dropdown
            value={difficulty}
            onValueChange={setDifficulty}
            options={difficultyOptions}
            classname={"flex-1 cursor-pointer px-6 py-5 border-b md:border-b-0 md:border-r border-zinc-100"}
            sideOffset={5}
          >
            <p className="text-sm font-bold text-zinc-800">Difficulty Level</p>
            <span className="text-sm text-zinc-500">
              {difficultyOptions.find((opt) => opt.id === difficulty)?.label}
            </span>
          </Dropdown>

          <DatePicker
            date={date}
            setDate={setDate}
            align='end'
            sideOffset={5}
            className="flex-1 px-6 py-5 border-b md:border-b-0 md:border-r border-zinc-100"
          >
            <p className="text-sm font-bold text-zinc-800">Select Duration</p>
            <span className="text-sm text-zinc-500">
              {date?.from ? `${date.from.toLocaleDateString()} - ${date.to?.toLocaleDateString() || ""}` : "Add dates"}
            </span>
          </DatePicker>
          {/* Search Button */}
          <div className="p-3 flex items-center">
            <button className="bg-primary hover:bg-primary-500 text-white rounded-full h-full min-h-[52px] px-7 flex items-center gap-2.5 text-sm font-bold transition-colors whitespace-nowrap w-full md:w-auto justify-center cursor-pointer">
              <Search className="w-4 h-4" />
              Search Trek
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
