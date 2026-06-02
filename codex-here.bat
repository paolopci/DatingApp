@echo off
setlocal

:: --- CONFIGURAZIONE: nome della tua distro WSL (verifica con: wsl -l -v)
set "DISTRO=Ubuntu-22.04"

:: Usa la cartella corrente come target
set "WINPATH=%CD%"

:: Converte il path di Windows nel path WSL (es. C:\foo -> /mnt/c/foo)
for /f "usebackq delims=" %%i in (`wsl -d %DISTRO% wslpath -a "%WINPATH%"`) do set "WSLPATH=%%i"

:: Avvia bash come login shell, carica NVM (per il PATH di npm) e lancia Codex
wsl -d %DISTRO% -e bash -lc "export NVM_DIR=\"$HOME/.nvm\"; [ -s \"$NVM_DIR/nvm.sh\" ] && . \"$NVM_DIR/nvm.sh\"; cd '%WSLPATH%' && codex"
