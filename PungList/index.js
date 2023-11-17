const divGenerateItem = document.getElementById("div-generate-item");
const inputItemName = document.getElementById("input-item-name");
const ulPungList = document.getElementById("ul-pung-list");
const listCount = document.getElementById("list-count");
const averageTime = document.getElementById("average-time");

let index = 1;
const pungList = [];
const TEXT = {
  STOP: "중지",
  START: "시작",
  DELETE: "삭제",
  ADD: "5초 추가",
};

setInterval(() => {
  renderList();
}, 250);

const getLiChild = (item) => {
  return `
    <div class="item-name">${item.name}</div>
    <div class="item-time">${item.time}</div>초
    <button class="btn-add">${TEXT.ADD}</button>
    <button class="btn-stop-start">${item.isStop ? TEXT.START : TEXT.STOP}</button>
    <button class="btn-delete"">${TEXT.DELETE}</button>
  `;
};

const renderList = () => {
  if (pungList.length >= 0) {
    const count = pungList.length;
    let totalTime = 0;

    listCount.innerText = count;
    ulPungList.innerHTML = pungList
      .sort((a, b) => a.time - b.time)
      .map((arrItem) => {
        totalTime += arrItem.time;

        return `<li id="li-${arrItem.index}" class="div-row li-item">${getLiChild(arrItem)}</li>`;
      })
      .join("");
    averageTime.innerText = count ? (totalTime / count).toFixed(1) : 0;

    const liItems = document.getElementsByClassName("li-item");
    Array.from(liItems).forEach((liItem, ulIdx) => {
      liItem.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() === "button") {
          const pk = +liItem.id.slice(3);

          if (e.target.className === "btn-add") addTime(ulIdx);
          else if (e.target.className === "btn-stop-start") stopTime(pk);
          else if (e.target.className === "btn-delete") deleteItem(pk);
        }
      });
    });
  }
};

const updateListItem = (pk) => {
  const pkItem = document.getElementById(`li-${pk}`);
  const item = pungList.find((item) => item.index === pk);

  if (item) {
    pkItem.innerHTML = getLiChild(item);
  }
};

// 5초, 10초, 20초
divGenerateItem.addEventListener("click", (e) => {
  const defaultTime = +e.target.value;
  const name = inputItemName.value;

  if (defaultTime && name) {
    const newItem = {
      index,
      time: defaultTime,
      name,
      isStop: false,
      interval: setInterval(() => {
        newItem.time--;

        if (newItem.time <= 0) {
          clearInterval(newItem.interval);

          deleteItem(newItem.index);
        }

        updateListItem(newItem.index);
      }, 1000),
    };

    pungList.push(newItem);

    index++;
    inputItemName.value = "";
    inputItemName.focus();
  }
});

// 아이템 5초 추가
const addTime = (ulIdx) => {
  const arrItem = pungList[ulIdx];

  if (arrItem) {
    arrItem.time += 5;
    updateListItem(ulIdx);
  }
};

// 아이템 중지
const stopTime = (pk) => {
  const arrItem = pungList.find((item) => item.index === pk);

  if (arrItem) {
    if (arrItem.interval) {
      clearInterval(arrItem.interval);

      arrItem.isStop = true;
      arrItem.interval = null;
    } else {
      arrItem.isStop = false;
      arrItem.interval = setInterval(() => {
        arrItem.time--;

        if (arrItem.time <= 0) {
          clearInterval(arrItem.interval);

          deleteItem(pk);
        }

        updateListItem(pk);
      }, 1000);
    }
  }
};

// 아이템 삭제
const deleteItem = (pk) => {
  const arrItemIndex = pungList.findIndex((item) => item.index === pk);
  const arrItem = pungList[arrItemIndex];

  if (arrItem) {
    clearInterval(arrItem.intervalId);

    pungList.splice(arrItemIndex, 1);
  }
};

// 전체 초기화
const btnAllReset = document.getElementById("btn-all-reset");

btnAllReset.addEventListener("click", () => {
  pungList.forEach((item) => clearInterval(item.interval));
  pungList.length = 0;
});

// 전체 2배 복사
const btnAllTwice = document.getElementById("btn-all-twice");

btnAllTwice.addEventListener("click", () => {
  const addIndex = pungList.length;
  const newItems = JSON.parse(JSON.stringify(pungList));

  newItems.forEach((item) => {
    item.index += addIndex;
    item.time *= 2;
    item.interval = setInterval(() => {
      item.time--;

      if (item.time <= 0) {
        clearInterval(item.interval);
        deleteItem(item.index);
      }

      updateListItem(item.index);
    }, 1000);
  });

  pungList.push(...newItems);
});

// 전체 5초 추가
const btnAllAdd = document.getElementById("btn-all-add");

btnAllAdd.addEventListener("click", () => {
  pungList.forEach((item) => (item.time += 5));
});

// 전체 중지
const btnAllStop = document.getElementById("btn-all-stop");

btnAllStop.addEventListener("click", () => {
  const liItems = document.getElementsByClassName("li-item");

  Array.from(liItems).forEach((liItem) => {
    const arrIdx = +liItem.id.slice(3);
    const item = pungList.find((item) => item.index === arrIdx);

    if (item.interval) stopTime(arrIdx);
  });
});

// 전체 시작
const btnAllStart = document.getElementById("btn-all-start");

btnAllStart.addEventListener("click", () => {
  const liItems = document.getElementsByClassName("li-item");

  Array.from(liItems).forEach((liItem) => {
    const arrIdx = +liItem.id.slice(3);
    const item = pungList.find((item) => item.index === arrIdx);

    if (!item.interval) stopTime(arrIdx);
  });
});
