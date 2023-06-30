import { useMemo, useState } from "react";

import { getIncrementForPrice } from "@acme/increments";

import { api } from "~/utils/api";

const bidder = () => {
  return (
    <div>
      <h1>thesaleroom</h1>
      <IncomingBid />
      <Bid />
      <SetInterval />
    </div>
  );
};

export default bidder;

const IncomingBid = () => {
  const currentLot = api.lot.current.useQuery(undefined, {
    refetchInterval: 3000,
  });

  const asking: number = currentLot?.data?.asking || 1;
  const bid = currentLot?.data?.Bid[0];
  const lotId: number = currentLot?.data?.id || 0;

  return (
    <div>
      <h1>Lot {lotId}</h1>
      <h2>Asking: {asking}</h2>
      <h2 style={bid?.online || false ? { color: "green" } : { color: "red" }}>
        Bid: {bid?.amount}
      </h2>
      <h2>Time: {bid?.time.toLocaleDateString()}</h2>
    </div>
  );
};

const Bid = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const currentLot = api.lot.current.useQuery(undefined, {
    refetchInterval: 3000,
  });
  const bidMutation = api.bid.create.useMutation({
    onSuccess: () => {
      currentLot.refetch();
    },
  });

  const asking: number = currentLot?.data?.asking || 1;
  const lotId: number = currentLot?.data?.id || 0;
  const bid: number = currentLot?.data?.Bid[0]?.amount || 0;

  useMemo(() => {
    if (asking != bid) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [asking, bid]);

  return (
    <div>
      <h1>Lot {currentLot?.data?.id}</h1>
      <h2>Asking: {asking}</h2>
      <button
        onClick={() => {
          bidMutation.mutate({ amount: asking, lotId: lotId, online: false });
        }}
        disabled={isDisabled}
      >
        Bid
      </button>
    </div>
  );
};

const SetInterval = () => {
  const [ask, setAsk] = useState(1);
  const currentLot = api.lot.current.useQuery(undefined, {
    refetchInterval: 3000,
  });

  const askMutation = api.lot.updateAsk.useMutation({
    onSuccess: () => {
      currentLot.refetch();
    },
  });

  const lotId = currentLot?.data?.id || 0;

  // get the highest bid or asking price
  const highestBid: number =
    currentLot?.data?.Bid[0]?.amount || currentLot?.data?.asking || 1;

  // const asking = getIncrementForPrice(highestBid) + highestBid || 1;
  useMemo(() => {
    setAsk(getIncrementForPrice(highestBid) + highestBid || 1);
  }, [highestBid]);

  return (
    <div>
      <h1>Lot {currentLot?.data?.id}</h1>
      <input
        value={ask}
        onChange={(e) => setAsk(Number(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            askMutation.mutate({ asking: ask, id: lotId });
          }
        }}
      />
    </div>
  );
};
