
/* =========================================================
   DATA PUBLIKASI
========================================================= */

const publications = [

/* ------------------ Buku 1 ------------------ */
    {
        id: 1,

        title:
            "Statistik Kebudayaan 2025",

        year:
            2026,

        type:
            "statistik",

        typeLabel:
            "Statistik",

        description:
            "Publikasi yang menyajikan gambaran statistik kebudayaan Indonesia berdasarkan berbagai indikator pembangunan kebudayaan.",

        image:
            "assets/img/publications/statistik-kebudayaan-2025.png",

        link:
            "detail-publikasi.html?id=1"
    },

/* ------------------ Buku 2 ------------------ */
    {
        id: 2,

        title:
            "Lanskap Ketahanan Seni dan Budaya Populer Menghadapi Tantangan Dinamika di Era Digital dan Media Baru",

        year:
            2025,

        type:
            "kajian",

        typeLabel:
            "Kajian",

        description:
            "Kajian mengenai perkembangan, dinamika, dan ketahanan seni serta budaya populer dalam kehidupan masyarakat Indonesia.",

        image:
            "assets/img/publications/lanskap-ketahanan-seni-budaya.png",

        link:
            "detail-publikasi.html?id=2"
    },

/* ------------------ Buku 3 ------------------ */
    {
        id: 3,

        title:
            "Analisis Forecasting Indikator Indeks Pembangunan Kebudayaan Hingga 2045",

        year:
            2025,

        type:
            "analisis",

        typeLabel:
            "Analisis",

        description:
            "Analisis proyeksi indikator Indeks Pembangunan Kebudayaan sebagai salah satu bahan untuk melihat kemungkinan perkembangan hingga tahun 2045.",

        image:
            "assets/img/publications/forecasting-ipk-2045.png",

        link:
            "detail-publikasi.html?id=3"
    },

/* ------------------ Buku 4 ------------------ */
    {
        id: 4,

        title:
            "Lanskap Kebudayaan Indonesia 2024",

        year:
            2025,

        type:
            "laporan",

        typeLabel:
            "Laporan",

        description:
            "Publikasi yang memberikan gambaran mengenai lanskap kebudayaan Indonesia dan berbagai perkembangan pembangunan kebudayaan.",

        image:
            "assets/img/publications/lanskap-kebudayaan-indonesia-2024.png",

        link:
            "detail-publikasi.html?id=4"
    },
	
/* ------------------ Buku 5 ------------------ */	
	{
        id: 5,

        title:
            "Indeks Pembangunan Kebudayaan 2018",

        year:
            2019,

        type:
            "statistik",

        typeLabel:
            "Statistik",

        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

        image:
            "assets/img/publications/ipk-tahun-2018.png",

        link:
            "detail-publikasi.html?id=5"
    },
	
/* ------------------ Buku 6 ------------------ */	
	{
        id: 6,

        title:
            "Indeks Pembangunan Kebudayaan Tahun 2020",

        year:
            2021,

        type:
            "statistik",

        typeLabel:
            "Statistik",

        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

        image:
            "assets/img/publications/ipk-tahun-2020.png",

        link:
            "detail-publikasi.html?id=6"
    },
	
/* ------------------ Buku 7 ------------------ */	
	{
        id: 7,

        title:
            "Indeks Pembangunan Kebudayaan Tahun 2021",

        year:
            2022,

        type:
            "statistik",

        typeLabel:
            "Statistik",

        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

        image:
            "assets/img/publications/ipk-tahun-2021.png",

        link:
            "detail-publikasi.html?id=7"
    },
	
/* ------------------ Buku 8 ------------------ */	
	{
        id: 8,

        title:
            "Kebudayaan dalam Perbandingan: Analisis Komparatif atas IPK dan Enam Indeks Terkait",

        year:
            2022,

        type:
            "analisis",

        typeLabel:
            "Analisis",

        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

        image:
            "assets/img/publications/analisis-komparatif-ipk.png",

        link:
            "detail-publikasi.html?id=8"
    },
	
/* ------------------ Buku 9 ------------------ */	
	{
        id: 9,

        title:
            "Enam Tahun Pembangunan Kebudayaan: Perkembangan IPK Nasional dan Provinsi 2018 - 2023",

        year:
            2024,

        type:
            "analisis",

        typeLabel:
            "Analisis",

        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

        image:
            "assets/img/publications/perkembangan-ipk-nas-prov-2018-2023.png",

        link:
            "detail-publikasi.html?id=9"
    }

];


