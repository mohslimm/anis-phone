"use client";

import Link from "next/link";
import { ChevronDown, Sparkles, Percent } from "lucide-react";

export function Navigation() {
  const categories = [
    { name: "Smartphones", hasDropdown: true },
    { name: "Occasions", highlight: true },
    { name: "Tablettes", hasDropdown: false },
    { name: "Laptops", hasDropdown: false },
    { name: "Smartwatches", hasDropdown: false },
    { name: "Accessoires", hasDropdown: false },
    { name: "Packs exclusifs", hasDropdown: false },
  ];

  return (
    <nav className="hidden lg:block bg-white border-b shadow-sm relative z-30">
      <div className="container mx-auto px-4">
        <ul className="flex items-center space-x-8">
          <li className="py-3">
            <Link 
              href="/promos" 
              className="flex items-center gap-1.5 font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              <Percent className="w-4 h-4" />
              Affaire du jour
            </Link>
          </li>
          
          <div className="w-px h-6 bg-slate-200" />
          
          {categories.map((cat) => (
            <li key={cat.name} className="py-3 group relative">
              <Link 
                href={`/categorie/${cat.name.toLowerCase()}`}
                className={`flex items-center gap-1 text-sm font-semibold transition-colors
                  ${cat.highlight ? 'text-amber-600 hover:text-amber-700' : 'text-slate-700 hover:text-blue-600'}
                `}
              >
                {cat.highlight && <Sparkles className="w-3.5 h-3.5" />}
                {cat.name}
                {cat.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />}
              </Link>
              
              {/* Very Simple Mega Menu Mock for Smartphones */}
              {cat.hasDropdown && (
                <div className="absolute top-full left-0 w-[200px] bg-white shadow-xl border rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top pt-2">
                  <div className="py-2 flex flex-col">
                    {["Apple", "Samsung", "Xiaomi", "Oppo", "Realme", "Honor", "Poco"].map(brand => (
                      <Link 
                        key={brand} 
                        href={`/categorie/smartphones/${brand.toLowerCase()}`}
                        className="px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 font-medium"
                      >
                        {brand}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
