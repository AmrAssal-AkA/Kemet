import axios from "axios";
import Head from "next/head";
import Image from "next/image";

import LikeHeart from "@/components/ui/LikeHeart";
import { useState } from "react";

function BlogDetailPage(props) {
  const { blog } = props;
  const [comment, setComment] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post(`/api/Blog/AddCommentToBlog?blogId=${blog._id}`, {
        comment,
      });
      setSuccessMessage("Comment submitted successfully!");
      setComment("");
    }catch (error) {
      setError("Failed to submit comment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={blog.content.substring(0, 150)} />
      </Head>
      <main className="bg-linear-to-b from-slate-50 to-white">
        <div className="relative overflow-visible">

          <div className="relative h-96 md:h-125 lg:h-150 w-full">
            <Image
              src={blog.images[0]?.imageUrl}
              alt={blog.title}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
          </div>


          <div className="relative px-4 md:px-8 lg:px-12 -mt-32 md:-mt-40 lg:-mt-48 mb-16">
            <div className="mx-auto max-w-4xl">
              <div className="backdrop-blur-md bg-white/85 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl border border-white/20">

                <div className="mb-6 flex items-center gap-2">
                  <span className="inline-block px-4 py-2 rounded-full bg-yellow-400 text-blue-900 text-sm font-bold uppercase tracking-wider">
                    {blog.category || "Travel"}
                  </span>
                </div>


                <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                      {blog.title}
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 font-medium">
                      By <span className="font-semibold">{blog.author}</span> •{" "}
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>


                  <div className="shrink-0">
                    <LikeHeart />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 md:px-8 lg:px-12 py-12">
            <div className="mx-auto max-w-4xl">
              {/* Content Text */}
              <article className="prose prose-lg max-w-none mb-16">
                <p className="text-lg text-gray-700 leading-relaxed font-light first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
                  {blog.content}
                </p>
              </article>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                {blog.images[1]?.imageUrl && (
                  <div className="rounded-3xl overflow-hidden shadow-lg">
                    <Image
                      src={blog.images[0].imageUrl}
                      alt={`${blog.title} image 2`}
                      width={400}
                      height={300}
                      className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                {blog.images[2]?.imageUrl && (
                  <div className="rounded-3xl overflow-hidden shadow-lg">
                    <Image
                      src={blog.images[2].imageUrl}
                      alt={`${blog.title} image 3`}
                      width={400}
                      height={300}
                      className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 py-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-center">Comments Section</h2>
              <div className="mx-auto max-w-4xl px-4 md:px-8 lg:px-12">
                <form className="mb-8" onSubmit={handleCommentSubmit}>
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                      Add a comment
                    </label>
                    <textarea
                      id="comment"
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write your comment here..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Comment"}
                  </button>
                </form>
              </div>

              <div className="mx-auto max-w-4xl px-4 md:px-8 lg:px-12">
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                  {blog.comments.length === 0 ? (
                    <p className="text-gray-600">No comments yet. Be the first to comment!</p>
                  ) : (
                    blog.comments.map((comment) => (
                      <div key={comment._id} className="mb-4">
                        <p className="text-sm text-gray-800 font-semibold mb-1">{comment.user.name}</p>
                        <p className="text-sm text-gray-500 mb-1">
                          {new Date(comment.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-gray-800">{comment.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
        </div>
      </main>
    </>
  );
}

export default BlogDetailPage;

export async function getServerSideProps(context) {
  const blogId = context.query.blogId;

  try {
    const res = await axios.get(`http://localhost:3000/api/Blog/getoneBlog`,
      {
        params: { blogId },
      }
    );
    return {
      props: {
        blog: res.data,
      },
    };
  } catch (error) {
    console.error("Error fetching blog:", error.message);
    return {
      notFound: true,
    };
  }
}
