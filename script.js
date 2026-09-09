
/* =========================================================
   BRAISON BACKUP GEN19 PHOTOS
   Photo Viewer + Swipe Navigation
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       ELEMENTS
    ========================================== */

    const viewer = document.getElementById("viewer");
    const viewerImage = document.getElementById("viewerImage");

    const viewerClose = document.getElementById("viewerClose");
    const viewerPrev = document.getElementById("viewerPrev");
    const viewerNext = document.getElementById("viewerNext");

    const viewerCounter = document.getElementById("viewerCounter");

    const photoCards = document.querySelectorAll(".photo-card");


    /* ==========================================
       PHOTO DATA
    ========================================== */

    const photos = Array.from(
        { length: 15 },
        (_, index) => `images/p${index + 1}.jpg`
    );

    let currentIndex = 0;


    /* ==========================================
       OPEN VIEWER
    ========================================== */

    function openViewer(index) {

        currentIndex = index;

        updateViewer();

        viewer.classList.add("active");
        viewer.setAttribute("aria-hidden", "false");

        document.body.classList.add("viewer-open");

        // Reset animation
        viewerImage.style.transform = "scale(0.96)";

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                viewerImage.style.transform = "scale(1)";
            });
        });
    }


    /* ==========================================
       CLOSE VIEWER
    ========================================== */

    function closeViewer() {

        viewer.classList.remove("active");
        viewer.setAttribute("aria-hidden", "true");

        document.body.classList.remove("viewer-open");

        viewerImage.src = "";
    }


    /* ==========================================
       UPDATE IMAGE
    ========================================== */

    function updateViewer() {

        const imageNumber = currentIndex + 1;

        viewerImage.src = photos[currentIndex];

        viewerImage.alt =
            `Braison photo ${imageNumber}`;

        viewerCounter.textContent =
            `${String(imageNumber).padStart(2, "0")} / 15`;
    }


    /* ==========================================
       NEXT PHOTO
    ========================================== */

    function nextPhoto() {

        currentIndex =
            (currentIndex + 1) % photos.length;

        updateViewer();
    }


    /* ==========================================
       PREVIOUS PHOTO
    ========================================== */

    function previousPhoto() {

        currentIndex =
            (currentIndex - 1 + photos.length) %
            photos.length;

        updateViewer();
    }


    /* ==========================================
       GALLERY CLICK
    ========================================== */

    photoCards.forEach((card) => {

        card.addEventListener("click", () => {

            const index =
                Number(card.dataset.index);

            openViewer(index);
        });

    });


    /* ==========================================
       VIEWER BUTTONS
    ========================================== */

    viewerClose.addEventListener(
        "click",
        closeViewer
    );

    viewerNext.addEventListener(
        "click",
        nextPhoto
    );

    viewerPrev.addEventListener(
        "click",
        previousPhoto
    );


    /* ==========================================
       CLICK BACKDROP TO CLOSE
    ========================================== */

    viewer.addEventListener("click", (event) => {

        if (event.target === viewer) {
            closeViewer();
        }

    });


    /* ==========================================
       KEYBOARD CONTROLS
    ========================================== */

    document.addEventListener("keydown", (event) => {

        if (!viewer.classList.contains("active")) {
            return;
        }

        if (event.key === "Escape") {
            closeViewer();
        }

        if (
            event.key === "ArrowRight" ||
            event.key === "ArrowDown"
        ) {
            nextPhoto();
        }

        if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowUp"
        ) {
            previousPhoto();
        }

    });


    /* ==========================================
       TOUCH SWIPE
    ========================================== */

    let touchStartX = 0;
    let touchStartY = 0;

    let touchEndX = 0;
    let touchEndY = 0;


    viewer.addEventListener(
        "touchstart",
        (event) => {

            const touch =
                event.changedTouches[0];

            touchStartX = touch.screenX;
            touchStartY = touch.screenY;

        },
        { passive: true }
    );


    viewer.addEventListener(
        "touchend",
        (event) => {

            const touch =
                event.changedTouches[0];

            touchEndX = touch.screenX;
            touchEndY = touch.screenY;

            handleSwipe();

        },
        { passive: true }
    );


    function handleSwipe() {

        const horizontalDistance =
            touchEndX - touchStartX;

        const verticalDistance =
            touchEndY - touchStartY;

        const minimumSwipe = 50;


        // Ignore mostly vertical gestures
        if (
            Math.abs(horizontalDistance) <
            Math.abs(verticalDistance)
        ) {
            return;
        }


        // Swipe left
        if (horizontalDistance < -minimumSwipe) {
            nextPhoto();
        }


        // Swipe right
        if (horizontalDistance > minimumSwipe) {
            previousPhoto();
        }

    }


    /* ==========================================
       NAVIGATION
       Smooth scroll + close viewer
    ========================================== */

    document.querySelectorAll(
        '.navbar a[href^="#"]'
    ).forEach((link) => {

        link.addEventListener("click", () => {

            if (viewer.classList.contains("active")) {
                closeViewer();
            }

        });

    });


    /* ==========================================
       IMAGE ERROR HANDLING
    ========================================== */

    document.querySelectorAll(
        ".photo-card img"
    ).forEach((img) => {

        img.addEventListener("error", () => {

            img.style.display = "none";

            img.parentElement.classList.add(
                "image-missing"
            );

        });

    });


    /* ==========================================
       PRELOAD PHOTOS
       Makes next/previous feel faster
    ========================================== */

    photos.forEach((src) => {

        const image = new Image();

        image.src = src;

    });


    /* ==========================================
       SIMPLE REVEAL ANIMATION
    ========================================== */

    const revealElements = document.querySelectorAll(
        ".story-card, .intro-card, .photo-card"
    );


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries, obs) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "revealed"
                        );

                        obs.unobserve(entry.target);

                    });

                },
                {
                    threshold: 0.08
                }
            );


        revealElements.forEach((element) => {

            element.classList.add("reveal-ready");

            observer.observe(element);

        });

    }


    /* ==========================================
       CONSOLE MESSAGE
    ========================================== */

    console.log(
        "BRAISON BACKUP GEN19 PHOTOS — READY 🚀"
    );

});

