/*******************************/
/* carousel*/
/*******************************/
const carousel = document.querySelector(".testimonial-list");
const testimonial = carousel.querySelectorAll(".testimonial-box")[0];
const dotButtons = document.querySelectorAll(".dots");
const circles = document.querySelectorAll(".dots circle");

const carouselStyles = getComputedStyle(carousel);

let isDragStart = false,
  startX,
  drag,
  isDragging,
  resetTimeout;
let prevScrollLeft = 0;

let slideNum = 0;

let testimonialWidth = testimonial.clientWidth + parseInt(carouselStyles.gap);

const mediaQueries = [
  window.matchMedia("(max-width: 68.75em)"),
  window.matchMedia("(min-width:68.75em)"),
  window.matchMedia("(max-width:49.4em)"),
];

const debounce = (func, delay) => {
  clearTimeout(resetTimeout);
  resetTimeout = setTimeout(func, delay);
};

const handleBreakPoints = () => {
  testimonialWidth = testimonial.clientWidth + parseInt(carouselStyles.gap);
  if (mediaQueries[0].matches) {
    carousel.scrollLeft = 0;
    fillDots(slideNum, 0);
    slideNum = 0;
  } else {
    carousel.scrollLeft = testimonialWidth;
  }
};
window.addEventListener("resize", () => {
  debounce(handleBreakPoints, 500);
});

const firstSlide = () => {
  if (mediaQueries[1].matches) {
    carousel.scrollLeft = testimonialWidth;
  }
};
firstSlide();

const slide = (scrollWidth) => {
  if (carousel.scrollLeft > prevScrollLeft) {
    carousel.scrollLeft = prevScrollLeft + scrollWidth;
    return 1;
  } else {
    carousel.scrollLeft = prevScrollLeft - scrollWidth;
    return -1;
  }
};

const autoSlide = () => {
  // if there is no image left to scroll then return from here
  if (
    carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) >= -1 ||
    carousel.scrollLeft <= 0
  )
    return;
  if (Math.abs(drag) > testimonialWidth / 3) {
    if (mediaQueries[2].matches) {
      if (slide(testimonialWidth) === 1) {
        fillDots(slideNum, slideNum + 1);
        slideNum++;
      } else {
        fillDots(slideNum, slideNum - 1);
        slideNum--;
      }
    } else if (mediaQueries[0].matches) {
      if (slide(2 * testimonialWidth) === 1) {
        fillDots(slideNum, slideNum + 1);
        slideNum++;
      } else {
        fillDots(slideNum, slideNum - 1);
        slideNum--;
      }
    } else {
      slide(testimonialWidth);
    }
  } else {
    carousel.scrollLeft -= drag;
  }
};

const fillDots = (prevSlide, currentSlide) => {
  circles[prevSlide].setAttribute("fill", "white");
  circles[currentSlide].setAttribute("fill", "hsl(12, 88%, 59%)");
};

const buttonSlide = (prevSlide, currentSlide) => {
  if (mediaQueries[2].matches) {
    carousel.scrollLeft += (currentSlide - prevSlide) * testimonialWidth;
  } else if (mediaQueries[0].matches) {
    carousel.scrollLeft += 2 * (currentSlide - prevSlide) * testimonialWidth;
  }
  fillDots(prevSlide, currentSlide);
  slideNum = currentSlide;
};

dotButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (slideNum - index !== 0) buttonSlide(slideNum, index);
  });
});

const dragStart = (e) => {
  isDragStart = true;
  startX = e.touches ? e.touches[0].pageX : e.pageX;
  prevScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  e.preventDefault();
  if (!isDragStart) return;
  isDragging = true;
  carousel.classList.add("dragging");
  drag = startX - (e.touches ? e.touches[0].pageX : e.pageX);
  carousel.scrollLeft = prevScrollLeft + drag;
};

const dragStop = (e) => {
  isDragStart = false;
  carousel.classList.remove("dragging");
  if (!isDragging) return;
  autoSlide();
  isDragging = false;
};

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

carousel.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);

carousel.addEventListener("mouseleave", dragStop);

/*******************************/
/* Make mobile navigation work */
/*******************************/

const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

/*******************************/
/* Sticky navigation */
/*******************************/

const sectionHero = document.querySelector(".section-hero");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];

    if (ent.isIntersecting === false) {
      document.body.classList.add("sticky");
    } else {
      document.body.classList.remove("sticky");
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  }
);

obs.observe(sectionHero);

/*******************************/
/* Smooth scrolling */
/*******************************/

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const href = link.getAttribute("href");

    if (href === "#") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    if (href !== "#" && href.startsWith("#")) {
      const section = document.querySelector(href);
      section.scrollIntoView({ behavior: "smooth" });
    }

    if (link.classList.contains("main-nav-link")) {
      headerEl.classList.toggle("nav-open");
    }
  });
});

/*******************************/
/* Customizing error message */
/*******************************/

const emailInput = document.getElementById("email");
const emailError = document.getElementById("errorMessage");

emailInput.addEventListener("invalid", (e) => {
  e.preventDefault();
  emailError.style.display = "block";
});

emailInput.addEventListener("input", function () {
  emailError.style.display = "none";
});
