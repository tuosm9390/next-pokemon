// 색상 이름을 RGB로 변환하는 함수
const getRgbFromColorName = (colorName) => {
  const tempDiv = document.createElement('div');
  tempDiv.style.color = colorName;
  document.body.appendChild(tempDiv);

  const rgbColor = window.getComputedStyle(tempDiv).color;

  document.body.removeChild(tempDiv);

  return rgbColor;
};

// RGB 문자열을 RGBA로 변환하는 함수
const rgbToRgba = (rgb, alpha = 1) => {
  const rgbValues = rgb.match(/\d+/g);
  return `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${alpha})`;
};

// HEX 또는 색상 이름을 RGBA로 변환하는 함수
export const colorToRgba = (color, alpha = 1) => {
  const rgb = getRgbFromColorName(color);
  return rgbToRgba(rgb, alpha);
};
