/* =========================================================
   PERMOHONAN DATA IPK
   permohonan-data.js
========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =================================================
           ELEMENTS
        ================================================= */

        const form =
            document.querySelector(
                "#dataRequestForm"
            );


        const resetButton =
            document.querySelector(
                "#resetForm"
            );


        const successBox =
            document.querySelector(
                "#requestSuccess"
            );


        const newRequestButton =
            document.querySelector(
                "#newRequest"
            );


        const submitButton =
            document.querySelector(
                "#submitRequest"
            );


        const textarea =
            document.querySelector(
                "#uraian"
            );


        const characterCount =
            document.querySelector(
                "#uraianCount"
            );


        const fileInput =
            document.querySelector(
                "#dokumenPendukung"
            );


        const fileInfo =
            document.querySelector(
                "#fileInfo"
            );


        const uploadArea =
            document.querySelector(
                ".request-upload"
            );


        const agreement =
            document.querySelector(
                "#agreement"
            );


        const yearSelector =
            document.querySelector(
                ".year-selector"
            );


        const yearHelp =
            document.querySelector(
                "#yearHelp"
            );


        /* =================================================
           UPDATE CHARACTER COUNT
        ================================================= */

        function updateCharacterCount() {

            if (
                !textarea ||
                !characterCount
            ) {
                return;
            }


            const length =
                textarea.value.length;


            const max =
                textarea.maxLength;


            characterCount.textContent =
                `${length} / ${max}`;


        }


        if (textarea) {

            textarea.addEventListener(
                "input",
                updateCharacterCount
            );

            updateCharacterCount();

        }


        /* =================================================
           FILE UPLOAD
        ================================================= */

        if (fileInput) {

            fileInput.addEventListener(
                "change",
                function () {

                    const file =
                        this.files[0];


                    if (!file) {

                        fileInfo.textContent =
                            "PDF, DOC, atau DOCX. Maksimal 5 MB.";

                        return;

                    }


                    const maxSize =
                        5 * 1024 * 1024;


                    const allowedTypes = [
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ];


                    if (
                        file.size >
                        maxSize
                    ) {

                        alert(
                            "Ukuran file maksimal 5 MB."
                        );

                        this.value =
                            "";

                        return;

                    }


                    if (
                        !allowedTypes.includes(
                            file.type
                        )
                    ) {

                        alert(
                            "Format file harus PDF, DOC, atau DOCX."
                        );

                        this.value =
                            "";

                        return;

                    }


                    fileInfo.textContent =
                        `${file.name} — ${formatFileSize(file.size)}`;

                }
            );

        }


        /* =================================================
           FORMAT FILE SIZE
        ================================================= */

        function formatFileSize(
            bytes
        ) {

            if (
                bytes < 1024
            ) {

                return `${bytes} B`;

            }


            if (
                bytes < 1024 * 1024
            ) {

                return `${(
                    bytes / 1024
                ).toFixed(1)} KB`;

            }


            return `${(
                bytes /
                (1024 * 1024)
            ).toFixed(1)} MB`;

        }


        /* =================================================
           DRAG & DROP
        ================================================= */

        if (uploadArea) {


            [
                "dragenter",
                "dragover"
            ].forEach(
                function (eventName) {

                    uploadArea.addEventListener(
                        eventName,
                        function (event) {

                            event.preventDefault();

                            uploadArea.classList.add(
                                "is-dragover"
                            );

                        }
                    );

                }
            );


            [
                "dragleave",
                "drop"
            ].forEach(
                function (eventName) {

                    uploadArea.addEventListener(
                        eventName,
                        function () {

                            uploadArea.classList.remove(
                                "is-dragover"
                            );

                        }
                    );

                }
            );


            uploadArea.addEventListener(
                "drop",
                function (event) {

                    event.preventDefault();


                    if (
                        !fileInput
                    ) {
                        return;
                    }


                    const files =
                        event.dataTransfer.files;


                    if (
                        files.length
                    ) {

                        /*
                         * Browser security biasanya
                         * mengizinkan assignment files
                         * menggunakan DataTransfer.
                         */

                        try {

                            const dataTransfer =
                                new DataTransfer();


                            dataTransfer.items.add(
                                files[0]
                            );


                            fileInput.files =
                                dataTransfer.files;


                            fileInput.dispatchEvent(
                                new Event(
                                    "change",
                                    {
                                        bubbles: true
                                    }
                                )
                            );

                        } catch (error) {

                            console.warn(
                                "Drag & drop file tidak dapat digunakan.",
                                error
                            );

                        }

                    }

                }
            );

        }


        /* =================================================
           GET SELECTED YEARS
        ================================================= */

        function getSelectedYears() {

            return Array.from(
                document.querySelectorAll(
                    'input[name="tahun[]"]:checked'
                )
            );

        }


        /* =================================================
           YEAR VALIDATION
        ================================================= */

        function validateYears() {

            const selected =
                getSelectedYears();


            if (
                selected.length === 0
            ) {

                if (yearSelector) {

                    yearSelector.classList.add(
                        "is-invalid"
                    );

                }


                if (yearHelp) {

                    yearHelp.textContent =
                        "Pilih minimal satu tahun data.";

                    yearHelp.classList.add(
                        "text-danger"
                    );

                }


                return false;

            }


            if (yearSelector) {

                yearSelector.classList.remove(
                    "is-invalid"
                );

            }


            if (yearHelp) {

                yearHelp.textContent =
                    `Dipilih: ${selected.length} tahun`;

                yearHelp.classList.remove(
                    "text-danger"
                );

            }


            return true;

        }


        /* =================================================
           YEAR CHANGE
        ================================================= */

        document
            .querySelectorAll(
                'input[name="tahun[]"]'
            )
            .forEach(
                function (checkbox) {

                    checkbox.addEventListener(
                        "change",
                        validateYears
                    );

                }
            );


        /* =================================================
           AGREEMENT
        ================================================= */

        if (agreement) {

            agreement.addEventListener(
                "change",
                function () {

                    if (this.checked) {

                        this.classList.remove(
                            "is-invalid"
                        );

                    }

                }
            );

        }


        /* =================================================
           FORM VALIDATION
        ================================================= */

        function validateForm() {

            let valid =
                true;


            /*
             * Bootstrap native validation
             */

            if (
                !form.checkValidity()
            ) {

                valid =
                    false;

            }


            /*
             * Show validation state
             */

            form.classList.add(
                "was-validated"
            );


            /*
             * Validate years
             */

            if (
                !validateYears()
            ) {

                valid =
                    false;

            }


            /*
             * Agreement
             */

            if (
                agreement &&
                !agreement.checked
            ) {

                valid =
                    false;

            }


            return valid;

        }


        /* =================================================
           GENERATE REQUEST NUMBER
        ================================================= */

        function generateRequestNumber() {

            const now =
                new Date();


            const year =
                now.getFullYear();


            const month =
                String(
                    now.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            const day =
                String(
                    now.getDate()
                ).padStart(
                    2,
                    "0"
                );


            const random =
                String(
                    Math.floor(
                        Math.random() * 999999
                    )
                ).padStart(
                    6,
                    "0"
                );


            return `IPK-${year}${month}${day}-${random}`;

        }


        /* =================================================
           SUBMIT
        ================================================= */

        if (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    if (
                        !validateForm()
                    ) {

                        /*
                         * Scroll ke elemen invalid pertama
                         */

                        const invalid =
                            form.querySelector(
                                ":invalid"
                            );


                        if (invalid) {

                            invalid.scrollIntoView(
                                {
                                    behavior: "smooth",
                                    block: "center"
                                }
                            );

                        }


                        return;

                    }


                    /*
                     * Simulasi pengiriman
                     */

                    if (submitButton) {

                        submitButton.disabled =
                            true;


                        submitButton.innerHTML =
                            `
                                <span>
                                    Mengirim...
                                </span>
                            `;

                    }


                    setTimeout(
                        function () {

                            showSuccess();

                        },
                        900
                    );

                }
            );

        }


        /* =================================================
           SHOW SUCCESS
        ================================================= */

        function showSuccess() {

            const requestNumber =
                generateRequestNumber();


            const numberElement =
                document.querySelector(
                    "#requestNumber"
                );


            if (numberElement) {

                numberElement.textContent =
                    requestNumber;

            }


            form.hidden =
                true;


            if (successBox) {

                successBox.hidden =
                    false;

            }


            window.scrollTo(
                {
                    top:
                        successBox
                            ? successBox.offsetTop - 100
                            : 0,

                    behavior:
                        "smooth"
                }
            );


            if (submitButton) {

                submitButton.disabled =
                    false;

            }

        }


        /* =================================================
           RESET FORM
        ================================================= */

        function resetForm() {

            if (!form) {

                return;
            }


            const confirmReset =
                window.confirm(
                    "Apakah Anda yakin ingin mengosongkan seluruh formulir?"
                );


            if (!confirmReset) {
                return;
            }


            form.reset();


            form.classList.remove(
                "was-validated"
            );


            if (yearSelector) {

                yearSelector.classList.remove(
                    "is-invalid"
                );

            }


            if (yearHelp) {

                yearHelp.textContent =
                    "Pilih satu atau beberapa tahun data.";

                yearHelp.classList.remove(
                    "text-danger"
                );

            }


            if (fileInfo) {

                fileInfo.textContent =
                    "PDF, DOC, atau DOCX. Maksimal 5 MB.";

            }


            updateCharacterCount();

        }


        if (resetButton) {

            resetButton.addEventListener(
                "click",
                resetForm
            );

        }


        /* =================================================
           NEW REQUEST
        ================================================= */

        if (newRequestButton) {

            newRequestButton.addEventListener(
                "click",
                function () {

                    form.reset();


                    form.classList.remove(
                        "was-validated"
                    );


                    if (successBox) {

                        successBox.hidden =
                            true;

                    }


                    form.hidden =
                        false;


                    if (yearSelector) {

                        yearSelector.classList.remove(
                            "is-invalid"
                        );

                    }


                    if (yearHelp) {

                        yearHelp.textContent =
                            "Pilih satu atau beberapa tahun data.";

                    }


                    if (fileInfo) {

                        fileInfo.textContent =
                            "PDF, DOC, atau DOCX. Maksimal 5 MB.";

                    }


                    updateCharacterCount();


                    window.scrollTo(
                        {
                            top: 0,
                            behavior: "smooth"
                        }
                    );

                }
            );

        }


        /* =================================================
           INITIALIZE
        ================================================= */

        updateCharacterCount();


    }
);

/* ==================================================================================================
Tombol Kirim Permohonan belum benar-benar mengirim data ke server karena endpoint/API backend-nya belum ditentuin. Klo backend udah ada, bagian:

setTimeout(
    function () {
        showSuccess();
    },
    900
);

diganti dengan fetch() ke API layanan permohonan data
================================================================================================== */