import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { api } from '../utils/api';
import { Star } from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';

export default function ProductPageShim() {
  const { id } = useParams();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        const apiProduct = await api.getProductById(id);

        const mappedProduct = {
          id: apiProduct.id,
          name: apiProduct.title,
          priceETB: apiProduct.priceETB,
          seller: apiProduct.user?.name || 'Unknown',
          sellerId: apiProduct.userId,
          sellerPhone: apiProduct.user?.phoneNumber || null,
          teraId: apiProduct.teraId,
          section: apiProduct.section,
          description: apiProduct.description,
          stock: apiProduct.stock,
          imageUrl: apiProduct.imageUrl,
          rating: apiProduct.rating ? parseFloat(apiProduct.rating) : null,
          popular: apiProduct.popular === 'true',
          comments: Array.isArray(apiProduct.comments) ? apiProduct.comments : [],
        };

        setProduct(mappedProduct);

        if (apiProduct.teraId) {
          const related = await api.getProductsByTera(apiProduct.teraId);

          setRelatedProducts(
            related
              .filter(p => p.id !== id)
              .slice(0, 4)
              .map(p => ({
                id: p.id,
                name: p.title,
                priceETB: p.priceETB,
                seller: p.user?.name || 'Unknown',
                sellerId: p.userId,
                teraId: p.teraId,
                section: p.section,
                description: p.description,
                stock: p.stock,
                imageUrl: p.imageUrl,
                rating: p.rating ? parseFloat(p.rating) : null,
                popular: p.popular === 'true',
              }))
          );
        }

      } catch (apiErr) {
        console.error("API failed:", apiErr);
        setError("Failed to load product");
      }

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      alert("Please sign in to leave a comment.");
      return;
    }
    if (!commentText.trim()) return;

    setCommentSubmitting(true);
    setCommentError(null);
    try {
      await api.createComment(id, commentText.trim());
      setCommentText('');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-merkato-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p>Loading product...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-merkato-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Link to="/" className="btn-primary inline-block">
            Go Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-merkato-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${product.teraId}`}>
            {product.section}
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <img
              src={product.imageUrl || '/images/placeholder.jpg'}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {product.rating && (
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span>({product.rating})</span>
              </div>
            )}

            <div className="text-3xl font-bold text-merkato-orange">
              {product.priceETB} ETB
            </div>

            <p className="text-gray-700">{product.description}</p>

            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-1">Seller</h3>
              <p className="text-sm text-gray-700">{product.seller}</p>
              {product.sellerPhone && (
                <button
                  onClick={() => (window.location.href = `tel:${product.sellerPhone}`)}
                  className="mt-2 text-sm font-medium text-merkato-orange hover:underline"
                >
                  Call Seller: {product.sellerPhone}
                </button>
              )}
            </div>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-md p-6 mb-12">
          <h2 className="text-xl font-bold mb-4 text-merkato-gray">
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
                const isMine = isSignedIn && comment.userId === user?.id;
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
        </section>

        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">
              More from {product.section}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
