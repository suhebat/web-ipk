/* =====================================================
       NUMBER COUNTER ON HERO
===================================================== */

(function() {
  "use strict";
document.addEventListener("DOMContentLoaded", function () {

    const counters = document.querySelectorAll(".score-number");

    if (!counters.length) {
        console.log("Score counter tidak ditemukan.");
        return;
    }


    function animateCounter(element) {

        const target = parseFloat(
            element.getAttribute("data-target")
        );

        if (isNaN(target)) {
            return;
        }


        const duration = 1800;

        let startTime = null;


        function update(currentTime) {

            if (!startTime) {
                startTime = currentTime;
            }

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /* Ease Out */

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const current =
                target * eased;


            element.textContent =
                current
                    .toFixed(2)
                    .replace(".", ",") + "";


            if (progress < 1) {

                requestAnimationFrame(update);

            } else {

                element.textContent =
                    target
                        .toFixed(2)
                        .replace(".", ",") + "";

            }

        }


        requestAnimationFrame(update);

    }


    /* =====================================================
       RUN WHEN HERO IS VISIBLE
    ===================================================== */

    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        counters.forEach(function (counter) {

                            animateCounter(counter);

                        });


                        observer.disconnect();

                    }

                });

            },
            {
                threshold: 0.2
            }
        );


    /*
     * Amati angka pertama
     */

    observer.observe(counters[0]);


});
	
})();

/* =====================================================
       BACK TO TOP BUTTON
===================================================== */
(function() {
  "use strict";
document.addEventListener(
    "DOMContentLoaded",
    function () {

        const backToTop =
            document.getElementById(
                "backToTop"
            );


        if (!backToTop) {
            return;
        }


        /*
         * Tampilkan tombol setelah
         * halaman mulai di-scroll.
         */

        window.addEventListener(
            "scroll",
            function () {

                if (window.scrollY > 300) {

                    backToTop.classList.add(
                        "show"
                    );

                } else {

                    backToTop.classList.remove(
                        "show"
                    );

                }

            }
        );


        /*
         * Kembali ke bagian paling atas.
         */

        backToTop.addEventListener(
            "click",
            function () {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );
		
		/* =====================================================
		   DARK / LIGHT MODE
		===================================================== */
		const themeSwitch =
			document.getElementById(
				"themeSwitch"
			);

		const themeIcon =
			document.getElementById(
				"themeIcon"
			);


		function applyTheme(theme) {

			document.documentElement
				.setAttribute(
					"data-bs-theme",
					theme
				);


			if (theme === "dark") {

				themeSwitch.checked = true;

				themeIcon.classList
					.remove("bi-moon-fill");

				themeIcon.classList
					.add("bi-sun-fill");

			} else {

				themeSwitch.checked = false;

				themeIcon.classList
					.remove("bi-sun-fill");

				themeIcon.classList
					.add("bi-moon-fill");
			}
		}


		const savedTheme =
			localStorage.getItem(
				"ipk-theme"
			);


		if (savedTheme) {

			applyTheme(savedTheme);

		} else {

			const prefersDark =
				window.matchMedia(
					"(prefers-color-scheme: dark)"
				).matches;

			applyTheme(
				prefersDark
					? "dark"
					: "light"
			);
		}


		themeSwitch.addEventListener(
			"change",
			function () {

				const newTheme =
					this.checked
						? "dark"
						: "light";

				applyTheme(newTheme);

				localStorage.setItem(
					"ipk-theme",
					newTheme
				);

			}
		);

    }
);

})();

	
