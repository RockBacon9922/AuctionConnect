import { useMemo, useState } from "react";

import { api } from "~/utils/api";

const bidder = () => {
  return (
    <div>
      <h1>bidder</h1>
      <CurrentLot />
      <PlaceBid />
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
  const currentLot = api.lot.current.useQuery(undefined, {
    refetchInterval: 3000,
  });
  const bidMutation = api.bid.create.useMutation({
    onSuccess: () => {
      currentLot.refetch();
    },
  });

  const asking: number = currentLot?.data?.asking || 1;
  const bid: number = currentLot?.data?.Bid[0]?.amount || 0;
  const lotId: number = currentLot?.data?.id || 0;

  const [isDisabled, setIsDisabled] = useState(true);

  useMemo(() => {
    if (asking > bid) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [asking, bid]);

  if (!currentLot.data) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>Place Bid</h2>
      <button
        onClick={() =>
          bidMutation.mutate({
            amount: asking,
            lotId: lotId,
          })
        }
        disabled={isDisabled}
      >
        {currentLot.data?.asking}
      </button>
    </div>
  );
};
