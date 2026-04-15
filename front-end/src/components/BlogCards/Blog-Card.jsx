import Image from "next/image";
import { useRouter } from "next/router";

function BlogCard({ title, content, image, id , index}) {
  const router = useRouter();

  return (
    <li className="bg-white rounded-lg text-center shadow-md overflow-hidden justify-center items-center flex flex-col border border-orange-300 border-dashed p-3">
      <Image
        src={image}
        alt={title}
        width={500}
        height={250}
        priority={index === 0}
        className="w-full h-80 object-cover mb-4 rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-left">{content}</p>
      </div>
      <button
        className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-full m-4 hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-300"
        onClick={() => router.push(`/blog/${id}`)}
      >
        Read More
      </button>
    </li>
  );
}

export default BlogCard;
