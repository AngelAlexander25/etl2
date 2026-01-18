# 🚀 Configurar Scraper Automático con GitHub Actions

## ✅ Paso 1: Subir el código a GitHub

```bash
cd c:\Users\test\Desktop\etl
git init
git add .
git commit -m "Dashboard Cancún Real Estate con scraper automático"
git branch -M main
git remote add origin https://github.com/AngelAlexander25/cancun-etl.git
git push -u origin main
```

## ✅ Paso 2: Configurar Secrets en GitHub

1. Ve a tu repositorio: `https://github.com/AngelAlexander25/cancun-etl`
2. Click en **Settings** (⚙️)
3. En el menú izquierdo: **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Agrega estos secrets uno por uno:

```
DB_HOST = localhost (o tu servidor de BD)
DB_PORT = 5432
DB_USER = postgres
DB_PASSWORD = 25092002
DB_NAME = cancun_real_estate
```

## ✅ Paso 3: Activar GitHub Actions

1. Ve a la pestaña **Actions** en tu repo
2. Verás el workflow "Scraper Semanal de Propiedades"
3. Click en **Enable workflow**

## ✅ Paso 4: Probar manualmente (Primera vez)

1. En **Actions** → Click en "Scraper Semanal de Propiedades"
2. Click **Run workflow** → **Run workflow**
3. Espera 2-3 minutos
4. ✅ Verifica que se ejecutó correctamente

## 📅 Ejecución Automática

El scraper se ejecutará:
- ⏰ **Cada Domingo a las 2 AM (UTC)**
- 🔄 **Automáticamente sin hacer nada**
- 📊 **Actualiza los datos de propiedades**

## 🔧 Cambiar el horario

Edita `.github/workflows/scraper.yml`:

```yaml
# Cada día a las 3 AM
- cron: '0 3 * * *'

# Cada lunes y jueves a las 10 AM
- cron: '0 10 * * 1,4'

# Cada 12 horas
- cron: '0 */12 * * *'
```

Formato: `minuto hora día_mes mes día_semana`
- `0 2 * * 0` = Domingo (0) a las 2:00 AM

## 📝 Ver logs de ejecución

1. Ve a **Actions**
2. Click en una ejecución
3. Ver logs detallados de cada paso

## ⚠️ Notas Importantes

- GitHub Actions tiene **2,000 minutos gratis/mes**
- Cada ejecución del scraper toma ~5-10 minutos
- Puedes ejecutarlo ~200 veces al mes gratis
- Con scraper semanal = 4 ejecuciones/mes = ✅ Más que suficiente

## 🎯 Ventajas

✅ Totalmente gratis
✅ No necesitas PC prendida
✅ Corre en la nube
✅ Logs automáticos
✅ Ejecución manual disponible
✅ Notificaciones por email si falla
