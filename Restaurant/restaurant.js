import Chef from "./chef.js";
import Server from "./server.js";

const engToKor = new Map([
  ["sundae", "순댓국"],
  ["haejang", "해장국"],
]);

class Restaurant {
  constructor() {
    this.chefOne = new Chef("one");
    this.chefTwo = new Chef("two");
    this.serverOne = new Server(1, "one");
    this.serverTwo = new Server(2, "two");
    this.orderList = [];
    this.cookingList = new Map();
    this.servingList = new Map();
    this.doneList = [];
  }

  takeOrder(index, food) {
    this.orderList.push({ index, food });
    this.updateOrder();
    this.start();
  }

  async start() {
    this.cookOrder()
      .then((order) => this.serveOrder(order))
      .then((order) => this.done(order));
  }

  async cookOrder() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        let chef =
          this.chefOne.status === "waiting" ? this.chefOne : this.chefTwo.status === "waiting" ? this.chefTwo : null;

        if (chef) {
          const order = this.orderList.shift();
          this.updateOrder();
          this.cookingList.set(order.index, order);

          clearInterval(interval);
          resolve({ chef, order });
        }
      });
    }).then(({ chef, order }) => chef.cooking(order));
  }

  async serveOrder(order) {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        const server =
          this.serverOne.status === "waiting"
            ? this.serverOne
            : this.serverTwo.status === "waiting"
            ? this.serverTwo
            : null;

        if (server) {
          this.servingList.set(order.index, order);

          clearInterval(interval);
          resolve({ server, order });
        }
      });
    }).then(({ server, order }) => {
      this.cookingList.delete(order.index);
      return server.serving(order);
    });
  }

  done(order) {
    console.log(order);
    this.doneList.push(order);
    this.updateDone();
    this.servingList.delete(order.index);
  }

  updateOrder() {
    const orderList = document.querySelector(".order-list");
    orderList.innerHTML = this.orderList
      .map((order) => `<li>${order.index}. ${engToKor.get(order.food)}</li>`)
      .join("");
  }

  updateDone() {
    const doneList = document.querySelector(".done-list");
    doneList.innerHTML = this.doneList.map((order) => `<li>${order.index}. ${engToKor.get(order.food)}</li>`).join("");
  }
}

export default Restaurant;
