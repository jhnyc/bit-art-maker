import React from "react";
import "./App.css";
import Grid from "./components/Grid";
import Accordion from "./components/List";
import { SliderPicker, SketchPicker } from "react-color";
import DisplayImage from "./components/Upload";
import RenderData from "./components/GenerateList";
import Save from "./components/Save";
import Export from "./components/Export";

const App = () => {
  const init = Array(4096).fill("white");
  // const [fillColors, setFillColors] = React.useState(init);
  const [colorStates, setColorStates] = React.useState([init]); // to track all historical states
  const [index, setIndex] = React.useState(0); // index states with respect to all states
  const colorState = React.useMemo(
    () => colorStates[index],
    [colorStates, index]
  ); // trigger rerender when colorStates/index is changed
  const [gridLines, setGridLines] = React.useState(true); // track gridline state
  const [mouseDown, setMouseDown] = React.useState(false); // track mouseDown state, pixels that the mouse move over while mouseDown will be colored
  const [color, setColor] = React.useState("#40bf80");
  const [colorPickMode, setColorPickMode] = React.useState(false);
  const [recentColors, setRecentColors] = React.useState([]);
  const [childData, setChildData] = React.useState("a");
  const [saved, setSaved] = React.useState({
    theme: "Saved",
    children: [],
  });
  const [fillColorMode, setFillColorMode] = React.useState(false);
  const [sketchPickerState, setSketchPickerState] = React.useState("hidden");

  const maxRecentColors = 7;

  const onFillColor = (i) => {
    // only fill pixel color when not in colorPickMode
    if (!colorPickMode) {
      let newFillColors = colorState.slice(0);
      newFillColors[i] = color;
      setFillColors(newFillColors);
      // add to recentColors
      let newRecentColor = recentColors.slice(-maxRecentColors);
      if (newRecentColor.length == 0) {
        newRecentColor.push(color);
      } else if (!newRecentColor.includes(color)) {
        newRecentColor.push(color);
      }
      setRecentColors(newRecentColor);
    }
  };

  const setFillColors = (newColors) => {
    // avoid re-render if current colorState equals newColors
    // if (isEqual(colorState, newColors)) {
    //   return;
    // }
    // push new colorState to all colorStates and update current index of state
    const copy = colorStates.slice(0, index + 1);
    copy.push(newColors);
    setColorStates(copy);
    setIndex(copy.length - 1);
  };

  const undo = () => {
    // set index as current index-1
    // if current index=0, the init state, undo will do nothing
    setIndex(Math.max(0, Number(index) - 1));
  };

  const redo = () => {
    setIndex(Math.min(colorStates.length - 1, Number(index) + 1));
  };

  const resetGrid = () => {
    // reset canva to init state
    setFillColors(init);
  };

  const showGridLines = () => {
    if (gridLines) {
      return "#979797";
    } else {
      return "none";
    }
  };

  const changeGridLines = () => {
    // change gridline state
    setGridLines(!gridLines);
  };

  const generateDefault = () => {
    // generate random sample on click of generate button
    const allColors = require("./all_colors.json");
    let randColors = allColors[Math.floor(Math.random() * allColors.length)];
    // let randColors = allColors[0];
    setFillColors(randColors);
  };

  const handleMouseSelection = (e) => {
    if (!!mouseDown) {
      let rectId = e.target.id;
      let gridID = parseInt(rectId - 4);
      onFillColor(gridID);
    }
  };

  const handleMouseDown = () => {
    // set mouseDown state as true when mouse down
    setMouseDown(true);
  };
  const handleMouseUp = () => {
    // set mouseDown state as false when mouse released
    setMouseDown(false);
  };

  const handleColorChange = (e) => {
    setColor(e.hex);
  };

  const colorPicker = () => {
    if (fillColorMode) {
      setFillColorMode(!fillColorMode);
    }
    setColorPickMode(!colorPickMode);
  };

  const colorPickerOnClick = (e) => {
    if (colorPickMode && !fillColorMode) {
      setColor(e.target.getAttribute("fill"));
      setColorPickMode(!colorPickMode); // end colorPickMode after picking the color
    } else if (fillColorMode && !colorPickMode) {
      const selectedColor = e.target.getAttribute("fill");
      let newFillColors = colorState.slice(0);
      let newFillColors_ = newFillColors.map((c) => {
        if (c == selectedColor) {
          return color;
        } else {
          return c;
        }
      });
      setFillColors(newFillColors_);
      setFillColorMode(!fillColorMode); // end colorPickMode after picking the color
    }
  };

  const onClickFillColorMode = () => {
    if (colorPickMode) {
      setColorPickMode(!colorPickMode);
    }
    setFillColorMode(!fillColorMode);
  };

  const recentColorOnClick = (e) => {
    // change color to selected recent color
    setColor(e.target.style.backgroundColor);
  };

  const getSaved = (data) => {
    setSaved(data);
  };

  return (
    <div className="App">
      <div className="grid">
        <Grid
          fillColors={colorState}
          onFill={onFillColor}
          onPick={colorPickerOnClick}
          stroke={showGridLines}
          onMouseMove={handleMouseSelection}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      </div>
      {/* <ColorPalette currentColor={currentColor} changeColor={setCurrentColor} /> */}
      <div className="botNavigationBar">
        <div className="colorPicker">
          <div id="SliderPicker">
            <SliderPicker onChange={handleColorChange} color={color} />
          </div>
          <button
            id="openSketchPicker"
            onClick={() =>
              setSketchPickerState(
                sketchPickerState == "hidden" ? "visible" : "hidden"
              )
            }
          >
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 2c5.522 0 10 3.978 10 8.889a5.558 5.558 0 0 1-5.556 5.555h-1.966c-.922 0-1.667.745-1.667 1.667 0 .422.167.811.422 1.1.267.3.434.689.434 1.122C13.667 21.256 12.9 22 12 22 6.478 22 2 17.522 2 12S6.478 2 12 2zm-1.189 16.111a3.664 3.664 0 0 1 3.667-3.667h1.966A3.558 3.558 0 0 0 20 10.89C20 7.139 16.468 4 12 4a8 8 0 0 0-.676 15.972 3.648 3.648 0 0 1-.513-1.86zM7.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM12 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
              </g>
            </svg>
          </button>
          <div id="SketchPicker" style={{ visibility: `${sketchPickerState}` }}>
            <SketchPicker onChange={handleColorChange} color={color} />
          </div>
        </div>
        {/* <button id="export">Export</button> */}
        <Export currentColor={colorState} />
      </div>
      <div className="leftNavigationBar">
        <div className="buttons">
          <button id="resetButton" onClick={resetGrid}>
            Reset
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h8a.996.996 0 0 0 .707-.293l7-7a.997.997 0 0 0 .196-.293c.014-.03.022-.061.033-.093a.991.991 0 0 0 .051-.259c.002-.021.013-.041.013-.062V5c0-1.103-.897-2-2-2zM5 5h14v7h-6a1 1 0 0 0-1 1v6H5V5zm9 12.586V14h3.586L14 17.586z" />
            </svg>
          </button>
          <button id="gridLinesButton" onClick={changeGridLines}>
            Gridlines
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 3H4.984c-1.103 0-2 .897-2 2v14.016c0 1.103.897 2 2 2H19c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2h-4zm4 5h-3V5h3v3zM4.984 10h3v4.016h-3V10zm5 0H14v4.016H9.984V10zM16 10h3v4.016h-3V10zm-2-5v3H9.984V5H14zM7.984 5v3h-3V5h3zm-3 11.016h3v3h-3v-3zm5 3v-3H14v3H9.984zm6.016 0v-3h3.001v3H16z" />
            </svg>
          </button>
          <button id="generateDefault" onClick={generateDefault}>
            Generate
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z" />
              <path d="m10 14-1-1-3 4h12l-5-7z" />
            </svg>
          </button>
          <button id="undo" onClick={undo}>
            Undo
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.758 8.758 5.344 7.344a8.048 8.048 0 0 0-1.841 2.859l1.873.701a6.048 6.048 0 0 1 1.382-2.146zM19 12.999a7.935 7.935 0 0 0-2.344-5.655A7.917 7.917 0 0 0 12 5.069V2L7 6l5 4V7.089a5.944 5.944 0 0 1 3.242 1.669A5.956 5.956 0 0 1 17 13v.002c0 .33-.033.655-.086.977-.007.043-.011.088-.019.131a6.053 6.053 0 0 1-1.138 2.536c-.16.209-.331.412-.516.597a5.954 5.954 0 0 1-.728.613 5.906 5.906 0 0 1-2.277 1.015c-.142.03-.285.05-.43.069-.062.009-.122.021-.184.027a6.104 6.104 0 0 1-1.898-.103L9.3 20.819a8.087 8.087 0 0 0 2.534.136c.069-.007.138-.021.207-.03.205-.026.409-.056.61-.098l.053-.009-.001-.005a7.877 7.877 0 0 0 2.136-.795l.001.001.028-.019a7.906 7.906 0 0 0 1.01-.67c.27-.209.532-.43.777-.675.248-.247.47-.513.681-.785.021-.028.049-.053.07-.081l-.006-.004a7.899 7.899 0 0 0 1.093-1.997l.008.003c.029-.078.05-.158.076-.237.037-.11.075-.221.107-.333.04-.14.073-.281.105-.423.022-.099.048-.195.066-.295.032-.171.056-.344.076-.516.01-.076.023-.15.03-.227.023-.249.037-.5.037-.753.002-.002.002-.004.002-.008zM6.197 16.597l-1.6 1.201a8.045 8.045 0 0 0 2.569 2.225l.961-1.754a6.018 6.018 0 0 1-1.93-1.672zM5 13c0-.145.005-.287.015-.429l-1.994-.143a7.977 7.977 0 0 0 .483 3.372l1.873-.701A5.975 5.975 0 0 1 5 13z" />
            </svg>
          </button>
          <button id="redo" onClick={redo}>
            Redo
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.242 17.242a6.04 6.04 0 0 1-1.37 1.027l.961 1.754a8.068 8.068 0 0 0 2.569-2.225l-1.6-1.201a5.938 5.938 0 0 1-.56.645zm1.743-4.671a5.975 5.975 0 0 1-.362 2.528l1.873.701a7.977 7.977 0 0 0 .483-3.371l-1.994.142zm1.512-2.368a8.048 8.048 0 0 0-1.841-2.859l-1.414 1.414a6.071 6.071 0 0 1 1.382 2.146l1.873-.701zm-8.128 8.763c-.047-.005-.094-.015-.141-.021a6.701 6.701 0 0 1-.468-.075 5.923 5.923 0 0 1-2.421-1.122 5.954 5.954 0 0 1-.583-.506 6.138 6.138 0 0 1-.516-.597 5.91 5.91 0 0 1-.891-1.634 6.086 6.086 0 0 1-.247-.902c-.008-.043-.012-.088-.019-.131A6.332 6.332 0 0 1 6 13.002V13c0-1.603.624-3.109 1.758-4.242A5.944 5.944 0 0 1 11 7.089V10l5-4-5-4v3.069a7.917 7.917 0 0 0-4.656 2.275A7.936 7.936 0 0 0 4 12.999v.009c0 .253.014.504.037.753.007.076.021.15.03.227.021.172.044.345.076.516.019.1.044.196.066.295.032.142.065.283.105.423.032.112.07.223.107.333.026.079.047.159.076.237l.008-.003A7.948 7.948 0 0 0 5.6 17.785l-.007.005c.021.028.049.053.07.081.211.272.433.538.681.785a8.236 8.236 0 0 0 .966.816c.265.192.537.372.821.529l.028.019.001-.001a7.877 7.877 0 0 0 2.136.795l-.001.005.053.009c.201.042.405.071.61.098.069.009.138.023.207.03a8.038 8.038 0 0 0 2.532-.137l-.424-1.955a6.11 6.11 0 0 1-1.904.102z" />
            </svg>
          </button>
          <button
            id="pickColor"
            onClick={colorPicker}
            style={
              colorPickMode
                ? {
                    fontSize: "14.5px",
                    fontWeight: "bold",
                    filter: "brightness(95%)",
                  }
                : {}
            }
          >
            Color Picker
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.3847 2.87868C19.2132 1.70711 17.3137 1.70711 16.1421 2.87868L14.0202 5.00052L13.313 4.29332C12.9225 3.9028 12.2894 3.9028 11.8988 4.29332C11.5083 4.68385 11.5083 5.31701 11.8988 5.70754L17.5557 11.3644C17.9462 11.7549 18.5794 11.7549 18.9699 11.3644C19.3604 10.9739 19.3604 10.3407 18.9699 9.95018L18.2629 9.24316L20.3847 7.12132C21.5563 5.94975 21.5563 4.05025 20.3847 2.87868Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.9297 7.09116L4.1515 14.8693C3.22786 15.793 3.03239 17.169 3.5651 18.2842L1.99994 19.8493L3.41415 21.2635L4.97931 19.6984C6.09444 20.2311 7.4705 20.0356 8.39414 19.112L16.1723 11.3338L11.9297 7.09116ZM13.3439 11.3338L11.9297 9.91959L5.56571 16.2835C5.17518 16.6741 5.17518 17.3072 5.56571 17.6978C5.95623 18.0883 6.5894 18.0883 6.97992 17.6978L13.3439 11.3338Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            onClick={onClickFillColorMode}
            style={
              fillColorMode
                ? {
                    fontSize: "14.5px",
                    fontWeight: "bold",
                    filter: "brightness(95%)",
                  }
                : {}
            }
          >
            Color Filler
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 13.998c-.092.065-2 2.083-2 3.5 0 1.494.949 2.448 2 2.5.906.044 2-.891 2-2.5 0-1.5-1.908-3.435-2-3.5zm-16.586-1c0 .534.208 1.036.586 1.414l5.586 5.586c.378.378.88.586 1.414.586s1.036-.208 1.414-.586l7-7-.707-.707L11 4.584 8.707 2.291 7.293 3.705l2.293 2.293L4 11.584c-.378.378-.586.88-.586 1.414zM11 7.412l5.586 5.586L11 18.584h.001l-.001 1v-1l-5.586-5.586L11 7.412z" />
            </svg>
          </button>
          <DisplayImage getUploadedImagePixels={setFillColors} />
          <Save currentColor={colorState} getSaved={setSaved} saved={saved} />
        </div>
      </div>
      <div className="recentColors">
        <button
          id="recent1"
          onClick={(e) => recentColorOnClick(e)}
          style={{
            backgroundColor:
              recentColors[recentColors.length - 1] === undefined
                ? "#252931"
                : recentColors[recentColors.length - 1],
          }}
        ></button>
        <button
          id="recent2"
          onClick={(e) => recentColorOnClick(e)}
          style={{
            backgroundColor:
              recentColors[recentColors.length - 2] === undefined
                ? "#252931"
                : recentColors[recentColors.length - 2],
          }}
        ></button>
        <button
          id="recent3"
          onClick={(e) => recentColorOnClick(e)}
          style={{
            backgroundColor:
              recentColors[recentColors.length - 3] === undefined
                ? "#252931"
                : recentColors[recentColors.length - 3],
          }}
        ></button>
        <button
          id="recent4"
          onClick={(e) => recentColorOnClick(e)}
          style={{
            backgroundColor:
              recentColors[recentColors.length - 4] === undefined
                ? "#252931"
                : recentColors[recentColors.length - 4],
          }}
        ></button>
        <button
          id="recent5"
          onClick={(e) => recentColorOnClick(e)}
          style={{
            backgroundColor:
              recentColors[recentColors.length - 5] === undefined
                ? "#252931"
                : recentColors[recentColors.length - 5],
          }}
        ></button>
        <button
          id="recent5"
          onClick={(e) => recentColorOnClick(e)}
          style={{
            backgroundColor:
              recentColors[recentColors.length - 6] === undefined
                ? "#252931"
                : recentColors[recentColors.length - 6],
          }}
        ></button>
        <button
          id="recent5"
          onClick={(e) => recentColorOnClick(e)}
          style={{
            backgroundColor:
              recentColors[recentColors.length - 7] === undefined
                ? "#252931"
                : recentColors[recentColors.length - 7],
          }}
        ></button>
      </div>

      <div className="Accordion">
        <RenderData updatePreset={setFillColors} saved={saved} />
      </div>
    </div>
  );
};

export default App;
