#!/bin/bash
echo "正在编译全部项目..."

for dir in `ls src/projects`; do
 echo "编译 -> $dir"
 ./build.sh $dir &
 wait $!
done

echo "删除无用文件..."

rm -rf --verbose dist/*/index-*.html
rm -rf --verbose dist/*/*.ico

echo "全部编译完毕..."


