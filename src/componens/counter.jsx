import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  const colors = ["blue", "green", "orange", "purple", "pink"];
  const currentColor = colors[colorIndex];

  const backgroundColor = isClicked ? "white" : "red";

  return (
    <div
      style={{
        backgroundColor: currentColor,
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2 style={{ color: "black" }}>{count}</h2>

      <button
        onClick={() => {
          setCount(count + 1);
          setIsClicked(true);
          setColorIndex((colorIndex + 1) % colors.length);
        }}
        style={{
          backgroundColor: backgroundColor,
          color: "black",
          padding: "10px",
          marginRight: "10px",
        }}
      >
        Increment
      </button>

      <button
        onClick={() => {
          setCount(0);
          setIsClicked(false);
          setColorIndex(0);
        }}
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px",
          marginTop: "10px",
        }}
      >
        Reset
      </button>
    </div>
  );
}

export default Counter;
