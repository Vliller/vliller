# Contribuer à VLiller

Si vous êtes ici c'est que vous envisagez de contribuer à VLiller et nous en sommes ravis ! Avant toute chose, prenez
le temps de jeter un oeil à la [roadmap](https://github.com/alexetmanon/vliller/blob/master/ROADMAP.md) afin d'avoir
une idée des _features_ que nous avons pour ambition d'implémenter :)

Si votre idée ne figure pas dans cette roadmap, nous vous invitons à ouvrir une issue sur Github afin de discuter de
cette dernière et de décider de son éventuelle développement !

## Conventions

Le projet étant destiné a un public francophone, l'ensemble des documents relatifs à celui-ci sont à rédiger en Français.

Néanmoins l'intégralité du code ainsi que des commits doivent être en Anglais.

## Protocole de contribution

Voici les quelques étapes à suivre pour contribuer à VLiller:
1. Faites un [Fork](https://help.github.com/articles/fork-a-repo/) du repo sur votre compte Github
2. Créer une branche avec un nom sexy, par exemple: `git checkout -b feat/awesomeIdea`
3. Implémentez votre idée
4. Soumettez une _pull request_
5. Attendez la _review_ de votre PR, si tout est satisfaisant elle sera mergée dans la prochaine release ! Si
ce n'est pas (et c'est probable) une discussion sera ouverte afin d'échanger sur les correctifs nécessaires.

## Configuration de l'environnement

Afin de pouvoir compiler le projet il vous faudra avant toute chose:
1. Installer `npm` si ce n'est pas déjà fait
2. Executer`npm install` qui installera les différents modules du projet
3. Executer `ionic state restore` qui installera les plugins cordova
4. Executer `bower install` afin de générer les _assets_ de l'application

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

Pour compiler la version iOS de VLiller il vous faudra être sur un système OSX.

### Compilation et Installation

Il vous suffira de lancer le script `./build-debug.sh` qui se chargera de générer les applications Android et iOS.
Si vous ne disposez pas d'un environnement OSX, un message vous indiquera l'échec de la génération de l'archive iOS.
- __Android__: Installer l'APK généré sur votre téléphone connecté en USB avec la commande 
  `$ANDROID_HOME/platform-tools/adb install -r platforms/android/build/outputs/apk/android-debug.apk`
  
  Note: Si vous souhaitez lancer l'APK généré sur un émulateur, référez-vous à la
  [documentation de Cordova](https://cordova.apache.org/docs/fr/latest/guide/cli/index.html#tester-l'application-sur-un-émulateur-ou-un-périphérique)
  