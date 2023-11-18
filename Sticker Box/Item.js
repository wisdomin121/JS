export class Item {
  static itemIndex = 1;

  constructor(sticker) {
    this.sticker = sticker;
    this.itemEl = this.generateItem();
  }

  generateItem() {
    const item = document.createElement('div');
    const itemTitle = document.createElement('div');
    const itemDeleteBtn = document.createElement('button');

    item.classList.add('item');

    itemTitle.innerText = `Text ${Item.itemIndex++}`;
    itemDeleteBtn.innerText = '삭제';

    item.append(itemTitle, itemDeleteBtn);

    // 이벤트 붙이기
    item.onclick = (e) => {
      const tagName = e.target.tagName.toLowerCase();

      if (tagName === 'button') this.deleteItem(item);
      else if (tagName === 'div') this.moveItem(item);
    };

    return item;
  }

  // 아이템 삭제
  deleteItem(item) {
    const itemList = this.sticker.stickerEl.children[3];
    const deleteIdx = this.sticker.items.findIndex(
      (stickerItem) => stickerItem === item
    );

    this.sticker.items.splice(deleteIdx, 1);
    item.remove();

    itemList.style = `height: ${itemList.clientHeight - 50.2}px;`;

    this.sticker.renderItem(itemList);
  }

  // 아이템 움직임
  moveItem(item) {
    item.onmousedown = (e) => {
      e.stopPropagation();

      const parentRect = item.parentElement.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      const offsetX = e.clientX - itemRect.left;
      const offsetY = e.clientY - itemRect.top;

      function onMouseMove(e) {
        const x = e.clientX - parentRect.left - offsetX;
        const y = e.clientY - parentRect.top - offsetY;

        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
  }
}
