import Head from "next/head";
import Image from "next/image";

import LikeHeart from "@/components/ui/LikeHeart";
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

function BlogDetailPage(props) {
  const { blog } = props;
  const heroImage = getBlogImage(blog.images, 0);
  const secondImage = getBlogImage(blog.images, 1);
  const thirdImage = getBlogImage(blog.images, 2);
  const authorName = getTextValue(blog.author || blog.user, "Kemet Travel");
  const categoryName = getTextValue(blog.category, "Travel");
  const createdDate = getDisplayDate(blog.createdAt);

  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={(blog.content || "").substring(0, 150)} />
      </Head>
      <main className="bg-linear-to-b from-slate-50 to-white">
        <div className="relative overflow-visible">

          <div className="relative h-96 md:h-125 lg:h-150 w-full">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={blog.title}
                fill
                className="object-cover object-center"
                priority
              />
            ) : (
              <div className="h-full w-full bg-gray-200" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
          </div>


          <div className="relative px-4 md:px-8 lg:px-12 -mt-32 md:-mt-40 lg:-mt-48 mb-16">
            <div className="mx-auto max-w-4xl">
              <div className="backdrop-blur-md bg-white/85 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl border border-white/20">

                <div className="mb-6 flex items-center gap-2">
                  <span className="inline-block px-4 py-2 rounded-full bg-yellow-400 text-blue-900 text-sm font-bold uppercase tracking-wider">
                    {categoryName}
                  </span>
                </div>


                <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                      {blog.title}
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 font-medium">
                      By <span className="font-semibold">{authorName}</span>
                      {createdDate && <> • {createdDate}</>}
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
                {secondImage && (
                  <div className="rounded-3xl overflow-hidden shadow-lg">
                    <Image
                      src={secondImage}
                      alt={`${blog.title} image 2`}
                      width={400}
                      height={300}
                      className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                {thirdImage && (
                  <div className="rounded-3xl overflow-hidden shadow-lg">
                    <Image
                      src={thirdImage}
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
