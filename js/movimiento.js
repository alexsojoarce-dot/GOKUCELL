(() => {
  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reading progress line: one paint per animation frame while scrolling.
  const progress = document.createElement("div");
  progress.className = "gc-scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = '<span></span>';
  document.body.appendChild(progress);
  const progressFill = progress.firstElementChild;

  let progressFrame = 0;
  const updateProgress = () => {
    if (progressFrame) return;
    progressFrame = requestAnimationFrame(() => {
      progressFrame = 0;
      const root = document.documentElement;
      const max = root.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progressFill.style.transform = `scaleX(${ratio})`;
    });
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });

  const selectors = [
    ".section-heading", ".service-card", ".about-image-wrap", ".about-copy",
    ".showcase-copy", ".showcase-image-wrap", ".contact-band-inner",
    ".page-hero .container", ".content-card", ".catalog-card",
    ".admin-welcome", ".admin-stat-card", ".phone-stat",
    ".admin-panel", ".report-block"
  ];
  const elements = [...new Set(selectors.flatMap(selector =>
    [...document.querySelectorAll(selector)]
  ))];

  if (reduceMotion || !("IntersectionObserver" in window)) {
    elements.forEach(element => element.classList.add("gc-visible"));
  } else {
    elements.forEach((element, index) => {
      element.setAttribute("data-reveal", "");
      if (element.matches(".service-card,.admin-stat-card,.phone-stat,.catalog-card")) {
        element.style.transitionDelay = `${(index % 4) * 65}ms`;
      }
    });

    document.documentElement.classList.add("gc-motion-ready");
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("gc-visible");
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: "0px 0px -36px 0px" });

    elements.forEach(element => observer.observe(element));

    // Product cards can be re-created after search/filter input.
    const catalogGrids = document.querySelectorAll(".catalog-grid");
    const catalogCardsObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        const cards = [];
        if (node.matches?.(".catalog-card")) cards.push(node);
        if (node.querySelectorAll) cards.push(...node.querySelectorAll(".catalog-card"));
        cards.forEach(card => {
          card.setAttribute("data-reveal", "");
          observer.observe(card);
        });
      }));
    });
    catalogGrids.forEach(grid => catalogCardsObserver.observe(grid, { childList: true }));

    // Table rows are created dynamically by the local data modules.
    const rowObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1 || node.tagName !== "TR" || node.classList.contains("empty-row")) return;
        node.classList.add("gc-row-enter");
      }));
    });
    document.querySelectorAll("tbody").forEach(tbody => {
      tbody.querySelectorAll("tr:not(.empty-row)").forEach(row => row.classList.add("gc-row-enter"));
      rowObserver.observe(tbody, { childList: true });
    });
  }
})();