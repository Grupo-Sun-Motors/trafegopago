@echo off
cd /d %~dp0

echo.
echo ------------------------------------------
echo    [ GIT PUSH - Projeto trafegopago ]
echo ------------------------------------------

REM Inicializa repositório e configura usuário (se necessário)
git init
git config user.name "SunMotorsOficial"
git config user.email "mktsunmotors@gmail.com"

REM Remove e reconfigura origin remoto
git remote remove origin >nul 2>&1
git remote add origin https://github.com/SunMotorsOficial/trafegopago.git

REM Garante que supabase-infos.txt seja ignorado
echo supabase-infos.txt>>.gitignore

REM Remove do Git se já tiver sido rastreado antes
git rm --cached supabase-infos.txt >nul 2>&1

REM Adiciona arquivos e pastas específicas (inclusive docs e midias)
git add index.html
git add push-github.bat
git add .gitignore
git add pages/
git add shared/
git add docs/
git add midias/

REM Commit com data/hora
git commit -m "Atualização automática %date% %time%"

REM Push do branch local master para main remoto
git push -f origin master:main

echo.
echo Push concluído com sucesso!
pause
