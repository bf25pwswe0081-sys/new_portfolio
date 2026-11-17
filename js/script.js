
// =================================
// JALWA GHAFAR - 3D PORTFOLIO
// INTERACTIVE JAVASCRIPT
// =================================

// 0. PORTFOLIO INTRO

const introScreen = document.getElementById("introScreen");
const skipIntro = document.getElementById("skipIntro");
const siteContent = document.querySelectorAll(".site-content");

if (introScreen && skipIntro && siteContent.length) {

    introScreen.hidden = false;
    siteContent.forEach(element => {
        element.inert = true;
    });
    document.body.classList.add("intro-active");
    skipIntro.focus();

    let introFinished = false;
    let finishTimer;
    let touchStart = null;

    const finishIntro = () => {

        if (introFinished) return;

        introFinished = true;
        window.clearTimeout(finishTimer);

        introScreen.classList.add("is-finished");
        introScreen.setAttribute("aria-hidden", "true");
        window.setTimeout(() => {
            introScreen.hidden = true;
        }, 700);
        siteContent.forEach(element => {
            element.inert = false;
        });
        document.documentElement.classList.remove("intro-pending");
        document.documentElement.classList.add("site-revealing");
        document.body.classList.remove("intro-active");
        skipIntro.blur();

    };

    introScreen.addEventListener("touchstart", event => {
        const touch = event.changedTouches[0];
        touchStart = touch ? { x: touch.clientX, y: touch.clientY } : null;
    }, { passive: true });

    introScreen.addEventListener("touchend", event => {
        const touch = event.changedTouches[0];

        if (!touch || !touchStart) return;

        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;
        touchStart = null;

        if (Math.abs(deltaY) > 45 && Math.abs(deltaY) > Math.abs(deltaX)) {
            finishIntro();
        }
    }, { passive: true });

    introScreen.addEventListener("wheel", event => {
        if (event.deltaY !== 0) {
            finishIntro();
        }
    }, { passive: true });

    const typeIntro = async () => {

        const lines = [...introScreen.querySelectorAll(".intro-line")].map(line => ({
            outputs: [...line.querySelectorAll(".typed-output")].map(output => ({
                element: output,
                parts: [...output.querySelectorAll(".typed-part")].map(part => {
                    const text = part.textContent;
                    part.textContent = "";

                    return {
                        element: part,
                        text
                    };
                })
            }))
        }));
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        for (const line of lines) {

            if (introFinished) return;

            for (const output of line.outputs) {

                output.element.classList.add("is-typing");
                const isInterestLine = output.element.closest(".intro-interest");

                for (const part of output.parts) {

                    if (reduceMotion) {
                        part.element.textContent = part.text;
                        continue;
                    }

                    for (let index = 0; index < part.text.length; index += 1) {

                        if (introFinished) return;

                        part.element.textContent = part.text.slice(0, index + 1);
                        await new Promise(resolve => {
                            const character = part.text[index];
                            const delay = isInterestLine
                                ? /[,.!?]/.test(character) ? 70 : character === " " ? 8 : 18
                                : /[,.!?]/.test(character) ? 200 : character === " " ? 35 : 55;
                            window.setTimeout(resolve, delay);
                        });

                    }

                }

                output.element.classList.remove("is-typing");

            }

            if (!reduceMotion) {
                await new Promise(resolve => window.setTimeout(resolve, 320));
            }

        }

        if (introFinished) return;

        finishTimer = window.setTimeout(finishIntro, reduceMotion ? 350 : 1800);

    };

    skipIntro.addEventListener("click", finishIntro);
    typeIntro();

}


// 1. MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {

    const isOpen = navMenu.classList.toggle("active");

    menuToggle.textContent = isOpen ? "✕" : "☰";

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );

});


// CLOSE MOBILE MENU AFTER CLICK

document.querySelectorAll("#navMenu a").forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

        menuToggle.textContent = "☰";

        menuToggle.setAttribute("aria-expanded", "false");

    });

});


// 2. SCROLL REVEAL ANIMATION

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.12
});

revealElements.forEach(element => {

    observer.observe(element);

});


// 3. 3D HERO SPHERE MOVEMENT

const heroArt = document.getElementById("heroArt");
const threeDObject = document.querySelector(".three-d-object");

if (heroArt && threeDObject) {

    heroArt.addEventListener("mousemove", (event) => {

        if (!window.matchMedia("(hover: hover)").matches) return;

        const rect = heroArt.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 35;
        const rotateX = (0.5 - y) * 30;

        threeDObject.style.animation = "none";

        threeDObject.style.transform =
            `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    });

    heroArt.addEventListener("mouseleave", () => {

        threeDObject.style.animation = "";

        threeDObject.style.transform = "";

    });

}


// 4. INTERACTIVE TECHNOLOGY CUBES

const techCubes = document.querySelectorAll(".tech-cube");

techCubes.forEach(cube => {

    let rotationX = -15;
    let rotationY = -25;

    cube.addEventListener("mousemove", (event) => {

        const rect = cube.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        rotationY = ((x - centerX) / centerX) * 35;
        rotationX = ((centerY - y) / centerY) * 35;

        cube.style.animation = "none";

        cube.style.transform =
            `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale3d(1.12, 1.12, 1.12)`;

    });

    cube.addEventListener("mouseleave", () => {

        cube.style.animation = "";

        cube.style.transform = "";

    });

    // TAP TO ROTATE ON TOUCH DEVICES

    cube.addEventListener("click", () => {

        rotationY += 90;

        cube.style.animation = "none";

        cube.style.transform =
            `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale3d(1.08, 1.08, 1.08)`;

    });

});


// 5. 3D PROJECT CARD MOVEMENT

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach(card => {

    card.addEventListener("mousemove", (event) => {

        if (!window.matchMedia("(hover: hover)").matches) return;

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (centerY - y) / 18;
        const rotateY = (x - centerX) / 18;

        card.style.transform =
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});


// 6. WELCOME MESSAGE

console.log(
    "Welcome to Jalwa Ghafar's 3D Portfolio!"
);

console.log(
    "Designed with HTML, CSS and JavaScript."
);
