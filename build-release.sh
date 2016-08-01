#! /bin/bash

PROJECT_NAME="CreaZAP"
SCHEME_NAME="CreaZAP"

ANDROID_BUILD_FOLDER="./platforms/android/build/outputs/apk"

IOS_FOLDER="./platforms/ios"
IOS_BUILD_FOLDER=$IOS_FOLDER"/build"

RELEASE_KEYSTORE="/Users/alex/alexandrebonhomme-release-key.keystore"

BUILD_DATE=$(date +%Y-%m-%dT%H:%M:%S)
BUILD_VERSION=$(grep "\"version\":" package.json | sed 's/[^0-9.]*//g')

ZIPALIGN=$ANDROID_HOME/build-tools/23.0.1/zipalign

# build release
printf "\033[1;35mStart BUILD RELEASE \e[0m\n"

if [ "$1" != "ios" ]; then
    printf "\033[0;35m\nIonic build \033[1;35mAndroid \e[0m\n"
    ionic build --release android
fi
if [ "$1" != "android" ]; then
    printf "\033[0;35m\nIonic build \033[1;35miOS \e[0m\n"
    ionic plugin add cordova-plugin-wkwebview
    ionic build --release ios
fi

if [ "$1" != "ios" ]; then
    printf "\033[0;35m\nSigning APK \e[0m\n"
    # jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $RELEASE_KEYSTORE $ANDROID_BUILD_FOLDER/android-x86-release-unsigned.apk alexandrebonhomme
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $RELEASE_KEYSTORE $ANDROID_BUILD_FOLDER/android-armv7-release-unsigned.apk alexandrebonhomme

    printf "\033[0;35m\nAPK optimization \e[0m\n"
    # $ZIPALIGN -v 4 $ANDROID_BUILD_FOLDER/android-x86-release-unsigned.apk $ANDROID_BUILD_FOLDER/$BUILD_DATE-$BUILD_VERSION-android-x86-release.apk
    $ZIPALIGN -v 4 $ANDROID_BUILD_FOLDER/android-armv7-release-unsigned.apk $ANDROID_BUILD_FOLDER/$BUILD_DATE-$BUILD_VERSION-android-armv7-release.apk
fi

if [ "$1" != "android" ]; then
    printf "\033[0;35m\nClean xcode project \e[0m\n"
    xcodebuild clean -project $IOS_FOLDER"/"$PROJECT_NAME.xcodeproj -configuration Release -alltargets

    printf "\033[0;35m\nBuild IPA package \e[0m\n"
    xcodebuild -project $IOS_FOLDER"/"$PROJECT_NAME.xcodeproj -scheme $SCHEME_NAME -archivePath $IOS_FOLDER"/"$PROJECT_NAME -configuration Release archive

    ionic plugin rm com.telerik.plugins.wkwebview
fi

if [ "$1" != "ios" ]; then
    printf "\nBuilt the following apk:\n"
    # printf "    \e[1m$ANDROID_BUILD_FOLDER/$BUILD_DATE-$BUILD_VERSION-android-x86-release.apk\e[0m\n\n"
    printf "    \e[1m$ANDROID_BUILD_FOLDER/$BUILD_DATE-$BUILD_VERSION-android-armv7-release.apk\e[0m\n\n"
fi

if [ "$1" != "android" ]; then
    printf "\nBuilt the following archive:\n"
    printf "    \e[1m$IOS_FOLDER/$PROJECT_NAME.xcarchive\e[0m\n\n"
fi

printf "\033[1;32mAll DONE ! \e[0m\n"