/**
 * @param {Object} props
 * @param {import('../types/index.js').Post} props.post
 */
import { Show, createSignal } from 'solid-js';
import { updateTweet, posttweet } from '../service/twitter_service.js'; // Adjust path as needed

export default function PostCard(props) {
  const [isEditing, setIsEditing] = createSignal(false);
  const [editedTopic, setEditedTopic] = createSignal(props.post.topic);
  const [editedContent, setEditedContent] = createSignal(props.post.content);
  const [loading, setLoading] = createSignal(false);
  const [posted, setPosted] = createSignal(props.post.posted);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setEditedTopic(props.post.topic);
    setEditedContent(props.post.content);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateTweet(props.post.id, {
        topic: editedTopic(),
        content: editedContent(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostTweet = async () => {
    setLoading(true);
    try {
      await posttweet(props.post.id);
      setPosted(true); // Update UI immediately
    } catch (error) {
      console.error("Failed to post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="glass rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl animate-fade-in group">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <Show when={isEditing()} fallback={
            <>
              <h3 class="text-xl font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
                {editedTopic()}
              </h3>
              <p class="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                {editedContent()}
              </p>
            </>
          }>
            <input
              type="text"
              value={editedTopic()}
              onInput={(e) => setEditedTopic(e.target.value)}
              class="w-full bg-white/10 text-white font-semibold mb-2 px-3 py-2 rounded border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Edit topic"
            />
            <textarea
              rows="4"
              value={editedContent()}
              onInput={(e) => setEditedContent(e.target.value)}
              class="w-full bg-white/10 text-white px-3 py-2 rounded border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Edit content"
            ></textarea>
          </Show>
        </div>
      </div>

      <div class="flex gap-3 mt-4 flex-wrap">
        <button
          class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-5 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50"
          disabled={posted() || loading()}
          onClick={handlePostTweet}
        >
          {posted() ? "Posted" : loading() ? "Posting..." : "Post to Twitter"}
        </button>

        <Show when={isEditing()} fallback={
          <Show when={!posted()}>
            <button
              onClick={handleEdit}
              class="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-semibold py-2 px-5 rounded-full shadow-lg transition-all duration-300"
            >
              Edit
            </button>
          </Show>
        }>
          <button
            onClick={handleSave}
            class="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold py-2 px-5 rounded-full shadow-lg transition-all duration-300"
            disabled={loading()}
          >
            {loading() ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            class="bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-semibold py-2 px-5 rounded-full shadow-lg transition-all duration-300"
            disabled={loading()}
          >
            Cancel
          </button>
        </Show>
      </div>
    </div>
  );
}
