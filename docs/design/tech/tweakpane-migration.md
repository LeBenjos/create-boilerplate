# Design technique : lil-gui → Tweakpane v4 (templates three/experience et three/poc)

Story : panneau de debug Tweakpane à la place de lil-gui, mêmes réglages. Hors périmètre : stats.js, three-perf.

Versions vérifiées (npm, 2026-10-19) : `tweakpane@4.0.5`, `@tweakpane/core@2.0.5`.
Les types de `tweakpane` (`dist/types/index.d.ts`) importent `@tweakpane/core` : sans lui en devDependency, `tsc` échoue.
`FolderApi`, `ButtonApi`, `BindingApi`, `Pane` s'importent depuis `tweakpane` (ré-export), jamais depuis `@tweakpane/core` dans le code.

## Dépendances (les deux templates)

- `dependencies` : retirer `lil-gui`, ajouter `"tweakpane": "^4.0.5"`.
- `devDependencies` : ajouter `"@tweakpane/core": "^2.0.5"`.
- Régénérer `package-lock.json` par `npm install` dans le dossier du template (mise à jour, pas suppression ; c'est un asset du template).
- Experience : `three-perf` dépend de `tweakpane@^3.1.10`. Après install, v4 passe au top-level et v3 est nichée sous `three-perf`. C'est attendu, ne pas forcer de `overrides`.

## Correspondance des API (seulement les cas réellement utilisés)

| lil-gui | Tweakpane v4 |
|---|---|
| `new GUI({ title, closeFolders: true })` + `gui.close()` | `new Pane({ container, title, expanded: false })` |
| `width: 300` | pas d'option : largeur portée par le `container` (voir DebugManager) |
| `closeFolders: true` (s'applique à tous les sous-dossiers) | pas d'équivalent global : `expanded: false` sur **chaque** `addFolder`, y compris les sous-dossiers des appelants |
| `gui.addFolder('T')` | `pane.addFolder({ title: 'T', expanded: false })` |
| `add(obj, 'k', min, max, step)` | `addBinding(obj, 'k', { min, max, step })` |
| `add(obj, 'k', min, max)` (poc, sans pas) | `addBinding(obj, 'k', { min, max })` |
| `add(obj, 'k', { A, B })` (options en objet) | `addBinding(obj, 'k', { options: { A, B } })` (libellé = clé, valeur = valeur) |
| `add(obj, 'bool')` | `addBinding(obj, 'bool')` (checkbox inférée) |
| `.name('x')` | paramètre `label: 'x'` de `addBinding` |
| `.onChange((v) => …)` | `.on('change', (ev) => …ev.value…)` |
| `add({ fn: () => … }, 'fn')` (+ `.name('X')`) | `addButton({ title: 'X' }).on('click', () => …)` (titre = l'ancien libellé affiché : nom de la clé, ou `.name()`) |
| `gui.show(bool)` | `pane.hidden = !bool` |
| `gui.folders.find(f => f._title === t)` | `Map<DebugGuiTitle, FolderApi>` dans DebugManager |
| `addColor` / `listen()` | non utilisés aujourd'hui, ne rien ajouter (voir pièges pour la règle future) |

Libellés des boutons à conserver tels quels : `resetCurrentView`, `createWorld1`, `createWorld2`, `SWITCH WORLD_1_VIEW`, `SWITCH WORLD_2_VIEW`.
Libellés des bindings : `post-processing`, `intensity`, `positionX`, `positionY`, `positionZ`, `cube rotation` ; les autres prennent le nom de la clé (comportement par défaut identique).

## Conception de DebugManager (`experience/vanilla/src/experiences/managers/DebugManager.ts`)

Le singleton exporté et son API publique restent (convention du template ; la refonte du singleton est hors périmètre).

- Champs : `declare private _pane: Pane;` et `private readonly _folders = new Map<DebugGuiTitle, FolderApi>();`. Supprimer `_gui`.
- `_initGui()` (renommer `_initPane()`) :
  1. crée un `div` de classe `DebugManager._PANE_CONTAINER_CLASS_NAME = 'debug-panel'`, l'ajoute à `document.body` ;
  2. `this._pane = new Pane({ container, title: DebugManager._GUI_TITLE, expanded: false })` ;
  3. abonnement clavier inchangé (`remove` puis `add`).
- Pourquoi un container dédié : la largeur n'est pas une option de Tweakpane, et le wrapper par défaut `.tp-dfwv` est aussi celui du Pane v3 de three-perf. Le styler globalement toucherait three-perf.
- `getGuiFolder(title: DebugGuiTitle): FolderApi` : renvoie le dossier de la Map s'il existe ; sinon `this._pane.addFolder({ title, expanded: false })`, l'enregistre dans la Map et le renvoie. `_addGuiFolder` peut rester privé ou être inliné, sans dupliquer l'appel `addFolder`.
- `_toggleVisibility()` : `this._pane.hidden = !this._isDebugVisible` remplace `this._gui.show(...)`. Le reste est inchangé.
- Supprimer `_GUI_WIDTH` (la largeur part en SCSS, une seule source) et le getter public `gui` (aucun appelant, vérifié par grep ; code mort).
- `_isActive` lu une fois au démarrage : inchangé (critère 2).

Style (`experience/vanilla/src/experiences/styles/commons/main.scss:55`) : remplacer `.lil-gui` par `.debug-panel`, garder `z-index: 999999` partagé avec `#three-perf-ui`. Ajouter sur `.debug-panel` : `position: fixed; top: 8px; right: 8px; width: 300px;` (`.tp-dfwv` est en `absolute`, on passe en `fixed` comme lil-gui).

## Appelants (experience), changements mécaniques

- `renderers/threes/MainThreeWebGLRenderer.ts` `_setupDebug` : `toneMapping` → `options` (8 constantes) ; `toneMappingExposure` → `{ min: 0, max: 10, step: 0.001 }` ; `outputColorSpace` → `options` ; proxy `postProcProxy` conservé → `addBinding(postProcProxy, 'active', { label: 'post-processing' }).on('change', (ev) => this.setIsPostProcessingActive(ev.value))`.
- `engines/threes/apps/MainThreeApp.ts` : 3 boutons.
- `views/threes/worlds/World1ThreeView.ts`, `World2ThreeView.ts` : 1 bouton chacun.
- `views/threes/worlds/components/TemplateThreeModel.ts` : `addFolder({ title: 'Template Model', expanded: false })` + `position.y` `{ min: -1, max: 1, step: 0.01 }`.
- `views/threes/worlds/components/EnvironmentThreeActor.ts` : dossiers `Environment` et `Sun Light` avec `expanded: false` ; plages inchangées (0..10 / 0.01, -5..5 / 0.01) ; le `change` de l'intensité met à jour `MainThreeApp.scene.environmentIntensity` comme avant.

## Poc (`poc/vanilla`)

- `src/gui.ts` : `export const gui = new Pane();` (nom d'export conservé, pas de chirurgie au fusil). Wrapper par défaut, pas de three-perf ici.
- `src/main.ts:14` : `gui.addBinding(cube.rotation, 'y', { min: 0, max: Math.PI * 2, label: 'cube rotation' })`.
- `src/style.css:27` : `.lil-gui` → `.tp-dfwv` (même `z-index`).
- `readme.md:14,17` : remplacer « lil-gui » par « Tweakpane ».
- Racine : `packages/README.md:27` : « Debug mode with Tweakpane (DebugManager) ».

## Pièges

- **Type inféré de la valeur initiale** : Tweakpane choisit le contrôle selon `typeof obj[key]` au moment de `addBinding`. Une valeur `undefined` ou `null` lève une `TpError` (erreur console, critère 5). `EnvironmentMap.intensity` est optionnel dans le type mais affecté dans le constructeur avant `init()`, donc c'est sûr au runtime. `ev.value` est typé `number | undefined` : garder la lecture actuelle de `this._environmentMap.intensity!` dans le handler. Le `!` est déjà là, à ne pas corriger ici (refactoring hors périmètre, signalé).
- **Getters/setters** : Tweakpane lit et écrit via `obj[key]`, donc les accesseurs (`Euler.y`, propriétés de `WebGLRenderer`) fonctionnent. Il ne relit pas la valeur si elle change ailleurs, comme lil-gui sans `listen()`. Pas de `refresh()` à ajouter.
- **Non bindable** : champs privés et méthodes. Garder le proxy `{ active }` pour la post-processing et des boutons pour les actions. Ne jamais binder `this` avec un champ `_privé`.
- **Valeurs enum** : `toneMapping` (nombres) et `outputColorSpace` (chaînes) passent par `options`. La valeur courante doit faire partie des options, sinon la liste s'affiche vide. Les valeurs par défaut `CineonToneMapping` et `SRGBColorSpace` y sont.
- **Couleurs (règle pour plus tard, rien à migrer)** : un `THREE.Color` se binde avec `{ color: { type: 'float' } }`, car ses composantes r/g/b sont entre 0 et 1. Sans ça, Tweakpane les traite en 0-255. Attention à l'espace colorimétrique (Color est linéaire en three ≥ r152).
- **Deux versions de Tweakpane dans la page (experience + three-perf)** : les feuilles de style ont des ids distincts (`default` en v3, `plugin-default` en v4) et partagent les classes `.tp-*`. three-perf s'initialise au premier frame, après le panneau, donc ses règles v3 arrivent en dernier. QA doit vérifier visuellement le panneau avec `#debug`. Si le rendu est cassé, le signaler : la correction touche three-perf, hors périmètre.
- **Doublons de contrôles** à chaque `init()` d'une vue (dossiers `Environment`, `Template Model`, boutons de monde) : comportement existant avec lil-gui, inchangé, hors périmètre. Signalé.

## Découpage en tâches (dev)

- **T1 Experience** (un seul agent : les appelants dépendent du type `FolderApi` de DebugManager) : deps et lock, DebugManager, `main.scss`, les 6 appelants, `packages/README.md:27`.
- **T2 Poc** : deps et lock, `gui.ts`, `main.ts`, `style.css`, `readme.md`.
- T1 et T2 sont indépendantes : elles peuvent tourner **en parallèle**.

## Vérification (pas de script `verify` dans ces templates ; commandes à lancer depuis le dossier du template)

- Experience (`packages/templates/three/experience/vanilla`) : `npx tsc --noEmit && npm run lint && npm run build`.
- Poc (`packages/templates/three/poc/vanilla`) : `npx tsc --noEmit && npm run build` (pas d'ESLint dans ce template).
- Contrôle du critère 1 : `grep -rn "lil-gui\|lil gui" packages/templates/three packages/README.md --exclude-dir=node_modules --exclude-dir=dist` ne renvoie rien (lockfiles compris, après `npm install`).
- QA navigateur : experience avec et sans `#debug` (panneau fermé, titre, 300px, dossiers fermés, Shift+H masque panneau, stats et three-perf), poc, console vide.

## À ne pas faire

- Pas de wrapper ou d'adapter autour de Tweakpane (une seule implémentation, YAGNI).
- Ne pas toucher stats.js ni three-perf, ne pas ajouter `overrides` npm.
- Ne supprimer aucun asset dans `packages/templates/**`.

## Suite

Après la migration, stats.js est supprimé : three-perf affiche déjà FPS, CPU, GPU et compteurs. `overClock: false` lui fait afficher le FPS réel (frames comptées) au lieu de son estimation du FPS hors vsync.
