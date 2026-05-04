import heroImage from "../../../public/images/BlogPageImages/hero.jpg";
import BlogGrid from "@/components/BlogCards/Blog-Grid";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

import AddBlogForm from "@/components/BlogCards/AddBlogForm";
import {VscChromeClose} from "react-icons/vsc";

export default function BlogPage(props) {
  const { blogs } = props;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const showAddArticleForm = isOpen || router.query.addArticle === "1";

  function handleAddArticle() {
    setIsOpen(true);
  }

  function handleCloseAddArticle() {
    setIsOpen(false);
    if (router.query.addArticle) {
      router.replace("/blogs", undefined, { shallow: true });
    }
  }

  return (
    <>
      <Head>
        <title>Blog - Kemet Travel</title>
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
        <section
          className="relative flex min-h-[60vh] w-full flex-col items-center justify-center overflow-hidden bg-cover bg-center px-4 py-12 text-center sm:min-h-[68vh] sm:px-6 sm:py-16 lg:min-h-[74vh] lg:px-8"
          style={{
            backgroundImage: `url(${heroImage.src})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/65" />

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
            <div className="w-full max-w-7xl rounded-full border border-gray-100 bg-white p-2 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-1 px-5 py-2 sm:border-r sm:border-gray-200">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Location
                  </span>
                  <input
                    type="text"
                    placeholder="How to, etc."
                    className="w-full bg-transparent text-sm font-bold text-[#111827] outline-none placeholder-[#111827]"
                  />
                </div>

                <div className="flex-1 px-5 py-2 sm:border-r sm:border-gray-200">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Date
                  </span>
                  <input
                    type="date"
                    className="w-full cursor-pointer bg-transparent text-sm font-bold text-[#111827] outline-none"
                  />
                </div>

                <div className="flex-1 px-5 py-2 sm:border-r sm:border-gray-200">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Travelers
                  </span>
                  <input
                    type="text"
                    placeholder="Guests"
                    className="w-full bg-transparent text-sm font-bold text-[#111827] outline-none placeholder-[#111827]"
                  />
                </div>

                <div className="flex-1 px-5 py-2">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Category
                  </span>
                  <input
                    type="text"
                    placeholder="Type"
                    className="w-full bg-transparent text-sm font-bold text-[#111827] outline-none placeholder-[#111827]"
                  />
                </div>

                <div className="px-2 py-2">
                  <button className="w-full rounded-full bg-[#FBBF24] px-8 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#e5a913] sm:w-auto">
                    FIND
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 flex justify-center sm:mt-8">
            <button
              className="rounded-full bg-yellow-500 px-6 py-3 text-sm font-bold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-yellow-600 sm:px-8 sm:text-base md:text-lg"
              onClick={handleAddArticle}
            >
              Add Your Article
            </button>
          </div>
        </section>

        <section className="py-12 px-4 md:px-12">
          <h2 className="text-3xl font-semibold mb-3 text-center">
            Recent Articles
          </h2>

          <BlogGrid
            blogPosts={blogs.map((blog) => ({
              title: blog.title,
              content: blog.content.slice(0, 100) + "...",
              image: blog.images[0]?.imageUrl,
              id: blog._id,
            }))}
          />

          <div className="flex justify-center mt-8">
            <button className="bg-gray-800 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-300 shadow-lg cursor-pointer">
              View All Articles
            </button>
          </div>
        </section>
      </main>

      {showAddArticleForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
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
    const Blog = await axios.get("http://localhost:3000/api/Blog/GetBlogs");
    return {
      props: {
        blogs: Blog.data,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      props: {
        blogs: [],
      },
    };
  }
}
