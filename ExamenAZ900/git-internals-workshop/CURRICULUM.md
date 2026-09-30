# Currículo Avanzado: Git Internals & GitHub Governance

Este currículo está diseñado para transformar a un usuario de Git en un arquitecto de la herramienta, comprendiendo la base de datos de objetos subyacente y los mecanismos de gobernanza en GitHub.

## Módulo 1: La Base de Datos de Objetos (The Object Database)
**Objetivo:** Comprender que Git es un sistema de archivos direccionable por contenido.

*   **Teoría**:
    *   SHA-1 Hashing: Cómo Git garantiza la integridad.
    *   Los 4 tipos de objetos: Blob, Tree, Commit, Tag.
    *   Compresión Zlib y almacenamiento en `.git/objects`.
*   **Escenario de Simulación 1 (`Plumbing` Basics)**:
    *   Crear un blob sin un nombre de archivo (`git hash-object`).
    *   Leer el contenido y tipo de un objeto usando su hash (`git cat-file`).
    *   Construir un árbol (Tree) manualmente (`git update-index`, `git write-tree`).
    *   Crear un commit manualmente vinculando un árbol (`git commit-tree`).

## Módulo 2: Referencias y HEAD (The Refs)
**Objetivo:** Desmitificar las ramas y etiquetas.

*   **Teoría**:
    *   `.git/refs`: Dónde viven realmente las ramas.
    *   `HEAD`: Un puntero a un puntero (simbólico).
    *   Detached HEAD state: Qué significa a nivel de archivos.
*   **Escenario de Simulación 2 (Manipulación de Refs)**:
    *   Crear una rama editando un archivo de texto en `.git/refs/heads`.
    *   Mover `HEAD` manualmente.
    *   Entender cómo `git checkout` actualiza los archivos de trabajo basándose en el árbol apuntado por el commit de la referencia.

## Módulo 3: El Área de Staging (The Index)
**Objetivo:** Analizar el archivo binario `.git/index`.

*   **Teoría**:
    *   El Índice como barrera entre el Working Directory y el Repositorio.
    *   Información de `stat` (timestamps, inodos) para detección rápida de cambios.
*   **Escenario de Simulación 3 (Index Surgery)**:
    *   Usar `git ls-files --stage` para ver el contenido del índice.
    *   Manipular el índice sin tocar el directorio de trabajo.

## Módulo 4: Protocolos y Packfiles
**Objetivo:** Eficiencia en red y almacenamiento.

*   **Teoría**:
    *   Loose objects vs Packfiles.
    *   El proceso de `git gc`.
    *   Deltas: Cómo Git almacena diferencias en los packfiles.
*   **Escenario de Simulación 4 (Garbage Collection)**:
    *   Observar la explosión de objetos sueltos.
    *   Ejecutar `git gc` y analizar el archivo `.pack` y `.idx`.

## Módulo 5: GitHub Governance & Advanced Flows
**Objetivo:** Aplicar el conocimiento interno a la gestión de equipos.

*   **Temas**:
    *   **CODEOWNERS**: Sintaxis avanzada y reglas de aprobación.
    *   **Branch Protection Rules**: Status checks obligatorios y linear history.
    *   **Git Hooks**: Server-side (pre-receive) vs Client-side (pre-commit).
    *   **Reflog**: Recuperación de desastres (commits perdidos).

---

## Instrucciones para la Simulación Interactiva

Se ha provisto un script de PowerShell (`interactive_simulation.ps1`) que te guiará paso a paso por la creación manual de un repositorio Git utilizando solo comandos de "fontanería" (plumbing).

Ejecuta el script en tu terminal:
```powershell
.\interactive_simulation.ps1
```
