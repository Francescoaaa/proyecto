# 🧪 Guía de Testing - Sistema de Notificaciones Push

## 📋 Checklist de Verificación

### ✅ Backend - Verificaciones Básicas

1. **Servidor funcionando**
   ```bash
   cd backend
   npm start
   # Verificar: http://localhost:3001
   ```

2. **Base de datos MySQL**
   - ✅ Tabla `notificaciones` creada
   - ✅ Campos: id, usuario_id, tipo, titulo, mensaje, turno_id, leida, created_at

3. **Rutas de notificaciones**
   - ✅ `GET /notificaciones/usuario/:userId`
   - ✅ `GET /notificaciones/usuario/:userId/no-leidas`
   - ✅ `PUT /notificaciones/:id/leer`

### ✅ Frontend - Verificaciones Básicas

1. **Componente NotificationBell**
   - ✅ Visible en Admin Panel
   - ✅ Visible en MisTurnos
   - ✅ Visible en Header general

2. **Funcionalidades**
   - ✅ Contador de notificaciones no leídas
   - ✅ Dropdown con lista de notificaciones
   - ✅ Marcar como leída al hacer clic
   - ✅ Actualización automática cada 30s

## 🔬 Tests Automatizados

### Test 1: Componente de Testing
- Ubicación: Admin Panel → Dashboard → "Test de Notificaciones"
- Función: Verifica conexión y funcionalidades básicas

### Test 2: Flujo Completo Usuario → Admin

1. **Como Usuario:**
   - Ir a `/reservar`
   - Crear un nuevo turno
   - ✅ Verificar que se genera notificación para admin

2. **Como Admin:**
   - Ir a `/admin`
   - ✅ Verificar campana con contador actualizado
   - ✅ Ver notificación de "nuevo_turno"

### Test 3: Flujo Completo Admin → Usuario

1. **Como Admin:**
   - Ir a `/admin` → Turnos
   - Cancelar/Posponer un turno con justificación
   - ✅ Verificar que se genera notificación para usuario

2. **Como Usuario:**
   - Ir a `/mis-turnos`
   - ✅ Verificar campana con contador actualizado
   - ✅ Ver notificación de "turno_cancelado" o "turno_pospuesto"

## 🐛 Debugging y Logs

### Console Logs Importantes
```javascript
// Backend
console.log('NOTIF: Creando notificación:', { usuario_id, tipo, titulo });

// Frontend
console.log('API: Error al obtener notificaciones:', error);
console.log('NOTIF: Notificaciones cargadas:', data);
```

### Verificar en DevTools
1. **Network Tab**: Verificar llamadas a `/notificaciones/*`
2. **Console**: Buscar logs con prefijo "NOTIF:" o "API:"
3. **Application → LocalStorage**: Verificar token de usuario

## 🚨 Problemas Comunes y Soluciones

### Problema: "No aparecen notificaciones"
**Solución:**
1. Verificar que el usuario esté autenticado
2. Verificar que existan notificaciones en la BD
3. Revisar console por errores de API

### Problema: "Contador no se actualiza"
**Solución:**
1. Verificar intervalo de 30s en useEffect
2. Verificar que la API devuelva `{ count: number }`
3. Revisar estado de `noLeidas` en componente

### Problema: "Error 401/403 en notificaciones"
**Solución:**
1. Verificar token en localStorage
2. Verificar middleware de autenticación en rutas
3. Verificar headers Authorization en requests

## 📊 Métricas de Éxito

### ✅ Sistema Funcionando Correctamente
- [ ] Notificaciones se crean automáticamente
- [ ] Contador se actualiza en tiempo real
- [ ] Marcar como leída funciona
- [ ] No hay errores en console
- [ ] Responsive en móvil y desktop

### ⚡ Performance
- [ ] Carga inicial < 2 segundos
- [ ] Actualización automática no bloquea UI
- [ ] Animaciones fluidas
- [ ] Sin memory leaks en intervalos

## 🔄 Casos de Prueba Específicos

### Caso 1: Usuario Nuevo
1. Registrar nuevo usuario
2. Verificar que campana aparece (sin notificaciones)
3. Crear primer turno
4. Verificar notificación para admin

### Caso 2: Admin con Múltiples Notificaciones
1. Crear varios turnos desde diferentes usuarios
2. Verificar contador > 1
3. Marcar algunas como leídas
4. Verificar que contador disminuye

### Caso 3: Modo Offline/Fallback
1. Desconectar backend
2. Verificar que campana no crashea
3. Verificar fallbacks silenciosos
4. Reconectar y verificar recuperación

## 📱 Testing en Dispositivos

### Desktop
- [ ] Chrome, Firefox, Safari
- [ ] Hover effects funcionan
- [ ] Dropdown se posiciona correctamente

### Mobile
- [ ] Touch interactions
- [ ] Responsive design
- [ ] No overlap con otros elementos

## 🎯 Criterios de Aceptación Final

✅ **COMPLETADO** cuando:
1. Usuario puede ver sus notificaciones
2. Admin puede ver notificaciones de nuevos turnos
3. Notificaciones se marcan como leídas
4. Sistema funciona con/sin MySQL
5. No hay errores en producción
6. Performance es aceptable
7. UX es intuitiva y fluida