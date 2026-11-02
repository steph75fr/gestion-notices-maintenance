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
</style></head><body><header><strong><a href="/">Gestion Notices & Équipements</a></strong><nav><a href="/">Accueil</a><a href="/admin">Administration (aperçu)</a></nav></header>
<main>${content}</main></body></html>`;
const page404 = () => new Response(shell("Introuvable", '<h1>Page introuvable</h1><a href="/">Retour à l’accueil</a>'), { status:404, headers:{"content-type":"text/html; charset=utf-8"}});
const response = html => new Response(html,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}});
export default {
  fetch(request) {
    const url = new URL(request.url);
    if (request.method !== "GET") return new Response("Méthode non autorisée", {status:405});
    if (url.pathname === "/") {
      const cards = models.map(m => `<article class="card"><span class="tag">${escapeHtml(m.category)}</span><h2>${escapeHtml(m.name)}</h2><p>${escapeHtml(m.brand)}</p><a href="/m/${encodeURIComponent(m.id)}">Consulter le modèle</a></article>`).join("");
      return response(shell("Accueil", `<h1>Bibliothèque de notices</h1><p class="muted">Prototype avec données fictives. Les PDF et QR codes seront ajoutés lors des prochaines étapes.</p><div class="grid">${cards}</div>`));
    }
    if (url.pathname === "/admin") {
      const rows = equipment.map(e => {
        const m = models.find(x => x.id === e.modelId);
        return `<tr><td style="padding:10px;border-bottom:1px solid #ddd"><a href="/e/${encodeURIComponent(e.id)}">${escapeHtml(e.id)}</a></td><td style="padding:10px;border-bottom:1px solid #ddd">${escapeHtml(m.name)}</td><td style="padding:10px;border-bottom:1px solid #ddd">${escapeHtml(e.building)} / ${escapeHtml(e.floor)} / ${escapeHtml(e.office)}</td></tr>`;
      }).join("");
      return response(shell("Administration — aperçu", `<h1>Inventaire — aperçu</h1><p><strong>Attention :</strong> cette page est publique et en lecture seule. Elle contient uniquement des données fictives. Ne pas y saisir de données réelles.</p><div class="card" style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th align="left">Identifiant</th><th align="left">Modèle</th><th align="left">Localisation fictive</th></tr></thead><tbody>${rows}</tbody></table></div><p class="muted">Gestion des comptes, imports, PDF et QR codes à développer.</p>`));
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
