/* =====================================================
       NAVBAR
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const navbarCollapse =
            document.querySelector(
                "#mainNavbar"
            );

        if (!navbarCollapse) {
            return;
        }


        const navLinks =
            navbarCollapse.querySelectorAll(
                ".dropdown-item, " +
                ".nav-link:not(.dropdown-toggle)"
            );


        navLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        /*
                         * Hanya berlaku untuk
                         * link tujuan.
                         *
                         * Dropdown toggle tidak
                         * ditutup oleh script ini.
                         */

                        if (
                            this.classList.contains(
                                "dropdown-toggle"
                            )
                        ) {
                            return;
                        }


                        /*
                         * Hanya tutup navbar
                         * pada mobile.
                         */

                        if (
                            window.innerWidth <
                            992
                        ) {

                            const collapse =
                                bootstrap.Collapse
                                .getInstance(
                                    navbarCollapse
                                );

                            if (collapse) {

                                collapse.hide();

                            }

                        }

                    }
                );

            }
        );

    }
);
