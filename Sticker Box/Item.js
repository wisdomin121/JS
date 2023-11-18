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

      const itemList = item.parentElement;
      const parentRect = itemList.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      const offsetX = e.clientX - itemRect.left;
      const offsetY = e.clientY - itemRect.top;

      function onMouseMove(e) {
        const x = e.clientX - offsetX - parentRect.left;
        const y = e.clientY - offsetY - parentRect.top;

        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
      }

      function onMouseUp(mouseUpEvent) {
        function getNowElement(x, y) {
          const elements = document.elementsFromPoint(x, y);
          let isPass = false;

          for (let i = elements.length - 1; i >= 0; i--) {
            const element = elements[i];
            const rect = element.getBoundingClientRect();

            if (
              x >= rect.left &&
              x <= rect.right &&
              y >= rect.top &&
              y <= rect.bottom
            ) {
              if (isPass) return element;
              else isPass = true;
            }
          }

          return null;
        }

        const dropTarget = getNowElement(
          mouseUpEvent.clientX,
          mouseUpEvent.clientY
        );

        // 다른 div로 옮겨갔을 때
        if (
          dropTarget.className === 'items-div' &&
          dropTarget !== item.parentElement
        ) {
          this.deleteItem(item);

          // TODO: this.sticker에 dropTarget을 stickerEl로 가지고 있는 Sticker 클래스 객체를 집어넣어야 함..
        }

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp.bind(this));
    };
  }
}
