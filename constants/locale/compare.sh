#!/bin/bash
rm noKeys 2>/dev/null
cnt=0
for koKey in $(jq 'keys[]' $1)
do
    hasKey=$(jq 'has('$koKey')' $2)
if [ $hasKey = "false" ];
then
cnt=$((cnt+1));
echo $koKey >> noKeys
fi
done 

echo "en.json에서 $cnt 개의 키 누락이 발견되었습니다 noKeys 파일을 확인해주세요"