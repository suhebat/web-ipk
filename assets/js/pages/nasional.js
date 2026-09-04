let data, provinces, trend, radar;
let mode = 'multi';
let mapScale = 1;
let mapPos = { x: 0, y: 0 };
let isDragging = false;
let startPos = { x: 0, y: 0 };

const $ = id => document.getElementById(id);

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [a, b] = await Promise.all([
            fetch('assets/data/nasional.json'), 
            fetch('assets/data/provinsi.json')
        ]);
        data = await a.json();
        provinces = await b.json();
        init();
    } catch (e) {
        console.error("Fetch Error:", e);
    }
});

function init() {
    populate();
    setupPan();
    renderTrend();
    renderRadarChart(); // Perbaikan nama fungsi
    updateYear(data.years.at(-1));
    updateRadar();
    loadMap(data.years.at(-1));

    $('headerYear').onchange = e => updateYear(+e.target.value);
    $('mapYear').onchange = e => { 
        updateYear(+e.target.value); 
        loadMap(+e.target.value); 
    };
    $('year1').onchange = updateRadar;
    $('year2').onchange = updateRadar;

    $('themeSwitch').onclick = () => {
		const h = document.documentElement;
		h.dataset.bsTheme = h.dataset.bsTheme === 'dark' ? 'light' : 'dark';

		setTimeout(() => {
			// Update Radar Chart
			if(radar) { 
				radar.destroy(); 
				renderRadarChart(); 
				updateRadar(); 
			}

			// UPDATE TREND CHART (Hancurkan dan buat ulang)
			if(trend) {
				trend.destroy();
				renderTrend();
			}

			// Update Peta
			loadMap(+$('mapYear').value); 
		}, 100);
	};
}

function populate() {
    const opts = data.years.map(y => `<option value="${y}">${y}</option>`).join('');
    ['headerYear', 'mapYear', 'year1', 'year2'].forEach(id => {
        if($(id)) $(id).innerHTML = opts;
    });

    $('year1').value = data.years.at(-2);
    $('year2').value = data.years.at(-1);

    if($('multiYears')) {
        $('multiYears').innerHTML = data.years.map((y, i) => `
            <input class="btn-check multi" id="y${y}" type="checkbox" value="${y}" ${i >= data.years.length - 2 ? 'checked' : ''}>
            <label class="btn btn-sm btn-outline-primary y-color-${i % 6}" for="y${y}">${y}</label>
        `).join('');
    }

    document.querySelectorAll('.multi').forEach(x => x.onchange = updateRadar);

    document.querySelectorAll('input[name=mode]').forEach(x => {
        x.onchange = () => {
            mode = x.value;
            if($('multiPanel')) $('multiPanel').classList.toggle('d-none', mode !== 'multi');
            if($('pairPanel')) $('pairPanel').classList.toggle('d-none', mode !== 'pair');
            if($('comparisonTableWrap')) $('comparisonTableWrap').classList.toggle('d-none', mode !== 'pair');
            updateRadar();
        };
    });
}

function setupPan() {
    const wrap = document.querySelector('.map-wrapper');
    if(!wrap) return;
    wrap.onmousedown = e => {
        isDragging = true;
        startPos = { x: e.clientX - mapPos.x, y: e.clientY - mapPos.y };
    };
    window.onmousemove = e => {
        if (!isDragging) return;
        mapPos.x = e.clientX - startPos.x;
        mapPos.y = e.clientY - startPos.y;
        updateMapTransform();
    };
    window.onmouseup = () => isDragging = false;
}

function updateMapTransform() {
    const svg = $('map').querySelector('svg');
    if(svg) svg.style.transform = `translate(${mapPos.x}px, ${mapPos.y}px) scale(${mapScale})`;
}

$('zoomIn').onclick = () => { mapScale += 0.2; updateMapTransform(); };
$('zoomOut').onclick = () => { if(mapScale > 1) mapScale -= 0.2; updateMapTransform(); };

