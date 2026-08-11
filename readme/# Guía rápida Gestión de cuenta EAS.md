# Guía rápida: Gestión de cuenta EAS CLI, perfiles de desarrollo y compilación (con Shake)

Esta guía te muestra paso a paso cómo iniciar sesión en EAS, verificar tu cuenta actual, cambiar de cuenta cuando se agoten las 5 construcciones gratuitas y compilar tu aplicación tanto con el menú de desarrollo (Shake) como en modo producción.

---

## 1. Gestión de Sesión en EAS CLI

### Iniciar sesión

Para autenticarte con tu cuenta de Expo/EAS, ejecuta el siguiente comando en la raíz de tu proyecto:

```bash
eas login

```

*Sigue las instrucciones en la terminal o el navegador para completar el acceso.*

### Saber con qué usuario estás logueado

Para verificar qué cuenta se encuentra activa actualmente en tu entorno local, ejecuta:

```bash
eas whoami

```

*Este comando te devolverá el nombre de usuario o correo electrónico de la cuenta con la que estás construyendo en ese momento.*

### Cambiar de cuenta (cuando se agotan las 5 construcciones gratuitas)

Si has alcanzado el límite de las 5 builds gratuitas en tu cuenta actual y deseas cambiar a otra cuenta alternativa:

1. Cierra la sesión actual ejecutando:
```bash
eas logout

```


2. Vuelve a iniciar sesión con tu otra cuenta:
```bash
eas login

```


3. Verifica que el cambio se haya realizado correctamente comprobando el usuario activo:
```bash
eas whoami

```



---

## 2. Tipos de Compilación en EAS

### Versión de Desarrollo (Con la función de Shake)

Esta versión incluye el cliente de desarrollo de Expo, lo que te permite agitar el dispositivo físico para abrir el menú de depuración (*Developer Menu*), recargar la app y usar herramientas de inspección.

* **Para Android:**
```bash
eas build --profile development --platform android

```


* **Para iOS:**
```bash
eas build --profile development --platform ios

```



### Versión de Producción (Sin herramientas de desarrollo / Clean)

Esta versión compila el paquete final optimizado para tiendas o distribución limpia, sin las herramientas de desarrollo ni el menú de shake habilitados.

* **Para Android:**
```bash
eas build --profile production --platform android

```


*(O si usas el perfil predeterminado sin especificar perfil):*
```bash
eas build --platform android

```


* **Para iOS:**
```bash
eas build --profile production --platform ios

```