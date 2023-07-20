import { useMemo, useState } from "react";
import Image from "next/image";

import { getIncrementForPrice } from "@acme/increments";

import { api } from "~/utils/api";
import deskimage from "../../public/Desk.png";

const bidder = () => {
  return (
    <div>
      <h1>thesaleroom</h1>
      <IncomingBid />
      <Bid />
      <SetInterval />
      <RoomBid />
      <UpdateCurrentLot type="pass" status="pass" />
      <UpdateCurrentLot type="sell" status="sold" />
      <Image src={deskimage} id="image" alt="image of lot" width={200} />
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
      <h1 id="currentLot">Lot {lotId}</h1>
      <h2 id="description">description: {currentLot.data?.description}</h2>
      <h2 id="lowEstimate">Low Estimate: {currentLot.data?.lowEstimate}</h2>
      <h2 id="highEstimate">High Estimate: {currentLot.data?.highEstimate}</h2>
      <h2 id="currentAsk">Asking: {asking}</h2>
      <h2 id="currentBidder">Bidder: sr{bid?.id}</h2>
      <h2
        style={bid?.online || false ? { color: "green" } : { color: "red" }}
        id="currentBid"
      >
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
      <button
        onClick={() => {
          bidMutation.mutate({ amount: asking, lotId: lotId, online: false });
        }}
        disabled={isDisabled}
        id="bidButton"
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
    setAsk(highestBid || 1);
  }, [highestBid]);

  return (
    <div>
      <input
        value={ask}
        id="askInput"
        onChange={(e) => setAsk(Number(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            askMutation.mutate({ asking: ask, id: lotId });
          }
        }}
      />
      <button
        onClick={() => {
          askMutation.mutate({ asking: ask, id: lotId });
        }}
        id="askButton"
      >
        Set Ask
      </button>
    </div>
  );
};

const RoomBid = () => {
  const currentLot = api.lot.current.useQuery(undefined, {
    refetchInterval: 3000,
  });
  const mutation = api.bid.create.useMutation({
    onSuccess: () => {
      currentLot.refetch();
    },
  });

  // get the highest bid or asking price
  const highestBid: number =
    currentLot?.data?.Bid[0]?.amount || currentLot?.data?.asking || 1;

  // create a bid button where it will bid the same price as the highest bid

  return (
    <div>
      <button
        onClick={() => {
          mutation.mutate({
            amount: highestBid,
            lotId: currentLot?.data?.id || 0,
            online: true,
          });
        }}
        id="Room"
      >
        Bid Room
      </button>
    </div>
  );
};

type UpdateCurrentLotProps = {
  type: string;
  status: string;
};

const UpdateCurrentLot: React.FC<UpdateCurrentLotProps> = ({
  type,
  status,
}) => {
  // get current lot
  const currentLot = api.lot.current.useQuery(undefined, {
    refetchInterval: 3000,
  });

  // get the next lot
  const nextLot = api.lot.next.useQuery(undefined, {
    refetchInterval: 3000,
  });

  // sell the item
  const mutation = api.lot.sell.useMutation({
    onSuccess: () => {
      currentLot.refetch();
      nextLot.refetch();
    },
  });

  return (
    <div>
      <button
        onClick={() => {
          mutation.mutate({ id: currentLot?.data?.id || 0, status: status });
        }}
        id={type + "Button"}
      >
        {type}
      </button>
    </div>
  );
};
