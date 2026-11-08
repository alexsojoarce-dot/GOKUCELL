(() => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  const closeMenu = () => {
    if (!menuButton || !mainNav) return;
    mainNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
      const opened = mainNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(opened));
      document.body.classList.toggle("nav-open", opened);
    });

    mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("click", event => {
      if (!mainNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
})();