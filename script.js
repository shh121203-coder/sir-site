let chart;
function setVirus(type) {
  const presets = {
    covid: {
      population: 1000,
      infected: 3,
      beta: 0.35,
      gamma: 0.1,
      days: 120
    },
    flu: {
      population: 1000,
      infected: 2,
      beta: 0.2,
      gamma: 0.12,
      days: 80
    },
    measles: {
      population: 1000,
      infected: 1,
      beta: 0.8,
      gamma: 0.1,
      days: 100
    },
    ebola: {
      population: 1000,
      infected: 1,
      beta: 0.25,
      gamma: 0.07,
      days: 140
    }
  };

  const selected = presets[type];

  document.getElementById("population").value = selected.population;
  document.getElementById("infected").value = selected.infected;
  document.getElementById("beta").value = selected.beta;
  document.getElementById("gamma").value = selected.gamma;
  document.getElementById("days").value = selected.days;
}
function runSimulation() {
  const N = parseInt(document.getElementById("population").value);
  const I0 = parseInt(document.getElementById("infected").value);
  const beta = parseFloat(document.getElementById("beta").value);
  const gamma = parseFloat(document.getElementById("gamma").value);
  const days = parseInt(document.getElementById("days").value);

  let S = N - I0;
  let I = I0;
  let R = 0;

  const sData = [S];
  const iData = [I];
  const rData = [R];
  const labels = [0];

  for (let t = 1; t <= days; t++) {
    const newInfected = (beta * S * I) / N;
    const newRecovered = gamma * I;

    S -= newInfected;
    I += newInfected - newRecovered;
    R += newRecovered;

    sData.push(S);
    iData.push(I);
    rData.push(R);
    labels.push(t);
  }

  const ctx = document.getElementById("sirChart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "S (감수성 인구)",
          data: sData,
          borderColor: "blue",
          fill: false
        },
        {
          label: "I (감염자)",
          data: iData,
          borderColor: "red",
          fill: false
        },
        {
          label: "R (회복자)",
          data: rData,
          borderColor: "green",
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        }
      },
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
          }
        }
      }
    }
  });
}
