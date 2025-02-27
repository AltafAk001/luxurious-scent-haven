
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-button-sm text-secondary-medium">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={item.href} className="flex items-center">
              {isLast ? (
                <span className="uppercase">{item.label}</span>
              ) : (
                <>
                  <Link 
                    to={item.href} 
                    className="uppercase hover:text-primary-muted transition-colors"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight size={14} className="mx-1 text-secondary-medium" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
