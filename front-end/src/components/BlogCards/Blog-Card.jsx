import Image from "next/image";

function BlogCard(props) {
  return (
    <li className="bg-white rounded-lg shadow-md overflow-hidden justify-center items-center flex flex-col border border-orange-300 border-dashed p-3">
      <Image
        src={props.image}
        alt={props.title}
        width={500}
        height={250}
        quality={90}
        className="w-full h-80 object-cover mb-4 rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{props.title}</h3>
        <p className="text-gray-600">{props.content}</p>
      </div>
      <button className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-full m-4 hover:bg-yellow-600 transform hover:scale-105 transition-transform duration-300">
        Read More
      </button>
    </li>
  );
}

export default BlogCard;
