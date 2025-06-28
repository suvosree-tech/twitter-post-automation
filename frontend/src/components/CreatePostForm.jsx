import { createSignal } from 'solid-js';
import { generatepost } from '../service/twitter_service'; // Adjust path if different

/**
 * @param {Object} props
 * @param {function(): void} [props.onSuccess] - Callback after successful submission
 */
export default function CreatePostForm(props) {
  const [title, setTitle] = createSignal('');
  const [content, setContent] = createSignal('');
  const [category, setCategory] = createSignal('');
  const [tags, setTags] = createSignal('');
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title()) return;


    setLoading(true);
    setError('');
    generatepost({"topic":title()}).then((responce)=>{
      console.log(responce.data)
    }).catch((error)=>{
      console.log(error)
    })
  };
  return (
    <div class="glass rounded-xl p-6 mb-8">
      <form onSubmit={handleSubmit} class="space-y-4">
        <div class="relative">
          <input
            type="text"
            value={title()}
            onInput={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="What's on your mind? Share your thoughts..."
            class="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 transition-all duration-200 border border-white/20"
            required
          />
        </div>

        {isExpanded() && (
          <div class="space-y-4 animate-slide-up">
            <div class="relative">
              <textarea
                value={content()}
                onInput={(e) => setContent(e.target.value)}
                rows="4"
                class="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 transition-all duration-200 border border-white/20 resize-none"
                readOnly
              />
            </div>


            <div class="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading()}
                class="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-60"
              >
                {loading() ? "Generate AI..." : "Generate AI"}
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                class="px-6 py-3 glass text-white font-semibold rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
            </div>

            {error() && (
              <p class="text-red-400 text-sm font-medium">{error()}</p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