async function loadMap(y) {
    const count = y >= 2024 ? 38 : 34;
    if($('mapCount')) $('mapCount').textContent = `${count} Provinsi`;
    try {
        const r = await fetch(`assets/svg/maps/indonesia-${count}-provinsi.svg`);
        const svgText = await r.text();
        $('map').innerHTML = svgText;
        const svg = $('map').querySelector('svg');
        setTimeout(() => {
            const bbox = svg.getBBox();
            svg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
            applyMap(svg, y, count);
        }, 50);
    } catch (e) { console.error(e); }
}

function applyMap(svg, y, count) {
    const tooltip = $('mapTooltip');
    Object.entries(provinces).forEach(([code, p]) => {
        if (count === 34 && !p.availableBefore2024) return;
        const val = p.years[y];
        const el = findProv(svg, code, p.name);
        if (!el || !val) return;

        el.style.fill = getCategoryColor(val);
        el.classList.add('province-path');

        el.onmouseenter = () => { if(tooltip) tooltip.style.display = 'block'; };
        el.onmouseleave = () => { if(tooltip) tooltip.style.display = 'none'; };
        el.onmousemove = e => {
            if(tooltip) {
                tooltip.innerHTML = `<strong>${p.name}</strong><br>IPK: ${val.toFixed(2)}`;
                tooltip.style.left = (e.offsetX + 15) + 'px';
                tooltip.style.top = (e.offsetY - 50) + 'px';
                const isPapua = ["91","92","93","94","95","96"].includes(code);
                tooltip.classList.toggle('left-align', isPapua);
            }
        };
        el.onclick = () => {
            if($('provinceEmpty')) $('provinceEmpty').classList.add('d-none');
            if($('provinceInfo')) {
                $('provinceInfo').classList.remove('d-none');
                $('provinceName').textContent = p.name;
                $('provinceYear').textContent = y;
                $('provinceScore').textContent = val.toFixed(2);
            }
        };
    });
}

function getCategoryColor(v) {
    const isDark = document.documentElement.dataset.bsTheme === 'dark';
    if (v >= 85) return isDark ? "#15803D" : "#86EFAC";
    if (v >= 75) return isDark ? "#166534" : "#BBF7D0";
    if (v >= 65) return isDark ? "#854D0E" : "#FEF3C7";
    if (v >= 55) return isDark ? "#9A3412" : "#FED7AA";
    return isDark ? "#7F1D1D" : "#FEE2E2";
}

function updateRadar() {
    if(!radar) return;
    const ys = mode === 'multi' ? [...document.querySelectorAll('.multi:checked')].map(x => +x.value) : [+$('year1').value, ++$('year2').value];
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3', '#FFD433'];

    radar.data.datasets = ys.map((y, i) => ({
        label: String(y),
        data: data.dimensions.map(d => data.dimensionValues[y][d.id]),
        borderColor: colors[i % 6],
        backgroundColor: colors[i % 6] + '22',
        borderWidth: 2
    }));
    radar.update();
    if (mode === 'pair') updateTable(ys[0], ys[1]);
}

function updateTable(a, b) {
    if(!$('comparisonTable')) return;
    $('th1').textContent = a; $('th2').textContent = b;
    $('comparisonTable').innerHTML = data.dimensions.map(d => {
        const vA = data.dimensionValues[a][d.id], vB = data.dimensionValues[b][d.id];
        const diff = vB - vA;
        return `<tr><td>${d.name}</td><td class="text-end">${vA.toFixed(2)}</td><td class="text-end">${vB.toFixed(2)}</td> 
        <td class="text-end fw-bold ${diff >= 0 ? 'text-success' : 'text-danger'}">${diff >= 0 ? '+' : ''}${diff.toFixed(2)}</td></tr>`;
    }).join('');
}

