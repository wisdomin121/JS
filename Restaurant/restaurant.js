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
    const chef = await this.findChef();
    const order = this.cookOrder();
    await chef.cooking(order);

    const server = await this.findServer();
    this.serveOrder(order);
    await server.serving();

    this.done(order);
  }

  findChef() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const chef =
          this.chefOne.status === "waiting" ? this.chefOne : this.chefTwo.status === "waiting" ? this.chefTwo : null;

        if (chef) {
          clearInterval(interval);
          resolve(chef);
        }
      });
    });
  }

  cookOrder() {
    const order = this.orderList.shift();
    this.cookingList.set(order.index, order);
    this.updateOrder();

    return order;
  }

  findServer() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const server =
          this.serverOne.status === "waiting"
            ? this.serverOne
            : this.serverTwo.status === "waiting"
            ? this.serverTwo
            : null;

        if (server) {
          clearInterval(interval);
          resolve(server);
        }
      });
    });
  }

  serveOrder(order) {
    this.servingList.set(order.index, order);
    this.cookingList.delete(order.index);
  }

  done(order) {
    this.doneList.push(order);
    this.servingList.delete(order.index);
    this.updateDone();
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
