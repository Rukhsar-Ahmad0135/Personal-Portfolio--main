import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock } from 'lucide-react';
import { getPostBySlug, getRelatedPosts } from '@/data/posts';
import { photographerInfo } from '@/data/photographer';
import { SEOHead } from '@/components/seo/SEOHead';
import { SITE_URL, OG_IMAGE, absoluteUrl } from '@/lib/siteConfig';

const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/404" replace />;
  const relatedPosts = getRelatedPosts(post.slug);

  return (
    <>
      <SEOHead
        title={`${post.title} | ${photographerInfo.name}`}
        description={post.description}
        image={OG_IMAGE}
        type="article"
        keywords={[...post.tags, 'Rukhsar Ahmad'].join(', ')}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
              { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            url: `${SITE_URL}/blog/${post.slug}`,
            datePublished: post.date,
            dateModified: post.date,
            image: absoluteUrl(OG_IMAGE),
            articleSection: post.tags.join(', '),
            wordCount: post.blocks.reduce(
              (n, b) => n + (b.type === 'p' || b.type === 'h3' ? b.text?.split(/\s+/).length ?? 0 : 0),
              0,
            ),
            author: {
              '@type': 'Person',
              name: photographerInfo.name,
              jobTitle: 'Full-Stack Web Developer',
              url: `${SITE_URL}/about`,
              sameAs: Object.values(photographerInfo.socialLinks).filter(Boolean),
            },
            publisher: { '@id': `${SITE_URL}/#person` },
            mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          },
        ]}
      />

      <div className="bg-[#f4f4f2] text-black selection:bg-black selection:text-white">
        {/* HEADER */}
        <section className="px-5 sm:px-6 lg:px-10 pt-28 sm:pt-32 md:pt-36 pb-10 border-b border-black/10">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-light text-black/50"
          >
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <Link to="/blog" className="hover:text-black transition-colors">Blog</Link>
            <span aria-hidden>/</span>
            <span className="text-black/70 truncate max-w-[16rem] md:max-w-sm">{post.title}</span>
          </motion.nav>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-4xl text-3xl sm:text-4xl md:text-6xl font-light tracking-[-0.03em] leading-[1.05]"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs md:text-sm font-light text-black/50"
          >
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {post.readingTime}
            </span>
            <span>
              By <Link to="/about" className="text-black hover:underline underline-offset-4">{photographerInfo.name}</Link>
            </span>
          </motion.div>
        </section>

        {/* ARTICLE */}
        <article className="px-5 sm:px-6 lg:px-10 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-lg md:text-xl font-light text-black/75 leading-relaxed"
            >
              {post.intro}
            </motion.p>

            <div className="mt-10 space-y-6">
              {post.blocks.map((block, i) => {
                if (block.type === 'h3') {
                  return (
                    <h2
                      key={i}
                      className="!mt-12 text-2xl md:text-3xl font-light tracking-tight"
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === 'list') {
                  return (
                    <ul key={i} className="space-y-3">
                      {block.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-base md:text-lg font-light leading-relaxed text-black/70"
                        >
                          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-black/40" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === 'code') {
                  return (
                    <div key={i} className="overflow-x-auto rounded-xl bg-black text-white/90">
                      <div className="flex items-center justify-between px-4 pt-3 text-[11px] uppercase tracking-widest text-white/40">
                        <span>{block.lang}</span>
                      </div>
                      <pre className="px-4 pb-4 pt-1 text-xs md:text-sm font-light leading-relaxed">
                        <code>{block.code}</code>
                      </pre>
                    </div>
                  );
                }
                return (
                  <p key={i} className="text-base md:text-lg font-light text-black/70 leading-relaxed">
                    {block.text}
                  </p>
                );
              })}
            </div>

            {/* AUTHOR BOX */}
            <div className="mt-16 border-t border-black/10 pt-8">
              <p className="text-xs font-light tracking-[0.25em] uppercase text-black/40 mb-4">
                About the author
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="space-y-1">
                  <p className="text-lg font-light">{photographerInfo.name}</p>
                  <p className="text-sm font-light text-black/60">
                    Full-Stack Web Developer — MERN · Next.js · AI Integration.
                  </p>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-1.5 text-sm font-light text-black hover:underline underline-offset-4 mt-1"
                  >
                    More about me <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* RELATED */}
            <div className="mt-12 border-t border-black/10 pt-8">
              <p className="text-xs font-light tracking-[0.25em] uppercase text-black/40 mb-4">
                Related work
              </p>
              <div className="flex flex-wrap gap-3">
                {post.related.map((r) => (
                  <Link
                    key={r.href}
                    to={r.href}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/20 text-sm font-light hover:bg-black hover:text-white transition"
                  >
                    {r.label} <ArrowUpRight className="size-3.5" />
                  </Link>
                ))}
                {relatedPosts.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/blog/${p.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/20 text-sm font-light hover:bg-black hover:text-white transition"
                  >
                    {p.title.length > 44 ? `${p.title.slice(0, 44)}…` : p.title}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-14">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-light text-black/60 hover:text-black transition-colors"
              >
                <ArrowLeft className="size-4" /> All articles
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
