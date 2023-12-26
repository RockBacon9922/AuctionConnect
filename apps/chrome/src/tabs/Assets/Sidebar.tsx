import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "~hooks";
import { setActiveLot } from "~slices/auction-slice";
import { cn } from "~utils/cn";

const Logo = () => (
  <img
    src="https://www.gavelconnect.com/_astro/V5LightInnerShadow.qVRUR3pd_Z22S8dR.svg"
    alt="logo"
    className="h-[100%]"
  />
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
        "flex flex-row items-center justify-start gap-4 px-3 py-2 bg-white cursor-pointer",
        selected ? "bg-opacity-20" : "bg-opacity-0",
      )}
      onClick={() => dispatch(setActiveLot(LotId))}
      ref={selfRef}
    >
      <img src={LotImage} alt="lot" width={50} />
      <div className="flex flex-col w-full overflow-hidden hover:scrollbar-show">
        <div className="flex justify-between text-white font-bold items-start">
          <p className="text-xl">{LotId}</p>
          <p className="h-max mt-3">
            {"Est: " + highEstimate.toString() + "-" + lowEstimate.toString()}
          </p>
        </div>
        <p className="text-white truncate font-semibold w-full">
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
    <div className="flex flex-col h-screen w-[25%] items-center py-4 gap-2 bg-white bg-opacity-5">
      <Logo />
      <div className="flex flex-col mt-4 overflow-y-scroll hover:scrollbar-show">
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
