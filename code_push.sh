#!/usr/bin/env bash
  
cmd=$1
environment=$2
environment="$(tr '[:lower:]' '[:upper:]' <<< ${environment:0:1})${environment:1}"

_dir="`pwd`"

if [[ ! "$cmd" =~ ^(set|release|patch|promote)$ ]]; then
 	echo "\033[31m"[Error]"\033[0m" "Undefined command"
 	exit 1
fi

if [[ ! "$environment" =~ ^(Staging|Production)$ ]]; then
 	echo "\033[31m"[Error]"\033[0m" "Undefined environment"
 	exit 1
fi

if [[ "$cmd" = "promote" && "$environment" = "Staging" ]]; then
	echo "\033[31m"[Error]"\033[0m" "You can only promote the package for production"
	exit 1
fi

echo "\033[32m"[Info]"\033[0m" "Please enter the Android/iOS version manually before executing the command."
echo "\033[32m"[Info]"\033[0m" "Please check the CodePush Key again before pushing the source into git."

echo ""

targetiOSBinaryVersion=`grep 'MARKETING_VERSION' $_dir/ios/RokebiESIM.xcodeproj/project.pbxproj | tail -1 | awk  -F " |;" '{print $3}' `

androidMajorVersion=`grep 'VERSION_MAJOR' $_dir/android/app/version.properties | awk  -F "=" '{print $2}' `
androidMinorVersion=`grep 'VERSION_MINOR' $_dir/android/app/version.properties | awk  -F "=" '{print $2}' `
targetAndroidBinaryVersion=`echo $androidMajorVersion.$androidMinorVersion`

echo "\033[32m"[Info]"\033[0m" "Target iOS Binary version:            $targetiOSBinaryVersion"
echo "\033[32m"[Info]"\033[0m" "Target Android Binary version:        $targetAndroidBinaryVersion"

curiOSVersion=`appcenter codepush deployment list -a admin-uangel.kr/RokebiEsim-iOS | grep $environment | grep 'Label' | awk -F " " '{print $5}'`
curAndroidVersion=`appcenter codepush deployment list -a admin-uangel.kr/RokebiEsim-Android | grep $environment | grep 'Label' | awk -F " " '{print $5}'`

if [[ ! "$curiOSVersion" =~ ^v[0-9]+$ ]] || [[ ! "$curAndroidVersion" =~ ^v[0-9]+$ ]]; then
	echo "\033[31m"[Error]"\033[0m" "Please check appcenter-cli first"
	exit 1
fi

echo "\033[32m"[Info]"\033[0m" "Current $environment iOS version:     $curiOSVersion"
echo "\033[32m"[Info]"\033[0m" "Current $environment Android version: $curAndroidVersion"

echo "\033[32m"[Info]"\033[0m" "Get CodePush Key($environment) from App Center"

CODEPUSH_IOS_KEY=`appcenter codepush deployment list -k --app  admin-uangel.kr/RokebiEsim-iOS | grep $environment | sed -e 's/'"${environment}"'//g' -e 's/ //g' -e 's/│//g'`
CODEPUSH_ANDROID_KEY=`appcenter codepush deployment list -k --app  admin-uangel.kr/RokebiEsim-Android | grep $environment | sed -e 's/'"${environment}"'//g' -e 's/ //g' -e 's/│//g'`

CODEPUSH_IOS_KEY=`echo $CODEPUSH_IOS_KEY | cat -v | sed -e 's/\^\[\[39m//g' -e 's/\^\[\[90m//g'`
CODEPUSH_ANDROID_KEY=`echo $CODEPUSH_ANDROID_KEY | cat -v | sed -e 's/\^\[\[39m//g' -e 's/\^\[\[90m//g'`

if [ -z "$CODEPUSH_IOS_KEY" -o -z "$CODEPUSH_ANDROID_KEY" ]
then
	echo "\033[31m"[Error]"\033[0m" "Failed to get the Code Push Key"
	exit 1
fi

sed -i '' -E 's/CODEPUSH_KEY ?= ?.+/CODEPUSH_KEY = '"${CODEPUSH_IOS_KEY}"';/g' $_dir/ios/RokebiESIM.xcodeproj/project.pbxproj
sed -i '' -E 's/buildConfigField "String", "CODEPUSH_KEY", '\''".+"'\''/buildConfigField "String", "CODEPUSH_KEY", '\'\"''"$CODEPUSH_ANDROID_KEY"''\"\''/' $_dir/android/app/build.gradle

