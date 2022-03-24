import React, { useState, useRef } from "react";
import Chevron from "./Chevron";

import "./Accordion.css";

function Accordion(props) {
  const [setActive, setActiveState] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const [setRotate, setRotateState] = useState("accordion__icon");

  const content = useRef(null);

  function toggleAccordion() {
    setActiveState(setActive === "" ? "active" : "");
    setHeightState(
      setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
    );
    setRotateState(
      setActive === "active" ? "accordion__icon" : "accordion__icon rotate"
    );
  }


  function hexToRgba(hexArray){
    let rgbaArray = []
    for (var hex of hexArray) {
      if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        let c = hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x'+c.join('');
        rgbaArray =rgbaArray.concat([(c>>16)&255, (c>>8)&255, c&255, 255]);
    }
      else {
        return;
      }
    }
    return rgbaArray;
}

  
const convertColorArraytoPng = (color) => {
  // wrap function in useCallback to avoid rerendering
  console.log('test')
  const canvas  = document.createElement("canvas")
  canvas.width = 64
  canvas.height = 64
  const context = canvas.getContext("2d")
  let imageData = context.createImageData(64,64)
  let rgbaArray = hexToRgba(color)
  for (var i=0; i<rgbaArray.length; i++){
    imageData.data[i] = rgbaArray[i]
  }
  console.log('rendering icon');
  context.putImageData(imageData,0,0)
  var img = new Image();
  img.src = canvas.toDataURL("image/png");
  return img.src
}
  
  const buttonsWithImage = React.useMemo(() => {
    return props.buttons.map((button) => (
      <button
        id={button._name}
        onClick={() => props.updatePreset(button.color)}
      >
        <p>
          {button._name.includes(".")
            ? button._name.slice(0, -4)
            : button._name}
        </p>
        <img src={convertColorArraytoPng(button.color)} />
      </button>
    ));
  }, [props.buttons, props.data, props.saved.children.length]);

  

  return (
    <div className="accordion__section">
      <button className={`accordion ${setActive}`} onClick={toggleAccordion}>
        <p className="accordion__title">{props.title}</p>
        <Chevron className={`${setRotate}`} width={10} fill={"#777"} />
      </button>
      <div
        ref={content}
        style={{ maxHeight: `${setHeight}` }}
        className="accordion__content"
      >
        {buttonsWithImage}
      </div>
    </div>
  );
}

export default Accordion;
