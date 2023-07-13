// create an options page which at the moment will work as a dev page

// i want to be able to see the lots from redux

import exp from "constants";
import { useEffect, useState } from "react";
import {
  resetState,
  setAuctionDate,
  setAuctionName,
  setLotNumber,
  setSetup,
  type Auction,
} from "~slices/auction-slice";
import { RootState, useAppDispatch, useAppSelector } from "~store";
import Wrapper from "~tabs/Assets/wrapper";

const Options = () => {
  return (
    <Wrapper>
      <LotsTable />
    </Wrapper>
  );
};

export default Options;

const LotsTable = () => {
  const auction: Auction = useAppSelector((state: RootState) => state.auction);
  const lots = auction.lots;
  return (
    <table>
      <thead>
        <tr>
          <th>Lot Number</th>
          <th>Lot Name</th>
          <th>Lot Description</th>
          <th>Lot Estimate</th>
          <th>Lot Price</th>
        </tr>
      </thead>
      <tbody>
        {lots.map((lot) => (
          <tr key={lot.id.toString() + lot.name}>
            <td>{lot.id}</td>
            <td>{lot.name}</td>
            <td>{lot.description}</td>
            <td>{lot.lowEstimate}</td>
            <td>{lot.highEstimate}</td>
            <td>{lot.state}</td>
            <td>{lot.bids.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
