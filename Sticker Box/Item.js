export class Item {
  static itemIndex = 1;

  constructor(sticker) {
    this.sticker = sticker;
    this.itemEl = this.generateItem();
  }

  generateItem() {
    // UI
    const item = document.createElement('li');
    const itemTitle = document.createElement('div');
    const itemDeleteBtn = document.createElement('button');

    item.id = `item-${Item.itemIndex}`;
    item.classList.add('item');
    itemTitle.innerText = `Text ${Item.itemIndex++}`;
    itemDeleteBtn.innerText = '삭제';

    item.style.cursor = 'grab';

    item.append(itemTitle, itemDeleteBtn);

    // 클릭 이벤트 핸들러 등록
    item.addEventListener('click', (e) => {
      const tagName = e.target.tagName.toLowerCase();

      if (tagName === 'button') {
        this.deleteItem(this);
      } else if (tagName === 'li') {
        this.moveItem(this);
      }
    });

    return item;
  }

  // 아이템 삭제
  deleteItem(item) {
    const itemsDiv = item.itemEl.parentElement;
    const deleteIdx = this.sticker.items.findIndex(
      (stickerItem) => stickerItem === item
    );

    this.sticker.items.splice(deleteIdx, 1);
    item.itemEl.remove();

    itemsDiv.style.height = `${itemsDiv.clientHeight - 50.2}px`;

    this.sticker.renderItem(itemsDiv);
  }

  // 아이템 이동
  moveItem(item) {
    item.itemEl.addEventListener('mousedown', (e) => {
      e.stopPropagation();

      item.sticker.setTop(item.sticker.stickerEl);
      item.itemEl.style.cursor = 'grabbing';

      const originalY = item.itemEl.style.top;
      const originalZIndex = item.itemEl.style.zIndex;

      const itemsDiv = item.itemEl.parentElement;

      const parentRect = itemsDiv.getBoundingClientRect();
      const itemRect = item.itemEl.getBoundingClientRect();

      const itemInnerX = e.clientX - itemRect.left;
      const itemInnerY = e.clientY - itemRect.top;

      const onMouseMove = (moveEvent) => {
        const x = moveEvent.clientX - itemInnerX - parentRect.left;
        const y = moveEvent.clientY - itemInnerY - parentRect.top;

        item.itemEl.style.left = `${x}px`;
        item.itemEl.style.top = `${y}px`;
        item.itemEl.style.zIndex = 1000;
        item.itemEl.style.cursor = 'grabbing';
      };

      const onMouseUp = (upEvent) => {
        // 제자리로 돌아가기
        item.itemEl.style.left = '0px';
        item.itemEl.style.top = originalY;
        item.itemEl.style.zIndex = originalZIndex;
        item.itemEl.style.cursor = 'grab';

        // 이동 후 위치 확인
        const dropTarget = document.elementFromPoint(
          upEvent.clientX,
          upEvent.clientY
        );

        // 다른 스티커의 목록으로 이동할 때
        if (
          dropTarget &&
          dropTarget.classList.contains('items-div') &&
          dropTarget !== itemsDiv
        ) {
          this.deleteItem(item);

          const toSticker = this.sticker.stickerBox.stickers.find(
            (sticker) => sticker.stickerEl.id === dropTarget.parentElement.id
          );

          item.sticker = toSticker;
          toSticker.addItem(item);
        }

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }
}
