const Heading = ({ children }) => {
  return <h1 className="row-span-2 text-xl font-extrabold">{children}</h1>;
};

const Box = ({ children, ...props }) => {
  props.className +=
    " text-center rounded text-white flex justify-center items-center";
  return <div className={props.className}>{children}</div>;
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

// export all functions
export { Heading };
