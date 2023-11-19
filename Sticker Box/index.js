import { StickerBox } from './StickerBox.js';

// 스티커 생성
const generateSticker = document.querySelector('#generate-sticker');
const stickerBox = new StickerBox();

generateSticker.onclick = () => {
  stickerBox.addSticker();
};

// TODO: 인덱스에 맞게 불러올 수 있도록
// TODO: 제목도 불러올 수 있도록
// TODO: Z-INDEX
let stickerIndex = 0;
while (stickerIndex > -1) {
  const sticker = JSON.parse(localStorage.getItem(`sticker-${stickerIndex++}`));

  if (sticker === null) break;

  stickerBox.addSticker(sticker.stickerStyle);
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
