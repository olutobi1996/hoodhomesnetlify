document.addEventListener("DOMContentLoaded", function () {

  const mobileMenu = document.querySelector(".site-mobile-menu");
  const mobileBody = document.querySelector(".site-mobile-menu-body");
  const cloneNavs = document.querySelectorAll(".js-clone-nav");
  const toggles = document.querySelectorAll(".js-menu-toggle");

  if (!mobileMenu || !mobileBody) return;

  // Prevent double cloning
  mobileBody.innerHTML = "";

  // Clone desktop menu
  cloneNavs.forEach(nav => {
    const clone = nav.cloneNode(true);
    clone.classList.add("site-nav-wrap");
    mobileBody.appendChild(clone);
  });

  // Toggle menu
  function toggleMenu() {
    document.body.classList.toggle("offcanvas-menu");
    toggles.forEach(t => t.classList.toggle("active"));
  }

  toggles.forEach(t => {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      toggleMenu();
    });
  });

  // Close when clicking outside
  document.addEventListener("click", function (e) {
    const clickedInsideMenu = mobileMenu.contains(e.target);
    const clickedToggle = [...toggles].some(t => t.contains(e.target));

    if (!clickedInsideMenu && !clickedToggle) {
      document.body.classList.remove("offcanvas-menu");
      toggles.forEach(t => t.classList.remove("active"));
    }
  });

});