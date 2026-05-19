import heroImage from "../../../public/images/BlogPageImages/hero.jpg";
import BlogGrid from "@/components/BlogCards/Blog-Grid";
import Head from "next/head";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";

import AddBlogForm from "@/components/BlogCards/AddBlogForm";
import { buildApiUrl } from "@/utils/apiBaseUrl";
import { VscChromeClose } from "react-icons/vsc";

function normalizeBlogs(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.blogs)) return data.blogs;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.blogs)) return data.data.blogs;
  return [];
}

function getBlogImage(images, index = 0) {
  const image = Array.isArray(images) ? images[index] : null;
  if (typeof image === "string") return image;
  return image?.imageUrl || image?.url || "";
}

function getTextValue(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.name || value.fullName || value.username || "";
}

function getBlogDate(blog) {
  if (!blog.createdAt) return "";
  const date = new Date(blog.createdAt);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export default function BlogPage(props) {
  const { blogs = [], fetchError = null } = props;
  const router = useRouter();
  const recentArticlesRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    date: "",
    category: "",
  });
  const showAddArticleForm = isOpen || router.query.addArticle === "1";
  const hasActiveSearch = Object.values(activeFilters).some(Boolean);

  const filteredBlogs = useMemo(() => {
    const searchQuery = activeFilters.search.toLowerCase();
    const categoryQuery = activeFilters.category.toLowerCase();

    if (!hasActiveSearch) return blogs;

    return blogs.filter((blog) => {
      const categoryText = getTextValue(blog.category).toLowerCase();
      const blogDate = getBlogDate(blog);
      const searchableContent = [
        blog.title,
        blog.content,
        blog.author,
        blog.author?.name,
        blog.user?.name,
        categoryText,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!searchQuery || searchableContent.includes(searchQuery)) &&
        (!activeFilters.date || blogDate === activeFilters.date) &&
        (!categoryQuery || categoryText.includes(categoryQuery))
      );
    });
  }, [activeFilters, blogs, hasActiveSearch]);

  const blogPosts = filteredBlogs.map((blog) => ({
    title: blog.title || "Untitled Article",
    content: blog.content ? `${blog.content.slice(0, 100)}...` : "",
    image: getBlogImage(blog.images) || heroImage.src,
    id: blog._id || blog.id || blog.blogId,
  }));

  function handleAddArticle() {
    setIsOpen(true);
  }

  function handleCloseAddArticle() {
    setIsOpen(false);
    if (router.query.addArticle) {
      router.replace("/blogs", undefined, { shallow: true });
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setActiveFilters({
      search: searchInput.trim(),
      date: dateInput,
      category: categoryInput.trim(),
    });
    recentArticlesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleViewAllArticles() {
    if (
      hasActiveSearch ||
      searchInput.trim() ||
      dateInput ||
      categoryInput.trim()
    ) {
      setSearchInput("");
      setDateInput("");
      setCategoryInput("");
      setActiveFilters({
        search: "",
        date: "",
        category: "",
      });
      return;
    }

    recentArticlesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <>
      <Head>
        <title>Blogs - Kemet Travel</title>
        <meta
          name="description"
          content="Discover the wonders of Egypt through our travel blog. Explore ancient temples, vibrant culture, and hidden gems with us."
        />
        <meta
          name="keywords"
          content="Egypt travel blog, travel tips Egypt, things to do in Egypt, Egypt culture, Egypt history, travel guides Egypt"
        />
        <meta name="author" content="Kemet Travel" />
        <meta name="robots" content="nofollow" />
      </Head>
      <main className="w-full min-h-screen bg-gray-100">
        <section className="relative flex min-h-[600px] w-full flex-col items-center justify-center overflow-hidden px-4 py-12 text-center sm:min-h-[640px] sm:px-6 sm:py-16 lg:min-h-[700px] lg:px-8">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/55 to-black/65" />

          <div className="relative z-10 mx-auto w-full max-w-4xl text-white">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Let&apos;s Explore
              <br />
              <span className="text-sky-300">New Possibilities...</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-100 sm:mt-5 sm:text-base md:text-lg lg:text-xl">
              Plan your smart trip to Egypt – from temples to turquoise seas
            </p>
          </div>

          <div className="relative z-10 mt-8 flex w-full justify-center sm:mt-9">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-6xl rounded-3xl border border-gray-100 bg-white p-2 shadow-xl lg:rounded-full"
            >
              <div className="flex flex-col lg:flex-row lg:items-center">
                <div className="flex-1 border-b border-gray-100 px-5 py-3 lg:border-b-0 lg:border-r lg:border-gray-200">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Search
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Luxor temples, Nile cruise"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-[#111827] outline-none placeholder-[#111827]"
                  />
                </div>

                <div className="flex-1 border-b border-gray-100 px-5 py-3 lg:border-b-0 lg:border-r lg:border-gray-200">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Date
                  </span>
                  <input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full cursor-pointer bg-transparent text-sm font-bold text-[#111827] outline-none"
                  />
                </div>

                <div className="flex-1 border-b border-gray-100 px-5 py-3 lg:border-b-0 lg:border-r lg:border-gray-200">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Category
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Culture, Tips"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-[#111827] outline-none placeholder-[#111827]"
                  />
                </div>

                <div className="px-2 py-2 lg:shrink-0">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#FBBF24] px-8 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#e5a913] lg:w-auto"
                  >
                    FIND
                  </button>
                </div>
              </div>
            </form>
          </div>

        </section>

        <div className="flex justify-center px-4 pt-8">
          <button
            className="rounded-full bg-yellow-500 px-6 py-3 text-sm font-bold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-yellow-600 sm:px-8 sm:text-base"
            onClick={handleAddArticle}
          >
            Add Your Article
          </button>
        </div>

        <section ref={recentArticlesRef} className="py-12 px-4 md:px-12">
          <h2 className="text-3xl font-semibold mb-3 text-center">
            Recent Articles
          </h2>

          {fetchError ? (
            <p className="mx-auto mt-8 max-w-2xl rounded-lg bg-white px-6 py-5 text-center text-gray-600 shadow-sm">
              Articles could not be loaded right now.
            </p>
          ) : blogPosts.length > 0 ? (
            <BlogGrid blogPosts={blogPosts} />
          ) : (
            <p className="mx-auto mt-8 max-w-2xl rounded-lg bg-white px-6 py-5 text-center text-gray-600 shadow-sm">
              {hasActiveSearch
                ? "No matching articles found."
                : "No articles available yet."}
            </p>
          )}

          <div className="flex justify-center mt-8">
            <button
              onClick={handleViewAllArticles}
              className="rounded-full bg-yellow-500 px-8 py-3 text-lg font-bold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-yellow-600 cursor-pointer"
            >
              View All Articles
            </button>
          </div>
        </section>
      </main>

      {showAddArticleForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 z-40" />
          <div className="relative z-50 bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseAddArticle}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <VscChromeClose className="text-2xl" />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
              Add Your Blog Post
            </h1>
            <AddBlogForm onSuccess={handleCloseAddArticle} />
          </div>
        </div>
      )}
    </>
  );
}

export async function getStaticProps() {
  try {
    const response = await fetch(buildApiUrl("/api/blog"));

    if (!response.ok) {
      throw new Error(`Blog fetch failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      props: {
        blogs: normalizeBlogs(data),
        fetchError: null,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      props: {
        blogs: [],
        fetchError: "Blogs could not be loaded.",
      },
      revalidate: 10,
    };
  }
}
