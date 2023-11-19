import { StickerBox } from './StickerBox.js';

// 스티커 생성
const generateSticker = document.querySelector('#generate-sticker');
const stickerBox = new StickerBox();

generateSticker.onclick = () => {
  stickerBox.addSticker();
};
