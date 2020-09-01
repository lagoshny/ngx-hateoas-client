#!/bin/bash

function usage() {
  echo
  echo "NAME"
  echo "migrate-to-1.0.sh - Migrate a codebase from Spring HATEOAS 0.x to 1.0."
  echo
  echo "This script attempts to adjust a codebase for the package and type refactorings"
  echo "made for Spring HATEOAS 1.0."
  echo
  echo "SYNOPSIS"
  echo "migrate-to-1.0.sh [Pattern]"
  echo
  echo "OPTIONS"
  echo " -h --help    this help"
  echo " [Pattern]    a find pattern, default to *.java if you don't provide a pattern"
  echo "              don't forget to enclose your pattern with double quotes \"\" to "
  echo "              avoid pattern to be expanded by your shell prematurely."
  echo
  echo "EXAMPLE"
  echo " migrate-to-1.0.sh \"*IT.java\""
  exit 0
}

if [ "$1" == "-h" -o "$1" == "--help" ] ;
then
 usage
fi

FILES_PATTERN=${1:-*.ts}
SPEC_FILES_PATTERN=${1:-*.spec.ts}

echo ''
echo "Migrating Spring HATEOAS references to 1.0 for files : $FILES_PATTERN"
echo ''

FILES=`find ./ -name "$FILES_PATTERN" -not -name "$SPEC_FILES_PATTERN"`

