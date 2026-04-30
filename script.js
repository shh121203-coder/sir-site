let chart;

function setVirus(type) {
    const presets = {
        covid: { population: 1000, infected: 1, beta: 0.35, gamma: 0.1, days: 120 },
        flu: { population: 1000, infected: 1, beta: 0.2, gamma: 0.12, days: 90 },
        measles: { population: 1000, infected: 1, beta: 0.8, gamma: 0.1, days: 100 },
        ebola: { population: 1000, infected: 1, beta: 0.25, gamma: 0.07, days: 140 }
    };

    const selected = presets[type];

    // 입력창 수치 변경
    document.getElementById("population").value = selected.population;
    document.getElementById("infected").value = selected.infected;
    document.getElementById("beta").value = selected.beta;
    document.getElementById("gamma").value = selected.gamma;
    document.getElementById("days").value = selected.days;

    // 상세 정보 섹션 업데이트
    const infoSection = document.getElementById('virus-info-section');
    const infoTitle = document.getElementById('info-title');
    const infoLink = document.getElementById('info-link');

    infoSection.style.display = 'block';

    if (type === 'covid') {
        infoTitle.innerText = "코로나19 정보 센터";
        infoLink.innerText = "코로나19 상세페이지 이동";
        infoLink.href = "./info-covid.html"; 
        infoLink.style.backgroundColor = "#2563eb";
    } else if (type === 'flu') {
        infoTitle.innerText = "독감 정보 센터";
        infoLink.innerText = "독감 상세페이지 이동";
        infoLink.href = "./info-flu.html"; 
        infoLink.style.backgroundColor = "#f59e0b";
    } else if (type === 'measles') {
        infoTitle.innerText = "홍역 정보 센터";
        infoLink.innerText = "홍역 상세페이지 이동";
        infoLink.href = "./info-measles.html"; 
        infoLink.style.backgroundColor = "#ef4444";
    } else if (type === 'ebola') {
        infoTitle.innerText = "에볼라 정보 센터";
        infoLink.innerText = "에볼라 상세페이지 이동";
        infoLink.href = "./info-ebola.html"; 
        infoLink.style.backgroundColor = "#4b5563";
    }

    runSimulation();
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
// --- 상태 바 업데이트 로직 추가 ---
    const maxInfected = Math.max(...iData); // 감염자 데이터 중 최댓값 찾기
    const peakPercent = ((maxInfected / N) * 100).toFixed(1); // 백분율 계산 (소수점 첫째자리까지)

    const statusContainer = document.getElementById('status-container');
    const infectionBar = document.getElementById('infection-bar');
    const peakText = document.getElementById('peak-percentage');

    statusContainer.style.display = 'block'; // 숨겨져 있던 컨테이너 표시
    infectionBar.style.width = peakPercent + "%"; // 바 길이 조절
    peakText.innerText = peakPercent + "%"; // 텍스트 업데이트
    // --------------------------------
    const ctx = document.getElementById("sirChart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                { label: "S (감수성)", data: sData, borderColor: "blue", fill: false },
                { label: "I (감염자)", data: iData, borderColor: "red", fill: false },
                { label: "R (회복자)", data: rData, borderColor: "green", fill: false }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: "top" } },
            scales: {
                x: { title: { display: true, text: "일수" } },
                y: { title: { display: true, text: "인구 수" } }
            }
        }
    });
}
