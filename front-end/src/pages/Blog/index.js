import { useRouter } from "next/router";
import heroImage from "../../../public/images/BlogPageImages/hero.jpg";
import BlogGrid from "@/components/BlogCards/Blog-Grid";
import axios from "axios";

export default function BlogPage(props) {
  const router = useRouter();
  const { blogs } = props;

  function handleAddArticle() {
    router.push("/Blog/addBlog");
  }
  return (
    <main className="w-full min-h-screen bg-gray-100">
      <section
        className="relative w-full flex flex-col items-center justify-center p-8 text-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage.src})`,
          height: "75vh",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 text-white">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Let's Explore
            <br />
            <span className="text-sky-400">New Possibilities...</span>
          </h1>
          <p className="max-w-2xl mt-4 text-lg md:text-xl">
            Plan your smart trip to Egypt – from temples to turquoise seas
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center mt-8">
          <div className="flex items-center w-full max-w-md p-2 bg-white rounded-full shadow-lg">
            <input
              type="text"
              placeholder="How to, etc."
              className="w-full px-4 text-gray-700 placeholder-gray-500 bg-transparent border-none grow focus:outline-none"
            />
            <button className="px-6 py-2 font-bold text-black transition-transform duration-300 transform bg-yellow-500 rounded-full hover:bg-yellow-600 hover:scale-105">
              Search
            </button>
          </div>
        </div>

        <div className="relative z-10 flex justify-center mt-8">
          <button
            className="px-8 py-3 text-lg font-bold text-black transition-transform duration-300 transform bg-yellow-500 rounded-full shadow-lg hover:bg-yellow-600 hover:scale-105"
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
            content: blog.content,
            image: blog.image,
          }))}
        />


        <div className="flex justify-center mt-8">
          <button className="bg-gray-800 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-300 shadow-lg cursor-pointer">
            View All Articles
          </button>
        </div>
      </section>
    </main>
  );
}


export async function getServerSideProps() {
  try{
    const Blog = await axios.get("/api/Blog/GetBlogs");
    return {
      props: {
        blogs: Blog.data,
      }
    }
  }catch(error){
    console.error("Error fetching blogs:", error);
    return {
      props: {
        blogs: [],
      },
    };
  }
}