/* =========================================================
   SETTINGS
========================================================= */

const itemsPerPage = 6;

let currentPage = 1;

let filteredPublications = [
    ...publications
];


/* =========================================================
   DOM
========================================================= */

const publicationGrid =
    document.getElementById(
        "publicationGrid"
    );

const searchInput =
    document.getElementById(
        "searchPublication"
    );

const yearFilter =
    document.getElementById(
        "yearFilter"
    );

const typeFilter =
    document.getElementById(
        "typeFilter"
    );

const sortSelect =
    document.getElementById(
        "sortPublication"
    );

const resultCount =
    document.getElementById(
        "resultCount"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const paginationNumbers =
    document.getElementById(
        "paginationNumbers"
    );

const prevPage =
    document.getElementById(
        "prevPage"
    );

const nextPage =
    document.getElementById(
        "nextPage"
    );

const resetButton =
    document.getElementById(
        "resetFilter"
    );

const emptyReset =
    document.getElementById(
        "emptyReset"
    );


/* =========================================================
   MOBILE FILTER TOGGLE
========================================================= */

const filterMobileToggle =
    document.getElementById(
        "filterMobileToggle"
    );

const publicationFilterContent =
    document.getElementById(
        "publicationFilterContent"
    );


if (
    filterMobileToggle
    &&
    publicationFilterContent
) {

    filterMobileToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                filterMobileToggle
                    .classList
                    .toggle("active");


            publicationFilterContent
                .classList
                .toggle("show");


            filterMobileToggle
                .setAttribute(
                    "aria-expanded",
                    isOpen
                );

        }
    );

}


/* =========================================================
   RENDER PUBLICATIONS
========================================================= */

function renderPublications() {

    publicationGrid.innerHTML =
        "";


    const start =
        (currentPage - 1)
        * itemsPerPage;


    const end =
        start
        + itemsPerPage;


    const currentItems =
        filteredPublications.slice(
            start,
            end
        );


    currentItems.forEach(
        publication => {

            /*
             * HORIZONTAL PUBLICATION ITEM
             *
             * Cover berada di kiri.
             * Informasi publikasi berada di kanan.
             */

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "publication-result";


            card.innerHTML = `

                <!-- COVER -->

                <a
                    href="${publication.link}"
                    class="publication-result-cover"
                    aria-label="Lihat ${publication.title}"
                >

                    <img
                        src="${publication.image}"
                        alt="${publication.title}"
                        loading="lazy"
                    >

                </a>


                <!-- CONTENT -->

                <div
                    class="publication-result-content"
                >

                    <!-- META -->

                    <div
                        class="publication-result-meta"
                    >

                        <span
                            class="publication-type"
                        >
                            ${publication.typeLabel}
                        </span>

                        <span
                            class="publication-meta-divider"
                        >
                            •
                        </span>

                        <span>
                            ${publication.year}
                        </span>

                    </div>


                    <!-- TITLE -->

                    <h3
                        class="publication-result-title"
                    >
                        ${publication.title}
                    </h3>


                    <!-- DESCRIPTION -->

                    <p
                        class="publication-result-description"
                    >
                        ${publication.description}
                    </p>


                    <!-- LINK -->

                    <a
                        href="${publication.link}"
                        class="publication-result-link"
                    >

                        Lihat Publikasi

                        <i
                            class="bi bi-arrow-right"
                        ></i>

                    </a>

                </div>

            `;


            publicationGrid.appendChild(
                card
            );

        }
    );



    /*
     * RESULT COUNT
     */

    resultCount.textContent =
        filteredPublications.length;


    /*
     * EMPTY STATE
     */

    if (
        filteredPublications.length === 0
    ) {

        emptyState.classList.add(
            "show"
        );

        publicationGrid.style.display =
            "none";

    } else {

        emptyState.classList.remove(
            "show"
        );

        publicationGrid.style.display =
            "";

    }


    /*
     * PAGINATION
     */

    renderPagination();

}


