import { Sticker } from "./Sticker.js";

let stickerIndex = 1;
let itemIndex = 1;

// 스티커 생성
const generateSticker = document.querySelector("#generate-sticker");
const stickersDiv = document.querySelector("#stickers-div");

const stickers = [];

generateSticker.onclick = () => {
  const newSticker = new Sticker(stickerIndex++);

  stickers.push(newSticker);
  stickersDiv.append(newSticker.stickerEl);
};
