import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockBlogPosts } from '../data/mockBlogPosts';
import { AdBanner } from '../components/ads/AdBanner';
import { Button } from '../components/common/Button';
import { ChevronRight, Clock, Calendar, ArrowLeft, Share2, Check } from 'lucide-react';

export const SingleBlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = React.useState(false);

  const post = mockBlogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white mb-2">
          Article Not Found
        </h2>
        <p className="text-slate-500 mb-6 text-sm">The wellness article you requested does not exist.</p>
        <Link to="/blog">
          <Button variant="primary">Return to Blog</Button>
        </Link>
      </div>
    );
  }

  const relatedPosts = mockBlogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-emerald-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/blog" className="hover:text-emerald-600 transition-colors">
          Blog
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">
          {post.title}
        </span>
      </nav>

      {/* Header meta */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-slate-500 font-medium">{post.readTime}</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{post.author.name}</p>
              <p className="text-xs text-slate-500">{post.author.role} • {post.date}</p>
            </div>
          </div>

          <button
            onClick={handleShare}
            aria-label="Share article"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Article Body */}
      <div
        className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-base leading-relaxed space-y-4 pt-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Tags:</span>
        {post.tags.map((t) => (
          <span key={t} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            #{t}
          </span>
        ))}
      </div>

      {/* Ad placement after article body as required by TRD */}
      <AdBanner zone="in-content" />

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
            Related Wellness Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedPosts.map((r) => (
              <Link
                key={r.id}
                to={`/blog/${r.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all"
              >
                <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h4 className="font-heading font-semibold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 line-clamp-2">
                    {r.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-2">{r.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
