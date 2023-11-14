import Restaurant from "./restaurant.js";

const restaurant = new Restaurant();
const foodBtns = document.querySelector(".foodBtns");
let index = 1;

foodBtns.addEventListener("click", (e) => {
  const food = e.target.id;

  restaurant.takeOrder(index++, food);
});