/* =========================================================
   FILTER
========================================================= */

function applyFilters() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const year =
        yearFilter.value;


    const type =
        typeFilter.value;


    filteredPublications =
        publications.filter(
            publication => {

                const matchesSearch =
                    publication.title
                        .toLowerCase()
                        .includes(search);


                const matchesYear =
                    year === "all"
                    ||
                    publication.year
                        .toString()
                        === year;


                const matchesType =
                    type === "all"
                    ||
                    publication.type
                        === type;


                return (
                    matchesSearch
                    &&
                    matchesYear
                    &&
                    matchesType
                );

            }
        );


    applySorting();


    currentPage =
        1;


    renderPublications();

}


/* =========================================================
   SORT
========================================================= */

function applySorting() {

    const sort =
        sortSelect.value;


    if (
        sort === "newest"
    ) {

        filteredPublications.sort(
            (a, b) =>
                b.year - a.year
        );

    }


    else if (
        sort === "oldest"
    ) {

        filteredPublications.sort(
            (a, b) =>
                a.year - b.year
        );

    }


    else if (
        sort === "az"
    ) {

        filteredPublications.sort(
            (a, b) =>
                a.title.localeCompare(
                    b.title,
                    "id"
                )
        );

    }


    else if (
        sort === "za"
    ) {

        filteredPublications.sort(
            (a, b) =>
                b.title.localeCompare(
                    a.title,
                    "id"
                )
        );

    }

}


/* =========================================================
   PAGINATION
========================================================= */

function renderPagination() {

    paginationNumbers.innerHTML =
        "";


    const totalPages =
        Math.ceil(
            filteredPublications.length
            / itemsPerPage
        );


    prevPage.disabled =
        currentPage <= 1;


    nextPage.disabled =
        currentPage >= totalPages;


    if (
        totalPages <= 1
    ) {

        prevPage.style.display =
            "none";

        nextPage.style.display =
            "none";

        return;

    }


    prevPage.style.display =
        "";


    nextPage.style.display =
        "";


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "page-number";


        if (
            page === currentPage
        ) {

            button.classList.add(
                "active"
            );

        }


        button.textContent =
            page;


        button.addEventListener(
            "click",
            () => {

                currentPage =
                    page;


                renderPublications();


                scrollToPublicationGrid();

            }
        );


        paginationNumbers.appendChild(
            button
        );

    }

}


/* =========================================================
   PAGINATION BUTTONS
========================================================= */

prevPage.addEventListener(
    "click",
    () => {

        if (
            currentPage > 1
        ) {

            currentPage--;


            renderPublications();


            scrollToPublicationGrid();

        }

    }
);


nextPage.addEventListener(
    "click",
    () => {

        const totalPages =
            Math.ceil(
                filteredPublications.length
                / itemsPerPage
            );


        if (
            currentPage < totalPages
        ) {

            currentPage++;


            renderPublications();


            scrollToPublicationGrid();

        }

    }
);


/* =========================================================
   SCROLL TO PUBLICATION RESULT
========================================================= */

function scrollToPublicationGrid() {

    publicationGrid.scrollIntoView(
        {
            behavior:
                "smooth",

            block:
                "start"
        }
    );

}


/* =========================================================
   RESET
========================================================= */

function resetFilters() {

    searchInput.value =
        "";


    yearFilter.value =
        "all";


    typeFilter.value =
        "all";


    sortSelect.value =
        "newest";


    filteredPublications =
        [
            ...publications
        ];


    currentPage =
        1;


    renderPublications();

}


resetButton.addEventListener(
    "click",
    resetFilters
);


emptyReset.addEventListener(
    "click",
    resetFilters
);


/* =========================================================
   EVENTS
========================================================= */

searchInput.addEventListener(
    "input",
    applyFilters
);


yearFilter.addEventListener(
    "change",
    applyFilters
);


typeFilter.addEventListener(
    "change",
    applyFilters
);


sortSelect.addEventListener(
    "change",
    () => {

        applySorting();


        currentPage =
            1;


        renderPublications();

    }
);


/* =========================================================
   INITIAL RENDER
========================================================= */

applySorting();

renderPublications();