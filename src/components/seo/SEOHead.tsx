import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { photographerInfo } from '@/data/photographer';
import { SITE_URL, DEFAULT_KEYWORDS, OG_IMAGE } from '@/lib/siteConfig';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string;
  noIndex?: boolean;
  /** JSON-LD structured data object(s) to inject for this route */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const JSONLD_ATTR = 'data-seo-jsonld';

export function SEOHead({
  title,
  description,
  image = OG_IMAGE,
  type = 'website',
  keywords,
  noIndex = false,
  jsonLd,
}: SEOHeadProps) {
  const location = useLocation();

  // Titles that already contain the person's name are used verbatim,
  // otherwise the name is appended for consistent personal-brand signals.
  const fullTitle = title
    ? title.includes(photographerInfo.name)
      ? title
      : `${title} | ${photographerInfo.name}`
    : `${photographerInfo.name} — ${photographerInfo.tagline}`;
  const fullDescription = description || photographerInfo.heroIntroduction;
  const path = location.pathname;
  // Keep the trailing slash on the homepage so canonical matches sitemap.xml.
  const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;

  // Absolute image URL (needed for social crawlers)
  const absoluteImage = image?.startsWith('http')
    ? image
    : image
      ? `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`
      : `${SITE_URL}/favicon.png`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    setMeta('description', fullDescription);
    setMeta('keywords', keywords || DEFAULT_KEYWORDS);
    setMeta('author', photographerInfo.name);
    setMeta('robots', noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large');

    setMeta('og:title', fullTitle, true);
    setMeta('og:description', fullDescription, true);
    setMeta('og:type', type, true);
    setMeta('og:url', canonical, true);
    setMeta('og:image', absoluteImage, true);
    setMeta('og:site_name', photographerInfo.name, true);
    setMeta('og:locale', 'en_US', true);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', fullDescription);
    setMeta('twitter:image', absoluteImage);

    setLink('canonical', canonical);

    // Replace previous route-level JSON-LD blocks
    document.querySelectorAll(`script[${JSONLD_ATTR}]`).forEach((n) => n.remove());
    if (jsonLd) {
      const arr = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      arr.forEach((data) => {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.setAttribute(JSONLD_ATTR, 'true');
        s.text = JSON.stringify(data);
        document.head.appendChild(s);
      });
    }
  }, [fullTitle, fullDescription, canonical, absoluteImage, type, keywords, noIndex, jsonLd]);

  return null;
}
