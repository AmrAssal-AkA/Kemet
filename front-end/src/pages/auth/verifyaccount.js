import axios from "axios";
import { redirect } from "next/dist/server/api-utils";

function verifyaccount({ response }) {
  const { success } = response || {};
  return (
    <main className="min-h-screen w-full ">
      <div className="flex h-full w-full items-center justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Your Account Has Been {success ? "Successfully" : "Unsuccessfully"}{" "}
            Verified
          </h1>
          <p className="mt-4 text-sm text-slate-500">
            Your account has been {success ? "successfully" : "unsuccessfully"}{" "}
            verified. You can now log in.
          </p>
        </div>
      </div>
    </main>
  );
}

export default verifyaccount;

export async function getServerSideProps(context) {
  const { token } = context.query;
    if(!token){
        return {
            props: { response: { success: false } },
            redirect:{
                destination: "/",
                permanent: false,
            } 
        }
    }
    
    
  try {
    const response = await axios.get(
      "http://localhost:8000/api/auth/verify-email",
      {
        params: { token },
      },
    );

    return {
      props: {
        response: response.data,
      },
    };
  } catch (error) {
    console.error("Error verifying email:", error);
    return {
      props: {
        response: { success: false },
        redirect:{
            destination: "/",
            permanent: false,
        } 
        
      },
    };
  }
}
