import Link from 'next/link';
import Image from 'next/image';

type Category = {
  id: string;
  name: string;
  image?: string;
};

const CategorySlider: React.FC<{ categories: Category[] }> = ({ categories }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Categories</h2>
      
      {/* Scrollable Container */}
      <div className="w-full overflow-x-auto scrollbar-hide pb-2">
        <div className="flex gap-3 px-1">
          {categories.map((category, index) => (
            <div key={`${category.id}-${index}`} className="shrink-0">
              <Link 
                href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="block group"
              >
                {/* Card Container */}
                <div className="w-28 h-30 rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                  
                  {/* Image Area (Top 70%) - Changed to object-cover and removed padding */}
                  <div className="h-[70%] bg-white relative">
                    <Image
                      src={category.image || '/placeholder-category.png'}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="112px"
                      onError={(e: React.SyntheticEvent<Element, Event>) => {
                        const target = e.target as HTMLElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gray-50">
                             <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                             </svg>
                          </div>
                        `;
                      }}
                    />
                  </div>

                  {/* Text Area (Bottom 30%) */}
                  <div className="h-[30%] bg-system-blue-light flex items-center justify-center px-1">
                    <span className="text-xs font-medium text-white text-center line-clamp-2 leading-tight">
                      {category.name}
                    </span>
                  </div>
                  
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategorySlider;