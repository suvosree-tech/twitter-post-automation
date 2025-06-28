import { createSignal } from 'solid-js';

/**
 * @param {Object} props
 * @param {function(string): void} props.onSearch
 * @param {string} [props.placeholder]
 */
export default function SearchBar(props) {
  const [query, setQuery] = createSignal('');

  const handleSearch = (e) => {
    e.preventDefault();
    props.onSearch(query());
  };

  const handleInput = (e) => {
    const target = e.target;
    setQuery(target.value);
    props.onSearch(target.value);
  };

  return (
    <form onSubmit={handleSearch} class="relative w-full max-w-md">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query()}
          onInput={handleInput}
          placeholder={props.placeholder || 'Search posts...'}
          class="w-full pl-10 pr-4 py-3 glass rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-white/20"
        />
      </div>
    </form>
  );
}