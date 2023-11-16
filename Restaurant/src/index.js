import Restaurant from "./restaurant.js";

const foodBtns = document.querySelector(".foodBtns");
let index = 1;

const restaurant = new Restaurant();
foodBtns.addEventListener("click", (e) => {
  const food = e.target.id;

  restaurant.takeOrder(index++, food);
});
