type Lot = {
  id: string;
  name: string;
  description: string;
  image: string;
  status: "upcoming" | "live" | "sold" | "unsold";
  lowEstimate: number;
  highEstimate: number;
};

type Bid = {
  id: string;
  lotId: number;
};

export type { Lot, Bid };
