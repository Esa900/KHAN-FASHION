import React, { useState } from 'react';
import { X, Search, Sparkles, ArrowRight, Loader2, Tag } from 'lucide-react';
import { Product } from '../types';

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SmartSearchModal: React.FC<SmartSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [interpretedData, setInterpretedData] = useState<any>(null);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);

  if (!isOpen) return null;

  const exampleQueries = [
    'Blue cotton Punjabi for Eid prayer',
    'Heirloom Jamdani saree for wedding guest',
    'Breathable summer linen shirt for casual dinner',
    'Luxury winter cashmere coat for evening gala'
  ];

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setQuery(searchTerm);

    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm })
      });
      const data = await res.json();
      setInterpretedData(data.interpretedQuery);
      setMatchedProducts(data.matchedProducts || []);
    } catch (err) {
      console.error('AI search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[88vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="p-5 border-b border-neutral-800 flex items-center gap-3 bg-neutral-950">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex-1 flex items-center gap-2"
          >
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything (e.g. 'blue cotton Punjabi for Eid' or 'casual linen shirt')..."
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="p-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs flex items-center gap-1.5 transition disabled:opacity-40"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </>
              )}
            </button>
          </form>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Example prompts */}
        <div className="p-4 bg-neutral-950/40 border-b border-neutral-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">Try asking:</span>
          {exampleQueries.map((ex) => (
            <button
              key={ex}
              onClick={() => handleSearch(ex)}
              className="px-2.5 py-1 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-amber-300 border border-neutral-700/60 transition text-[11px]"
            >
              &ldquo;{ex}&rdquo;
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {isLoading && (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="text-sm text-neutral-300 font-medium">
                Gemini AI is analyzing silhouette, fabric, and styling intent...
              </p>
              <p className="text-xs text-neutral-500">Searching our artisan catalog in real time</p>
            </div>
          )}

          {!isLoading && interpretedData && (
            <div>
              {/* AI Understanding Badge */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 mb-6 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Semantic Interpretation</span>
                </div>
                <p className="text-xs text-neutral-200">
                  {interpretedData.summary || `Matching results for "${query}"`}
                </p>

                {/* Filter tags parsed by AI */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {interpretedData.detectedCategory && (
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] font-mono">
                      Category: {interpretedData.detectedCategory}
                    </span>
                  )}
                  {interpretedData.detectedFabric && (
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] font-mono">
                      Fabric: {interpretedData.detectedFabric}
                    </span>
                  )}
                  {interpretedData.detectedColor && (
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] font-mono">
                      Color: {interpretedData.detectedColor}
                    </span>
                  )}
                  {interpretedData.detectedOccasion && (
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] font-mono">
                      Occasion: {interpretedData.detectedOccasion}
                    </span>
                  )}
                </div>
              </div>

              {/* Matched Products Grid */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
                  Matched Catalog Items ({matchedProducts.length})
                </h4>

                {matchedProducts.length === 0 ? (
                  <p className="text-sm text-neutral-400 py-6 text-center">
                    No exact items found matching this specific query. Try searching with broader keywords.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {matchedProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onClose();
                          onSelectProduct(p);
                        }}
                        className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/60 cursor-pointer flex gap-3 transition group"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-20 h-24 object-cover rounded-lg bg-neutral-900 flex-shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold block">
                              {p.category} &bull; {p.fabric}
                            </span>
                            <h5 className="text-xs font-semibold text-white group-hover:text-amber-400 transition truncate mt-0.5">
                              {p.title}
                            </h5>
                            <p className="text-[11px] text-neutral-400 line-clamp-1 mt-1 font-light">
                              {p.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-neutral-850">
                            <span className="text-xs font-bold text-white">
                              ৳{(p.salePrice ?? p.price).toLocaleString('en-BD')}
                            </span>
                            <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition">
                              View Garment &rarr;
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {!isLoading && !interpretedData && (
            <div className="py-12 text-center text-neutral-500 space-y-2">
              <Sparkles className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-sm text-neutral-400">
                Type what you are looking for in plain conversational English or Bengali context.
              </p>
              <p className="text-xs text-neutral-600">
                Our Gemini-powered fashion engine will decipher weave, drape, color, and fit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