function renderTrend() {
    const ctx = $('trendChart');
    if (!ctx) return;

    // DETEKSI TEMA
    const isDark = document.documentElement.dataset.bsTheme === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)';
    const textColor = isDark ? '#adb5bd' : '#6c757d';

    trend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.years,
            datasets: [{
                label: 'IPK Nasional',
                data: data.years.map(y => data.national[y]),
                borderColor: '#8a6725',
                backgroundColor: '#8a6725',
                tension: .35,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: gridColor }, // Warna grid vertikal
                    ticks: { color: textColor }  // Warna teks tahun (bawah)
                },
                y: {
                    grid: { color: gridColor }, // Warna grid horizontal
                    ticks: { color: textColor }  // Warna teks angka (kiri)
                }
            }
        }
    });
}

function renderRadarChart() {
    const ctx = $('radarChart');
    if (!ctx) return;
    const isDark = document.documentElement.dataset.bsTheme === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
    radar = new Chart(ctx, {
        type: 'radar',
        data: { labels: data.dimensions.map(d => d.name), datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                r: {
                    beginAtZero: true,
                    suggestedMax: 100,
                    grid: { color: gridColor },
                    angleLines: { color: gridColor },
                    pointLabels: { color: isDark ? '#adb5bd' : '#495057', font: { size: 11 } },
                    ticks: { display: false }
                }
            }
        }
    });
}

function updateYear(y) {
    if ($('headerYear')) $('headerYear').value = y;
    if ($('mapYear')) $('mapYear').value = y;
    if ($('scoreYear')) $('scoreYear').textContent = y;
    
    document.querySelectorAll('.txt-year').forEach(el => el.textContent = y);

    const v = data.national[y];
    if ($('nationalScore')) $('nationalScore').textContent = v.toFixed(2);

    const idx = data.years.indexOf(y);
    const prevV = idx > 0 ? data.national[data.years[idx - 1]] : null;

    if ($('nationalChange')) {
        if (prevV === null) {
            $('nationalChange').textContent = 'Tidak ada pembanding';
            $('nationalChange').className = 'small mt-2 text-body-secondary';
        } else {
            const diff = v - prevV;
            $('nationalChange').textContent = `${diff >= 0 ? '+' : ''}${diff.toFixed(2)} dari ${data.years[idx - 1]}`;
            $('nationalChange').className = `small mt-2 ${diff >= 0 ? 'text-success' : 'text-danger'}`;
        }
    }
    renderDimensions(y);
}

function renderDimensions(y) {
    if(!$('dimensionCards')) return;
    $('dimensionCards').innerHTML = data.dimensions.map(d => `
        <div class="col-6 col-lg-3">
            <div class="dimension-card">
                <div class="small text-body-secondary">${d.name}</div>
                <div class="dimension-value mt-2">${Number(data.dimensionValues[y][d.id]).toFixed(2)}</div>
                <div class="small text-body-secondary">${y}</div>
            </div>
        </div>`).join('');
}

function findProv(svg, code, name) {
    const mapping = { "11": "ID-AC", "12": "ID-SU", "13": "ID-SB", "14": "ID-RI", "15": "ID-JA", "16": "ID-SS", "17": "ID-BE", "18": "ID-LA", "19": "ID-BB", "21": "ID-KR", "31": "ID-JK", "32": "ID-JB", "33": "ID-JT", "34": "ID-YO", "35": "ID-JI", "36": "ID-BT", "51": "ID-BA", "52": "ID-NB", "53": "ID-NT", "61": "ID-KB", "62": "ID-KT", "63": "ID-KS", "64": "ID-KI", "65": "ID-KU", "71": "ID-SA", "72": "ID-ST", "73": "ID-SN", "74": "ID-SG", "75": "ID-GO", "76": "ID-SR", "81": "ID-MA", "82": "ID-MU", "91": "ID-PA", "92": "ID-PB", "93": "ID-PS", "94": "ID-PT", "95": "ID-PE", "96": "ID-PD" };
    return svg.getElementById(mapping[code]) || [...svg.querySelectorAll('path')].find(el => el.getAttribute('title')?.includes(name));
}