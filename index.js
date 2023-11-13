const rspToInt = {
  바위: 0,
  가위: 1,
  보: 2,
};
const rspToSrc = {
  0: "rock.png",
  1: "scissors.png",
  2: "paper.png",
};
const resultToStr = {
  "-1": "졌습니다",
  0: "무승부입니다",
  1: "이겼습니다",
};

const getResult = (user, computer) => {
  const diff = user - computer;

  if ([-1, 2].includes(diff)) return resultToStr[1];
  else if ([1, -2].includes(diff)) return resultToStr[-1];
  else if (diff === 0) return resultToStr[0];
};

const rsp = document.getElementsByClassName("btn");
const userResult = document.getElementById("user");
const computerResult = document.getElementById("computer");
const finalResult = document.getElementById("result");

Array.from(rsp).forEach((btn) => {
  btn.addEventListener("click", () => {
    const user = rspToInt[btn.innerHTML];
    const computer = Math.floor(Math.random() * 3);

    userResult.src = rspToSrc[user];
    computerResult.src = rspToSrc[computer];

    let result = getResult(user, computer);
    finalResult.innerHTML = result;
  });
});
