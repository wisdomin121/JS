import { Sticker } from './Sticker.js';
import { StickerBox } from './StickerBox.js';

let stickerIndex = 1;
let itemIndex = 1;

// 스티커 생성
const generateSticker = document.querySelector('#generate-sticker');
const stickerBox = new StickerBox();

generateSticker.onclick = () => {
  stickerBox.addSticker();
};
