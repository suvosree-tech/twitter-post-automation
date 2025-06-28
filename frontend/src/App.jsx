import { createSignal, createMemo, onMount } from 'solid-js';
import { For } from 'solid-js';
import PostCard from './components/PostCard';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import CreatePostForm from './components/CreatePostForm';
import { mockPosts } from './data/mockPosts';

function App() {
  const [posts, setPosts] = createSignal(mockPosts);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 6;

  // Filter posts based on search query
  const filteredPosts = createMemo(() => {
    const query = searchQuery().toLowerCase();
    if (!query) return posts();
    
    return posts().filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query)) ||
      post.author.toLowerCase().includes(query)
    );
  });

  // Paginated posts
  const paginatedPosts = createMemo(() => {
    const filtered = filteredPosts();
    const startIndex = (currentPage() - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  });

  // Pagination state
  const paginationState = createMemo(() => {
    const totalItems = filteredPosts().length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return {
      currentPage: currentPage(),
      totalPages,
      itemsPerPage,
      totalItems
    };
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreatePost = (title, content, category, tags) => {
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      category,
      tags,
      createdAt: new Date(),
      author: 'You',
      likes: 0,
      comments: 0
    };
    
    setPosts([newPost, ...posts()]);
  };

  // Reset current page when search results change
  onMount(() => {
    // Add some animation delays for initial load
    const cards = document.querySelectorAll('.animate-fade-in');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Background decorations */}
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
      </div>

      <div class="relative z-10">
        {/* Header */}
        <header class="container mx-auto px-4 py-8">
          <div class="text-center mb-8">
            <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">
              <span class="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Premium
              </span>{' '}
              <span class="text-white">Posts</span>
            </h1>
            <p class="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Discover, create, and share amazing content with our premium platform
            </p>
          </div>

          {/* Search and Stats */}
          <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <SearchBar onSearch={handleSearch} />
            <div class="flex items-center gap-6 text-gray-300">
              <div class="text-center">
                <div class="text-2xl font-bold text-white">{paginationState().totalItems}</div>
                <div class="text-sm">Total Posts</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-white">{posts().length}</div>
                <div class="text-sm">All Time</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main class="container mx-auto px-4 pb-12">
          {/* Create Post Form */}
          <CreatePostForm onSubmit={handleCreatePost} />

          {/* Posts Grid */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <For each={paginatedPosts()}>
              {(post) => <PostCard post={post} />}
            </For>
          </div>

          {/* Empty State */}
          {filteredPosts().length === 0 && (
            <div class="text-center py-12">
              <div class="text-6xl mb-4">🔍</div>
              <h3 class="text-2xl font-semibold text-white mb-2">No posts found</h3>
              <p class="text-gray-300">
                {searchQuery() ? 
                  `No posts match "${searchQuery()}". Try adjusting your search.` : 
                  'No posts available yet. Be the first to create one!'
                }
              </p>
            </div>
          )}

          {/* Pagination */}
          {paginationState().totalPages > 1 && (
            <Pagination 
              pagination={paginationState()} 
              onPageChange={handlePageChange} 
            />
          )}
        </main>

        {/* Footer */}
        <footer class="glass-dark border-t border-white/10 mt-16">
          <div class="container mx-auto px-4 py-8">
            <div class="text-center text-gray-400">
              <p>&copy; 2024 Premium Posts. Built with SolidJS & Tailwind CSS</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;