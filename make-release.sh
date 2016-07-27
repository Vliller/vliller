#! /bin/bash

if [[ "$#" -ne 1 ]]; then
    printf "\033[0;31mUsage: $0 version \e[0m\n"

    exit -1
fi

RELEASE_VERSION=$1
BRANCH_NAME="release-$RELEASE_VERSION"

printf "\033[1;35mCreates release \e[0m\n"

# branch creation
git checkout -b $BRANCH_NAME develop

# log modifications
./bump-version.py $RELEASE_VERSION
git commit -am "Release version $RELEASE_VERSION"

# merge into master
git checkout master
git merge --no-ff $BRANCH_NAME

# tag management
git tag -a $RELEASE_VERSION -m "Release version $RELEASE_VERSION"

# merge into develop
git checkout develop
git merge --no-ff $BRANCH_NAME

# remove branch
git branch -d $BRANCH_NAME

printf "\033[1;35mPush commits release \e[0m\n"

# push branches
git push origin master --follow-tags
git push origin develop

printf "\033[1;32mRelease $RELEASE_VERSION DONE ! \e[0m\n"