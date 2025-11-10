# URL Shortener - Frontend

Aplicación web moderna para acortar URLs con soporte para usuarios registrados e invitados. Permite crear, gestionar y compartir enlaces cortos de forma rápida y sencilla.

## 🚀 Características

- **Sistema de usuarios dual**: Usuarios registrados y sesiones de invitado
- **URLs privadas**: Control de privacidad para enlaces registrados
- **Gestión de enlaces**: Edición, eliminación y organización de URLs
- **Límites inteligentes**: 5 URLs con expiración de 7 días para invitados, sin límites para usuarios registrados
- **Migración de cuenta**: Convierte tu sesión de invitado en cuenta permanente
- **Interfaz moderna**: Diseño responsivo con tema amarillo/ámbar

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16.0.1 (App Router)
- **UI Library**: React 19.2.0
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Componentes**: shadcn/ui
- **Iconos**: lucide-react
- **Backend**: FastAPI (http://localhost:8000)

## 📋 Prerequisitos

- Node.js 18.x o superior
- npm, yarn, pnpm o bun
- Backend de FastAPI corriendo en `http://localhost:8000`

## 🚀 Instalación y Ejecución

1. **Instalar dependencias**:

```bash
npm install
```

2. **Ejecutar servidor de desarrollo**:

```bash
npm run dev
```

3. **Abrir en el navegador**:

Visita [http://localhost:3002](http://localhost:3002)

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── page.tsx           # Página principal (landing/auth)
│   ├── layout.tsx         # Layout raíz
│   └── [shortCode]/       # Página de redirección
├── components/            # Componentes UI reutilizables
│   ├── ui/               # Componentes shadcn/ui
│   └── CustomAlertDialog.tsx
├── features/             # Módulos por funcionalidad
│   ├── auth/            # Autenticación (Login, Register)
│   └── dashboard/       # Dashboard de usuario
├── hooks/               # Custom React hooks
├── types/              # Definiciones TypeScript
├── utils/              # Utilidades y helpers
│   ├── api.ts         # Cliente API
│   └── guestSession.ts # Gestión de sesiones invitado
```

## 🔑 Funcionalidades Principales

### Para Usuarios Invitados
- Crear hasta 5 URLs cortas
- URLs expiran en 7 días
- No pueden crear URLs privadas
- Migración a cuenta registrada

### Para Usuarios Registrados
- Crear hasta 100 URLs
- URLs privadas (solo accesibles con login)
- Edición y gestión completa
- Persistencia permanente

## 🎨 Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Ejecutar producción
npm start

# Linter
npm run lint
```

## 🔗 Endpoints del Backend

La aplicación se conecta a:
- `http://localhost:8000/auth/*` - Autenticación
- `http://localhost:8000/urls/*` - Gestión de URLs
- `http://localhost:8000/{shortCode}` - Redirección

## 📝 Notas

- Las sesiones de invitado usan UUID almacenado en localStorage
- Las cookies HTTP-only manejan la autenticación de usuarios registrados
- El sistema implementa sliding sessions para mantener sesiones activas
