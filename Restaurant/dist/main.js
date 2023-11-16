(() => {
  "use strict";
  class t {
    constructor() {
      this.status = "waiting";
    }
  }
  const e = class extends t {
      constructor(t) {
        super(), (this.className = `chef-${t}`);
      }
      cooking(t) {
        return new Promise((e) => {
          const s = this.getCookingTime(t.food);
          (this.status = "cooking"),
            this.changeStatus(),
            setTimeout(() => {
              (this.status = "waiting"), this.changeStatus(), e();
            }, 1e3 * s);
        });
      }
      getCookingTime(t) {
        return "sundae" === t ? 1 : 2;
      }
      changeStatus() {
        const t = document.getElementById(this.className);
        (t.innerText = "waiting" === this.status ? "대기중" : "요리중"),
          (t.style.color = "waiting" === this.status ? "black" : "#DD312B");
      }
    },
    s = class extends t {
      constructor(t, e) {
        super(), (this.servingTime = t), (this.className = `server-${e}`);
      }
      serving() {
        return new Promise((t) => {
          (this.status = "serving"),
            this.changeStatus(),
            setTimeout(() => {
              (this.status = "waiting"), this.changeStatus(), t();
            }, 1e3 * this.servingTime);
        });
      }
      changeStatus() {
        const t = document.getElementById(this.className);
        (t.innerText = "waiting" === this.status ? "대기중" : "서빙중"),
          (t.style.color = "waiting" === this.status ? "black" : "#DD312B");
      }
    },
    i = new Map([
      ["sundae", "순댓국"],
      ["haejang", "해장국"],
    ]),
    n = document.querySelector(".foodBtns");
  let r = 1;
  const o = new (class {
    constructor() {
      (this.chefOne = new e("one")),
        (this.chefTwo = new e("two")),
        (this.serverOne = new s(1, "one")),
        (this.serverTwo = new s(2, "two")),
        (this.orderList = []),
        (this.cookingList = new Map()),
        (this.servingList = new Map()),
        (this.doneList = []);
    }
    takeOrder(t, e) {
      this.orderList.push({ index: t, food: e }), this.updateOrder(), this.start();
    }
    async start() {
      const t = await this.findChef(),
        e = this.cookOrder();
      await t.cooking(e);
      const s = await this.findServer();
      this.serveOrder(e), await s.serving(), this.done(e);
    }
    findChef() {
      return new Promise((t) => {
        const e = setInterval(() => {
          const s =
            "waiting" === this.chefOne.status ? this.chefOne : "waiting" === this.chefTwo.status ? this.chefTwo : null;
          s && (clearInterval(e), t(s));
        });
      });
    }
    cookOrder() {
      const t = this.orderList.shift();
      return this.cookingList.set(t.index, t), this.updateOrder(), t;
    }
    findServer() {
      return new Promise((t) => {
        const e = setInterval(() => {
          const s =
            "waiting" === this.serverOne.status
              ? this.serverOne
              : "waiting" === this.serverTwo.status
              ? this.serverTwo
              : null;
          s && (clearInterval(e), t(s));
        });
      });
    }
    serveOrder(t) {
      this.servingList.set(t.index, t), this.cookingList.delete(t.index);
    }
    done(t) {
      this.doneList.push(t), this.servingList.delete(t.index), this.updateDone();
    }
    updateOrder() {
      document.querySelector(".order-list").innerHTML = this.orderList
        .map((t) => `<li>${t.index}. ${i.get(t.food)}</li>`)
        .join("");
    }
    updateDone() {
      document.querySelector(".done-list").innerHTML = this.doneList
        .map((t) => `<li>${t.index}. ${i.get(t.food)}</li>`)
        .join("");
    }
  })();
  n.addEventListener("click", (t) => {
    const e = t.target.id;
    o.takeOrder(r++, e);
  });
})();
