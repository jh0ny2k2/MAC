# Simulación Interactiva: Git Internals
# Este script te guiará paso a paso para construir un repositorio Git manualmente usando comandos de bajo nivel ("plumbing").

function Pause-Script {
    Write-Host "`nPresiona Enter para continuar..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Bienvenido al Taller de Git Internals" -ForegroundColor Cyan
Write-Host "Vamos a construir un repositorio sin usar 'git add' ni 'git commit'." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Preparación del entorno
$RepoPath = Join-Path $PSScriptRoot "git-simulation-repo"
if (Test-Path $RepoPath) {
    Remove-Item $RepoPath -Recurse -Force
}
New-Item -ItemType Directory -Path $RepoPath | Out-Null
Set-Location $RepoPath

Write-Host "`n[PASO 1] Inicializando un repositorio vacío..." -ForegroundColor Green
git init
Write-Host "Repositorio creado en $RepoPath"
Write-Host "Observa la estructura de .git:"
Get-ChildItem .git
Pause-Script

# 2. Creando un Blob (Binary Large Object)
Write-Host "`n[PASO 2] Creando un objeto Blob (Contenido del archivo)" -ForegroundColor Green
Write-Host "Vamos a guardar el texto 'Hola Git Internals' en la base de datos de Git."
$content = "Hola Git Internals"
# git hash-object calcula el SHA-1 y -w lo escribe en la base de datos
$blobHash = echo $content | git hash-object -w --stdin
Write-Host "Hash del Blob creado: $blobHash"

# Verificar dónde se guardó
$dir = $blobHash.Substring(0,2)
$file = $blobHash.Substring(2)
Write-Host "El objeto se guardó en .git/objects/$dir/$file"
if (Test-Path ".git/objects/$dir/$file") {
    Write-Host "¡Archivo encontrado!" -ForegroundColor Green
} else {
    Write-Host "Error: Archivo no encontrado." -ForegroundColor Red
}

# Leer el contenido usando git cat-file
Write-Host "Leyendo el contenido del objeto usando 'git cat-file -p':"
git cat-file -p $blobHash
Pause-Script

# 3. El Índice (Staging Area) y Trees
Write-Host "`n[PASO 3] El Índice y los Árboles (Trees)" -ForegroundColor Green
Write-Host "Un blob solo tiene contenido, no tiene nombre de archivo. El 'Tree' le da nombre."
Write-Host "Primero, añadimos el blob al índice (Staging Area) con un nombre de archivo 'saludo.txt'."

# git update-index registra el archivo en el índice
git update-index --add --cacheinfo 100644 $blobHash saludo.txt
Write-Host "Índice actualizado. Ahora creamos un objeto 'Tree' a partir del índice actual."

# git write-tree crea un objeto árbol a partir del índice
$treeHash = git write-tree
Write-Host "Hash del Tree creado: $treeHash"
Write-Host "Contenido del Tree:"
git cat-file -p $treeHash
Pause-Script

# 4. Creando el Commit
Write-Host "`n[PASO 4] Creando el Commit" -ForegroundColor Green
Write-Host "Un commit es un objeto que apunta a un Tree y tiene metadatos (autor, fecha, mensaje)."
$commitMessage = "Mi primer commit manual"
# git commit-tree crea el objeto commit
$commitHash = echo $commitMessage | git commit-tree $treeHash
Write-Host "Hash del Commit creado: $commitHash"
Write-Host "Contenido del Commit:"
git cat-file -p $commitHash
Pause-Script

# 5. Referencias (Branches)
Write-Host "`n[PASO 5] Referencias (Branches)" -ForegroundColor Green
Write-Host "Hasta ahora, tenemos un commit flotante. Necesitamos una rama (branch) que apunte a él."
Write-Host "Vamos a crear la rama 'master' manualmente escribiendo el hash en .git/refs/heads/master."

$refsDir = ".git/refs/heads"
if (-not (Test-Path $refsDir)) { New-Item -ItemType Directory -Path $refsDir -Force | Out-Null }
$commitHash | Out-File -FilePath "$refsDir/master" -NoNewline -Encoding ASCII

Write-Host "Rama 'master' creada apuntando a $commitHash"
Write-Host "Verificando con 'git log':"
git log --oneline
Pause-Script

# 6. HEAD y Checkout
Write-Host "`n[PASO 6] HEAD y Checkout" -ForegroundColor Green
Write-Host "El archivo HEAD nos dice en qué rama estamos."
Get-Content .git/HEAD
Write-Host "Actualmente HEAD apunta a refs/heads/master."
Write-Host "Sin embargo, nuestro directorio de trabajo está vacío (aún no hemos hecho checkout)."
Get-ChildItem

Write-Host "Recuperando los archivos del índice al directorio de trabajo..."
# git checkout-index copia archivos del índice al worktree
git checkout-index -a -f

Write-Host "¡Ahora el archivo 'saludo.txt' debería existir!"
if (Test-Path "saludo.txt") {
    Write-Host "Archivo encontrado: saludo.txt" -ForegroundColor Green
    Get-Content saludo.txt
} else {
    Write-Host "Algo salió mal." -ForegroundColor Red
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "¡Felicidades! Has simulado manualmente lo que Git hace automáticamente." -ForegroundColor Cyan
Write-Host "Has usado: hash-object, update-index, write-tree, commit-tree." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
