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

REM Adiciona remote (caso ainda não exista)
git remote remove origin >nul 2>&1
git remote add origin https://github.com/SunMotorsOficial/trafegopago.git

REM Ignora supabase-infos.txt
echo supabase-infos.txt>>.gitignore

REM Adiciona e commita tudo, exceto o supabase-infos.txt
git add .
git reset supabase-infos.txt
git commit -m "Atualização automática %date% %time%"

REM Faz push do branch local master para o remoto main
git push -f origin master:main

echo.
echo Push realizado com sucesso!
pause