MY_EXPRESSION="s/@lagoshny\/ngx-hal-client/@lagoshny\/ngx-hateoas-client/g;\
s/(RestService<[\S\s]+.super\()(.+?\,\s)(.+?)(\,.+?)(\))/\1\2\3\5/g;\
s/(RestService<[\S\s]+.constructor\()()(\s?\w+\:\sInjector\,?)/\1/g;\
s/(RestService<[\S\s]+.constructor\()([\S\s]+)(\,[\S\s]+\s\w+\:\sInjector\,?)/\1\2/g;\
\
s/([^\w])(RestService)([^\w])/\1OldRestService\3/g;\
s/([^\w])(RestService)([^\w])/\1OldRestService\3/g;\
s/([^\w])(RestService)([^\w])/\1OldRestService\3/g;\
s/([^\w])(RestService)([^\w])/\1OldRestService\3/g;\
\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
s/([^\w])(Resource)([^\w])/\1OldResource\3/g;\
\
s/([^\w])(EmbeddedResource)([^\w])/\1OldEmbeddedResource\3/g;\
s/([^\w])(EmbeddedResource)([^\w])/\1OldEmbeddedResource\3/g;\
s/([^\w])(EmbeddedResource)([^\w])/\1OldEmbeddedResource\3/g;\
s/([^\w])(EmbeddedResource)([^\w])/\1OldEmbeddedResource\3/g;\
s/([^\w])(EmbeddedResource)([^\w])/\1OldEmbeddedResource\3/g;\
s/([^\w])(EmbeddedResource)([^\w])/\1OldEmbeddedResource\3/g;\
s/([^\w])(EmbeddedResource)([^\w])/\1OldEmbeddedResource\3/g;\
s/([^\w])(EmbeddedResource)([^\w])/\1OldEmbeddedResource\3/g;\
s/([^\w])(EmbeddedResource)([^\w])/\1OldEmbeddedResource\3/g;\
s/([^\w])(EmbeddedResource)([^\w])/\1OldEmbeddedResource\3/g;\
s/([^\w])(EmbeddedResource)([^\w])/\1OldEmbeddedResource\3/g;\
s/([^\w])(EmbeddedResource)([^\w])/\1OldEmbeddedResource\3/g;\
s/([^\w])(EmbeddedResource)([^\w])/\1OldEmbeddedResource\3/g;\
s/([^\w])(EmbeddedResource)([^\w])/\1OldEmbeddedResource\3/g;\
\
s/([^\w])(BaseResource)([^\w])/\1OldBaseResource\3/g;\
s/([^\w])(BaseResource)([^\w])/\1OldBaseResource\3/g;\
s/([^\w])(BaseResource)([^\w])/\1OldBaseResource\3/g;\
s/([^\w])(BaseResource)([^\w])/\1OldBaseResource\3/g;\
s/([^\w])(BaseResource)([^\w])/\1OldBaseResource\3/g;\
s/([^\w])(BaseResource)([^\w])/\1OldBaseResource\3/g;\
s/([^\w])(BaseResource)([^\w])/\1OldBaseResource\3/g;\
s/([^\w])(BaseResource)([^\w])/\1OldBaseResource\3/g;\
s/([^\w])(BaseResource)([^\w])/\1OldBaseResource\3/g;\
s/([^\w])(BaseResource)([^\w])/\1OldBaseResource\3/g;\
s/([^\w])(BaseResource)([^\w])/\1OldBaseResource\3/g;\
s/([^\w])(BaseResource)([^\w])/\1OldBaseResource\3/g;\
s/([^\w])(BaseResource)([^\w])/\1OldBaseResource\3/g;\
s/([^\w])(BaseResource)([^\w])/\1OldBaseResource\3/g;\
\
s/([,:<{])(\s*?Sort)/\1OldSort/g;\
s/([,:<{])(\s*?Sort)/\1OldSort/g;\
s/([,:<{])(\s*?Sort)/\1OldSort/g;\
s/([,:<{])(\s*?Sort)/\1OldSort/g;\
s/([,:<{])(\s*?Sort)/\1OldSort/g;\
s/([,:<{])(\s*?Sort)/\1OldSort/g;\
s/([,:<{])(\s*?Sort)/\1OldSort/g;\
s/([,:<{])(\s*?Sort)/\1OldSort/g;\
s/([,:<{])(\s*?Sort)/\1OldSort/g;\
s/([,:<{])(\s*?SortOrder)/\1OldSortOrder/g;\
s/([,:<{])(\s*?SortOrder)/\1OldSortOrder/g;\
s/([,:<{])(\s*?SortOrder)/\1OldSortOrder/g;\
s/([,:<{])(\s*?SortOrder)/\1OldSortOrder/g;\
s/([,:<{])(\s*?SortOrder)/\1OldSortOrder/g;\
s/([,:<{])(\s*?SortOrder)/\1OldSortOrder/g;\
s/([,:<{])(\s*?SortOrder)/\1OldSortOrder/g;\
s/([,:<{])(\s*?SortOrder)/\1OldSortOrder/g;\
s/([,:<{])(\s*?SortOrder)/\1OldSortOrder/g;\
\
s/([^\w])(ResourcePage)([^\w])/\1OldResourcePage\3/g;\
s/([^\w])(ResourcePage)([^\w])/\1OldResourcePage\3/g;\
s/([^\w])(ResourcePage)([^\w])/\1OldResourcePage\3/g;\
s/([^\w])(ResourcePage)([^\w])/\1OldResourcePage\3/g;\
s/([^\w])(ResourcePage)([^\w])/\1OldResourcePage\3/g;\
s/([^\w])(ResourcePage)([^\w])/\1OldResourcePage\3/g;\
s/([^\w])(ResourcePage)([^\w])/\1OldResourcePage\3/g;\
s/([^\w])(ResourcePage)([^\w])/\1OldResourcePage\3/g;\
s/([^\w])(ResourcePage)([^\w])/\1OldResourcePage\3/g;\
s/([^\w])(ResourcePage)([^\w])/\1OldResourcePage\3/g;\
s/([^\w])(ResourcePage)([^\w])/\1OldResourcePage\3/g;\
s/([^\w])(ResourcePage)([^\w])/\1OldResourcePage\3/g;\
s/([^\w])(ResourcePage)([^\w])/\1OldResourcePage\3/g;\
\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
s/([^\w])(SubTypeBuilder)([^\w])/\1OldSubTypeBuilder\3/g;\
\
s/(import\s*?\{\s*?.*?)(CacheHelper)(.*?\s*?\}.*\;)//g;\
s/(import\s*?\{\s*?.*?)(EvictStrategy)(.*?\s*?\}.*\;)//g;\
\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
s/([^\w]CacheHelper\.[\s\S]*?\;)//g;\
"



for FILE in $FILES
do
    echo "Adapting $FILE"
#     echo $MY_EXPRESSION
#    sed -r -i ""  -e "$MY_EXPRESSION" $FILE
    perl -i~ -0777 -pe "$MY_EXPRESSION" $FILE
done

echo
echo 'Done!'
echo
echo 'If you have used link relation constants defined in Link (like Link.REL_SELF) in your '
echo 'codebase, you will have to trigger an organize imports in your IDE to make sure the'
echo 'now referenced IanaLinkRelations gets imported.'
echo
echo "Also, if you were referring to core Spring's Resource type you might see invalid migrations"
echo "as there's no way for us to differentiate that from Spring HATEOAS Resource type."
echo
echo 'After that, review your changes, commit and code on! \ö/'
