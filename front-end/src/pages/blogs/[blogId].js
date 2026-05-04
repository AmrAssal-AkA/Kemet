import axios from "axios";
import Head from "next/head";
import Image from "next/image";

import LikeHeart from "@/components/ui/LikeHeart";

function BlogDetailPage(props) {
  const { blog } = props;

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
