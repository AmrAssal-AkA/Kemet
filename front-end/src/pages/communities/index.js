export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/blogs",
      permanent: false,
    },
  };
}

export default function CommunityRedirect() {
  return null;
}
