// CallGuard site: test access form, header shadow, reveal on scroll.
(() => {
  // ---------- Test access request → Cloudflare worker → Telegram ----------

  const betaForm = document.getElementById("beta-form");
  if (betaForm) {
    const status = betaForm.querySelector(".beta-status");
    const button = betaForm.querySelector("button");
    betaForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      button.disabled = true;
      status.textContent = "Отправляю…";
      try {
        const response = await fetch("https://feedback-worker.nightwelf.workers.dev/request-test-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(betaForm))),
        });
        if (!response.ok) throw response;
        betaForm.reset();
        status.textContent = "✓ Запрос отправлен, приглашение придёт на почту";
      } catch {
        // Fields stay filled so nothing is lost.
        status.textContent = "Не отправилось, попробуйте ещё раз";
      } finally {
        button.disabled = false;
      }
    });
  }

  // ---------- Header shadow and reveal on scroll ----------

  const header = document.querySelector(".header");
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const revealed = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    for (const el of revealed) el.classList.add("is-in");
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  for (const el of revealed) observer.observe(el);
})();
