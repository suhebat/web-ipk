/* =========================================================
   KONTAK IPK
   kontak-ipk.js
========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =================================================
           ELEMENTS
        ================================================= */

        const form =
            document.querySelector(
                "#contactForm"
            );


        const submitButton =
            document.querySelector(
                "#contactSubmit"
            );


        const resetButton =
            document.querySelector(
                "#contactReset"
            );


        const successBox =
            document.querySelector(
                "#contactSuccess"
            );


        const newMessageButton =
            document.querySelector(
                "#contactNewMessage"
            );


        const message =
            document.querySelector(
                "#contactMessage"
            );


        const messageCount =
            document.querySelector(
                "#contactMessageCount"
            );


        const agreement =
            document.querySelector(
                "#contactAgreement"
            );


        /* =================================================
           CHARACTER COUNT
        ================================================= */

        function updateMessageCount() {

            if (
                !message ||
                !messageCount
            ) {

                return;

            }


            const length =
                message.value.length;


            const max =
                message.maxLength;


            messageCount.textContent =
                `${length} / ${max}`;

        }


        if (message) {

            message.addEventListener(
                "input",
                updateMessageCount
            );

        }


        updateMessageCount();



        /* =================================================
           GENERATE REFERENCE NUMBER
        ================================================= */

        function generateReferenceNumber() {

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
           FORM VALIDATION
        ================================================= */

        function validateForm() {

            let valid =
                true;


            /*
             * Bootstrap validation
             */

            if (
                !form.checkValidity()
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

                agreement.classList.add(
                    "is-invalid"
                );

                valid =
                    false;

            } else if (agreement) {

                agreement.classList.remove(
                    "is-invalid"
                );

            }


            form.classList.add(
                "was-validated"
            );


            return valid;

        }



        /* =================================================
           AGREEMENT CHANGE
        ================================================= */

        if (agreement) {

            agreement.addEventListener(
                "change",
                function () {

                    if (
                        this.checked
                    ) {

                        this.classList.remove(
                            "is-invalid"
                        );

                    }

                }
            );

        }



        /* =================================================
           SHOW SUCCESS
        ================================================= */

        function showSuccess() {

            const reference =
                generateReferenceNumber();


            const referenceElement =
                document.querySelector(
                    "#contactReference"
                );


            if (referenceElement) {

                referenceElement.textContent =
                    reference;

            }


            form.hidden =
                true;


            successBox.hidden =
                false;


            successBox.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "center"
                }
            );


            submitButton.disabled =
                false;


        }



        /* =================================================
           SUBMIT FORM
        ================================================= */

        if (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    if (
                        !validateForm()
                    ) {


                        const invalid =
                            form.querySelector(
                                ":invalid"
                            );


                        if (invalid) {

                            invalid.scrollIntoView(
                                {
                                    behavior:
                                        "smooth",

                                    block:
                                        "center"
                                }
                            );


                            invalid.focus();

                        }


                        return;

                    }


                    /*
                     * Simulasi pengiriman.
                     *
                     * Nanti bagian ini bisa diganti
                     * dengan fetch() ke API/backend.
                     */

                    submitButton.disabled =
                        true;


                    submitButton.innerHTML =
                        `
                            <span>
                                Mengirim...
                            </span>
                        `;


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
           RESET
        ================================================= */

        if (resetButton) {

            resetButton.addEventListener(
                "click",
                function () {

                    /*
                     * Browser melakukan reset
                     * secara otomatis.
                     *
                     * Kita hanya membersihkan
                     * state validasi.
                     */

                    setTimeout(
                        function () {

                            form.classList.remove(
                                "was-validated"
                            );


                            if (agreement) {

                                agreement.classList.remove(
                                    "is-invalid"
                                );

                            }


                            updateMessageCount();

                        },
                        0
                    );

                }
            );

        }



        /* =================================================
           NEW MESSAGE
        ================================================= */

        if (newMessageButton) {

            newMessageButton.addEventListener(
                "click",
                function () {


                    form.reset();


                    form.classList.remove(
                        "was-validated"
                    );


                    if (agreement) {

                        agreement.classList.remove(
                            "is-invalid"
                        );

                    }


                    successBox.hidden =
                        true;


                    form.hidden =
                        false;


                    submitButton.disabled =
                        false;


                    submitButton.innerHTML =
                        `
                            <span>
                                Kirim Pesan
                            </span>

                            <span>
                                →
                            </span>
                        `;


                    updateMessageCount();


                    window.scrollTo(
                        {
                            top:
                                form.offsetTop - 100,

                            behavior:
                                "smooth"
                        }
                    );

                }
            );

        }


    }
);