(() => {
  const reduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toastRoot = document.createElement("div");
  toastRoot.className = "gc-toast-root";
  toastRoot.setAttribute("aria-live", "polite");
  toastRoot.setAttribute("aria-atomic", "false");
  document.body.appendChild(toastRoot);

  function toast(message, type = "success") {
    const item = document.createElement("div");
    item.className = `gc-toast gc-toast-${type}`;
    item.setAttribute("role", "status");
    const mark = type === "success" ? "✓" : type === "error" ? "!" : "i";
    item.innerHTML = `<span class="gc-toast-mark" aria-hidden="true">${mark}</span><span class="gc-toast-message"></span><button type="button" class="gc-toast-close" aria-label="Cerrar notificación">×</button>`;
    item.querySelector(".gc-toast-message").textContent = message;
    toastRoot.appendChild(item);
    requestAnimationFrame(() => item.classList.add("gc-toast-visible"));

    const remove = () => {
      item.classList.remove("gc-toast-visible");
      window.setTimeout(() => item.remove(), reduced ? 0 : 220);
    };
    item.querySelector(".gc-toast-close").addEventListener("click", remove);
    window.setTimeout(remove, 3400);
  }

  function count(element, target, options = {}) {
    if (!element) return;
    const value = Number(target);
    if (!Number.isFinite(value)) {
      element.textContent = String(target);
      return;
    }
    const duration = reduced ? 0 : (options.duration || 650);
    const prefix = options.prefix || "";
    const suffix = options.suffix || "";
    const decimals = options.decimals || 0;
    const previous = Number(element.dataset.gcCount ?? 0);
    if (element.dataset.gcCount === String(value)) return;
    element.dataset.gcCount = String(value);
    if (!duration) {
      element.textContent = `${prefix}${value.toLocaleString("es-CR",{maximumFractionDigits:decimals})}${suffix}`;
      return;
    }
    const start = performance.now();
    const from = Number(options.from ?? previous);
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = now => {
      const t = Math.min(1, (now - start) / duration);
      const current = from + (value - from) * ease(t);
      element.textContent = `${prefix}${current.toLocaleString("es-CR",{maximumFractionDigits:decimals})}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Product image lightbox (only images already shown in the catalogue).
  const lightbox = document.createElement("div");
  lightbox.className = "gc-lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <div class="gc-lightbox-backdrop" data-lightbox-close></div>
    <section class="gc-lightbox-panel" role="dialog" aria-modal="true" aria-label="Vista ampliada del producto">
      <button type="button" class="gc-lightbox-close" aria-label="Cerrar imagen">×</button>
      <img class="gc-lightbox-image" alt="">
      <p class="gc-lightbox-caption"></p>
    </section>`;
  document.body.appendChild(lightbox);

  const closeLightbox = () => {
    lightbox.classList.remove("gc-lightbox-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gc-lightbox-active");
  };
  const openLightbox = image => {
    const target = lightbox.querySelector(".gc-lightbox-image");
    target.src = image.currentSrc || image.src;
    target.alt = image.alt || "Producto GOKUCELL";
    lightbox.querySelector(".gc-lightbox-caption").textContent = image.alt || "";
    lightbox.classList.add("gc-lightbox-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("gc-lightbox-active");
    lightbox.querySelector(".gc-lightbox-close").focus();
  };

  document.addEventListener("click", event => {
    const image = event.target.closest(".catalog-image img");
    if (image) {
      openLightbox(image);
      return;
    }
    if (event.target.closest(".gc-lightbox-close") || event.target.hasAttribute("data-lightbox-close")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeLightbox();
    const image = event.target.closest?.(".catalog-image img");
    if (image && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openLightbox(image);
    }
  });

  const prepareCatalogImages = root => {
    const images = [];
    if (root instanceof HTMLImageElement && root.matches(".catalog-image img")) images.push(root);
    if (root.querySelectorAll) images.push(...root.querySelectorAll(".catalog-image img"));
    images.forEach(image => {
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", `Ampliar ${image.alt || "fotografía del producto"}`);
    });
  };
  prepareCatalogImages(document);
  const catalogObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => mutation.addedNodes.forEach(prepareCatalogImages));
  });
  catalogObserver.observe(document.body, { childList: true, subtree: true });

  window.GokuUI = { toast, count };
})();