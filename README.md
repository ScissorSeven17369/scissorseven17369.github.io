# SevenZone Studio Core

¡Bienvenidos al repositorio oficial de **SevenZone**, un estudio de desarrollo de software independiente especializado en la ingeniería de sistemas web, aplicaciones móviles, videojuegos y consultoría tecnológica!

Esta web está diseñada y estructurada con un enfoque profesional, serio y futurista (estética limpia oscura inspirada en Riot Games, Discord y Cloudflare), y optimizada para responder directamente a las inquietudes clave de los clientes: **¿Qué hacemos?**, **¿Qué hemos construido?** y **¿Por qué confiar en nosotros?**

---

## 🛠️ Tecnologías Utilizadas

- **Maquetado:** HTML5 Semántico
- **Estilos:** CSS3 Custom Properties (Variables)
- **Lógica e Interacciones:** Vanilla Javascript (ES6+)
- **Base de Datos Estática:** Ficheros JSON dinámicos cargados del lado del cliente
- **Efectos Premium:** Intersection Observer (Scroll Reveal), Canvas 2D (Fondo de partículas) y 3D Tilt interactivo

---

## 📁 Estructura del Proyecto

El proyecto está diseñado bajo una arquitectura modular estática optimizada para **GitHub Pages**:

```text
SevenZone/
│
├── img/                       # Recursos visuales (capturas, logotipos, fotos de perfil)
│   ├── Aura/
│   ├── Nexus/
│   ├── Nail Coute/
│   ├── Perfil/
│   ├── IconApp/
│   └── Fabicon/
│
├── data/                      # Base de datos estática en formato JSON
│   ├── projects.json          # Datos de proyectos de portafolio y productos
│   ├── services.json          # Ficha de servicios core
│   └── team.json              # Datos y habilidades de los ingenieros
│
├── css/                       # Hojas de estilo modulares
│   ├── main.css               # Estilos globales, variables de color y layouts de navbar/footer
│   ├── components.css         # Estilos de botones, tarjetas de información, timeline y modals
│   └── animations.css         # Efectos visuales de scanline, pulsaciones y reveal en scroll
│
├── js/                        # Módulos de Javascript
│   ├── app.js                 # Comportamiento global (carruseles de partículas, modales, navbar)
│   ├── portfolio.js           # Carga dinámica de JSON, filtrado de portafolio y sistema de "me gusta"
│   └── effects.js             # Efectos visuales 3D tilt, observador de scroll y simulación de consola CLI
│
├── pages/                     # Páginas secundarias de navegación
│   ├── about.html             # Quiénes somos detallado e ingenieros
│   ├── projects.html          # Portafolio completo e interactivo con filtros
│   └── services.html          # Servicios avanzados, cronograma y estimador de cotización
│
├── index.html                 # Portal de inicio profesional y resumen de la empresa
└── README.md
```

---

## 🚀 Desarrollo Local

Debido a que el sitio web carga los datos de proyectos, servicios y equipo de manera dinámica a través de peticiones HTTP (`fetch()`), los navegadores web modernos bloquean estas peticiones cuando se intenta abrir el archivo `index.html` haciendo doble clic directamente desde el explorador de archivos (`file:///` protocol) por políticas de seguridad (CORS).

Para probar el sitio web localmente de forma correcta, es necesario iniciarlo usando un servidor web local de desarrollo:

### Opción 1: Live Server (Recomendado para VS Code)
Si utilizas **Visual Studio Code**, instala la extensión **Live Server**, abre la carpeta del proyecto, haz clic derecho sobre `index.html` y selecciona **Open with Live Server**.

### Opción 2: Servidor Python
Si tienes Python instalado, ejecuta el siguiente comando en la terminal desde la raíz del proyecto:
```bash
# Python 3
python -m http.server 8000
```
Luego abre en tu navegador: `http://localhost:8000`

### Opción 3: Servidor Node.js (http-server)
Si tienes Node.js instalado, puedes levantar un servidor con:
```bash
npx http-server ./
```
Luego accede a la dirección que se muestre en consola (por defecto: `http://localhost:8080`).

*Nota: La web cuenta con un sistema de respaldo de datos (Fallback Data) incorporado en el Javascript. Si se abre directamente mediante `file:///`, el portafolio cargará un listado estático básico como respaldo para que no se vea vacío.*

---

## 🌐 Despliegue en GitHub Pages

Al ser un sitio web estático (HTML, CSS y JS puro sin backend), el despliegue es sumamente simple y gratuito en **GitHub Pages**:

1. Sube este repositorio a tu cuenta de GitHub.
2. Ve a la pestaña **Settings** (Configuración) de tu repositorio.
3. En el menú lateral izquierdo, haz clic en **Pages**.
4. En la sección **Build and deployment**, selecciona la rama `main` (o la rama correspondiente) en la carpeta `/ (root)` y haz clic en **Save**.
5. En un par de minutos, tu web estará activa en: `https://<tu-usuario>.github.io/<nombre-del-repositorio>/`
