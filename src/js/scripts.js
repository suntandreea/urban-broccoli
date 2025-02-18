function throttle(fn, delay) {
  let isThrottling = false;

  return function (...args) {
    if (!isThrottling) {
      fn.apply(this, args);
      isThrottling = true;

      setTimeout(() => {
        isThrottling = false;
      }, delay);
    }
  };
}


window.addEventListener("load", function () {

  // ***** LANDING ***** //

  const isLanding = !!document.querySelector('.landing-wrapper');

  if (isLanding) {

    // VISUAL ELEMENTS //

    const root = document.querySelector(":root");
    const hero = document.querySelector('.hero');
    const style = getComputedStyle(hero);
    const heroMargin = +style.marginTop.split('px')[0];
    const headerHeight = document.querySelector('header').offsetHeight;
    const logoHeight = document.querySelector('.logo').offsetHeight;
    const headlineHalfHeight = document.querySelector('.hero__headline').offsetHeight / 4;

    root.style.setProperty(`--height1`, `${(headerHeight - logoHeight - heroMargin - headlineHalfHeight) / 16}rem`);


    const gridArguments = document.querySelectorAll('.argument.grid');
    gridArguments.forEach((item, idx) => {
      if (idx === 0) return;
      const parentMargin = getComputedStyle(item).marginTop.split('px')[0];
      const parentHeight = item.offsetHeight;
      const imgHeight = item.querySelector('.argument__image').offsetHeight;
      const diff = (parentHeight - imgHeight) / 2;
      const newHeight = (parentMargin - 10 + diff) / 16;
      root.style.setProperty(`--height${idx + 1}`, `${newHeight}rem`);
    });

    // TRANSITIONS //

    const argumentsList = document.querySelector('.js-list');
    const heroHeadline = document.querySelector('.hero__headline');

    argumentsList.children[0].classList.remove('js-entry-transition');
    heroHeadline.classList.remove('js-entry-transition');


    function adaptParallaxPositions() {
      const parallaxContainer = document.querySelector('.parallax');
      [...parallaxContainer.children].forEach(elem => {
        elem.style.transform = `translateY(${-window.scrollY / 3 / 16}rem)`
      });
    }

    (function attachIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.666,
      };

      const loadEntryAnimations = (entries) => {
        entries.forEach((entry) => entry.isIntersecting && entry.target.classList.remove('js-entry-transition'));
      };

      const observer = new IntersectionObserver(loadEntryAnimations, options);
      [...argumentsList.children].forEach((elem, index) => (index >= 1) && observer.observe(elem));
    })();

    (function attachParallaxListeners() {
      if (window.innerWidth >= 1024) {
        adaptParallaxPositions();
        window.addEventListener('scroll', throttle(adaptParallaxPositions, 50))
      }
    })();

  } else {

    // ***** SPEAKERS ***** //

    const dialog = document.querySelector(".modal");
    const dialogTitle = dialog.querySelector("h2");
    const closeButton = document.querySelector(".modal__header__close");
    const speakers = document.querySelectorAll(".feature");

    speakers.forEach((speaker, idx) => {
      speaker.addEventListener("click", () => {
        dialogTitle.innerText = speaker.querySelector('.feature__title').textContent;
        dialog.showModal();
      });
    })

    closeButton.addEventListener("click", () => {
      dialog.close();
    });

    dialog.addEventListener("click", e => {
      const modalSizes = dialog.getBoundingClientRect();
      if (
        e.clientX < modalSizes.left ||
        e.clientX > modalSizes.right ||
        e.clientY < modalSizes.top ||
        e.clientY > modalSizes.bottom
      ) {
        dialog.close();
      }
    })

  }

});
