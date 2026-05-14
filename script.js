alert("script.js 연결됨");

let chart;

function setVirus(type) {
  const presets = {
    covid: { population: 1000, infected: 1, beta: 0.35, gamma: 0.1, days: 120 },
    flu: { population: 1000, infected: 1, beta: 0.2, gamma: 0.12, days: 90 },
    measles: { population: 1000, infected: 1, beta: 0.8, gamma: 0.1, days: 100 },
    ebola: { population: 1000, infected: 1, beta: 0.25, gamma: 0.07, days: 140 }
  };

  const selected = presets[type];

  document.getElementById("population").value = selected.population;
  document.getElementById("infected").value = selected.infected;
  document.getElementById("beta").value = selected.beta;
  document.getElementById("gamma").value = selected.gamma;
  document.getElementById("days").value = selected.days;

  const infoSection = document.getElementById("virus-info-section");
  const infoTitle = document.getElementById("info-title");
  const infoLink = document.getElementById("info-link");

  infoSection.style.display = "block";

  if (type === "covid") {
    infoTitle.innerText = "코로나19 정보 선택";
    infoLink.innerText = "코로나19 상세페이지 이동";
    infoLink.href = "./info-covid.html";
    infoLink.style.backgroundColor = "#2563eb";
  } else if (type === "flu") {
    infoTitle.innerText = "독감 정보 선택";
    infoLink.innerText = "독감 상세페이지 이동";
    infoLink.href = "./info-flu.html";
    infoLink.style.backgroundColor = "#f59e0b";
  } else if (type === "measles") {
    infoTitle.innerText = "홍역 정보 선택";
    infoLink.innerText = "홍역 상세페이지 이동";
    infoLink.href = "./info-measles.html";
    infoLink.style.backgroundColor = "#ef4444";
  } else if (type === "ebola") {
    infoTitle.innerText = "에볼라 정보 선택";
    infoLink.innerText = "에볼라 상세페이지 이동";
    infoLink.href = "./info-ebola.html";
    infoLink.style.backgroundColor = "#4b5563";
  }

  runSimulation();
}

function runSimulation() {
  const N = Number(document.getElementById("population").value);
  const I0 = Number(document.getElementById("infected").value);
  const beta = Number(document.getElementById("beta").value);
  const gamma = Number(document.getElementById("gamma").value);
  const days = Number(document.getElementById("days").value);

  if (!N || !I0 || !days || beta < 0 || gamma < 0) {
    alert("입력값을 확인해주세요.");
    return;
  }

  let S = N - I0;
  let I = I0;
  let R = 0;

  const sData = [S];
  const iData = [I];
  const rData = [R];
  const labels = [0];

  for (let t = 1; t <= days; t++) {
    const newInfected = beta * S * I / N;
    const newRecovered = gamma * I;

    S = S - newInfected;
    I = I + newInfected - newRecovered;
    R = R + newRecovered;

    if (S < 0) S = 0;
    if (I < 0) I = 0;
    if (R > N) R = N;

    sData.push(Math.round(S));
    iData.push(Math.round(I));
    rData.push(Math.round(R));
    labels.push(t);
  }

 const maxInfected = Math.max(...iData);
const peakPercent = ((maxInfected / N) * 100).toFixed(1);
const peakDay = iData.indexOf(maxInfected);

let riskLevel = "낮음";

if (peakPercent >= 50) {
  riskLevel = "높음";
} else if (peakPercent >= 20) {
  riskLevel = "보통";
}

// 최고 감염률 상태바 업데이트
const statusContainer = document.getElementById("status-container");
const infectionBar = document.getElementById("infection-bar");
const peakText = document.getElementById("peak-percentage");

if (statusContainer) {
  statusContainer.style.display = "block";
}

if (infectionBar) {
  infectionBar.style.width = peakPercent + "%";
}

if (peakText) {
  peakText.innerText = peakPercent + "%";
}

// 요약카드 업데이트
document.getElementById("summary-peak-rate").innerText = peakPercent + "%";
document.getElementById("summary-peak-day").innerText = peakDay + "일차";
document.getElementById("summary-peak-count").innerText = Math.round(maxInfected) + "명";
document.getElementById("summary-risk").innerText = riskLevel;

document.getElementById("summary-peak-rate").innerText = peakPercent + "%";
document.getElementById("summary-peak-day").innerText = peakDay + "일차";
document.getElementById("summary-peak-count").innerText = Math.round(maxInfected) + "명";
document.getElementById("summary-risk").innerText = riskLevel;
  
  const statusContainer = document.getElementById("status-container");
  const infectionBar = document.getElementById("infection-bar");
  const peakText = document.getElementById("peak-percentage");

  if (statusContainer) {
    statusContainer.style.display = "block";
  }

  if (infectionBar) {
    infectionBar.style.width = peakPercent + "%";
  }

  if (peakText) {
    peakText.innerText = peakPercent + "%";
  }

  const canvas = document.getElementById("sirChart");
  const ctx = canvas.getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "S 감수성",
          data: sData,
          borderColor: "blue",
          fill: false
        },
        {
          label: "I 감염자",
          data: iData,
          borderColor: "red",
          fill: false
        },
        {
          label: "R 회복자",
          data: rData,
          borderColor: "green",
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "일수"
          }
        },
        y: {
          title: {
            display: true,
            text: "인구 수"
          },
          beginAtZero: true
        }
      }
    }
  });
  function openSirModal() {
  document.getElementById("sir-modal").style.display = "flex";
}

function closeSirModal() {
  document.getElementById("sir-modal").style.display = "none";
}

window.onclick = function(event) {
  const modal = document.getElementById("sir-modal");

  if (event.target === modal) {
    modal.style.display = "none";
  }
};
}
