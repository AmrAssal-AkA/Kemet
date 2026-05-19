import BlogCard from "./Blog-Card";

function BlogGrid({ blogPosts }) {
  return (
    <div className="px-0 py-8 sm:px-4 md:px-8 lg:px-12 lg:py-12">
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <BlogCard key={post.id} {...post} index={index} />
        ))}
      </ul>
    </div>
  );
}

export default BlogGrid;
