import React, { Component } from "react";

function DisplayImage( props) {
  function rgbaChunks(arr) {
    // split rgba array into chunks of 4
    let i, j;
    let output = [];
    for (i = 0, j = arr.length; i < j; i += 4) {
      output.push(arr.slice(i, i + 4));
    }
    return output;
  }

  function rgbaToHex(rgbaArray) {
    //   convert rgba/rgb into hex
    let output = [];
    let i, j;
    for (i = 0, j = rgbaArray.length; i < j; i++) {
      let rgba = rgbaArray[i];
      let parts = [
        rgba[0].toString(16),
        rgba[1].toString(16),
        rgba[2].toString(16),
      ];
      parts.forEach(function (part, i) {
        if (part.length === 1) {
          parts[i] = "0" + part;
        }
      });
      output.push("#" + parts.join(""));
    }
    return output;
  }

  function get64Pixel(size, context) {
    let temp = [];
    const multiple = size / 64;
    let h, w, j;
    for (h = 0; h < 64; h++) {
      let y = (multiple / 2) + h * multiple;
      for (w = 0; w < 64; w++) {
          let x = (multiple / 2) + w * multiple;
        let pixel = context.getImageData(parseInt(x), parseInt(y), 1, 1).data;
        temp = temp.concat(pixel);
      }
    }
    return temp;
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const img = new Image();
      let imgPath = URL.createObjectURL(event.target.files[0]);
      img.src = imgPath.toString();
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);
        const size = img.width > img.height ? img.height : img.width;
        console.log(context.getImageData(400, 400, 1, 1).data)
        const data = get64Pixel(size, context);
        const hexArray = rgbaToHex(data);
        // console.log(hexArray);
        props.getUploadedImagePixels(hexArray);
      };
    }
  };
  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  return (
    <div>
      <div>
        <div>
          {/* <img src={this.state.image} /> */}
          <button id="upload" onClick={handleClick}>
            {" "}
            Upload{" "}
          </button>
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            transform="translate(0,-6)"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 16h2V7h3l-4-5-4 5h3z" />
            <path d="M5 22h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2z" />
          </svg>
          <input
            type="file"
            ref={hiddenFileInput}
            name="myImage"
            onChange={onImageChange}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
}

export default DisplayImage;
