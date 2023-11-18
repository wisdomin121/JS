import { Item } from './Item.js';

export class Sticker {
  static highestZIndex = 0;

  constructor(stickerIndex) {
    this.stickerEl = this.generateSticker(stickerIndex);
    this.stickerIndex = stickerIndex;
    this.items = [];
  }

  // 랜덤 RGB값 가져오기
  getRandomRGB() {
    const r = Math.floor(Math.random() * (200 - 150)) + 150;
    const g = Math.floor(Math.random() * (200 - 150)) + 150;
    const b = Math.floor(Math.random() * (200 - 150)) + 150;

    return `rgb(${r}, ${g}, ${b})`;
  }

  // 스티커 생성
  generateSticker(stickerIndex) {
    const sticker = document.createElement('div');
    const stickerTitle = document.createElement('div');
    const stickerAddBtn = document.createElement('button');
    const stickerDeleteBtn = document.createElement('button');
    const itemsDiv = document.createElement('div');

    sticker.classList.add('sticker');
    itemsDiv.classList.add('items-div');
    stickerAddBtn.classList.add('btn-item-add');
    stickerDeleteBtn.classList.add('btn-sticker-delete');

    stickerTitle.innerText = `Sticker ${stickerIndex}`;
    stickerAddBtn.innerText = '항목 추가';
    stickerDeleteBtn.innerText = '스티커 삭제';

    sticker.style = `
      top: ${stickerIndex * 10 + 40}px;
      left: ${stickerIndex * 10}px;
      background-color: ${this.getRandomRGB()};
    `;

    sticker.append(stickerTitle, stickerAddBtn, stickerDeleteBtn, itemsDiv);

    // 이벤트 붙이기
    this.addItem(sticker);
    this.deleteSticker(sticker);
    this.moveSticker(sticker);
    this.setTop(sticker);

    return sticker;
  }

  // 스티커의 항목 생성
  addItem(sticker) {
    const btnItemAdd = sticker.querySelector('.btn-item-add');

    btnItemAdd.onclick = () => {
      const itemList = sticker.children[3];
      const itemListHeight = itemList.clientHeight;
      const newItem = new Item(this).itemEl;

      this.items.push(newItem);
      itemList.style = `height: ${itemListHeight + 50.2}px;`;

      this.renderItem(itemList);
    };
  }

  renderItem(itemList) {
    this.items.forEach((item, index) => {
      item.style.top = `${50.2 * index}px`;
      itemList.append(item);
    });
  }

  // 스티커 삭제
  deleteSticker(sticker) {
    const btnStickerDelete = sticker.querySelector('.btn-sticker-delete');

    btnStickerDelete.onclick = () => sticker.remove();
  }

  // 스티커의 움직임
  moveSticker(sticker) {
    sticker.onmousedown = (e) => {
      let shiftX = e.clientX - sticker.getBoundingClientRect().left;
      let shiftY = e.clientY - sticker.getBoundingClientRect().top;

      // 클릭 시, 최상단으로
      this.setTop(sticker);

      function onMouseMove(e) {
        sticker.style.left = e.pageX - shiftX + 'px';
        sticker.style.top = e.pageY - shiftY + 'px';
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      sticker.onmouseup = null;
    };

    sticker.ondragstart = () => {
      return false;
    };
  }

  // 스티커 최상단으로 이동
  setTop(sticker) {
    sticker.style.zIndex = Sticker.highestZIndex++;
  }
}
