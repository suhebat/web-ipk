/* =========================================================
   FAQ IPK
   faq-ipk.js
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const searchInput =
        document.querySelector("#faqSearch");

    const clearSearch =
        document.querySelector("#faqSearchClear");

    const faqItems =
        Array.from(
            document.querySelectorAll(".faq-item")
        );

    const categoryButtons =
        Array.from(
            document.querySelectorAll(".faq-category")
        );

    const categorySelect =
        document.querySelector("#faqCategory");

    const resultInfo =
        document.querySelector("#faqResultInfo");

    const emptyState =
        document.querySelector("#faqEmpty");

    const resetButton =
        document.querySelector("#faqReset");


    /* =====================================================
       STATE
    ===================================================== */

    let activeCategory = "all";

    let searchKeyword = "";


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (!faqItems.length) {
        console.warn(
            "FAQ IPK: Tidak ditemukan .faq-item"
        );
    }


    /* =====================================================
       NORMALIZE TEXT
    ===================================================== */

    function normalizeText(text) {

        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim();

    }


    /* =====================================================
       GET FAQ CATEGORY
    ===================================================== */

    function getItemCategory(item) {

        return (
            item.dataset.category ||
            "all"
        );

    }


    /* =====================================================
       GET FAQ SEARCH TEXT
    ===================================================== */

    function getItemSearchText(item) {

        const question =
            item.querySelector(
                ".faq-question"
            );

        const answer =
            item.querySelector(
                ".faq-answer"
            );

        return normalizeText(

            (question
                ? question.textContent
                : "") +

            " " +

            (answer
                ? answer.textContent
                : "")

        );

    }


    /* =====================================================
       FILTER FAQ
    ===================================================== */

    function filterFAQ() {

        const keyword =
            normalizeText(
                searchKeyword
            );

        let visibleCount = 0;


        faqItems.forEach(function (item) {

            const category =
                getItemCategory(item);

            const text =
                getItemSearchText(item);


            /*
             * Check category
             */

            const categoryMatch =
                activeCategory === "all" ||
                category === activeCategory;


            /*
             * Check search
             */

            const searchMatch =
                keyword === "" ||
                text.includes(keyword);


            /*
             * Final result
             */

            const isVisible =
                categoryMatch &&
                searchMatch;


            if (isVisible) {

                item.classList.remove(
                    "is-hidden"
                );

                visibleCount++;

            } else {

                item.classList.add(
                    "is-hidden"
                );

            }

        });


        updateResultInfo(
            visibleCount,
            keyword
        );


        updateEmptyState(
            visibleCount
        );


        updateClearButton();

    }


    /* =====================================================
       RESULT INFORMATION
    ===================================================== */

    function updateResultInfo(
        visibleCount,
        keyword
    ) {

        if (!resultInfo) {
            return;
        }


        const total =
            faqItems.length;


        if (keyword) {

            resultInfo.textContent =
                `Menampilkan ${visibleCount} dari ${total} pertanyaan`;

        } else {

            resultInfo.textContent =
                `${visibleCount} pertanyaan`;

        }

    }


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    function updateEmptyState(
        visibleCount
    ) {

        if (!emptyState) {
            return;
        }


        if (visibleCount === 0) {

            emptyState.hidden =
                false;

        } else {

            emptyState.hidden =
                true;

        }

    }


    /* =====================================================
       CLEAR SEARCH BUTTON
    ===================================================== */

    function updateClearButton() {

        if (!clearSearch) {
            return;
        }


        if (searchInput &&
            searchInput.value.trim() !== "") {

            clearSearch.classList.add(
                "is-visible"
            );

        } else {

            clearSearch.classList.remove(
                "is-visible"
            );

        }

    }


    /* =====================================================
       SEARCH EVENT
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                searchKeyword =
                    this.value;

                filterFAQ();

            }
        );

    }


    /* =====================================================
       CLEAR SEARCH
    ===================================================== */

    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            function () {

                if (searchInput) {

                    searchInput.value =
                        "";

                }


                searchKeyword =
                    "";


                filterFAQ();


                if (searchInput) {

                    searchInput.focus();

                }

            }
        );

    }


    /* =====================================================
       CATEGORY BUTTONS - DESKTOP
    ===================================================== */

    categoryButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    activeCategory =
                        this.dataset.category ||
                        "all";


                    /*
                     * Update active state
                     */

                    categoryButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "is-active"
                            );

                        }
                    );


                    this.classList.add(
                        "is-active"
                    );


                    /*
                     * Sync mobile dropdown
                     */

                    if (categorySelect) {

                        categorySelect.value =
                            activeCategory;

                    }


                    filterFAQ();

                }
            );

        }
    );


    /* =====================================================
       CATEGORY DROPDOWN - MOBILE
    ===================================================== */

    if (categorySelect) {

        categorySelect.addEventListener(
            "change",
            function () {

                activeCategory =
                    this.value ||
                    "all";


                /*
                 * Sync desktop buttons
                 */

                categoryButtons.forEach(
                    function (button) {

                        const category =
                            button.dataset.category ||
                            "all";


                        if (
                            category ===
                            activeCategory
                        ) {

                            button.classList.add(
                                "is-active"
                            );

                        } else {

                            button.classList.remove(
                                "is-active"
                            );

                        }

                    }
                );


                filterFAQ();

            }
        );

    }


    /* =====================================================
       ACCORDION
    ===================================================== */

    const questions =
        Array.from(
            document.querySelectorAll(
                ".faq-question"
            )
        );


    questions.forEach(
        function (question) {

            question.addEventListener(
                "click",
                function () {

                    const isExpanded =
                        this.getAttribute(
                            "aria-expanded"
                        ) === "true";


                    /*
                     * Close all other FAQ
                     *
                     * Kalau ingin bisa membuka
                     * banyak FAQ sekaligus,
                     * bagian ini bisa dihapus.
                     */

                    questions.forEach(
                        function (otherQuestion) {

                            if (
                                otherQuestion !==
                                question
                            ) {

                                otherQuestion.setAttribute(
                                    "aria-expanded",
                                    "false"
                                );

                            }

                        }
                    );


                    /*
                     * Toggle current FAQ
                     */

                    this.setAttribute(
                        "aria-expanded",
                        String(!isExpanded)
                    );

                }
            );

        }
    );


    /* =====================================================
       KEYBOARD SUPPORT
    ===================================================== */

    questions.forEach(
        function (question) {

            question.addEventListener(
                "keydown",
                function (event) {

                    /*
                     * Enter
                     */

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        this.click();

                    }


                    /*
                     * Space
                     */

                    if (
                        event.key ===
                        " "
                    ) {

                        event.preventDefault();

                        this.click();

                    }

                }
            );

        }
    );


    /* =====================================================
       RESET FAQ
    ===================================================== */

    function resetFAQ() {

        /*
         * Reset search
         */

        if (searchInput) {

            searchInput.value =
                "";

        }


        searchKeyword =
            "";


        /*
         * Reset category
         */

        activeCategory =
            "all";


        /*
         * Reset desktop category
         */

        categoryButtons.forEach(
            function (button) {

                const category =
                    button.dataset.category ||
                    "all";


                if (
                    category ===
                    "all"
                ) {

                    button.classList.add(
                        "is-active"
                    );

                } else {

                    button.classList.remove(
                        "is-active"
                    );

                }

            }
        );


        /*
         * Reset mobile category
         */

        if (categorySelect) {

            categorySelect.value =
                "all";

        }


        /*
         * Close accordion
         */

        questions.forEach(
            function (question) {

                question.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );


        /*
         * Apply filter
         */

        filterFAQ();

    }


    /* =====================================================
       RESET BUTTON
    ===================================================== */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetFAQ
        );

    }


    /* =====================================================
       ESC KEY
       Clear search
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                if (
                    searchInput &&
                    searchInput.value !== ""
                ) {

                    if (
                        document.activeElement ===
                        searchInput
                    ) {

                        searchInput.value =
                            "";

                        searchKeyword =
                            "";

                        filterFAQ();

                    }

                }

            }

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    /*
     * Pastikan category pertama
     * yang aktif adalah "all".
     */

    if (categoryButtons.length) {

        let hasActive =
            categoryButtons.some(
                function (button) {

                    return button.classList.contains(
                        "is-active"
                    );

                }
            );


        if (!hasActive) {

            const allButton =
                categoryButtons.find(
                    function (button) {

                        return (
                            button.dataset.category ===
                            "all"
                        );

                    }
                );


            if (allButton) {

                allButton.classList.add(
                    "is-active"
                );

            }

        }

    }


    /*
     * Initial filter
     */

    filterFAQ();


});