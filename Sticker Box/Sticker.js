import { Item } from "./Item.js";

export class Sticker {
  static highestZIndex = 0;

  constructor(stickerBox) {
    this.stickerBox = stickerBox;
    this.stickerIndex = stickerBox.stickerIndex;
    this.stickerEl = this.generateSticker(stickerBox.stickerIndex);

    this.items = [];

    this.isDragged = false;
  }

  /* 랜덤 RGB값 가져오기 */
  getRandomRGB() {
    const r = Math.floor(Math.random() * (200 - 150)) + 150;
    const g = Math.floor(Math.random() * (200 - 150)) + 150;
    const b = Math.floor(Math.random() * (200 - 150)) + 150;

    return `rgb(${r}, ${g}, ${b})`;
  }
  /* 스티커 생성 */
  generateStickerUI(stickerIndex) {
    const sticker = document.createElement("div");
    const stickerTitle = document.createElement("input");
    const stickerAddBtn = document.createElement("button");
    const stickerDeleteBtn = document.createElement("button");
    const itemsDiv = document.createElement("ul");

    sticker.id = `sticker-${stickerIndex}`;
    sticker.classList.add("sticker");
    itemsDiv.classList.add("items-div");
    stickerAddBtn.classList.add("btn-item-add");
    stickerDeleteBtn.classList.add("btn-sticker-delete");
    stickerTitle.classList.add("sticker-title");

    stickerTitle.innerText = `Sticker ${stickerIndex}`;
    stickerAddBtn.innerText = "항목 추가";
    stickerDeleteBtn.innerText = "스티커 삭제";
    stickerTitle.value = "Sticker";

    sticker.style.top = `${stickerIndex * 10 + 40}px`;
    sticker.style.left = `${stickerIndex * 10}px`;
    sticker.style.zIndex = 1;
    sticker.style.backgroundColor = `${this.getRandomRGB()}`;
    itemsDiv.style.height = "50px";

    this.setTop(sticker);

    sticker.append(stickerTitle, stickerAddBtn, stickerDeleteBtn, itemsDiv);

    return sticker;
  }

  generateSticker(stickerIndex) {
    const sticker = this.generateStickerUI(stickerIndex);

    // 이벤트 추가
    this.generateItem(sticker);
    this.deleteSticker(sticker);
    this.moveSticker(sticker);
    this.changeTitle(sticker);

    return sticker;
  }

  /* 스티커의 item 생성 */
  generateItem(sticker) {
    const btnItemAdd = sticker.querySelector(".btn-item-add");

    btnItemAdd.onclick = (e) => {
      let newItem;

      const userInfo = e.target.getAttribute("data-userInfo");

      if (userInfo) {
        newItem = new Item(this, userInfo);
      } else {
        newItem = new Item(this);
      }

      e.target.removeAttribute("data-userInfo");
      this.addItem(newItem);
    };
  }

  addItem(item) {
    this.items.push(item);

    const itemsDiv = this.stickerEl.children[3];

    itemsDiv.style.margin = "0px";
    itemsDiv.style.padding = "0px";

    this.renderItem(itemsDiv);
  }

  /* itemsDiv 렌더링 */
  renderItem(itemsDiv) {
    if (this.items.length === 0) {
      itemsDiv.style = `height: 50px`;
      return;
    }

    for (let li of itemsDiv.children) {
      if (li.tagName.toLowerCase() !== "li") li.remove();
    }
    itemsDiv.style.height = `${this.items.length * 50.2}px`;

    this.items.forEach((item, index) => {
      if (item === "EMPTY") {
        itemsDiv.append(document.createElement("div"));
      } else {
        item.itemEl.style.top = `${50.2 * index}px`;
        itemsDiv.append(item.itemEl);
      }
    });
  }

  /* 스티커 삭제 */
  deleteSticker(deleteSticker) {
    const btnStickerDelete = deleteSticker.querySelector(".btn-sticker-delete");

    btnStickerDelete.onclick = () => {
      const deleteIndex = this.stickerBox.stickers.findIndex((sticker) => sticker.stickerEl === deleteSticker);

      this.stickerBox.stickers.splice(deleteIndex, 1);
      deleteSticker.remove();

      this.stickerBox.clear();
    };
  }

  /* 스티커 움직임 */
  moveSticker(sticker) {
    sticker.onmousedown = (e) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      let shiftX = clientX - sticker.getBoundingClientRect().left;
      let shiftY = clientY - sticker.getBoundingClientRect().top;

      this.setTop(sticker);

      function onMouseMove(e) {
        sticker.style.left = e.pageX - shiftX + "px";
        sticker.style.top = e.pageY - shiftY + "px";

        if (clientX !== e.clientX || clientY !== e.clientY) {
          sticker.isDragged = true;
        }
      }

      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", () => {
        return onMouseUp();
      });

      sticker.onmouseup = null;
    };

    sticker.ondragstart = () => false;
  }

  /* 스티커 최상단으로 이동 */
  setTop(sticker) {
    sticker.style.zIndex = Sticker.highestZIndex++;
  }

  /* 스티커 제목 변경 */
  changeTitle(sticker) {
    const stickerTitleInput = sticker.querySelector(".sticker-title");
    const copyInput = stickerTitleInput.cloneNode();
    let originValue = stickerTitleInput.value;

    // Sticker Title의 onKeyUp
    const onKeyUp = (e) => {
      if (e.key === "Enter") e.target.blur();
    };

    // Sticker Title의 onBlur
    const onBlur = (e) => {
      const newDiv = document.createElement("div");
      newDiv.classList.add("sticker-title");

      if (e.target.value === "") {
        newDiv.innerText = originValue;
      } else {
        newDiv.innerText = e.target.value;
        originValue = e.target.value;
      }

      newDiv.addEventListener("click", () => {
        if (!sticker.isDragged) {
          copyInput.value = newDiv.innerText;
          newDiv.replaceWith(copyInput);
          copyInput.focus();
        } else {
          sticker.isDragged = false;
        }
      });

      e.target.replaceWith(newDiv);
    };

    // Sticker Title의 onMouseDown
    // = 한 번 클릭으로 제목 수정할 수 있도록
    const onMouseDown = (e) => {
      e.stopPropagation();
    };

    // 이벤트 달기
    stickerTitleInput.onkeyup = (e) => onKeyUp(e);
    copyInput.onkeyup = (e) => onKeyUp(e);

    stickerTitleInput.addEventListener("blur", (e) => onBlur(e));
    copyInput.addEventListener("blur", (e) => onBlur(e));

    stickerTitleInput.addEventListener("mousedown", onMouseDown);
    copyInput.addEventListener("mousedown", onMouseDown);
  }
}
