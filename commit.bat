@echo off;
rem commit git
git add ./src/*
git add ./pom.xml
git add ./MS.sql
git add ./commit.bat
git add ./bootstrap-alert.zip
git commit -m 'update'
git push origin -u master