import { Sticker } from "./Sticker.js";

export class StickerBox {
  constructor() {
    this.stickers = [];
    this.stickerIndex = 1;
  }

  /* 스티커 추가하기 */
  addSticker(style = null) {
    const stickerBox = document.getElementById("sticker-box");
    const newSticker = new Sticker(this);
    const stickerTitle = newSticker.stickerEl.querySelector(".sticker-title");
    console.log(style);
    if (style) {
      newSticker.stickerEl.style.left = style.left;
      newSticker.stickerEl.style.top = style.top;
      newSticker.stickerEl.style.backgroundColor = style.backgroundColor;
      stickerTitle.value = style.stickerTitle;
    }

    this.stickers.push(newSticker);
    this.stickerIndex++;

    stickerBox.append(newSticker.stickerEl);
    this.setInputFocus(newSticker.stickerEl);
  }

  setInputFocus(stickerEl) {
    const stickerTitleInput = stickerEl.querySelector(".sticker-title");
    stickerTitleInput.focus();
  }

  /* 로컬스토리 로직 */
  clear() {
    localStorage.clear();
  }

  save() {
    const saveStickers = [];

    this.stickers.forEach((sticker, stickerIndex) => {
      const saveItems = [];

      sticker.items.forEach((item) => {
        const saveItem = {
          itemIndex: item.itemEl.id,
          stickerIndex: item.sticker.stickerIndex,
        };

        localStorage.setItem(`item-${item.itemEl.id}`, JSON.stringify(saveItem));
        saveItems.push(saveItem);
      });

      const saveSticker = {
        items: JSON.stringify(saveItems),
        stickerIndex: sticker.stickerIndex,
        stickerStyle: {
          left: sticker.stickerEl.style.left,
          top: sticker.stickerEl.style.top,
          backgroundColor: sticker.stickerEl.style.backgroundColor,
          stickerTitle: sticker.stickerEl.children[0].innerText,
        },
      };

      localStorage.setItem(`sticker-${stickerIndex}`, JSON.stringify(saveSticker));

      saveStickers.push(saveSticker);
    });

    localStorage.setItem("stickers", JSON.stringify(saveStickers));
  }
}
