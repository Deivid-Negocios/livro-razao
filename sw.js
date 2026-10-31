// Service worker do Livro Razão. Gerado pelo App_Livro_Razao_montar.py: não editar à mão.
// Guarda só os arquivos do próprio aplicativo. Chamadas para a API do Apps Script (script.google.com)
// e qualquer outro endereço passam direto, sem cache.
const VERSAO = "lr-app-5dcba99095";
const ARQUIVOS = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith("lr-app-") && k !== VERSAO).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;   // API, fontes e o resto: rede, sem cache
  if (req.mode === "navigate") {
    // Página: primeiro a internet (pega a versão nova), sem internet abre a guardada
    e.respondWith(fetch(req).then(r => {
      if (r.ok) { const copia = r.clone(); caches.open(VERSAO).then(c => c.put("./", copia)); }
      return r;
    }).catch(() => caches.match("./")));
    return;
  }
  const nome = url.pathname.split("/").pop();
  if (!ARQUIVOS.includes(nome)) return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req)));
});
