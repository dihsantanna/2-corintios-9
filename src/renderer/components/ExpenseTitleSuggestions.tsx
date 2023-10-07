import { useCallback, useEffect, useState } from 'react';

interface ExpenseTitleSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  search: string;
}

export function ExpenseTitleSuggestions({
  onSuggestionClick,

  search,
}: ExpenseTitleSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const getSuggestions = useCallback(async () => {
    const response = await window.expenseTitleSuggestions.get();
    setSuggestions(response);
  }, []);

  useEffect(() => {
    getSuggestions();
  }, [getSuggestions]);

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.includes(search),
  );

  return (
    <div className="w-full max-h-28 absolute left-0 top-[49px] bg-zinc-900 text-zinc-300 z-50 border-x border-b p-1 rounded-b-sm overflow-y-auto scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-300">
      <ul className="w-full max-h-full">
        {filteredSuggestions.length ? (
          filteredSuggestions.map((suggestion) => (
            <li className="w-full" key={suggestion}>
              <button
                className="w-full text-left hover:bg-teal-500"
                type="button"
                onClick={() => {
                  onSuggestionClick(suggestion);
                }}
              >
                {suggestion}
              </button>
            </li>
          ))
        ) : (
          <li className="w-full"> Nenhuma sugestão </li>
        )}
      </ul>
    </div>
  );
}
