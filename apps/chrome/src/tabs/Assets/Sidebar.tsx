import { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "~hooks";
import { setActiveLot } from "~slices/auction-slice";
import { cn } from "~utils/cn";

const Logo = () => (
  <img src="https://www.gavelconnect.com/LightInnerShadow.svg" alt="logo" />
);

const LotListItem: React.FC<{
  LotId: string;
  LotImage: string;
  LotDescription: string;
  selected: boolean;
  lowEstimate: number;
  highEstimate: number;
}> = ({
  LotId,
  LotImage,
  LotDescription,
  selected,
  lowEstimate,
  highEstimate,
}) => {
  const dispatch = useAppDispatch();
  const selfRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selected) {
      selfRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "start",
      });
    }
  }, [selected]);
  return (
    <div
      className={cn(
        "flex flex-row gap-4 px-3 py-2 cursor-pointer",
        selected ? "bg-abbey-500 h-36" : "h-20",
      )}
      onClick={() => dispatch(setActiveLot(LotId))}
      ref={selfRef}
    >
      <div className="aspect-square flex items-center h-full max-w-[30%]">
        <img src={LotImage} alt="lot" width={150} />
      </div>
      <div className="flex flex-col w-full h-full gap-2 overflow-hidden hover:scrollbar-show">
        <div className="flex justify-between text-white font-bold items-center">
          <p className="text-2xl">{LotId}</p>
          <p className="text-lg">
            {"Est: " + highEstimate.toString() + "-" + lowEstimate.toString()}
          </p>
        </div>
        <p
          className={cn(
            "text-white font-semibold w-full",
            selected ? "hyphens-auto overflow-y-scroll" : "truncate",
          )}
        >
          {LotDescription}
        </p>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  // get state from redux
  const auction = useAppSelector((state) => state.auction);
  return (
    <div className="flex flex-col h-screen w-[25%] items-center py-4 gap-4 bg-abbey-700 px-3">
      <Logo />
      <div className="flex flex-col mt-4 w-full gap-2 overflow-y-scroll hover:scrollbar-show">
        {auction.lots.map((lot) => (
          <LotListItem
            key={lot.id}
            LotId={lot.id}
            LotImage={lot.image}
            LotDescription={lot.description}
            selected={lot.id === auction.currentLotId}
            lowEstimate={lot.lowEstimate}
            highEstimate={lot.highEstimate}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
