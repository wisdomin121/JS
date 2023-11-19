import { Item } from './Item.js';

export class Sticker {
  static highestZIndex = 0;

  constructor(stickerBox) {
    this.stickerBox = stickerBox;
    this.stickerIndex = stickerBox.stickerIndex;
    this.stickerEl = this.generateSticker(stickerBox.stickerIndex);

    this.items = [];
  }

  // 랜덤 RGB값 가져오기
  getRandomRGB() {
    const r = Math.floor(Math.random() * (200 - 150)) + 150;
    const g = Math.floor(Math.random() * (200 - 150)) + 150;
    const b = Math.floor(Math.random() * (200 - 150)) + 150;

    return `rgb(${r}, ${g}, ${b})`;
  }

  generateStickerUI(stickerIndex) {
    const sticker = document.createElement('div');
    const stickerTitle = document.createElement('div');
    const stickerAddBtn = document.createElement('button');
    const stickerDeleteBtn = document.createElement('button');
    const itemsDiv = document.createElement('ul');

    sticker.id = `sticker-${stickerIndex}`;
    sticker.classList.add('sticker');
    itemsDiv.classList.add('items-div');
    stickerAddBtn.classList.add('btn-item-add');
    stickerDeleteBtn.classList.add('btn-sticker-delete');

    stickerTitle.innerText = `Sticker ${stickerIndex}`;
    stickerAddBtn.innerText = '항목 추가';
    stickerDeleteBtn.innerText = '스티커 삭제';

    sticker.style.top = `${stickerIndex * 10 + 40}px`;
    sticker.style.left = `${stickerIndex * 10}px`;
    sticker.style.zIndex = 1;
    sticker.style.backgroundColor = `${this.getRandomRGB()}`;

    this.setTop(sticker);

    sticker.append(stickerTitle, stickerAddBtn, stickerDeleteBtn, itemsDiv);

    return sticker;
  }

  // 스티커 생성
  generateSticker(stickerIndex) {
    const sticker = this.generateStickerUI(stickerIndex);

    // 이벤트 추가
    this.generateItem(sticker);
    this.deleteSticker(sticker);
    this.moveSticker(sticker);

    return sticker;
  }

  // 스티커의 item 생성
  generateItem(sticker) {
    const btnItemAdd = sticker.querySelector('.btn-item-add');

    btnItemAdd.onclick = () => {
      const newItem = new Item(this);
      this.addItem(newItem);
    };
  }

  addItem(item) {
    this.items.push(item);

    const itemsDiv = this.stickerEl.children[3];

    itemsDiv.style.margin = '0px';
    itemsDiv.style.padding = '0px';

    this.renderItem(itemsDiv);
  }

  // itemsDiv 렌더링
  renderItem(itemsDiv) {
    if (this.items.length === 0) {
      itemsDiv.style = `height: 0px`;
      return;
    }

    for (let li of itemsDiv.children) {
      if (li.tagName.toLowerCase() !== 'li') li.remove();
    }

    itemsDiv.style.height = `${this.items.length * 50.2}px`;

    this.items.forEach((item, index) => {
      if (item === 'EMPTY') {
        itemsDiv.append(document.createElement('div'));
      } else {
        item.itemEl.style.top = `${50.2 * index}px`;
        itemsDiv.append(item.itemEl);
      }
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
