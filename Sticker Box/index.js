import { StickerBox } from './StickerBox.js';

// 스티커 생성
const generateSticker = document.querySelector('#generate-sticker');
const stickerBox = new StickerBox();

generateSticker.onclick = () => {
  stickerBox.addSticker();
};

let stickerIndex = 0;

while (stickerIndex > -1) {
  const sticker = localStorage.getItem(`sticker-${stickerIndex++}`);

  if (sticker === null) break;

  stickerBox.addSticker();
}

let itemIndex = 1;
while (itemIndex > -1) {
  const item = JSON.parse(localStorage.getItem(`item-${itemIndex++}`));

  if (item === null) break;

  const sticker = stickerBox.stickers.find((sticker) => {
    return sticker.stickerIndex === item.stickerIndex;
  });

  const btnItemAdd = sticker.stickerEl.querySelector('.btn-item-add');
  btnItemAdd.onclick();
}
