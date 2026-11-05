# Relevamiento de funciones (referencia: AS Legal)

Relevado el 2026-11-05 con una cuenta vacía en plan gratis, solo leyendo.
Esto es un inventario de **funciones**; el diseño, los textos, la marca y el código van a ser propios.

## Navegación general
- Barra lateral: Inicio, Expedientes, Calendario, Clientes, Juzgados, Agentes IA, Documentos, Integraciones, Configuración. Se puede colapsar.
- Barra superior: buscador global ("buscar en el estudio"), consumos de IA, ayuda, estado de conexiones con tribunales, abrir asistente IA, "Hoy", notificaciones, mi cuenta.
- Login: Google, email + contraseña, link mágico por email, recuperar contraseña, alta de cuenta.

## Inicio (dashboard)
- Saludo + caja de chat con el asistente IA (texto, adjuntar PDF/imágenes hasta 10 MB y 4 por mensaje, dictado por voz).
- Checklist "Primeros pasos" (5 ítems, se puede ocultar): conectar tribunales, Google Calendar, Drive/Dropbox, probar IA, invitar al equipo.
- Contadores: expedientes activos, míos, esta semana (próximos 7 días), retrasadas.
- Widgets: mi agenda, vencimientos, recordatorios, notificaciones, expedientes por estado, documentos recientes, última actividad (actuaciones).
- Botón "Personalizar" (elegir y ordenar widgets).

## Expedientes
- Listado con filtros y vistas guardadas: "Asignados a mí" y "Parecen terminadas" (más de 2 años sin movimiento, o el tribunal informa que están archivadas).
- Archivo: archivar es un interruptor aparte del estado.
- Alta de expediente:
  - Identificación: carátula*, número, año, fuero, numeración completa (clave PJN / CUIJ), link al tribunal (avisa si la causa ya estuvo en el estudio).
  - Clasificación: estado, etapa, parte (cliente), radicación (juzgado), etiquetas.
  - Personas: clientes, abogados del estudio asignados.
  - Observaciones.
- Papelera: los expedientes borrados no cuentan para el límite.
- *No relevado (la cuenta no tiene datos):* la ficha del expediente, las actuaciones y movimientos, y las partes.

## Calendario / tareas
- Calendarios múltiples ("Agregar calendario").
- Filtros: Inactivos / Activos / Completados / Finalizados / Retrasados / Asignados a mí.
- Vistas: Calendario (día/semana), Agenda, Movimientos, Tabla, Kanban.
- "+ Crear" evento o tarea. Un evento sin estado se toma como alerta; una tarea vencida que no está en Completados ni Finalizados queda como retrasada.

## Clientes
- Listado con filtro Activos / Inactivos / Todos, por tipo (Cliente, Empresa, Proveedor, Otro) y "Asignados a mí".
- Columnas configurables: nombre, tipo, estado, asignados, etiquetas, email, teléfono, cantidad de asuntos.

## Juzgados
- Mismo patrón que Clientes. Columnas: nombre, tipo, estado, asignados, provincia, email, teléfono, identificación, dirección, asuntos.
- "Agregar del directorio": carga juzgados en lote desde un directorio nacional.

## Documentos
- Explorador de archivos: Inicio, por Expedientes / Clientes / Juzgados / Tareas, Escritos, Sin vincular, Recientes, Destacados, Papelera.
- Carpeta automática por cada entidad. Almacenamiento en Drive.

## Agentes de IA
- Asistente general: chat sobre las causas, redacción de escritos, seguimiento de causas. Configurable: identidad, base de conocimiento, jurisprudencia y qué vigila.
- Agente de vencimientos: lee las actuaciones nuevas de los tribunales y detecta plazos.
- Cada agente se activa o desactiva para todo el estudio.
- Conector MCP para usar el sistema desde Claude o ChatGPT.
- La IA se cobra con créditos prepagos (1 crédito = $1) y se pausa cuando no queda saldo.

## Integraciones
- **Poderes judiciales** (por usuario, con credenciales cifradas): PJN (por CUIL), SCBA (notificaciones electrónicas), MEV SCBA (sets de búsqueda; la clave vence cada 90 días), EJE CABA ("mis causas" o "por sujeto"), SRT (con Clave Fiscal AFIP). Traen causas, novedades y archivos.
- Agenda: Google Calendar.
- Almacenamiento del estudio: Google Drive y Dropbox (OneDrive y SharePoint figuran como "próximamente").
- Equipo.

## Configuración
- Estudio: nombre y logo (se usan en documentos y reportes), zona de peligro para dar de baja el estudio (baja lógica).
- Plan y uso: plan, saldo de créditos IA, expedientes activos (100 en el plan gratis), almacenamiento (2 GB) y archivos de tribunales (20 GB aparte).
- Dominios: verificación de dominio para que entren automáticamente los mails de ese dominio.
- Usuarios: invitaciones (también Gmail externos) con rol (Administrador, Abogado, …) y activar/desactivar.
- Catálogos con nombre, color y uso:
  - Estados propios (En trámite, En espera) + estados que informa cada tribunal (PJN, SCBA, EJE, SRT; se pueden renombrar y recolorear, no borrar). Un estado nuevo del tribunal pisa al manual y avisa.
  - Etapas: Inicio, Prueba, Alegatos, Sentencia, Recursos, Ejecución, Conciliado.
  - Fueros: Civil, Comercial, Laboral, Penal, Contencioso Administrativo, Familia, Seguridad Social.
  - Partes: Actora, Demandada, Tercero.
  - Estados de tarea, agrupados en 4 categorías fijas: Inactivos, Activos, Completados, Finalizados.
  - Tipos de cliente, tipos de juzgado, etiquetas.
  - Configuración del asistente IA.

## Lo caro y riesgoso (para decidir el alcance)
1. **Conectores con tribunales** (PJN, SCBA, MEV, EJE, SRT): es scraping de portales oficiales con las claves del abogado. Es el corazón del producto y lo más frágil de mantener; además implica custodiar claves cifradas.
2. **IA**: chat sobre causas, redacción y detección de plazos, con costo por uso.
3. **Integraciones** con Google Calendar, Drive y Dropbox (OAuth).
4. Lo demás (expedientes, calendario, clientes, juzgados, documentos, usuarios y catálogos) es un CRUD estándar.
