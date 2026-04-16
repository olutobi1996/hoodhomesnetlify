(function () {

  'use strict';

  var siteMenuClone = function () {

    var jsCloneNavs = document.querySelectorAll('.js-clone-nav');
    var siteMobileMenuBody = document.querySelector('.site-mobile-menu-body');
    var mobileMenu = document.querySelector('.site-mobile-menu');

    // 🛑 stop if missing required elements
    if (!siteMobileMenuBody || !mobileMenu) return;

    // Clone desktop menu into mobile menu
    jsCloneNavs.forEach(nav => {
      var navCloned = nav.cloneNode(true);
      navCloned.className = 'site-nav-wrap';
      siteMobileMenuBody.appendChild(navCloned);
    });

    // Build dropdowns safely
    setTimeout(function () {

      var hasChildrens = mobileMenu.querySelectorAll('.has-children');

      var counter = 0;

      hasChildrens.forEach(hasChild => {

        var refEl = hasChild.querySelector('a');

        // create arrow only if anchor exists
        var newElSpan = document.createElement('span');
        newElSpan.className = 'arrow-collapse collapsed';

        if (refEl) {
          hasChild.insertBefore(newElSpan, refEl);
        } else {
          hasChild.prepend(newElSpan);
        }

        newElSpan.setAttribute('data-bs-toggle', 'collapse');
        newElSpan.setAttribute('data-bs-target', '#collapseItem' + counter);

        var dropdown = hasChild.querySelector('.dropdown');

        if (dropdown) {
          dropdown.className = 'collapse';
          dropdown.id = 'collapseItem' + counter;
        }

        counter++;
      });

    }, 0); // no need for 1000ms delay

    // Burger toggle
    var menuToggle = document.querySelectorAll(".js-menu-toggle");

    menuToggle.forEach(mtoggle => {

      mtoggle.addEventListener("click", function (e) {
        e.preventDefault();

        document.body.classList.toggle('offcanvas-menu');
        menuToggle.forEach(el => el.classList.toggle('active'));
      });

    });

    // Click outside to close
    document.addEventListener('click', function (event) {

      var isInsideMenu = mobileMenu.contains(event.target);
      var clickedToggle = false;

      menuToggle.forEach(toggle => {
        if (toggle.contains(event.target)) {
          clickedToggle = true;
        }
      });

      if (!isInsideMenu && !clickedToggle) {
        document.body.classList.remove('offcanvas-menu');
        menuToggle.forEach(el => el.classList.remove('active'));
      }

    });

  };

  // 🟢 run after DOM is ready (IMPORTANT FIX)
  document.addEventListener('DOMContentLoaded', siteMenuClone);

})();