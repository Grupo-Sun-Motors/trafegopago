@echo off
cd /d "%~dp0"

echo ---------------------------------------
echo  [ GIT PUSH - Projeto trafegopago ]
echo ---------------------------------------

REM Configurações iniciais (se ainda não estiverem feitas)
git config user.name "FOSSIO-FTG-MCK"
git config user.email "desenvolvimento@fossio.com.br"

REM Evita enviar o arquivo sensível
echo supabase-infos.txt>>.gitignore

REM Adiciona tudo, exceto o que estiver no .gitignore
git add .

REM Mensagem de commit automática com data/hora
set hora=%time:~0,2%:%time:~3,2%
set data=%date:~-4%-%date:~3,2%-%date:~0,2%
git commit -m "Atualização automática %data% %hora%"

REM Define o repositório remoto se não tiver
git remote remove origin >nul 2>&1
git remote add origin https://github.com/SunMotorsOficial/trafegopago.git

REM Envia para o repositório principal
git push -u origin main --force

echo.
echo Push realizado com sucesso!
pause
