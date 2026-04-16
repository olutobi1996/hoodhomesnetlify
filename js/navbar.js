document.addEventListener("DOMContentLoaded", function () {

  const mobileMenu = document.querySelector(".site-mobile-menu");
  const mobileBody = document.querySelector(".site-mobile-menu-body");
  const cloneNavs = document.querySelectorAll(".site-navigation .js-clone-nav");
  const toggles = document.querySelectorAll(".js-menu-toggle");

  if (!mobileMenu || !mobileBody) return;

  // Clear old content
  mobileBody.innerHTML = "";

  // FORCE clone AFTER DOM is ready
  cloneNavs.forEach(nav => {
    const clone = nav.cloneNode(true);

    clone.classList.remove("d-none", "d-lg-inline-block");
    clone.classList.add("site-nav-wrap");

    mobileBody.appendChild(clone);
  });

  // Toggle menu
  toggles.forEach(t => {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      document.body.classList.toggle("offcanvas-menu");
      toggles.forEach(x => x.classList.toggle("active"));
    });
  });

  // Close on outside click
  document.addEventListener("click", function (e) {
    const insideMenu = mobileMenu.contains(e.target);
    const insideToggle = [...toggles].some(t => t.contains(e.target));

    if (!insideMenu && !insideToggle) {
      document.body.classList.remove("offcanvas-menu");
      toggles.forEach(x => x.classList.remove("active"));
    }
  });

});