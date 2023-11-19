import { Sticker } from './Sticker.js';

export class StickerBox {
  constructor() {
    this.stickers = [];
    this.stickerIndex = 1;
  }

  /* 스티커 추가하기 */
  addSticker(style = null) {
    const stickerBox = document.getElementById('sticker-box');
    const newSticker = new Sticker(this);
    const stickerTitle = newSticker.stickerEl.querySelector('.sticker-title');

    if (style) {
      newSticker.stickerEl.style.left = style.left;
      newSticker.stickerEl.style.top = style.top;
      newSticker.stickerEl.style.backgroundColor = style.backgroundColor;
      stickerTitle.innerText = style.stickerTitle;
    }

    this.stickers.push(newSticker);
    this.stickerIndex++;

    stickerBox.append(newSticker.stickerEl);
    this.setInputFocus(newSticker.stickerEl);
  }

  setInputFocus(stickerEl) {
    const stickerTitleInput = stickerEl.querySelector('.sticker-title');
    stickerTitleInput.focus();
  }

  /* 로컬스토리 로직 */
  clear() {
    localStorage.clear();
  }

  save() {
    this.stickers.forEach((sticker, stickerIndex) => {
      sticker.items.forEach((item) => {
        localStorage.setItem(
          `item-${item.itemEl.id}`,
          JSON.stringify({
            itemIndex: item.itemEl.id,
            stickerIndex: item.sticker.stickerIndex,
          })
        );
      });

      localStorage.setItem(
        `sticker-${stickerIndex}`,
        JSON.stringify({
          stickerIndex: sticker.stickerIndex,
          stickerStyle: {
            left: sticker.stickerEl.style.left,
            top: sticker.stickerEl.style.top,
            backgroundColor: sticker.stickerEl.style.backgroundColor,
            stickerTitle: sticker.stickerEl.children[0].innerText,
          },
        })
      );
    });
  }
}
