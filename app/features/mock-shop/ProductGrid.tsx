import { products } from "./products";

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <article
          key={product.id}
          className="group bg-white border border-cream-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-cream-400 transition-all duration-300 animate-fade-in"
        >
          <div className="relative aspect-square overflow-hidden bg-cream-100">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.tag && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-accent-500 text-white text-xs font-semibold rounded-full shadow-sm">
                {product.tag}
              </span>
            )}
          </div>
          <div className="p-5 space-y-2">
            <h3 className="font-heading text-lg font-semibold text-charcoal-800 leading-snug">
              {product.name}
            </h3>
            <p className="text-sm text-charcoal-500 leading-relaxed">
              {product.blurb}
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-base font-medium text-charcoal-800">
                ${product.price}
              </span>
              <button className="px-3 py-1.5 text-sm font-semibold text-accent-600 border border-accent-300 rounded-lg hover:bg-accent-50 hover:border-accent-400 transition-colors focus-ring">
                Add to cart
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
