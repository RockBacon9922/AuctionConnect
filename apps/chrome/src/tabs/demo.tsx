import { useEffect, useState } from "react";

import "../style.css";

import { incrementPairs, increments } from "./Assets/increments";

const Console = () => {
  const [platform, setPlatform] = useState("SaleRoom");
  const [colour, setColour] = useState("#ff2200");
  const [bid, setBid] = useState(10);
  const [asking, setAsking] = useState(20);
  const [interval, setInterval] = useState(10);
  const platforms = {
    SaleRoom: ["#a62639", "#DB324D", "#511C29", "#ff2200"],
    "Easy Live": ["#90F1EF", "#FFD6E0", "#FFEF9F", "#C1FBA4", "#7BF1A8"],
    Room: ["#e48d80", "#e48d81"],
  };

  const askingHandler = (e) => {
    setAsking(parseInt(e.target.value));
  };
  // write a function which randomly selects a platform and a colour from the platform every 5 seconds
  // and updates the state

  const roomBid = () => {
    const platformKeys = Object.keys(platforms);
    // set randomPlatform to room
    let randomPlatform = "Room";
    let randomColour = colour;
    // while (randomPlatform === platform) {
    //   randomPlatform =
    //     platformKeys[Math.floor(Math.random() * (platformKeys.length - 1))];
    // }
    while (randomColour === colour) {
      randomColour =
        platforms[randomPlatform][
          Math.floor(Math.random() * platforms[randomPlatform].length)
        ];
    }
    setPlatform(randomPlatform);
    setColour(randomColour);
  };

  const onlineBid = () => {
    const platformKeys = Object.keys(platforms);
    let randomPlatform = platform;
    let randomColour = colour;
    while (randomPlatform === platform) {
      randomPlatform =
        platformKeys[Math.floor(Math.random() * (platformKeys.length - 1))];
    }
    while (randomColour === colour) {
      randomColour =
        platforms[randomPlatform][
          Math.floor(Math.random() * platforms[randomPlatform].length)
        ];
    }
    setPlatform(randomPlatform);
    setColour(randomColour);
  };

  const handleOnlineBid = () => {
    setBid(asking);
    setAsking(asking + interval);
    onlineBid();
  };

  useEffect(() => {
    const interval = setTimeout(() => {
      handleOnlineBid();
    }, 5000);
    return () => clearInterval(interval);
  }, [bid]);

  const handleBid = () => {
    setBid(asking);
    setAsking(asking + interval);
    roomBid();
    // setTimeout(updatePlatform, 2000);
  };

  // create an automatic bid function which will bid every 5 seconds
  return (
    <div className="grid h-screen w-screen grid-cols-6 grid-rows-6 items-center gap-2 bg-gradient-to-br from-slate-300 to-slate-400 p-2">
      <h1 className="row-span-2 text-xl font-extrabold">Lot 701</h1>
      <div className="row-span-2 flex justify-start">
        <img className="h-20" src="https://i.ibb.co/6D5pzNZ/Antique-Desk.png" />
      </div>
      <Box className="row-span-2 h-full flex-col bg-blue-600">
        <span>Easy Live ✔</span>
        <span>SaleRoom ❌</span>
        <i className="text-[0.35rem]">A/V Fault</i>
        <i className="text-[0.35rem]">Tab Not Open</i>
      </Box>
      <Button>Pass</Button>
      <Button>Sell</Button>
      <Button>Next Lot</Button>
      <div className="col-span-3 row-span-5 overflow-x-auto ">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Lot</th>
              <th>Description</th>
              <th>Estimate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>701</td>
              <td>description</td>
              <td>estimate</td>
            </tr>
            <tr>
              <td>702</td>
              <td>description</td>
              <td>estimate</td>
            </tr>
            <tr>
              <td>703</td>
              <td>description</td>
              <td>estimate</td>
            </tr>
            <tr>
              <td>704</td>
              <td>description</td>
              <td>estimate</td>
            </tr>
          </tbody>
        </table>
      </div>
      <BidLabel className="col-span-2 h-10" bgcolour={colour}>
        {platform} : {bid}
      </BidLabel>
      <Button
        onClick={() => {
          setAsking(asking - interval);
          setBid(bid - interval);
          roomBid();
        }}
      >
        Undo
      </Button>
      <Asking
        className="col-span-2 bg-blue-500"
        asking={asking}
        handler={askingHandler}
        submit={handleBid}
      >
        Asking :
      </Asking>
      <Box className="row-span-3 h-full w-full flex-col gap-2 bg-blue-500 p-2">
        <Label className="w-[90%]">Quick Ask</Label>
        <Button
          className="w-[90%] bg-sky-300 hover:bg-sky-400"
          onClick={(e) => {
            setAsking(parseInt(e.target.innerHTML));
            setInterval(increments[increments.indexOf(interval) - 1]);
          }}
        >
          {increments[increments.indexOf(interval) - 1] + bid}
        </Button>
        <Button
          className="w-[90%] bg-sky-300 hover:bg-sky-400"
          onClick={(e) => {
            setAsking(parseInt(e.target.innerHTML));
            setInterval(increments[increments.indexOf(interval) + 1]);
          }}
        >
          {increments[increments.indexOf(interval) + 1] + bid}
        </Button>
        <Button
          className="w-[90%] bg-sky-300 hover:bg-sky-400"
          onClick={(e) => {
            setAsking(parseInt(e.target.innerHTML));
            setInterval(increments[increments.indexOf(interval) + 2]);
          }}
        >
          {increments[increments.indexOf(interval) + 2] + bid}
        </Button>
      </Box>
      <Button className="row-span-2" onClick={handleBid}>
        Bid
      </Button>
      <Button
        className="row-span-2"
        onClick={() => {
          setAsking(parseInt((asking - interval / 2).toString()));
          setInterval(parseInt((interval / 2).toString()));
        }}
      >
        Split Bid
      </Button>
    </div>
  );
};

export default Console;

const Button = ({ children, ...props }) => {
  // if props include b- in the class name, then use that colour
  // else use the default colour
  // check if props.className is undefined

  if (!props?.className?.includes("bg-")) {
    props.className += " bg-blue-500 hover:bg-blue-600";
  }
  props.className += " w-30 h-full rounded text-white";

  return <button {...props}>{children}</button>;
};

const BidLabel = ({ children, ...props }) => {
  props.className +=
    " h-full text-center rounded text-white flex items-center justify-center";
  return (
    <div
      className={props.className}
      style={{ backgroundColor: props.bgcolour }}
    >
      <h3>{children}</h3>
    </div>
  );
};

const Label = ({ children, ...props }) => {
  props.className +=
    " text-center rounded text-white flex items-center justify-center";
  return (
    <div className={props.className}>
      <h3>{children}</h3>
    </div>
  );
};

const Box = ({ children, ...props }) => {
  props.className +=
    " text-center rounded text-white flex justify-center items-center";
  return <div className={props.className}>{children}</div>;
};

const Asking = ({ children, ...props }) => {
  props.className +=
    " h-full text-center rounded text-white flex items-center justify-center bg-blue-500";
  const keyDownHandler = (e) => {
    if (e.key === "Enter") {
      props.submit();
      // highlight the input
      e.target.select();
    }
  };
  return (
    <span className={props.className}>
      <label>Asking : </label>
      <input
        className="ml-2 w-[44%] text-black"
        inputMode="numeric"
        value={props.asking}
        onChange={props.handler}
        onKeyDown={keyDownHandler}
        pattern="[0-9]*"
        type="number"
      />
    </span>
  );
};

const Empty = () => {
  return <div className="bg-slate-950">a</div>;
};
