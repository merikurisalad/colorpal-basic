import React, { useState } from 'react';
import { Input, Typography } from '@mui/material';
import axios from 'axios';
import './ColorPicker.css';

export default function ColorPicker() {
  const [image, setImage] = useState();
  const [hoverColor, setHoverColor] = useState('');
  const [hexColor, setHexColor] = useState('');
  
  function handleImage(event) {
    setImage(URL.createObjectURL(event.target.files[0]));
  }

  function valueToHex(c) {
    let hex = c.toString(16);
    return hex;
  }

  function rgbToHex(r, g, b) {
    return (valueToHex(r) + valueToHex(g) + valueToHex(b));
  }

  async function handleHoverColor(event) {
    const imageElement = event.target;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;

    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    for (let j = y; j < y + 20; j++) {
        for (let i = x; i < x + 20; i++) {
            const pixelData = context.getImageData(i, j, 1, 1).data;
            sumR += pixelData[0];
            sumG += pixelData[1];
            sumB += pixelData[2];
        }
    }
    console.log(sumR, sumG, sumB);
    const hexVal = rgbToHex(Math.floor(sumR / 400), Math.floor(sumG / 400), Math.floor(sumB / 400));
    setHexColor(hexVal);
    console.log(hexVal);

    // SINGLE PIXEL
    // const pixelData = context.getImageData(x, y, 1, 1).data;
    // console.log(x, y, pixelData);
    // const rgb = { r: pixelData[0], g: pixelData[1], b: pixelData[2] };

    // const hexVal = rgbToHex(rgb.r, rgb.g, rgb.b);
    // setHexColor(hexVal);

    try {
      const response = await axios.get(
        `https://api.color.pizza/v1/${hexVal}`
      );
      const colorName = response.data.paletteTitle;
      setHoverColor(colorName);
    } catch (error) {
      console.error('Error fetching color name:', error);
    }
  }

  return (
    // TODO: change click to hover
    <div className="color-picker">
      <Input type="file" onChange={handleImage} />
      <img src={image} alt="Palette" onMouseDown={handleHoverColor} />
      <Typography>
        {hoverColor &&
        <p>Detected color: {hoverColor}, Hex Value: #{hexColor}
        <span
          style={{
            display: "inline-block",
            width: "20px",
            height: "20px",
            backgroundColor: `#${hexColor}`,
            marginLeft: "5px"
          }}
        ></span></p>}
      </Typography>
    </div> 
  )
}
