@echo off;
rem commit git
git add ./src/*
git add ./pom.xml
git add ./MS.sql
git add ./commit.bat
git commit -m 'update'
git push origin -u master