sed -i '' -E 's/\$\(CODEPUSH_KEY\)/'"${CODEPUSH_IOS_KEY}"'/g' $_dir/ios/RokebiESIM/Info.plist
sed -i '' -E 's/\$\(CODEPUSH_KEY\)/'"${CODEPUSH_IOS_KEY}"'/g' $_dir/ios/RokebiESIM/Development.plist

# 버전 변경 (수동으로 진행 필요)

# 코드 푸쉬 실행

case $cmd in
	release) 
		echo "\033[32m"[Info]"\033[0m" "Release an update to the app deployment ($environment)"
		
		nextiOSVersion=`echo $curiOSVersion | awk -F 'v' '{ print "v" $2 + 1 }'`
		nextAndroidVersion=`echo $curAndroidVersion | awk -F 'v' '{ print "v" $2 + 1 }'`

		if [ "$environment" = "Production" ]; then
  			sed -i '' -E 's/  productionAndroid: ?.+/  productionAndroid: "'"${nextAndroidVersion}"'",/g'  $_dir/environment.js
  			sed -i '' -E 's/  productionIOS: ?.+/  productionIOS: "'"${nextiOSVersion}"'",/g'  $_dir/environment.js
		else
  			sed -i '' -E 's/  stagingAndroid: ?.+/  stagingAndroid: "'"${nextAndroidVersion}"'",/g'  $_dir/environment.js
 	 		sed -i '' -E 's/  stagingIOS: ?.+/  stagingIOS: "'"${nextiOSVersion}"'",/g'  $_dir/environment.js
		fi
	
		appcenter codepush release-react -a admin-uangel.kr/RokebiEsim-iOS -t $targetiOSBinaryVersion -d $environment
		appcenter codepush release-react -a admin-uangel.kr/RokebiEsim-Android -t $targetAndroidBinaryVersion -d $environment

		;;

	patch)
		echo "\033[32m"[Info]"\033[0m" "Update the metadata for the existing release  ($environment)"
	
		appcenter codepush patch -a admin-uangel.kr/RokebiEsim-iOS $environment -l $curiOSVersion -t $targetiOSBinaryVersion
		appcenter codepush patch -a admin-uangel.kr/RokebiEsim-Android $environment -l $curAndroidVersion -t $targetAndroidBinaryVersion

		;;

	promote)
		echo "\033[32m"[Info]"\033[0m" "Create a new release for ($environment) from the latest release of staging deployment"

		appcenter codepush promote -a admin-uangel.kr/RokebiEsim-iOS -s Staging -d Production
		appcenter codepush promote -a admin-uangel.kr/RokebiEsim-Android -s Staging -d Production

		;;
	*) ;;
esac

echo ""

newiOSVersion=`appcenter codepush deployment list -a admin-uangel.kr/RokebiEsim-iOS | grep $environment | grep 'Label' | awk -F " " '{print $5}'`
newAndroidVersion=`appcenter codepush deployment list -a admin-uangel.kr/RokebiEsim-Android | grep $environment | grep 'Label' | awk -F " " '{print $5}'`

echo "\033[32m"[Info]"\033[0m" "Current $environment iOS version:     $newiOSVersion"
echo "\033[32m"[Info]"\033[0m" "Current $environment Android version: $newAndroidVersion"

# 소스 롤백

sed -i '' -E 's/'"${CODEPUSH_IOS_KEY}"'/\$\(CODEPUSH_KEY\)/g' ./ios/RokebiESIM/Info.plist
sed -i '' -E 's/'"${CODEPUSH_IOS_KEY}"'/\$\(CODEPUSH_KEY\)/g' ./ios/RokebiESIM/Development.plist

if [ "$environment" = "Production" ]; then
	sed -i '' -E 's/  productionAndroid: ?.+/  productionAndroid: "'"${newAndroidVersion}"'",/g'  $_dir/environment.js
	sed -i '' -E 's/  productionIOS: ?.+/  productionIOS: "'"${newiOSVersion}"'",/g'  $_dir/environment.js
else
	sed -i '' -E 's/  stagingAndroid: ?.+/  stagingAndroid: "'"${newAndroidVersion}"'",/g'  $_dir/environment.js
	sed -i '' -E 's/  stagingIOS: ?.+/  stagingIOS: "'"${newiOSVersion}"'",/g'  $_dir/environment.js
fi


