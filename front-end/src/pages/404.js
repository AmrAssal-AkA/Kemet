import { useRouter } from "next/router"


function notFoundPage() {
    const router =useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-6 sm:px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
        <button onClick={()=> {
            router.push("/")
        }}
        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-all duration-200"
        >
            Go Home
        </button>
    </main>
  )
}

export default notFoundPage