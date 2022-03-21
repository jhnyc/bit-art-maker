import React, { useImperativeHandle } from "react";
import "./Export.css"

function Export(props) {
const [modalState, setModalState] = React.useState("none")
const [currentSvg, setCurrentSvg] = React.useState()
const [exportSize, setExportSize] = React.useState(2048);
const [pngURL, setPngURL] =React.useState()
const [svgURL, setSvgURL] =React.useState()

const onClickExport = () => {
    setModalState(modalState == "none" ? "block" : "none")
    setCurrentSvg(document.querySelector("svg").cloneNode(true))
}


const exportPng = React.useMemo(() => {
  if (currentSvg != undefined) {
    const canvas = document.createElement("canvas");
    // remove gridline before export
    currentSvg.getElementById("svg_27").childNodes.forEach((item) => {
      item.setAttribute("stroke", "none");
      item.setAttribute("stroke-width", "0");
    });
    const svg = currentSvg.cloneNode(true);
    const size = Math.ceil(exportSize / 64) * 64; // change the number to multiple of 64
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", `0 0 640 640`);
    const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
    const w = parseInt(svg.getAttribute("width"));
    const h = parseInt(svg.getAttribute("height"));
    const img_to_download = document.createElement("img");
    let dataURL;
    let test = [];
    img_to_download.src = "data:image/svg+xml;base64," + base64doc;
    img_to_download.onload = function () {
      console.log("img loaded");
      canvas.setAttribute("width", size);
      canvas.setAttribute("height", size);
      const context = canvas.getContext("2d");
      context.drawImage(img_to_download, 0, 0, size, size);
      dataURL = canvas.toDataURL("image/png");
      setPngURL(dataURL);
      setSvgURL(img_to_download.src);
    };
    if (img_to_download.complete) {
      console.log("complete");
      return (
        <div>
          <a download="download.svg" target="_blank" href={svgURL}>
            <button onClick={() => setModalState("none")}>SVG</button>
          </a>
          <a download="download.png" target="_blank" href={pngURL}>
            <button onClick={() => setModalState("none")}> PNG</button>
          </a>
        </div>
      );
    }
    else {
      return (
        <div>
            <button>SVG</button>
            <button> PNG</button>
        </div>
      );
    }
  }
}, [modalState, exportSize, svgURL, pngURL]);


    return (
      <div>
        <button id="export" onClick={onClickExport}>
          Export
        </button>
        <div
          className="modalBackdrop"
          style={{ display: modalState }}
          onClick={() => setModalState("none")}
        >
          <div
            id="exportModal"
            class="modal"
            style={{ display: modalState }}
            onClick={(e) => e.stopPropagation()}
          >
            <div class="modal-content" >
              {/* <span class="close">&times;</span> */}
              <div id="modalTop" >
                {" "}
                <p>Download as</p>{" "}
              </div>
              {exportPng}
            </div>
            <input
              id="exportPngPixel"
              type="text"
              value={exportSize}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setExportSize(e.target.value)}
            ></input>
            <text>px</text>
          </div>
        </div>
      </div>
    );
}

export default Export;