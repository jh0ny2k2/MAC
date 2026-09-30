# Git Internals Workshop

Este directorio contiene materiales para un taller avanzado sobre los internos de Git.

## Contenido

1.  **[CURRICULUM.md](CURRICULUM.md)**: Plan de estudios detallado cubriendo desde la base de datos de objetos hasta gobernanza en GitHub.
2.  **[interactive_simulation.ps1](interactive_simulation.ps1)**: Script de PowerShell interactivo que te permite "ser Git" manualmente.

## Instrucciones de Uso

1.  Abre una terminal de PowerShell en esta carpeta.
2.  Ejecuta el script de simulación:
    ```powershell
    .\interactive_simulation.ps1
    ```
3.  Sigue las instrucciones en pantalla. El script pausará en puntos clave para que puedas inspeccionar el directorio `.git` y entender qué está pasando.

## Limpieza

El script crea una carpeta `git-simulation-repo`. Puedes borrarla cuando termines.
