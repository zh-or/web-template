#!/bin/sh

echo '开始编译...'
yarn build > /dev/null
echo '编译完成...'

mkdir dist
echo '清理垃圾文件...'
cd dist
pwd

rm --verbose ./static/js/*.LICENSE.txt
rm -rf --verbose ./static/js/*.map

echo '调整位置...'
mkdir public
mkdir template

mv layout ./template/
mv *.html ./template/
mv * ./public/

mv ./public/template/ ./

echo '操作完成...'
