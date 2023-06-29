import Link from "next/link";

const Index = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-evenly gap-2 text-blue-500">
      <Link href="/bidder">go to the bidder page</Link>
      <Link href="/thesaleroom">go to thesaleroom view</Link>
      <Link href="/easyLiveAuction">go to easyLiveAuction view</Link>
      <Link href="/dev">go to dev page</Link>
    </div>
  );
};

export default Index;
