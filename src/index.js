// Prototype de démonstration : données fictives, aucune authentification ni persistance.
const models = [
  { id: "clim-a", category: "Climatisation", brand: "Marque fictive A", name: "Télécommande A", description: "Exemple de télécommande pour bureau." },
  { id: "clim-b", category: "Climatisation", brand: "Marque fictive B", name: "Télécommande B", description: "Deuxième modèle de démonstration." },
  { id: "video-a", category: "Vidéoprojecteur", brand: "Marque fictive C", name: "Projecteur A", description: "Exemple de matériel audiovisuel." }
];
const equipment = [
  { id: "EQ-001", modelId: "clim-a", building: "Bâtiment Test", floor: "1", office: "101" },
  { id: "EQ-002", modelId: "clim-b", building: "Bâtiment Test", floor: "1", office: "102" },
  { id: "EQ-003", modelId: "video-a", building: "Bâtiment Test", floor: "2", office: "201" }
];
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
const shell = (title, content) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><title>${escapeHtml(title)} — Gestion Notices</title>
<style>
:root{font-family:system-ui,-apple-system,sans-serif;color:#172235;background:#f5f7fb}
*{box-sizing:border-box}body{margin:0}header{background:#142d52;color:white;padding:20px max(20px,calc((100vw - 950px)/2))}
header a{color:white;text-decoration:none}main{max-width:950px;margin:auto;padding:26px 20px 70px}
h1{font-size:clamp(1.6rem,4vw,2.2rem)}h2{font-size:1.2rem}.muted{color:#596579}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.card{background:white;border:1px solid #dfe4ec;border-radius:12px;padding:20px;margin:12px 0}
a.button{display:inline-block;background:#155bb4;color:white;padding:10px 15px;border-radius:8px;text-decoration:none}
a{color:#155bb4}small{color:#64748b}.tag{background:#e9f1ff;padding:4px 8px;border-radius:7px;font-size:.85rem}
nav{margin-top:12px}nav a{margin-right:18px}
.hero{text-align:center;padding:28px 16px}.hero-icon{font-size:3rem}.scan-button{border:0;border-radius:10px;background:#155bb4;color:#fff;padding:15px 24px;font-size:1.05rem;cursor:pointer}
input[type=search]{width:100%;padding:14px;border:1px solid #b9c6d7;border-radius:9px;font:inherit}
#camera-box{display:none;margin-top:16px}#camera-box video{max-width:100%;width:420px;border-radius:10px;background:#111}
#scan-status{min-height:1.5em}.admin-link{font-size:.9rem}
</style></head><body><header><strong><a href="/">Gestion Notices & Équipements</a></strong><nav><a href="/">Accueil</a><a href="/admin">Administration (aperçu)</a></nav></header>
<main>${content}</main></body></html>`;
const page404 = () => new Response(shell("Introuvable", '<h1>Page introuvable</h1><a href="/">Retour à l’accueil</a>'), { status:404, headers:{"content-type":"text/html; charset=utf-8"}});
const response = html => new Response(html,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}});
export default {
  fetch(request) {
    const url = new URL(request.url);
    if (request.method !== "GET") return new Response("Méthode non autorisée", {status:405});
    if (url.pathname === "/") {
      const cards = models.map(m => `<article class="card model-card" data-search="${escapeHtml((m.name+" "+m.brand+" "+m.category).toLocaleLowerCase("fr"))}"><span class="tag">${escapeHtml(m.category)}</span><h2>${escapeHtml(m.name)}</h2><p>${escapeHtml(m.brand)}</p><a href="/m/${encodeURIComponent(m.id)}">Consulter la fiche</a></article>`).join("");
      const home = `
      <section class="hero">
        <div class="hero-icon" aria-hidden="true">❄️</div>
        <h1>Notices &amp; Équipements</h1>
        <p class="muted">Retrouvez facilement la notice d'utilisation de votre matériel.</p>
        <div class="card">
          <h2>Besoin d'une notice ?</h2>
          <p>Scannez le QR code présent sur votre équipement.</p>
          <button id="scan-start" class="scan-button" type="button">📷 Scanner un QR code</button>
          <div id="camera-box"><video id="scan-video" playsinline muted autoplay aria-label="Caméra de scan"></video><p><button id="scan-stop" type="button">Arrêter la caméra</button></p></div>
          <p id="scan-status" role="status" class="muted"></p>
          <small>Vous pouvez aussi scanner directement avec l'appareil photo de votre téléphone.</small>
        </div>
      </section>
      <section aria-labelledby="catalogue-title">
        <h2 id="catalogue-title">Rechercher un matériel</h2>
        <label for="model-search">Nom, marque ou catégorie</label>
        <input type="search" id="model-search" placeholder="Ex. : télécommande, climatisation…" autocomplete="off">
        <p id="search-empty" hidden>Aucun modèle trouvé.</p>
        <div class="grid" id="models-grid">${cards}</div>
      </section>
      <p class="muted" style="margin-top:30px">Prototype de démonstration : matériels fictifs, notices PDF non encore disponibles.</p>
      <p><a class="admin-link" href="/admin">🔒 Administration (aperçu non sécurisé)</a></p>
      <script>
      (() => {
        const search = document.getElementById('model-search');
        const cards = [...document.querySelectorAll('.model-card')];
        search.addEventListener('input', () => {
          const q = search.value.trim().toLocaleLowerCase('fr');
          let count = 0;
          for (const card of cards) { const match = card.dataset.search.includes(q); card.hidden = !match; if (match) count++; }
          document.getElementById('search-empty').hidden = count !== 0;
        });
        const start = document.getElementById('scan-start');
        const stop = document.getElementById('scan-stop');
        const box = document.getElementById('camera-box');
        const video = document.getElementById('scan-video');
        const status = document.getElementById('scan-status');
        let stream = null, active = false;
        const finish = () => { active = false; if(stream) stream.getTracks().forEach(t => t.stop()); stream = null; video.srcObject = null; box.style.display = 'none'; };
        stop.addEventListener('click', finish);
        start.addEventListener('click', async () => {
          if (!navigator.mediaDevices?.getUserMedia || !('BarcodeDetector' in window)) {
            status.textContent = "Le scan intégré n'est pas disponible sur ce navigateur. Utilisez l'appareil photo de votre téléphone pour scanner l'étiquette.";
            return;
          }
          try {
            const detector = new BarcodeDetector({formats:['qr_code']});
            stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
            video.srcObject = stream; box.style.display = 'block'; active = true;
            status.textContent = 'Placez le QR code devant la caméra.';
            await video.play();
            while(active) {
              const codes = await detector.detect(video);
              if (codes.length) {
                const target = new URL(codes[0].rawValue, location.origin);
                if (target.origin === location.origin && /^\\/(m|e)\\/[a-zA-Z0-9_-]+$/.test(target.pathname)) {
                  finish(); location.assign(target.pathname); return;
                }
                status.textContent = "Ce QR code ne correspond pas à une fiche de cette application.";
              }
              await new Promise(resolve => setTimeout(resolve, 350));
            }
          } catch (error) {
            status.textContent = "Impossible d'utiliser la caméra. Vérifiez les autorisations ou utilisez l'appareil photo du téléphone.";
            finish();
          }
        });
        window.addEventListener('pagehide', finish);
      })();
      </script>`;
      return response(shell("Accueil", home));
    }
    if (url.pathname === "/admin/localisations") {
      const offices = [
        {building:"Bâtiment Test",floor:"1",number:"101"},
        {building:"Bâtiment Test",floor:"1",number:"102"},
        {building:"Bâtiment Test",floor:"2",number:"201"}
      ];
      const floors = [...new Set(offices.map(o => o.floor))];
      const lines = floors.map(floor => `<section class="card"><h2>Étage ${escapeHtml(floor)}</h2><div class="grid">${offices.filter(o => o.floor === floor).map(o => `<div class="card"><strong>Bureau ${escapeHtml(o.number)}</strong><p class="muted">${equipment.filter(e => e.floor === floor && e.office === o.number).length} équipement(s) fictif(s)</p></div>`).join("")}</div></section>`).join("");
      return response(shell("Localisations — aperçu", `<a href="/admin">← Retour à l'administration</a><h1>Localisations</h1><p><strong>Mode démonstration :</strong> données entièrement fictives, en lecture seule et visibles publiquement. Ne saisissez aucune donnée réelle.</p><div class="grid"><div class="card"><strong>1</strong><p>Bâtiment fictif</p></div><div class="card"><strong>${floors.length}</strong><p>Étages</p></div><div class="card"><strong>${offices.length}</strong><p>Bureaux</p></div></div><h2>Bâtiment Test</h2>${lines}<p class="muted">La création, la modification, la suppression et l'import Excel seront disponibles après mise en place de l'authentification et de la base de données.</p>`));
    }
    if (url.pathname === "/admin") {
      const rows = equipment.map(e => {
        const m = models.find(x => x.id === e.modelId);
        return `<tr><td style="padding:10px;border-bottom:1px solid #ddd"><a href="/e/${encodeURIComponent(e.id)}">${escapeHtml(e.id)}</a></td><td style="padding:10px;border-bottom:1px solid #ddd">${escapeHtml(m.name)}</td><td style="padding:10px;border-bottom:1px solid #ddd">${escapeHtml(e.building)} / ${escapeHtml(e.floor)} / ${escapeHtml(e.office)}</td></tr>`;
      }).join("");
      return response(shell("Administration — aperçu", `<h1>Administration — aperçu</h1><div class="card"><h2>Rubriques</h2><p><a class="button" href="/admin/localisations">🏢 Bâtiments, étages et bureaux</a></p><p class="muted">Matériels · Notices PDF · QR codes · Utilisateurs : à venir.</p></div><h2>Inventaire fictif</h2><p><strong>Attention :</strong> cette page est publique et en lecture seule. Elle contient uniquement des données fictives. Ne pas y saisir de données réelles.</p><div class="card" style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th align="left">Identifiant</th><th align="left">Modèle</th><th align="left">Localisation fictive</th></tr></thead><tbody>${rows}</tbody></table></div><p class="muted">Gestion des comptes, imports, PDF et QR codes à développer.</p>`));
    }
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length === 2 && parts[0] === "m") {
      const m = models.find(x => x.id === parts[1]);
      if (!m) return page404();
      return response(shell(m.name,`<a href="/">← Modèles</a><h1>${escapeHtml(m.name)}</h1><p><span class="tag">${escapeHtml(m.category)}</span> · ${escapeHtml(m.brand)}</p><div class="card"><p>${escapeHtml(m.description)}</p><p class="muted">Notice PDF non encore importée.</p></div>`));
    }
    if (parts.length === 2 && parts[0] === "e") {
      const e = equipment.find(x => x.id === parts[1]);
      if (!e) return page404();
      const m = models.find(x => x.id === e.modelId);
      return response(shell(e.id,`<a href="/">← Accueil</a><h1>${escapeHtml(m.name)}</h1><p>Équipement ${escapeHtml(e.id)}</p><div class="card"><h2>Notice</h2><p class="muted">PDF non encore importé.</p><a href="/m/${encodeURIComponent(m.id)}">Voir la fiche modèle</a></div><p class="muted">Localisation volontairement masquée sur cette page publique.</p>`));
    }
    return page404();
  }
};
