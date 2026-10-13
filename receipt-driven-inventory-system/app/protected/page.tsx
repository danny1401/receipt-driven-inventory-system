import { isAuthenticated } from "@/lib/authServer";

const Page = async () => {
  const hasToken = await isAuthenticated();
  if (!hasToken) {
    return <div>Unauthorized</div>;
  }

  return (
    <div>
      <p>Hello</p>
    </div>
  );
};

export default Page;