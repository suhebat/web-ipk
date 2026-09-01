document.addEventListener(
    "DOMContentLoaded",
    function () {

        const carousel =
            document.getElementById(
                "publicationCarousel"
            );

        const track =
            document.getElementById(
                "publicationTrack"
            );

        if (!carousel || !track) {
            return;
        }


        /* =================================================
           SETUP
        ================================================= */

        const originalItems =
            Array.from(
                track.children
            );

        const total =
            originalItems.length;


        /*
         * Clone satu set buku
         *
         * 1 2 3 4 | 1 2 3 4
         */

        originalItems.forEach(
            function (item) {

                track.appendChild(
                    item.cloneNode(true)
                );

            }
        );


        let currentIndex = 0;

        let currentPosition = 0;

        let targetPosition = 0;

        let animationFrame;

        let lastTime = 0;

        let isDragging = false;
		let isHovered = false;

        let startX = 0;

        let dragStartPosition = 0;

        let lastDragX = 0;

        let dragVelocity = 0;


        /*
         * Kecepatan auto-scroll.
         *
         * Semakin kecil = semakin lambat.
         */

        const speed = 35;

		/* =================================================
		   HOVER PAUSE
		================================================= */

		carousel.addEventListener(
			"mouseenter",
			function () {

				isHovered = true;

			}
		);


		carousel.addEventListener(
			"mouseleave",
			function () {

				isHovered = false;

			}
		);
		

        /* =================================================
           ITEM WIDTH
        ================================================= */

        function getItemWidth() {

            const item =
                track.children[0];

            const gap =
                parseFloat(
                    getComputedStyle(track).gap
                ) || 0;

            return (
                item.offsetWidth + gap
            );

        }


        /* =================================================
           ONE SET WIDTH
        ================================================= */

        function getSetWidth() {

            return (
                getItemWidth() *
                total
            );

        }


        /* =================================================
           APPLY POSITION
        ================================================= */

        function applyPosition() {

            track.style.transform =
                `translate3d(
                    ${currentPosition}px,
                    0,
                    0
                )`;

        }


        /* =================================================
           INFINITE LOOP
        ================================================= */

        function normalizePosition() {

            const setWidth =
                getSetWidth();


            /*
             * Jika sudah terlalu jauh ke kiri,
             * kembali ke set pertama.
             */

            if (
                currentPosition <=
                -setWidth
            ) {

                currentPosition +=
                    setWidth;

            }


            /*
             * Jika drag terlalu jauh ke kanan,
             * masuk ke set clone.
             */

            if (
                currentPosition > 0
            ) {

                currentPosition -=
                    setWidth;

            }

        }


        /* =================================================
           AUTO ANIMATION
        ================================================= */

        function animate(time) {

            if (!lastTime) {
                lastTime = time;
            }


            const delta =
                time - lastTime;


            lastTime = time;


            /*
             * Hanya auto-scroll ketika
             * user tidak sedang drag.
             */

            if (!isDragging && !isHovered) {

                currentPosition -=
                    speed *
                    (delta / 1000);

            }


            normalizePosition();

            applyPosition();


            animationFrame =
                requestAnimationFrame(
                    animate
                );

        }


        /* =================================================
           DRAG START
        ================================================= */

        function startDrag(event) {

            isDragging = true;

            carousel.classList.add(
                "is-dragging"
            );


            startX =
                event.type === "mousedown"
                    ? event.clientX
                    : event.touches[0].clientX;


            dragStartPosition =
                currentPosition;


            lastDragX = startX;

            dragVelocity = 0;

        }


        /* =================================================
           DRAG MOVE
        ================================================= */

        function moveDrag(event) {

            if (!isDragging) {
                return;
            }


            const x =
                event.type === "mousemove"
                    ? event.clientX
                    : event.touches[0].clientX;


            const delta =
                x - startX;


            /*
             * Posisi mengikuti
             * gerakan mouse/jari.
             */

            currentPosition =
                dragStartPosition +
                delta;


            /*
             * Hitung velocity
             * untuk efek momentum.
             */

            dragVelocity =
                x - lastDragX;


            lastDragX = x;


            normalizePosition();

            applyPosition();


            if (
                event.type ===
                "mousemove"
            ) {

                event.preventDefault();

            }

        }


        /* =================================================
           DRAG END
        ================================================= */

        function endDrag() {

            if (!isDragging) {
                return;
            }


            isDragging = false;

            carousel.classList.remove(
                "is-dragging"
            );


            /*
             * Tambahkan sedikit momentum
             * setelah swipe.
             */

            currentPosition +=
                dragVelocity * 3;


            normalizePosition();

            applyPosition();

        }


        /* =================================================
           MOUSE EVENTS
        ================================================= */

        carousel.addEventListener(
            "mousedown",
            startDrag
        );


        window.addEventListener(
            "mousemove",
            moveDrag
        );


        window.addEventListener(
            "mouseup",
            endDrag
        );


        /* =================================================
           TOUCH EVENTS
        ================================================= */

        carousel.addEventListener(
            "touchstart",
            startDrag,
            {
                passive: true
            }
        );


        carousel.addEventListener(
            "touchmove",
            moveDrag,
            {
                passive: false
            }
        );


        carousel.addEventListener(
            "touchend",
            endDrag
        );


        /* =================================================
           PREVENT IMAGE DRAG
        ================================================= */

        carousel.addEventListener(
            "dragstart",
            function (event) {

                event.preventDefault();

            }
        );


        /* =================================================
           RESIZE
        ================================================= */

        window.addEventListener(
            "resize",
            function () {

                normalizePosition();

                applyPosition();

            }
        );


        /* =================================================
           START
        ================================================= */

        animationFrame =
            requestAnimationFrame(
                animate
            );

    }
);



