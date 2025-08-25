# Migration des fichiers SCSS vers la syntaxe moderne de Sass

Ce document explique la migration complète des fichiers SCSS du dossier `src/assets/scss` vers la syntaxe moderne de Sass, remplaçant tous les `@import` par `@use` ou `@forward`.

## Structure migrated

### Ancienne structure (avec @import)
```scss
// Ancien style
@import "variables";
@import "mixins/breakpoints";

.component {
  color: $primary;
  @include media-breakpoint-up(md) {
    padding: $spacers[4];
  }
}
```

### Nouvelle structure (avec @use/@forward)
```scss
// Nouveau style moderne
@use 'sass:map';
@use 'variables' as vars;
@use 'mixins/breakpoints' as bp;

.component {
  color: vars.$primary;
  @include bp.media-breakpoint-up(md) {
    padding: map.get(vars.$spacers, 4);
  }
}
```

## Fichiers créés/migrés

### 1. Variables (`src/assets/scss/_variables.scss`)
- Contient toutes les variables personnalisées de l'Institut App
- Variables couleurs : `$primary`, `$secondary`, `$light`, `$dark`
- Variables typographie : `$font-family-base`, `$headings-font-family`
- Grid breakpoints et espacements

### 2. Fonctions (`src/assets/scss/_functions.scss`)
- Fonctions Bootstrap copiées et adaptées
- Fonctions utilitaires pour les couleurs et calculs

### 3. Mixins (`src/assets/scss/mixins/`)
- `_breakpoints.scss` : Mixins pour responsive design avec syntaxe moderne
- `_utilities.scss` : Mixins utilitaires
- `_buttons.scss` : Mixins pour les boutons
- `_index.scss` : @forward tous les mixins

### 4. Utilitaires (`src/assets/scss/_utilities.scss`)
- Classes utilitaires générées avec @each sur les maps
- Exemples : `.u-m-{0-5}`, `.u-p-{0-5}`, `.u-fs-{1-6}`

### 5. Bootstrap principal (`src/assets/scss/bootstrap.scss`)
- Import Bootstrap avec variables personnalisées
- Utilise @use pour l'import moderne

### 6. Index principal (`src/assets/scss/_index.scss`)
- @forward tous les modules principaux
- Point d'entrée pour l'utilisation modulaire

## Comment utiliser la nouvelle syntaxe

### 1. Import avec namespace
```scss
@use 'assets/scss/variables' as vars;
@use 'assets/scss/mixins/breakpoints' as bp;

.my-component {
  background: vars.$primary;
  
  @include bp.media-breakpoint-up(lg) {
    padding: map.get(vars.$spacers, 3);
  }
}
```

### 2. Import complet avec @forward
```scss
@use 'assets/scss' as *;  // Import tout via _index.scss

.my-component {
  background: $primary;  // Accès direct aux variables
}
```

### 3. Accès aux maps avec sass:map
```scss
@use 'sass:map';
@use 'assets/scss/variables' as vars;

.spacing-example {
  margin: map.get(vars.$spacers, 2);  // 0.5rem
  font-size: map.get(vars.$font-sizes, 4);  // 1.5rem
}
```

## Avantages de la migration

1. **Namespacing** : Évite les conflits de noms
2. **Performance** : Chargement seulement des modules nécessaires
3. **Maintenabilité** : Structure plus claire et modulaire
4. **Compatibilité future** : Prêt pour Sass 3.0
5. **Debugging** : Erreurs plus précises avec les namespaces

## Exemples d'utilisation

Voir le fichier `src/assets/scss/_example-usage.scss` pour des exemples concrets d'utilisation de la nouvelle syntaxe.

## Compilation

La compilation fonctionne correctement avec :
- Angular CLI
- Sass 1.x
- Build de production

Les avertissements de dépréciation proviennent de Bootstrap (node_modules) et non de nos fichiers migrés.