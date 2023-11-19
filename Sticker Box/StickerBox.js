import { Sticker } from './Sticker.js';

export class StickerBox {
  constructor() {
    this.stickers = [];
    this.stickerIndex = 1;
  }

  addSticker() {
    const stickerBox = document.getElementById('sticker-box');
    const newSticker = new Sticker(this);

    this.stickers.push(newSticker);
    this.stickerIndex++;

    stickerBox.append(newSticker.stickerEl);
  }
}
