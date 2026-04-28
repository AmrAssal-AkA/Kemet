export default function AdminDashboardRedirect() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/admin",
      permanent: false,
    },
  };
}
