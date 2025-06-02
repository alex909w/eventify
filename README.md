# 👥 Equipo

- Rossman Antonio Cabrera Dávila **CD240690**

- Nelson José Almendares Ruiz **AR230429**

- Jefferson Steven Velasco Alvarez **VA242207**

- Arístides Alexander Hernández Valdez **HV241964**


# 📝 Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

# 🖼️ Mockups

https://www.figma.com/proto/s5OXWm2WalUVK9EGNDZLgL?node-id=0-1&t=LDx47rbG1xhjJ2lq-6

# 📅 Notion

https://www.notion.so/2055ce05934180489a6af27c124e7868?v=2055ce0593418049ad6e000c10b2d500&source=copy_link

## 📚 Documentación

https://docs.google.com/document/d/1IxqsWaqS7qeYpTTgNW1bO81c4Fck5q_cUvOxy9wZRTA/edit?usp=sharing


# 🎉 Eventify

Una aplicación móvil moderna para la gestión y descubrimiento de eventos, desarrollada con React Native y Expo.

## 📱 Descripción

Eventify es una aplicación completa que permite a los usuarios crear, descubrir y gestionar eventos de manera intuitiva. Con una interfaz moderna y funcionalidades avanzadas, facilita la organización de eventos y la conexión entre personas.

## ✨ Características Principales

### 🏠 Funcionalidades Core
- **Descubrimiento de Eventos**: Explora eventos disponibles en una interfaz atractiva
- **Gestión de Eventos**: Crea, edita y gestiona tus propios eventos
- **Sistema de Asistencia**: Confirma asistencia y ve quién más va
- **Perfil de Usuario**: Gestiona tu información personal y preferencias

### 🔐 Autenticación y Seguridad
- Registro e inicio de sesión seguro
- Autenticación con Google integrada
- Recuperación de contraseñas
- Contexto de autenticación global

### 📅 Gestión Avanzada
- **Calendario Integrado**: Visualiza eventos en formato calendario
- **Historial de Eventos**: Revisa eventos pasados y futuros
- **Mis Eventos**: Gestiona eventos que has creado
- **Notificaciones**: Mantente informado sobre actualizaciones

### 💬 Interacción Social
- **Sistema de Comentarios**: Comenta y califica eventos
- **Compartir Eventos**: Comparte eventos con otros usuarios
- **Lista de Asistentes**: Ve quién más asistirá a los eventos

### 📊 Funciones Adicionales
- **Estadísticas**: Analiza datos de tus eventos
- **Configuraciones**: Personaliza tu experiencia
- **Ayuda y Soporte**: Acceso rápido a documentación y soporte

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React Native** (0.72.10) - Framework principal
- **Expo** (~49.0.15) - Plataforma de desarrollo
- **TypeScript** (^5.1.3) - Tipado estático
- **React Navigation** (^6.1.7) - Navegación entre pantallas

### Backend y Servicios
- **Firebase** (^10.7.1) - Base de datos y autenticación
- **Google Auth** - Autenticación con Google
- **AsyncStorage** - Almacenamiento local

### UI/UX
- **React Native Gesture Handler** - Gestos táctiles
- **React Native Reanimated** - Animaciones fluidas
- **Expo Vector Icons** - Iconografía
- **React Native Safe Area Context** - Manejo de áreas seguras

## 📁 Estructura del Proyecto

```
eventify/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── EventCard.tsx
│   │   ├── CommentsList.tsx
│   │   └── ...
│   ├── screens/            # Pantallas de la aplicación
│   │   ├── HomeScreen.tsx
│   │   ├── CreateEventScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── auth/
│   ├── navigation/         # Configuración de navegación
│   ├── context/           # Contextos de React
│   ├── services/          # Servicios y APIs
│   ├── hooks/             # Hooks personalizados
│   └── config/            # Configuraciones
├── assets/                # Recursos estáticos
├── app.json              # Configuración de Expo
├── package.json          # Dependencias
└── README.md
```

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Expo CLI
- Android Studio (para desarrollo Android)
- Xcode (para desarrollo iOS, solo macOS)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd eventify
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   - Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Añadir el archivo `google-services.json` en la raíz del proyecto
   - Configurar las credenciales en `src/config/firebase.ts`

4. **Configurar autenticación con Google**
   - Configurar OAuth 2.0 en Google Cloud Console
   - Actualizar las credenciales en `src/config/authConfig.ts`

## 📱 Ejecutar la Aplicación

### Desarrollo
```bash
# Iniciar el servidor de desarrollo
npm start

# Para Android
npm run android

# Para iOS
npm run ios

# Para Web
npm run web
```

### Comandos Útiles
```bash
# Limpiar caché
npm run clean

# Reset completo
npm run reset
```

## 🔧 Configuración

### Firebase
1. Crear proyecto en Firebase Console
2. Habilitar Authentication y Firestore
3. Configurar reglas de seguridad
4. Añadir configuración en `src/config/firebase.ts`

### Google Authentication
1. Configurar OAuth en Google Cloud Console
2. Añadir credenciales en `src/config/authConfig.ts`
3. Configurar redirect URIs apropiadas

## 📸 Capturas de Pantalla

*[Aquí puedes añadir capturas de pantalla de la aplicación]*

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal**: [Tu Nombre]
- **Diseño UI/UX**: [Diseñador]
- **Backend**: [Desarrollador Backend]

## 📞 Contacto

- **Email**: [tu-email@ejemplo.com]
- **LinkedIn**: [tu-linkedin]
- **GitHub**: [tu-github]

## 🙏 Agradecimientos

- Equipo de Expo por la excelente plataforma
- Comunidad de React Native
- Firebase por los servicios backend
- Todos los contribuidores del proyecto

---

**Eventify** - Conectando personas a través de eventos increíbles 🎊
