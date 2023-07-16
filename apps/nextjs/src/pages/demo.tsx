import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  const [word, setWord] = useState("hello");
  const increment = () => setCount(count + 1);
  return (
    <div>
      <button id="count" onClick={increment}>
        {count}
      </button>
      <input id="word" value={word} onChange={(e) => setWord(e.target.value)} />
      <h3>{word}</h3>
    </div>
  );
};

export default Counter;
