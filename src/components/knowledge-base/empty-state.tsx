"use client";

import { SearchX } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No items found" }: EmptyStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <SearchX className="size-12 text-gray-300" />
      <p className="mt-3 text-sm font-medium text-gray-500">{message}</p>
      <p className="mt-1 text-xs text-gray-400">Try adjusting your search or filters</p>
    </div>
  );
}
