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
    stickerDeleteBtn.classList.add('btn-sticker-delete');

    stickerTitle.innerText = `Sticker ${stickerIndex}`;
    stickerAddBtn.innerText = '항목 추가';
    stickerDeleteBtn.innerText = '스티커 삭제';

    sticker.style = `
      top: ${stickerIndex * 10 + 40}px;
      left: ${stickerIndex * 10}px;
      background-color: ${this.getRandomRGB()};
    `;

    // 스티커 내의 버튼 onclick
    stickerDeleteBtn.onclick = () => this.deleteSticker();
    stickerAddBtn.onclick = () => this.generateItem();

    sticker.append(stickerTitle, stickerAddBtn, stickerDeleteBtn, itemsDiv);

    // 이벤트 붙이기
    this.moveSticker(sticker);
    this.setTop(sticker);

    return sticker;
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

  // 스티커의 항목 생성
  generateItem() {
    const itemList = this.stickerEl.children[3];
    const itemListHeight = itemList.clientHeight;
    const newItem = new Item(itemList.children.length).itemEl;

    this.items.push(newItem);
    itemList.style = `height: ${itemListHeight + 50.2}px;`;

    this.renderItem(itemList);

    // 이벤트 붙이기
    this.deleteItem(newItem, itemList);
  }

  renderItem(itemList) {
    this.items.forEach((item, index) => {
      item.style.top = `${50.2 * index}px`;
      itemList.append(item);
    });
  }

  // 스티커 삭제
  deleteSticker() {
    this.stickerEl.remove();
  }

  // 아이템 삭제
  deleteItem(newItem, itemList) {
    newItem.addEventListener('click', (e) => {
      const itemListHeight = itemList.clientHeight;

      const tagName = e.target.tagName.toLowerCase();

      if (tagName === 'button') {
        const deleteIdx = this.items.findIndex((item) => item === newItem);
        this.items.splice(deleteIdx, 1);
        newItem.remove();

        itemList.style = `height: ${itemListHeight - 50.2}px;`;

        this.renderItem(itemList);
      }
      // 아이템 움직이기
      else if (tagName === 'div') {
        newItem.onmousedown = (e) => {
          e.stopPropagation();

          const parentRect = newItem.parentElement.getBoundingClientRect();
          const itemRect = newItem.getBoundingClientRect();

          const offsetX = e.clientX - itemRect.left;
          const offsetY = e.clientY - itemRect.top;

          function onMouseMove(e) {
            const x = e.clientX - parentRect.left - offsetX;
            const y = e.clientY - parentRect.top - offsetY;

            newItem.style.left = `${x}px`;
            newItem.style.top = `${y}px`;
          }

          function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          }

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        };
      }
    });
  }
}
