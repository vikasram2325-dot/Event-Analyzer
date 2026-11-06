import React from 'react';
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  MapPin,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { FilterOptions, EventCategory } from '../types';

interface EventFiltersProps {
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  onReset: () => void;
  totalResults: number;
}

const CATEGORIES: EventCategory[] = [
  'Technology',
  'Business',
  'Design & Creative',
  'Music & Entertainment',
  'Workshops & Training',
  'Health & Wellness',
  'Sports & Fitness',
  'Community & Networking',
];

export const EventFilters: React.FC<EventFiltersProps> = ({
  filterOptions,
  setFilterOptions,
  onReset,
  totalResults,
}) => {
  const hasActiveFilters =
    Boolean(filterOptions.searchQuery) ||
    Boolean(filterOptions.category) ||
    Boolean(filterOptions.location) ||
    Boolean(filterOptions.date);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Top Search Bar & Sort */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search input */}
        <div className="md:col-span-8 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events by title, topic, speaker or venue..."
            value={filterOptions.searchQuery}
            onChange={(e) =>
              setFilterOptions((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
          {filterOptions.searchQuery && (
            <button
              onClick={() =>
                setFilterOptions((prev) => ({ ...prev, searchQuery: '' }))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-full"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="md:col-span-4 flex items-center gap-2">
          <div className="relative w-full">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filterOptions.sortBy}
              onChange={(e) =>
                setFilterOptions((prev) => ({
                  ...prev,
                  sortBy: e.target.value as FilterOptions['sortBy'],
                }))
              }
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
            >
              <option value="date-asc">Date: Upcoming First</option>
              <option value="date-desc">Date: Furthest First</option>
              <option value="popular">Popularity: Most Registered</option>
              <option value="newest">Recently Added</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Location & Date filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {/* Location Filter */}
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter by city (e.g. San Francisco)"
            value={filterOptions.location}
            onChange={(e) =>
              setFilterOptions((prev) => ({ ...prev, location: e.target.value }))
            }
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="date"
            value={filterOptions.date}
            onChange={(e) =>
              setFilterOptions((prev) => ({ ...prev, date: e.target.value }))
            }
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
          />
        </div>

        {/* Reset / Results Counter */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:col-span-2 lg:col-span-1">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{totalResults}</strong> events
          </span>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Category Horizontal Filter Pills */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 mb-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Browse by Category:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() =>
              setFilterOptions((prev) => ({ ...prev, category: '' }))
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !filterOptions.category
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = filterOptions.category === cat;
            return (
              <button
                key={cat}
                onClick={() =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    category: isSelected ? '' : cat,
                  }))
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
