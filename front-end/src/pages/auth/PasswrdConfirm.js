import { confirmResetPassword} from "@/services/authService";
import { useState } from "react"

function ResetPasswordConfirm() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await confirmResetPassword(formData);
      alert(res.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className='text-3xl font-bold text-center mt-10'>Reset Password</h1>
        <form className='w-full max-w-md p-8 rounded-lg shadow-md mt-6' onSubmit={handleSubmit} >
            <div className='mb-4'>
                <label htmlFor="oldPassword" className='block text-gray-700 font-bold mb-2'>Old Password</label>
                <input type='password' id='oldPassword' className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter your old password' required onChange={(e) => setFormData({...formData, oldPassword: e.target.value})} />
            </div>
            <div className='mb-4'>
                <label htmlFor="newPassword" className='block text-gray-700 font-bold mb-2'>New Password</label>
                <input type='password' id='newPassword' className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter your new password' required onChange={(e) => setFormData({...formData, newPassword: e.target.value})} />
            </div>
            <button type='submit' className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200' disabled={isLoading}>
                {isLoading ? "confirming...." : "Confirm Reset Password"}
            </button>
        </form>
        {error && <p className='text-red-500 mt-4'>{error}</p>}
        </div>
    </main>
  )
}

export default ResetPasswordConfirm
