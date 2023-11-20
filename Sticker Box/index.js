import { StickerBox } from "./StickerBox.js";

// 스티커 생성
const generateSticker = document.querySelector("#generate-sticker");
const stickerBox = new StickerBox();

generateSticker.onclick = () => {
  stickerBox.addSticker();
};

// TODO: 인덱스에 맞게 불러올 수 있도록
// TODO: 제목도 불러올 수 있도록
// TODO: Z-INDEX
window.onload = () => {
  const saveStickers = JSON.parse(localStorage.getItem("stickers"));

  for (const key in saveStickers) {
    const stickerInfo = saveStickers[key];
    if (stickerInfo === null) break;

    stickerBox.addSticker(stickerInfo.stickerStyle);

    const sticker = stickerBox.stickers.find((s) => {
      return s.stickerIndex === stickerInfo.stickerIndex;
    });

    if (sticker) {
      const btnItemAdd = sticker.stickerEl.querySelector(".btn-item-add");
      const items = JSON.parse(stickerInfo.items);
      for (let itemInfo of items) {
        btnItemAdd.setAttribute("data-userInfo", JSON.stringify(itemInfo));
        btnItemAdd.click();
        // btnItemAdd.userInfo = null;
      }
    }
  }
};

window.addEventListener(
  "beforeunload",
  (event) => {
    event.preventDefault();

    stickerBox.save();

    event.returnValue = "";
  },
  { capture: true }
);
