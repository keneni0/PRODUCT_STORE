import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api } from "../utils/api";
import { products as mockProducts } from "../mockData";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const loadProduct = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProductById(id);
      setProduct({ ...data, __source: "api" });
    } catch (err) {
      // Fallback for mock products (used in search dropdown / mock pages)
      const mock = mockProducts.find((p) => p.id === id);
      if (mock) {
        setProduct({
          __source: "mock",
          id: mock.id,
          title: mock.name,
          description: mock.description,
          imageUrl: mock.imageUrl,
          priceETB: mock.priceETB,
          stock: mock.stock,
          section: mock.section,
          teraId: mock.teraId,
          popular: mock.popular ? "true" : "false",
          rating: mock.rating ? String(mock.rating) : null,
          user: { name: mock.seller, phoneNumber: null },
          comments: [],
        });
        return;
      }

      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (product?.__source === "mock") {
      alert("Comments are only available for products saved in the database.");
      return;
    }
    if (!isSignedIn) {
      alert("Please sign in to leave a comment.");
      return;
    }
    if (!commentText.trim()) {
      return;
    }

    setCommentSubmitting(true);
    setCommentError(null);
    try {
      await api.createComment(id, commentText.trim());
      setCommentText("");
      await loadProduct();
    } catch (err) {
      setCommentError(err.message || "Failed to add comment");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await api.deleteComment(commentId);
      await loadProduct();
    } catch (err) {
      alert(err.message || "Failed to delete comment");
    }
  };

  if (loading) return <div className="text-center py-16">Loading…</div>;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-16">Product not found</div>;

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full rounded mb-4"
          />
        )}
        <p className="text-gray-700">{product.description}</p>
        <div className="mt-6 p-4 bg-white rounded shadow-sm">
          <h3 className="font-semibold">Seller</h3>
          <div className="text-sm text-gray-700">
            {product.user?.name || "Unknown"}
          </div>
          {product.user?.phoneNumber && (
            <div className="mt-2">
              <a
                href={`tel:${product.user.phoneNumber}`}
                className="text-merkato-orange font-medium"
              >
                Call Seller: {product.user.phoneNumber}
              </a>
            </div>
          )}
        </div>
      </div>

      <section className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">
          Comments{" "}
          {Array.isArray(product.comments) && product.comments.length > 0 && (
            <span className="text-sm text-gray-500">
              ({product.comments.length})
            </span>
          )}
        </h2>

        {commentError && (
          <div className="mb-4 bg-red-50 text-red-700 px-3 py-2 rounded text-sm">
            {commentError}
          </div>
        )}

        {Array.isArray(product.comments) && product.comments.length > 0 ? (
          <ul className="space-y-4 mb-6">
            {product.comments.map((comment) => {
              const isMine =
                isSignedIn && comment.userId === user?.id;
              return (
                <li
                  key={comment.id}
                  className="border border-gray-100 rounded-lg p-3 flex justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      {comment.user?.name || "Anonymous"}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {comment.content}
                    </p>
                    {comment.createdAt && (
                      <div className="mt-1 text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                  {isMine && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 mb-6">
            No comments yet. Be the first to share your thoughts.
          </p>
        )}

        <div>
          {isSignedIn ? (
            <form onSubmit={handleAddComment} className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Add a comment
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-merkato-orange"
                rows={3}
                placeholder="Share your experience with this product..."
              />
              <button
                type="submit"
                disabled={commentSubmitting || !commentText.trim()}
                className="btn-primary px-4 py-2 text-sm disabled:opacity-60"
              >
                {commentSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-600">
              Please sign in to leave a comment.
            </p>
          )}
        </div>
      </section>
    </article>
  );
}
