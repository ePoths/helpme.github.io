const btn = document.getElementById("btn");
const input = document.getElementById("input");
const init = document.getElementById("initialization");
const container = document.getElementById("container");
const p = document.getElementById("result");
const resultElement = document.getElementById("resultElements");
const chartWarp = document.getElementsByClassName("chart-warp");
function saved() {
  const height1 = parseInt(localStorage.getItem("height1"));
  const height2 = parseInt(localStorage.getItem("height2"));
  const distance = parseInt(localStorage.getItem("distance"));
  calculate(
    (height1Value = height1),
    (height2Value = height2),
    (distanceValue = distance)
  );
}

btn.addEventListener("click", onBtnClick);

function onBtnClick(event) {
  event.preventDefault();
  if (input.value === "") {
    pushAlert((mainText = "📢알림📢"), (subText = "숫자의 값을 입력해주세요."));
  } else if (input.placeholder === "높이 1") {
    window.localStorage.setItem("height1", input.value);
    input.placeholder = "높이 2";
    input.value = "";
  } else if (input.placeholder === "높이 2") {
    window.localStorage.setItem("height2", input.value);
    input.placeholder = "거리";
    input.value = "";
  } else if (input.placeholder === "거리") {
    window.localStorage.setItem("distance", input.value);
    input.value = "";
    container.style.display = "none";
    resultElement.style.display = "flex";
    p.style.fontSize = "18px";
    p.style.marginRight = "20px";
    pushAlert(
      (mainText = "📢알림📢"),
      (subText = "값을 다시 작성 할려면 새로고침 해주세요.")
    );
    saved();
  }
}


function pushAlert(mainText, subText) {
  let notification;
  let notificationPermission = Notification.permission;
  if (notificationPermission === "granted") {
    if (mainText === "") {
      return;
    } else {
      notification = new Notification(`${mainText}`, {
        body: `${subText}`,
      });
    }
  } else if (notificationPermission !== "denied") {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
      } else {
        alert("알람 허용이 거부되었습니다.");
      }
    });
  }
}

function calculate(height1Value, height2Value, distanceValue) {
  let pressure = (9.81 * 1000 * (height1Value - height2Value)) / distanceValue;
  let atm = pressure / 101325;
  console.log(pressure);
  console.log(atm);
  p.innerHTML =
    "두 위치 사이의 수압 경도력: " +
    pressure.toFixed(2) +
    " Pa (" +
    atm.toFixed(2) +
    " atm) <br> <br> <p>값을 다시 작성 할려면 <span>새로고침</span> 해주세요. </p>";

  let ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "수압 경도력 계산 결과 차트",
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
    data: {
      labels: [0, distanceValue],
      datasets: [
        {
          label: "높이",
          fill: true,
          data: [
            { x: 0, y: 0 },
            { x: 0, y: height2Value },
            { x: distanceValue, y: height1Value },
          ],
          pointRadius: 0,
          backgroundColor: ["#88E69C", "#000000", "#000000"],
          borderColor: ["#56c2d2"],
          borderWidth: 2,
        },
      ],
    },
  });
}
