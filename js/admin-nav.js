(() => {
  const shell = document.querySelector(".admin-shell");
  const toggle = document.querySelector(".admin-mobile-toggle");
  const sidebar = document.querySelector(".admin-sidebar");
  if (!shell || !toggle || !sidebar) return;

  const close = () => {
    shell.classList.remove("admin-nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const opened = shell.classList.toggle("admin-nav-open");
    toggle.setAttribute("aria-expanded", String(opened));
  });

  sidebar.querySelectorAll("a").forEach(link => link.addEventListener("click", close));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") close();
  });
  document.addEventListener("click", event => {
    if (shell.classList.contains("admin-nav-open") &&
        !sidebar.contains(event.target) && !toggle.contains(event.target)) {
      close();
    }
  });
})();