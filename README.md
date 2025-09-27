"""
GIT COMANDOS

"""

clasicos:
git init
git add .
git commit -m "First commit"
git remote add origin url
git push -u origin main

repite cuando haces clasicos

GIT DETIALS:
git log
git status
git diff

Viajes en el tiempo

git reset --mixed codigo # viaje en el tiempo a esa version
git reset --hard codiedo #deja coimo estaba en ese momentoe sdestructuvio
git reflig # nos muestr atodos los cambioe que hcismos

Eliminar

git rm src/

ignorar o nos eguir directorios

Consultar rama principal, crear ramas y movernos:
git branch
git branch rama-schema
git checkout rama-schema
git push --force-with-lease origin main

uni al final
git merge rama-schema

crear tags

git tag super-realease
git tag -d
git tag -a v1.0.0 -m "Version 1.0.0 lista"
git push origin --tags