/* =================================================
   RADAR CHART
================================================= */


document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById("ipkRadarChart");
    const yearSelect = document.getElementById("yearSelect");
	
	const summaryYear =
		document.getElementById("summaryYear");

	const summaryScore =
    	document.getElementById("summaryScore");

    if (!canvas || !yearSelect) {
        return;
    }


    /* =========================================================
       DATA IPK
       ========================================================= */

    const ipkData = {

        2024: [
            31.25,
            73.41,
            75.71,
            54.93,
            39.85,
            64.40,
            57.5
        ],

        2023: [
            29.50,
			73.35,
			70.73,
			51.54,
			34.91,
			60.49,
			58.71
        ],

        2022: [
            26.88,
			72.53,
			69.25,
			48.92,
			31.48,
			57.40,
			59.30
        ],
		
		2021: [
            20.69,
			68.71,
			66.83,
			46.63,
			27.13,
			54.29,
			58.55
        ],
		
		2020: [
            26.96,
			71.26,
			74.01,
			41.00,
			35.82,
			61.63,
			58.01
        ],
		
		2019: [
            33.79,
			72.49,
			73.55,
			43.89,
			37.14,
			59.11,
			54.57
        ],
		
		2018: [
            30.55,
			69.67,
			72.84,
			41.11,
			36.57,
			55.03,
			54.97
        ]

    };

	/* MENGHITUNG RATA-RATA */
	
	function calculateAverage(values) {

		const total =
			values.reduce(
				(sum, value) => sum + value,
				0
			);

		return total / values.length;

	}
	
	/* UPDATE SUMMARY */
	function updateSummary(year) {

    const values =
        ipkData[year];

    const average =
        calculateAverage(values);


    // Tahun

    summaryYear.textContent =
        "Tahun " + year;


    // Nilai IPK

    summaryScore.textContent =
        average
            .toFixed(2)
            .replace(".", ",");


    // Cari tahun sebelumnya

    const years =
        Object.keys(ipkData)
            .map(Number)
            .sort((a, b) => a - b);

    const currentYear =
        Number(year);

    const currentIndex =
        years.indexOf(currentYear);


    /*
     * Jika tidak ada tahun sebelumnya,
     * misalnya 2024 adalah data paling awal,
     * tampilkan keterangan saja.
     */

    if (currentIndex <= 0) {

        summaryChange.textContent =
            "Data tahun sebelumnya tidak tersedia";

        summaryChange.className =
            "ipk-summary-change neutral";

        return;
    }


    // Tahun sebelumnya

    const previousYear =
        years[currentIndex - 1];


    const previousAverage =
        calculateAverage(
            ipkData[previousYear]
        );


    // Hitung persentase perubahan

    const percentageChange =
        (
            (average - previousAverage)
            / previousAverage
        ) * 100;


    const formattedChange =
        Math.abs(percentageChange)
            .toFixed(2)
            .replace(".", ",");


    // Naik

    if (percentageChange > 0) {

        summaryChange.textContent =
            "▲ " +
            formattedChange +
            "% dari " +
            previousYear;

        summaryChange.className =
            "ipk-summary-change";

    }


    // Turun

    else if (percentageChange < 0) {

        summaryChange.textContent =
            "▼ " +
            formattedChange +
            "% dari " +
            previousYear;

        summaryChange.className =
            "ipk-summary-change down";

    }


    // Tidak berubah

    else {

        summaryChange.textContent =
            "— Tidak berubah dari " +
            previousYear;

        summaryChange.className =
            "ipk-summary-change neutral";

    }

}
	
    /* =========================================================
       LABEL + ICON
       ========================================================= */

    const dimensions = [
		"Ekonomi Budaya",
		"Pendidikan",
		"Ketahanan Sosial",
		"Warisan Budaya",
		"Ekspresi Budaya",
		"Budaya Literasi",
		"Gender"
	];


    /* =========================================================
       THEME
       ========================================================= */

    function isDarkMode() {

        return document.documentElement
            .getAttribute("data-bs-theme") === "dark";

    }


    function getThemeColors() {

        const dark = isDarkMode();

        return {

            text: dark
                ? "#f1f1f1"
                : "#333333",

            muted: dark
                ? "#adb5bd"
                : "#6c757d",

            grid: dark
                ? "rgba(255,255,255,0.12)"
                : "rgba(0,0,0,0.10)",

            angle: dark
                ? "rgba(255,255,255,0.12)"
                : "rgba(0,0,0,0.10)",

            border: dark
                ? "#ffb74d"
                : "#e99a16",

            background: dark
                ? "rgba(255,183,77,0.18)"
                : "rgba(245,166,35,0.18)",

            point: dark
                ? "#ffb74d"
                : "#e99a16",

            pointBorder: dark
                ? "#212529"
                : "#ffffff"

        };

    }



    /* =========================================================
       CREATE CHART
       ========================================================= */

    const ctx = canvas.getContext("2d");

    const colors = getThemeColors();

    const chart = new Chart(ctx, {

        type: "radar",

        data: {

            labels: dimensions,
			
            datasets: [

                {

                    label: "IPK Nasional",

                    data: ipkData[yearSelect.value],

                    fill: true,

                    backgroundColor:
                        colors.background,

                    borderColor:
                        colors.border,

                    borderWidth: 3,

                    pointBackgroundColor:
                        colors.point,

                    pointBorderColor:
                        colors.pointBorder,

                    pointBorderWidth: 2,

                    pointRadius: 5,

                    pointHoverRadius: 7

                }

            ]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {

                duration: 700,

                easing: "easeOutQuart"

            },


            scales: {

                r: {

                    min: 0,

                    max: 100,

                    ticks: {

                        stepSize: 20,

                        backdropColor: "transparent",

                        color: colors.muted,

                        font: {
                            size: 10
                        }

                    },


                    grid: {

                        color:
                            colors.grid

                    },


                    angleLines: {

                        color:
                            colors.angle

                    },


                    /*
                     * Label bawaan dimatikan karena
                     * kita menggunakan custom plugin.
                     */

                    pointLabels: {

						display: true,

						color: colors.text,

						font: {
							size: 12,
							weight: "600"
						},

						padding: 12

					}

                }

            },


            plugins: {

                legend: {

                    display: true,

                    position: "bottom",

                    labels: {

                        usePointStyle: true,

                        pointStyle: "circle",

                        padding: 20,

                        color:
                            colors.text,

                        font: {

                            size: 13,

                            weight: "600"

                        }

                    }

                },


                tooltip: {

					callbacks: {

						title: function (context) {

							return dimensions[
								context[0].dataIndex
							];

						},

						beforeLabel: function () {

							return "Tahun Data: " + yearSelect.value;

						},

						label: function (context) {

							return (
								" " +
								context.dataset.label +
								": " +
								context.raw
							);

						}

					}

				}

            }

        },



    });
	
	/* RUN ON FIRST LOAD */
	updateSummary(yearSelect.value);


    /* =========================================================
       CHANGE YEAR
       ========================================================= */

    yearSelect.addEventListener(
		"change",
		function () {

			const selectedYear =
				this.value;


			// Update radar

			chart.data.datasets[0].data =
				ipkData[selectedYear];

			chart.update();


			// Update summary

			updateSummary(selectedYear);

		}
	);
	

    /* =========================================================
       UPDATE THEME
       ========================================================= */

    function updateChartTheme() {

        const colors =
            getThemeColors();


        chart.data.datasets[0].backgroundColor =
            colors.background;

        chart.data.datasets[0].borderColor =
            colors.border;

        chart.data.datasets[0].pointBackgroundColor =
            colors.point;

        chart.data.datasets[0].pointBorderColor =
            colors.pointBorder;


        chart.options.scales.r.ticks.color =
            colors.muted;

        chart.options.scales.r.grid.color =
            colors.grid;

        chart.options.scales.r.angleLines.color =
            colors.angle;
		
		chart.options.scales.r.pointLabels.color =
    		colors.text;

        chart.options.plugins.legend.labels.color =
            colors.text;


        chart.update();

    }


    /* =========================================================
       OBSERVE BOOTSTRAP DARK/LIGHT MODE
       ========================================================= */

    const themeObserver =
        new MutationObserver(function () {

            updateChartTheme();

        });


    themeObserver.observe(
        document.documentElement,
        {
            attributes: true,
            attributeFilter: [
                "data-bs-theme"
            ]
        }
    );

});