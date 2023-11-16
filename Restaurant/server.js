import Human from "./human.js";

class Server extends Human {
  constructor(servingTime, seq) {
    super();

    this.servingTime = servingTime;
    this.className = `server-${seq}`;
  }

  serving() {
    return new Promise((resolve) => {
      this.status = "serving";
      this.changeStatus();

      setTimeout(() => {
        this.status = "waiting";
        this.changeStatus();

        resolve();
      }, this.servingTime * 1000);
    });
  }

  changeStatus() {
    const status = document.getElementById(this.className);

    status.innerText = this.status === "waiting" ? "대기중" : "서빙중";
    status.style.color = this.status === "waiting" ? "black" : "#DD312B";
  }
}

export default Server;
