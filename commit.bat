@echo off;
rem commit git
git add ./src/*
git commit -m 'update'
git push origin -u master