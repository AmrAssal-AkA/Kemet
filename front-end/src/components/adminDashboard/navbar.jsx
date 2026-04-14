import {FaBahi, FaBell} from "react-icons/fa6"

export default function AdminNavBar() {
  return (
    <nav className="flex items-center justify-between p-4">
      <div className="">
      <h1 className="text-2xl font-bold">Kemet Admin</h1>
      </div>
        <ul className="flex space-x-4 mt-2">
          <li>
            <Link alt="notifications" >
              <FaBell className="inline mr-1" />
            </Link>
          </li>
          <li>
            <Link alt="settings" >
              <FaBahi className="inline mr-1" />
            </Link>
          </li>
        </ul>
        <div className="mt-4">
          <button className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">
            create Trip
          </button>
        </div>
    </nav>
  )
}
