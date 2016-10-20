# Contribuer à VLiller

Si vous êtes ici c'est que vous envisagez de contribuer à VLiller et nous en sommes ravis ! Avant toute chose, prenez
le temps de jeter un oeil à la [roadmap](https://github.com/alexetmanon/vliller/wiki/Roadmap) afin d'avoir
une idée des _features_ que nous avons pour ambition d'implémenter :)

Si votre idée ne figure pas dans cette roadmap, nous vous invitons à ouvrir une issue sur Github afin de discuter de
cette dernière et de décider de son éventuelle développement !

## Conventions

Le projet étant destiné à un public francophone, l'ensemble des documents relatifs à celui-ci sont à rédiger en Français.

Néanmoins l'intégralité du code ainsi que des commits doivent être en Anglais.

## Protocole de contribution

Voici les quelques étapes à suivre pour contribuer à Vliller:
1. Faites un [Fork](https://help.github.com/articles/fork-a-repo/) du repo sur votre compte Github
2. Taper `git checkout develop` et `git pull`, vous devriez avoir un message `Already up-to-date`
   par rapport à VLiller
2. Créer une branche avec un nom commençant par `feature-` pour les nouvelle fonctionnalités et `bugfix-` pour les corrections de bugs (eg. `git checkout -b feature-pull-to-refresh`)
3. Implémentez votre idée
4. Soumettez une _pull request_
5. Attendez la _review_ de votre PR, si tout est satisfaisant elle sera mergée dans la prochaine release ! Si
ce n'est pas (et c'est probable) une discussion sera ouverte afin d'échanger sur les correctifs nécessaires.

## Configuration de l'environnement

Afin de pouvoir compiler le projet il vous faudra avant toute chose:
1. Installer `npm` si ce n'est pas déjà fait
2. Executer `npm install -g cordova ionic` pour installer `cordova` et `ionic`
3. Executer `npm install && bower install` qui installera les différents modules du projet
4. Executer `ionic state restore` qui installera les plugins et platforms cordova

### Android

1. Assurez-vous que votre variable d'environnement `ANDROID_HOME` est correctement configurée
2. Installez si nécessaire la liste des outils ci-dessous depuis l'utilitaire que vous pourrez lancer en tapant
   `$ANDROID_HOME/tools/android`
    1. `Android SDK Build-Tools` en version `23.0.1`
    2. `Android 6 (API23)`
    3. `Android Support Repository`
    4. `Google Play Services`
    5. `Google Repository`


### iOS

Pour compiler la version iOS de Vliller il vous faudra être sur un système macOS.

## Compilation et Installation

### Android

Pour lancer l'application sur votre smartphone Android :
```
gulp && ionic run android
```

### iOS

Pour lancer l'application sur un emulateur iPhone :
```
gulp && ionic build ios && ionic emulate ios
```

Il est également possible d'effectuer uniquement la partie "build" et de lancer l'émulateur/le mobile directement depuis xcode.