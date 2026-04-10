import BlogCard from "./Blog-Card";

function BlogGrid({ blogPosts }) {
  return (
    <div className="py-12 px-4 md:px-12 ">
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {blogPosts.map((post, index) => (
          <BlogCard key={index} {...post} />
        ))}
      </ul>
    </div>
  );
}

export default BlogGrid;
