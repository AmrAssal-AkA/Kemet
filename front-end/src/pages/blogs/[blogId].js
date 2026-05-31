import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import LikeHeart from "@/components/ui/LikeHeart";
import { addBlogComment, getBlogComments } from "@/services/contentServices";
import { buildApiUrl } from "@/utils/apiBaseUrl";

function normalizeBlog(data) {
  return data?.blog || data?.data?.blog || data?.data || data || null;
}

function getBlogImage(images, index = 0) {
  const image = Array.isArray(images) ? images[index] : null;
  if (typeof image === "string") return image;
  return image?.imageUrl || image?.url || "";
}

function getTextValue(value, fallback = "") {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value.name || value.fullName || value.username || fallback;
}

function getDisplayDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getContentParagraphs(content) {
  return String(content || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function normalizeComments(value) {
  if (!Array.isArray(value)) return [];
  return value;
}

function getCommentText(comment) {
  return comment?.comment || comment?.content || comment?.text || "";
}

function getCommentAuthor(comment) {
  if (!comment) return "";
  const user = comment.user || comment.author || comment.userId;
  if (typeof user === "string") return "";
  return getTextValue(user, "");
}

function getLikedBlogIds(data) {
  const likes = Array.isArray(data?.likes)
    ? data.likes
    : Array.isArray(data?.data?.likes)
      ? data.data.likes
      : [];
  const likedBlogs = Array.isArray(data?.likedBlogs)
    ? data.likedBlogs
    : Array.isArray(data?.data?.likedBlogs)
      ? data.data.likedBlogs
      : [];

  return [...likes, ...likedBlogs]
    .map((item) => {
      const blog = item?.blogId || item?.blog || item;
      return String(blog?._id || blog?.id || blog || "");
    })
    .filter(Boolean);
}

function BlogDetailPage(props) {
  const { blog } = props;
  const blogId = blog._id || blog.id || blog.blogId;
  const primaryImage = getBlogImage(blog.images, 0);
  const secondImage = getBlogImage(blog.images, 1);
  const thirdImage = getBlogImage(blog.images, 2);
  const authorName = getTextValue(blog.author || blog.user, "Kemet Travel");
  const categoryName = getTextValue(blog.category, "Travel");
  const createdDate = getDisplayDate(blog.createdAt);
  const paragraphs = useMemo(() => getContentParagraphs(blog.content), [blog.content]);
  const [comments, setComments] = useState(() => normalizeComments(blog.comments));
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!blogId) return;

    let active = true;
    setCommentsLoading(true);
    setCommentsError("");

    getBlogComments(blogId)
      .then((result) => {
        if (active) setComments(normalizeComments(result));
      })
      .catch((error) => {
        if (active) setCommentsError(error.message || "Comments could not be loaded.");
      })
      .finally(() => {
        if (active) setCommentsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [blogId]);

  async function handleCommentSubmit(event) {
    event.preventDefault();
    const cleanComment = commentText.trim();
    if (!cleanComment || !blogId) return;

    setSubmittingComment(true);
    setSubmitStatus("");
    setCommentsError("");

    try {
      await addBlogComment(blogId, cleanComment);
      setCommentText("");
      const updatedComments = await getBlogComments(blogId);
      setComments(normalizeComments(updatedComments));
      setSubmitStatus("Comment added successfully.");
    } catch (error) {
      const message =
        error.message === "UNAUTHORIZED"
          ? "Please log in as a user to add a comment."
          : error.message || "Comment could not be added.";
      setSubmitStatus(message);
    } finally {
      setSubmittingComment(false);
    }
  }

  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={(blog.content || "").substring(0, 150)} />
      </Head>
      <main className="bg-linear-to-b from-slate-50 to-white px-4 py-8 text-slate-900 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8 lg:p-10">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold uppercase tracking-wider text-blue-900">
                {categoryName}
              </span>
            </div>

            <div className="mt-6 flex flex-col items-start justify-between gap-5 md:flex-row md:items-start">
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-extrabold leading-tight text-gray-950 md:text-5xl">
                  {blog.title}
                </h1>
                <p className="mt-4 text-sm font-medium text-gray-600 md:text-base">
                  By <span className="font-semibold">{authorName}</span>
                  {createdDate && <> - {createdDate}</>}
                </p>
              </div>

              <div className="shrink-0">
                <LikeHeart
                  blogId={blogId}
                  initialLiked={Boolean(blog.isLiked)}
                  initialCount={Number(blog.likesCount ?? blog.likes ?? 0)}
                />
              </div>
            </div>

            {primaryImage && (
              <div className="relative mt-8 overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 shadow-sm">
                <Image
                  src={primaryImage}
                  alt={blog.title}
                  width={1200}
                  height={700}
                  className="h-72 w-full object-cover md:h-96"
                  priority
                />
              </div>
            )}

            <div className="mt-8 max-w-3xl space-y-5 text-lg leading-8 text-gray-700">
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              ) : (
                <p>{blog.content}</p>
              )}
            </div>

            {(secondImage || thirdImage) && (
              <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
                {secondImage && (
                  <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
                    <Image
                      src={secondImage}
                      alt={`${blog.title} image 2`}
                      width={600}
                      height={420}
                      className="h-64 w-full object-cover"
                    />
                  </div>
                )}
                {thirdImage && (
                  <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
                    <Image
                      src={thirdImage}
                      alt={`${blog.title} image 3`}
                      width={600}
                      height={420}
                      className="h-64 w-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </article>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-600">
                  Community
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-gray-950">Comments</h2>
              </div>
              {commentsLoading && <p className="text-sm font-semibold text-slate-500">Loading comments...</p>}
            </div>

            {commentsError && (
              <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-700">
                {commentsError}
              </p>
            )}

            <div className="mt-5 space-y-3">
              {comments.length > 0 ? (
                comments.map((comment, index) => {
                  const author = getCommentAuthor(comment);
                  const commentDate = getDisplayDate(comment?.createdAt);
                  return (
                    <div
                      key={comment._id || comment.id || `${comment.createdAt || "comment"}-${index}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                        {author && <span>{author}</span>}
                        {author && commentDate && <span>-</span>}
                        {commentDate && <span>{commentDate}</span>}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{getCommentText(comment)}</p>
                    </div>
                  );
                })
              ) : (
                !commentsLoading && (
                  <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                    No comments yet.
                  </p>
                )
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="mt-6 space-y-3">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue-900">
                  Add a comment
                </span>
                <textarea
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                  placeholder="Share your thoughts"
                />
              </label>
              {submitStatus && (
                <p className="text-sm font-semibold text-slate-600">{submitStatus}</p>
              )}
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="rounded-full bg-yellow-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-sm transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submittingComment ? "Submitting..." : "Submit Comment"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}

export default BlogDetailPage;

export async function getServerSideProps(context) {
  const blogId = context.params?.blogId || context.query.blogId;

  try {
    const res = await fetch(buildApiUrl(`/api/blog/${blogId}`), {
      headers: context.req.headers.cookie
        ? { Cookie: context.req.headers.cookie }
        : {},
    });

    if (!res.ok) {
      throw new Error(`Blog fetch failed with status ${res.status}`);
    }

    const data = await res.json();
    const blog = normalizeBlog(data);

    if (!blog) {
      return {
        notFound: true,
      };
    }

    try {
      const likedRes = await fetch(buildApiUrl("/api/userdashboard/blogLikes"), {
        headers: context.req.headers.cookie
          ? { Cookie: context.req.headers.cookie }
          : {},
      });

      if (likedRes.ok) {
        const likedData = await likedRes.json();
        const likedBlogIds = getLikedBlogIds(likedData);
        const currentBlogId = String(blog._id || blog.id || blog.blogId || blogId);
        blog.isLiked = likedBlogIds.includes(currentBlogId);
      }
    } catch (error) {
      console.error("Error fetching liked blogs:", error.message);
    }

    return {
      props: {
        blog,
      },
    };
  } catch (error) {
    console.error("Error fetching blog:", error.message);
    return {
      notFound: true,
    };
  }
}
