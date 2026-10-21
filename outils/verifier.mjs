/* Vérifie les invariants de l'outil. Un seul fichier, aucun réseau, aucun stockage.
   Exécution : node outils/verifier.mjs                                        */
import fs from 'node:fs';

const FICHIER = 'index.html';
const html = fs.readFileSync(new URL('../' + FICHIER, import.meta.url), 'utf8');
const ech = [];
const ok  = [];
const dit = (bon, msg) => (bon ? ok : ech).push(msg);

/* 1 — le JavaScript doit s'analyser */
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { ech.push('Aucun bloc <script> trouvé.'); }
const js = m ? m[1] : '';
try { new Function(js); dit(true, 'Le JavaScript s\'analyse sans erreur.'); }
catch (e) { dit(false, 'Erreur de syntaxe JavaScript : ' + e.message); }

/* 2 — aucun stockage navigateur : l'outil ne doit rien laisser sur le poste */
const stockage = ['localStorage', 'sessionStorage', 'indexedDB', 'document.cookie'];
const trouves = stockage.filter(s => html.includes(s));
dit(trouves.length === 0, trouves.length
  ? 'Stockage navigateur détecté : ' + trouves.join(', ')
  : 'Aucun stockage navigateur.');

/* 3 — aucun appel réseau : les données ne sortent pas du poste */
const reseau = ['fetch(', 'XMLHttpRequest', 'WebSocket', 'sendBeacon', 'EventSource'];
const net = reseau.filter(s => js.includes(s));
dit(net.length === 0, net.length
  ? 'Appel réseau détecté : ' + net.join(', ')
  : 'Aucun appel réseau.');

/* 4 — aucun script externe ; seules les polices Google sont permises */
const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(x => x[1]);
dit(scripts.length === 0, scripts.length
  ? 'Script externe interdit : ' + scripts.join(', ')
  : 'Aucun script externe.');
const liens = [...html.matchAll(/<link[^>]+href=["'](https?:[^"']+)["']/g)].map(x => x[1]);
const horsPolices = liens.filter(u => !/^https:\/\/fonts\.(googleapis|gstatic)\.com(\/|$)/.test(u));
dit(horsPolices.length === 0, horsPolices.length
  ? 'Ressource externe inattendue : ' + horsPolices.join(', ')
  : 'Ressources externes limitées aux polices Google (' + liens.length + ').');

/* 5 — toute fonction câblée sur un évènement doit exister
       (une suppression accidentelle casse des boutons en silence) */
const refs = [...js.matchAll(/addEventListener\('[a-z]+',\s*([A-Za-z_$][\w$]*)\s*\)/g)].map(x => x[1]);
const manquantes = [...new Set(refs)].filter(nom =>
  !new RegExp('(function|const|let|var)\\s+' + nom + '\\b').test(js));
dit(manquantes.length === 0, manquantes.length
  ? 'Fonctions câblées mais non définies : ' + manquantes.join(', ')
  : 'Les ' + new Set(refs).size + ' gestionnaires d\'évènements sont tous définis.');

/* 6 — un seul fichier : aucune ressource locale à côté */
const locales = [...html.matchAll(/(?:src|href)=["'](?!https?:|#|data:)([^"']+)["']/g)].map(x => x[1]);
dit(locales.length === 0, locales.length
  ? 'Fichier local référencé (l\'outil doit rester autonome) : ' + locales.join(', ')
  : 'Fichier autonome, aucune dépendance locale.');

/* 7 — taille raisonnable pour un fichier unique */
const ko = Math.round(html.length / 1024);
dit(ko < 400, 'Taille : ' + ko + ' Ko' + (ko < 400 ? '' : ' — au-delà de 400 Ko, découper.'));

console.log('\n' + FICHIER + '\n');
ok.forEach(l => console.log('  ok   ' + l));
ech.forEach(l => console.log('  ÉCHEC ' + l));
console.log('\n' + ok.length + ' vérifications réussies, ' + ech.length + ' en échec.\n');
process.exit(ech.length ? 1 : 0);
