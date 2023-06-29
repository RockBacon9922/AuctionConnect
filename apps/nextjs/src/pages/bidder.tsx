import { api } from "~/utils/api";

const bidder = () => {
  return (
    <div>
      <h1>bidder</h1>
      <CurrentLot />
    </div>
  );
};

export default bidder;

const CurrentLot = () => {
  const currentLot = api.lot.current.useQuery(undefined, {
    refetchInterval: 3000,
  });
  return (
    <div>
      <h2>Current Lot</h2>
      <pre>{JSON.stringify(currentLot.data, null, 2)}</pre>
    </div>
  );
};

const PlaceBid = () => {
  const [bid, setBid] = useState(0);
  const currentLot = api.lot.current.useQuery(undefined, {
    refetchInterval: 3000,
  });

  // check if there are any bids
  if (!currentLot.data?.Bid.length) {
    currentLot.data?.lowEstimate
  }
  return (
    <div>
      <h2>Place Bid</h2>
    </div>
  );
};
