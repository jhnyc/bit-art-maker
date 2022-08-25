import React from "react";

function Grid(props) {

  const WIDTH = 10
  const DIM = 64

  const generateRow = (n) => {
    return [...Array(DIM).keys()].map((i) => (
      <rect
        id={`${i+n*DIM}`}
        onClick={(e) => {
          props.onFill(i+n*DIM);
          props.onPick(e);
        }}
        fill={props.fillColors[i+n*DIM]}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        onMouseOver={props.onMouseMove}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        onMouseOver={props.onMouseMove}
        fill-rule="evenodd"
        x={`${WIDTH * i + 0.15}`}
        y={`${WIDTH * (n + 1)}`}
        width="10.15"
        height="10.15"
        stroke={props.stroke()}
        stroke-width="0.3"
      />
    ));
  };

  const generateGrid = () => {
    return [...Array(64).keys()].map((i) => generateRow(i));
  };

  return (
    <svg
      width="80vh"
      height="80vh"
      viewBox="0 0 640 640"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      display="block"
    >
      <title>Grid</title>
      <g id="layer2" display="block">
        <g id="svg_27">{generateGrid()}</g>
      </g>
    </svg>
  );
}

export default Grid;
