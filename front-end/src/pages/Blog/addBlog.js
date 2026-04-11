
import AddBlogForm from "@/components/BlogCards/AddBlogForm";
import GetBackArrow from "@/components/ui/GetBackArrow";
function AddBlog() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 py-12 bg-gray-500">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <GetBackArrow />
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          Add Your Blog Post
        </h1>
          <AddBlogForm />
      </div>
    </main>
  );
}

export default AddBlog;
