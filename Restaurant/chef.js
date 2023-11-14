import Human from "./human.js";

class Chef extends Human {
  constructor(seq) {
    super();

    this.className = `chef-${seq}`;
  }

  cooking(order) {
    return new Promise((resolve) => {
      const cookingTime = this.getCookingTime(order.food);

      this.status = "cooking";
      this.changeStatus();

      setTimeout(() => {
        this.status = "waiting";
        this.changeStatus();

        resolve(order);
      }, cookingTime * 1000);
    });
  }

  getCookingTime(food) {
    return food === "sundae" ? 1 : 2;
  }

  changeStatus() {
    const status = document.getElementById(this.className);

    status.innerText = this.status === "waiting" ? "대기중" : "요리중";
    status.style.color = this.status === "waiting" ? "black" : "#DD312B";
  }
}

export default Chef;
