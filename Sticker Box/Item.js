export class Item {
  static itemIndex = 1;

  constructor(sticker) {
    this.sticker = sticker;
    this.itemEl = this.generateItem();
  }

  // Item HTML 생성
  generateItemUI() {
    const item = document.createElement('li');
    const itemTitle = document.createElement('div');
    const itemDeleteBtn = document.createElement('button');

    item.id = `${Item.itemIndex}`;
    item.classList.add('item');
    itemTitle.innerText = `Text ${Item.itemIndex++}`;
    itemDeleteBtn.innerText = '삭제';

    item.style.cursor = 'grab';

    item.append(itemTitle, itemDeleteBtn);

    return item;
  }

  // Item에 이벤트 붙이기
  patchItemEvent(item) {
    item.addEventListener('mousedown', (e) => {
      e.stopPropagation();

      const tagName = e.target.tagName.toLowerCase();

      if (tagName === 'button') this.deleteItem(this);
      else if (tagName === 'li') this.moveItem(e, this);
    });

    return item;
  }

  generateItem() {
    const itemUI = this.generateItemUI();
    return this.patchItemEvent(itemUI);
  }

  // 아이템 삭제
  deleteItem(targetItem) {
    const itemsDiv = targetItem.itemEl.parentElement;
    const deleteIdx = this.sticker.items.findIndex(
      (item) => item === targetItem
    );

    this.sticker.items.splice(deleteIdx, 1);
    targetItem.itemEl.remove();

    itemsDiv.style.height = `${itemsDiv.clientHeight - 50.2}px`;

    this.sticker.renderItem(itemsDiv);
  }

  // 아이템 이동
  moveItem(e, target) {
    let draggingItem = null;
    let isFirstFromSticker = true;

    const targetEl = target.itemEl;

    // 드래그 할 아이템 지정
    draggingItem = targetEl;

    target.sticker.setTop(target.sticker.stickerEl);
    targetEl.style.cursor = 'grabbing';

    // 원래 자리 기억
    const originInfo = {
      y: targetEl.style.top,
      zIndex: targetEl.style.zIndex,
    };

    const itemsDiv = targetEl.parentElement;

    const parentRect = itemsDiv.getBoundingClientRect();
    const itemRect = targetEl.getBoundingClientRect();

    const itemInnerX = e.clientX - itemRect.left;
    const itemInnerY = e.clientY - itemRect.top;

    let insertIndex;
    let toSticker = target.sticker;
    let isFromSticker = true;
    let fromStickerIndex = target.sticker.items.findIndex(
      (i) => i.itemEl.id === targetEl.id
    );

    const onMouseMove = (moveEvent) => {
      const clientX = moveEvent.clientX;
      const clientY = moveEvent.clientY;

      targetEl.style.left = `${clientX - itemInnerX - parentRect.left}px`;
      targetEl.style.top = `${clientY - itemInnerY - parentRect.top}px`;
      targetEl.style.zIndex = 1000;
      targetEl.style.cursor = 'grabbing';

      // 가장 가까운 item 찾기
      const closestItemEl = document.elementsFromPoint(clientX, clientY)[1];

      if (closestItemEl && closestItemEl.classList.contains('items-div')) {
        const stickers = target.sticker.stickerBox.stickers;

        for (const sticker of stickers) {
          if (closestItemEl.parentElement === sticker.stickerEl) {
            toSticker = sticker;
            isFromSticker =
              closestItemEl.parentElement === target.sticker.stickerEl;
            break;
          }
        }
      } else if (
        closestItemEl &&
        closestItemEl.classList.contains('item') &&
        closestItemEl !== draggingItem
      ) {
        const stickers = target.sticker.stickerBox.stickers;
        let closestItem;

        outer: for (const sticker of stickers) {
          const items = sticker.items;

          for (let i of items) {
            if (i.itemEl === closestItemEl) {
              closestItem = i;
              toSticker = sticker;
              isFromSticker =
                target.sticker.stickerIndex === sticker.stickerIndex;
              break outer;
            }
          }
        }

        // 옮겨갈 sticker에 공간 마련하기
        const isTop =
          closestItemEl.style.height / 2 >
          document.clientX - closestItemEl.getBoundingClientRect().top;

        // 원래 스티커 내에서의 이동
        if (isFromSticker) {
          if (isFirstFromSticker) {
            isFirstFromSticker = false;
            toSticker.items.splice(fromStickerIndex, 1);
            toSticker.renderItem(toSticker.stickerEl.children[3]);
          }

          insertIndex = toSticker.items.findIndex(
            (item) =>
              item !== 'EMPTY' && item.itemEl.id === closestItem.itemEl.id
          );

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

        // 다른 스티커로의 이동
        else {
          insertIndex = toSticker.items.findIndex(
            (item) =>
              item !== 'EMPTY' && item.itemEl.id === closestItem.itemEl.id
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
      }
    };

    const onMouseUp = () => {
      // 원래 자리로 돌아가기
      targetEl.style.left = '0px';
      targetEl.style.top = originInfo.y;
      targetEl.style.zIndex = originInfo.zIndex;
      targetEl.style.cursor = 'grab';

      // 원래 스티커 내에서의 이동
      if (isFromSticker) {
        toSticker.items[insertIndex ?? fromStickerIndex] = target;
        toSticker.renderItem(toSticker.stickerEl.children[3]);
        isFirstFromSticker = true;

        const stickers = target.sticker.stickerBox.stickers;
        for (let sticker of stickers) {
          if (toSticker.stickerIndex === sticker.stickerIndex) continue;

          const emptyIndex = sticker.items.indexOf('EMPTY');
          if (emptyIndex !== -1) {
            sticker.items.splice(emptyIndex, 1);
            sticker.renderItem(sticker.stickerEl.children[3]);
          }
        }
      }

      // 다른 스티커로의 이동
      else {
        const emptyIndex = target.sticker.items.indexOf('EMPTY');

        if (emptyIndex !== -1) {
          target.sticker.items.splice(emptyIndex, 1);
        } else {
          target.sticker.items = target.sticker.items.filter(
            (item) => targetEl.id !== item.itemEl.id
          );
        }

        toSticker.items[insertIndex ?? 0] = target;

        target.sticker.renderItem(target.sticker.stickerEl.children[3]);
        toSticker.renderItem(toSticker.stickerEl.children[3]);
        target.sticker = toSticker;
      }

      draggingItem = null;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}
