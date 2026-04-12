
import AuthForm from "@/components/authForms/auth";

export default function Auth() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-6 sm:px-6">
      {<AuthForm />}
    </main>
  );
}
