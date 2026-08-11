# Guía rápida: Comandos Esenciales de Git (Desde cero hasta ramas, commits y tags)

Esta guía recopila los comandos fundamentales de Git para inicializar un repositorio, gestionar cambios, trabajar con ramas (branches), registrar commits, guardar etiquetas (tags) y buscar o regresar en el historial.

---

## 1. Instalación y Configuración Inicial

### ¿Cómo instalar Git?

* **Windows:** Descarga e instala el instalador oficial desde [git-scm.com](https://git-scm.com/). Durante la instalación puedes dejar las opciones predeterminadas.
* **Linux (Debian/Ubuntu):**
```bash
sudo apt update
sudo apt install git

```



### Configurar tu identidad (Nombre y Correo)

Una vez instalado, configura tus datos para que queden registrados en tus commits:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu_correo@ejemplo.com"

```

---

## 2. Inicializar un Repositorio

Para convertir cualquier carpeta de tu computadora en un repositorio rastreado por Git:

1. Abre tu terminal y navega hasta la carpeta del proyecto.
2. Ejecuta el comando de inicialización:
```bash
git init

```


*Esto creará una carpeta oculta llamada `.git` que gestionará todo el historial.*

---

## 3. Agregar Cambios y Hacer Commits

### Ver el estado actual (`status`)

Para saber qué archivos han cambiado o cuáles están listos para guardarse:

```bash
git status

```

### Agregar cambios (`add`)

Para preparar los archivos modificados y subirlos a la zona de espera (staging area):

* **Agregar todos los archivos nuevos o modificados:**
```bash
git add .

```


* **Agregar un archivo específico:**
```bash
git add nombre_del_archivo.ext

```



### Guardar cambios (`commit`)

Para empaquetar los cambios preparados con un mensaje descriptivo de lo que hiciste:

```bash
git commit -m "feat: descripción clara de los cambios realizados"

```

---

## 4. Gestión de Ramas (Branches)

Las ramas te permiten trabajar en nuevas funciones o corregir errores sin afectar la versión principal (`main` o `master`).

* **Ver las ramas existentes:**
```bash
git branch

```


* **Crear una nueva rama:**
```bash
git branch nombre-de-rama

```


* **Crear una rama y cambiarte a ella de un solo golpe:**
```bash
git checkout -b nombre-de-rama

```


*(O en versiones modernas de Git):*
```bash
git switch -c nombre-de-rama

```


* **Cambiarte de una rama a otra:**
```bash
git checkout nombre-de-rama

```


*(O con switch):*
```bash
git switch nombre-de-rama

```



---

## 5. Guardar Etiquetas (Tags Locales)

Las etiquetas sirven para marcar puntos específicos en la historia de tu código, como versiones oficiales (ej. `v1.0.0` o `v0.3.0`).

* **Crear un tag local:**
```bash
git tag v0.3.0

```


* **Crear un tag con un mensaje específico:**
```bash
git tag -a v0.3.0 -m "Versión estable con soporte de cuadernos"

```


* **Listar los tags guardados:**
```bash
git tag

```



---

## 6. Buscar, Consultar Historial y Regresar (Reset / Log)

### Ver el historial de commits (`log`)

Para revisar la lista de todos los cambios guardados con sus códigos hash, autor y fecha:

```bash
git log

```

*(Si quieres una vista más limpia y resumida en una sola línea por commit):*

```bash
git log --oneline

```

### Buscar dentro del historial (`log --grep`)

Si buscas un commit específico por una palabra clave en su mensaje:

```bash
git log --grep="cuaderno"

```

### Regresar en el tiempo o deshacer cambios

* **Descartar cambios locales no añadidos al stage (¡Cuidado, borra lo no guardado!):**
```bash
git restore .

```


* **Deshacer un `git add` (sacar archivos del área de preparación sin perder cambios):**
```bash
git reset

```


* **Regresar a un commit anterior (modo seguro / soft o mixto):**
```bash
git reset --mixed <hash_del_commit>

```


* **Inspeccionar un commit o tag antiguo sin modificar tu estado actual (modo lectura):**
```bash
git checkout v0.3.0

```