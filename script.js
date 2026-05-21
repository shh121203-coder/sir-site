let chart = null;

function setVirus(type) {
  const presets = {
    covid: {
      population: 1000,
      infected: 1,
      beta: 0.35,
      gamma: 0.1,
      days: 120,
      title: "코로나19 정보",
      description: "코로나19는 호흡기 비말과 접촉을 통해 전파되는 감염병입니다.",
      link: "./info-covid.html"
    },
    flu: {
      population: 1000,
      infected: 1,
      beta: 0.2,
      gamma: 0.12,
      days: 90,
      title: "독감 정보",
      description: "독감은 인플루엔자 바이러스에 의해 발생하는 호흡기 감염병입니다.",
      link: "./info-flu.html"
    },
    measles: {
      population: 1000,
      infected: 1,
      beta: 0.8,
      gamma: 0.1,
      days: 100,
      title: "홍역 정보",
      description: "홍역은 전염성이 매우 높은 바이러스성 감염병입니다.",
      link: "./info-measles.html"
    },
    ebola: {
      population: 1000,
      infected: 1,
      beta: 0.25,
      gamma: 0.07,
      days: 140,
      title: "에볼라 정보",
      description: "에볼라는 치명률이 높은 바이러스성 출혈열 감염병입니다.",
      link: "./info-ebola.html"
    }
  };

  const selected = presets[type];

  if (!selected) {
    return;
  }

  document.getElementById("population").value = selected.population;
  document.getElementById("infected").value = selected.infected;
  document.getElementById("beta").value = selected.beta;
  document.getElementById("gamma").value = selected.gamma;
  document.getElementById("days").value = selected.days;

  const infoSection = document.getElementById("virus-info-section");
  const infoTitle = document.getElementById("info-title");
  const infoDescription = document.getElementById("info-description");
  const infoLink = document.getElementById("info-link");

  if (infoSection) {
    infoSection.style.display = "block";
  }

  if (infoTitle) {
    infoTitle.innerText = selected.title;
  }

  if (infoDescription) {
    infoDescription.innerText = selected.description;
  }

  if (infoLink) {
    infoLink.href = selected.link;
    infoLink.innerText = selected.title + " 자세히 보기";
  }

  runSimulation();
}

function runSimulation() {
  const populationInput = document.getElementById("population");
  const infectedInput = document.getElementById("infected");
  const betaInput = document.getElementById("beta");
  const gammaInput = document.getElementById("gamma");
  const daysInput = document.getElementById("days");
  const canvas = document.getElementById("sirChart");

  if (!populationInput || !infectedInput || !betaInput || !gammaInput || !daysInput || !canvas) {
    alert("HTML 요소 ID가 맞지 않습니다. index.html의 id를 확인해주세요.");
    return;
  }

  const N = Number(populationInput.value);
  const I0 = Number(infectedInput.value);
  const beta = Number(betaInput.value);
  const gamma = Number(gammaInput.value);
  const days = Number(daysInput.value);

  if (N <= 0 || I0 <= 0 || I0 >= N || beta < 0 || gamma < 0 || days <= 0) {
    alert("입력값을 확인해주세요. 초기 감염자는 총 인구보다 작아야 합니다.");
    return;
  }

  let S = N - I0;
  let I = I0;
  let R = 0;

  const labels = [];
  const sData = [];
  const iData = [];
  const rData = [];

  for (let day = 0; day <= days; day++) {
    labels.push(day);
    sData.push(Math.round(S));
    iData.push(Math.round(I));
    rData.push(Math.round(R));

    const newInfected = beta * S * I / N;
    const newRecovered = gamma * I;

    S = S - newInfected;
    I = I + newInfected - newRecovered;
    R = R + newRecovered;

    if (S < 0) S = 0;
    if (I < 0) I = 0;
    if (R > N) R = N;
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

  const summaryPeakRate = document.getElementById("summary-peak-rate");
  const summaryPeakDay = document.getElementById("summary-peak-day");
  const summaryPeakCount = document.getElementById("summary-peak-count");
  const summaryRisk = document.getElementById("summary-risk");
  const resultText = document.getElementById("result-text");

  if (summaryPeakRate) {
    summaryPeakRate.innerText = peakPercent + "%";
  }

  if (summaryPeakDay) {
    summaryPeakDay.innerText = peakDay + "일차";
  }

  if (summaryPeakCount) {
    summaryPeakCount.innerText = Math.round(maxInfected) + "명";
  }

  if (summaryRisk) {
    summaryRisk.innerText = riskLevel;
  }

  if (resultText) {
    resultText.innerText =
      "이 조건에서는 약 " + peakDay + "일차에 감염자가 가장 많아집니다. " +
      "최고 감염률은 " + peakPercent + "%이며, 확산 위험도는 " + riskLevel + " 수준입니다. " +
      "시간이 지나면서 감염자는 감소하고 회복자 수가 증가합니다.";
  }

  if (typeof Chart === "undefined") {
    alert("Chart.js가 불러와지지 않았습니다. 인터넷 연결 또는 script 순서를 확인해주세요.");
    return;
  }

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
    label: "S 감수성 인구",
    data: sData,
    borderColor: "#2563eb",
    backgroundColor: "transparent",
    tension: 0.25
  },
  {
    label: "I 감염자",
    data: iData,
    borderColor: "#111827",
    backgroundColor: "transparent",
    tension: 0.25
  },
  {
    label: "R 회복자",
    data: rData,
    borderColor: "#9ca3af",
    backgroundColor: "transparent",
    tension: 0.25
  }
]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
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
}

function openSirModal() {
  const modal = document.getElementById("sir-modal");

  if (modal) {
    modal.style.display = "flex";
  }
}

function closeSirModal() {
  const modal = document.getElementById("sir-modal");

  if (modal) {
    modal.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("sir-modal");

  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  const tooltipDetails = document.querySelectorAll(".tooltip-details");

  function closeTooltipsExcept(target) {
    tooltipDetails.forEach(function (tooltip) {
      if (!tooltip.contains(target)) {
        tooltip.open = false;
      }
    });
  }

  tooltipDetails.forEach(function (detail) {
    detail.addEventListener("toggle", function () {
      if (detail.open) {
        tooltipDetails.forEach(function (otherDetail) {
          if (otherDetail !== detail) {
            otherDetail.open = false;
          }
        });
      }
    });
  });

  document.addEventListener(
    "touchstart",
    function (event) {
      closeTooltipsExcept(event.target);
    },
    true
  );

  document.addEventListener(
    "mousedown",
    function (event) {
      closeTooltipsExcept(event.target);
    },
    true
  );
});
