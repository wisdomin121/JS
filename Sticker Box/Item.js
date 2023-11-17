export class Item {
  static itemIndex = 1;

  constructor() {
    this.itemEl = this.generateItem();
  }

  generateItem() {
    const item = document.createElement("div");
    const itemTitle = document.createElement("div");
    const itemDeleteBtn = document.createElement("button");

    item.classList.add("item");

    itemTitle.innerText = `Text ${Item.itemIndex++}`;
    itemDeleteBtn.innerText = "삭제";

    item.append(itemTitle, itemDeleteBtn);

    return item;
  }
}
