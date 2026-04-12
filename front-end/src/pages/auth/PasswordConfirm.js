import ResetPassword from "@/components/authForms/reset-password";

function ResetPasswordConfirm({ token }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mt-10">Reset Password</h1>
        <ResetPassword token={token} />
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  const { token } = context.query;

  if (!token) {
    return {
      redirect: {
        destination: "/auth/Reset-password",
        permanent: false,
      },
    };
  }

  return {
    props: { token },
  };
}

export default ResetPasswordConfirm;
