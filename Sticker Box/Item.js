export class Item {
  static itemIndex = 1;

  constructor(sticker) {
    this.sticker = sticker;
    this.itemEl = this.generateItem();
  }

  generateItemUI() {
    const item = document.createElement('li');
    const itemTitle = document.createElement('div');
    const itemDeleteBtn = document.createElement('button');

    item.id = `item-${Item.itemIndex}`;
    item.classList.add('item');
    itemTitle.innerText = `Text ${Item.itemIndex++}`;
    itemDeleteBtn.innerText = '삭제';

    item.style.cursor = 'grab';

    item.append(itemTitle, itemDeleteBtn);

    return item;
  }

  patchItemEvent(item) {
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

  generateItem() {
    // UI
    const itemUI = this.generateItemUI();
    const item = this.patchItemEvent(itemUI);

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
    let draggingItem = null;

    item.itemEl.addEventListener('mousedown', (e) => {
      e.stopPropagation();

      draggingItem = item.itemEl;

      item.sticker.setTop(item.sticker.stickerEl);
      item.itemEl.style.cursor = 'grabbing';

      // 원래 자리 기억
      const originalY = item.itemEl.style.top;
      const originalZIndex = item.itemEl.style.zIndex;

      const itemsDiv = item.itemEl.parentElement;

      const parentRect = itemsDiv.getBoundingClientRect();
      const itemRect = item.itemEl.getBoundingClientRect();

      const itemInnerX = e.clientX - itemRect.left;
      const itemInnerY = e.clientY - itemRect.top;

      let insertIndex;
      let toSticker;

      const onMouseMove = (moveEvent) => {
        const x = moveEvent.clientX;
        const y = moveEvent.clientY;

        item.itemEl.style.left = `${x - itemInnerX - parentRect.left}px`;
        item.itemEl.style.top = `${y - itemInnerY - parentRect.top}px`;
        item.itemEl.style.zIndex = 1000;
        item.itemEl.style.cursor = 'grabbing';

        const closestItemEl = document.elementsFromPoint(x, y)[1];
        const isTop =
          closestItemEl.style.height / 2 >
          document.clientX - closestItemEl.getBoundingClientRect().top;

        if (
          closestItemEl &&
          closestItemEl.classList.contains('item') &&
          closestItemEl !== draggingItem
        ) {
          const stickers = item.sticker.stickerBox.stickers;
          let closestItem;

          outer: for (const sticker of stickers) {
            const items = sticker.items;

            for (let item of items) {
              if (item.itemEl === closestItemEl) {
                closestItem = item;
                toSticker = sticker;
                break outer;
              }
            }
          }

          // 옮겨갈 sticker에 공간 마련하기
          // TODO: 옮겨갈 STICKER가 원래 sticker이면 ?
          insertIndex = toSticker.items.findIndex(
            (item) =>
              item !== 'EMPTY' &&
              item.itemEl.id.split('-')[1] ===
                closestItem.itemEl.id.split('-')[1]
          );

          if (isTop && insertIndex === 1) insertIndex--;

          if (toSticker.items[insertIndex] !== 'EMPTY') {
            if (toSticker.items.includes('EMPTY')) {
              toSticker.items = toSticker.items.filter(
                (item) => item !== 'EMPTY'
              );
            }

            toSticker.items = [
              ...toSticker.items.slice(0, insertIndex),
              'EMPTY',
              ...toSticker.items.slice(insertIndex),
            ];

            toSticker.renderItem(toSticker.stickerEl.children[3]);
          }
        }
      };

      const onMouseUp = (upEvent) => {
        // 원래 자리로 돌아가기
        item.itemEl.style.left = '0px';
        item.itemEl.style.top = originalY;
        item.itemEl.style.zIndex = originalZIndex;
        item.itemEl.style.cursor = 'grab';

        item.sticker.items = item.sticker.items.filter(
          (deleteItem) =>
            item.itemEl.id.split('-')[1] !== deleteItem.itemEl.id.split('-')[1]
        );

        toSticker.items[insertIndex ?? 0] = item;

        item.sticker.renderItem(item.sticker.stickerEl.children[3]);
        item.sticker = toSticker;
        toSticker.renderItem(toSticker.stickerEl.children[3]);

        // // 이동 후 위치 확인
        // const dropTarget = document.elementsFromPoint(
        //   upEvent.clientX,
        //   upEvent.clientY
        // )[1];

        // if (dropTarget && dropTarget)
        // // 다른 스티커의 목록으로 이동할 때
        // if (
        //   dropTarget &&
        //   dropTarget.classList.contains('items-div') &&
        //   dropTarget !== itemsDiv
        // ) {
        //   this.deleteItem(item);

        //   const toSticker = this.sticker.stickerBox.stickers.find(
        //     (sticker) => sticker.stickerEl.id === dropTarget.parentElement.id
        //   );

        //   item.sticker = toSticker;
        //   toSticker.addItem(item);
        // }
        draggingItem = null;

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }
}
