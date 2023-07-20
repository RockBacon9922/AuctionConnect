// create an options page which at the moment will work as a dev page

// i want to be able to see the lots from redux

import { useState } from "react";
import { createLot, setActiveLot, type Auction } from "~slices/auction-slice";
import { useAppDispatch, useGetAuction } from "~store";
import Wrapper from "~tabs/Assets/wrapper";

const Options = () => {
  return (
    <Wrapper>
      <LotsTable />
      <CreateLot />
      <SetCurrentLot />
      <BidsTable />
    </Wrapper>
  );
};

export default Options;

const LotsTable = () => {
  const auction = useGetAuction();
  const lots = auction.lots;
  return (
    <table>
      <thead>
        <tr>
          <th>Lot Number</th>
          <th>Lot Description</th>
          <th>Lot Low Estimate</th>
          <th>Lot High Estimate</th>
          <th>Lot Asking</th>
          <th>Lot State</th>
        </tr>
      </thead>
      <tbody>
        {lots.map((lot) => (
          <tr key={lot.id.toString() + lot.description}>
            <td>{lot.id}</td>
            <td>{lot.description}</td>
            <td>{lot.lowEstimate}</td>
            <td>{lot.highEstimate}</td>
            <td>{lot.asking}</td>
            <td>{lot.state}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const CreateLot = () => {
  // create a rfc which is used to create a lot
  const dispatch = useAppDispatch();
  const [lotNumber, setLotNumber] = useState("");
  const [lotDescription, setLotDescription] = useState("");
  const [lotLowEstimate, setLotLowEstimate] = useState(0);
  const [lotHighEstimate, setLotHighEstimate] = useState(0);
  const [lotAsking, setLotAsking] = useState(0);
  const [lotState, setLotState] = useState("unsold");
  const lotBids = [];
  const image = "";

  const createLotDispatch = () => {
    dispatch(
      createLot({
        id: lotNumber,
        description: lotDescription,
        lowEstimate: lotLowEstimate,
        highEstimate: lotHighEstimate,
        asking: lotAsking,
        state: lotState,
        bids: lotBids,
        image: image,
      }),
    );
  };

  return (
    <div>
      <h1>Create Lot</h1>
      <input
        type="text"
        placeholder="Lot Number"
        value={lotNumber}
        onChange={(e) => setLotNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Lot Description"
        value={lotDescription}
        onChange={(e) => setLotDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Lot Low Estimate"
        value={lotLowEstimate}
        onChange={(e) => setLotLowEstimate(parseInt(e.target.value))}
      />
      <input
        type="number"
        placeholder="Lot High Estimate"
        value={lotHighEstimate}
        onChange={(e) => setLotHighEstimate(parseInt(e.target.value))}
      />
      <input
        type="number"
        placeholder="Lot Asking"
        value={lotAsking}
        onChange={(e) => setLotAsking(parseInt(e.target.value))}
      />
      <select value={lotState} onChange={(e) => setLotState(e.target.value)}>
        <option value="unsold">Unsold</option>
        <option value="sold">Sold</option>
      </select>
      <button onClick={createLotDispatch}>Create Lot</button>
    </div>
  );
};

const SetCurrentLot = () => {
  const auction = useGetAuction();
  const [lotNumber, setLotNumberState] = useState(auction.currentLotId);
  const dispatch = useAppDispatch();
  return (
    <div>
      <h1>Set Current Lot</h1>
      <input
        type="text"
        placeholder="Lot Number"
        value={lotNumber}
        onChange={(e) => setLotNumberState(e.target.value)}
      />
      <button onClick={() => dispatch(setActiveLot(lotNumber))}>
        Set Lot Number
      </button>
    </div>
  );
};

const BidsTable = () => {
  const auction: Auction = useGetAuction();
  const lots = auction.lots;

  return (
    <div>
      {lots.map((lot) => (
        <div key={lot.id}>
          <h2>Lot Number: {lot.id}</h2>
          <table>
            <thead>
              <tr>
                <th>Bid Amount</th>
                <th>Bidder</th>
                <th>Platform</th>
              </tr>
            </thead>
            <tbody>
              {lot.bids.map((bid) => (
                <tr key={bid.amount.toString() + bid.bidder}>
                  <td>{bid.amount}</td>
                  <td>{bid.bidder}</td>
                  <td>{bid.platform}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};
