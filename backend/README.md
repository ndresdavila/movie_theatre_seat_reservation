# Movie Theatre Seat Reservation

Este repositorio contiene dos aplicaciones:

1. **Backend**: API REST construida con .NET 8 y PostgreSQL.
2. **Frontend**: Single Page Application construida con React y Tailwind CSS.

Código fuente: https://github.com/ndresdavila/movie_theatre_seat_reservation.git

---

## 🔗 Clonar el repositorio

```bash
git clone https://github.com/ndresdavila/movie_theatre_seat_reservation.git
cd movie_theatre_seat_reservation
```

---

## ⚙️ Backend (.NET 8 C#)

La carpeta del backend está en `backend/CinemaReservation.API`.

### Pre-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- Docker (para levantar PostgreSQL en contenedor) y Docker Compose opcionalmente

### Configuración de la base de datos

En lugar de instalar PostgreSQL localmente, puedes usar Docker para levantar un contenedor:

```bash
docker run -d --name postgres-cinema \
  -e POSTGRES_DB=cinema_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=asdf \
  -p 5432:5432 \
  postgres:15
```

Tu `appsettings.json` ya está configurado para conectar a `localhost:5432`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=cinema_db;Username=postgres;Password=asdf"
  }
}
```

### Restaurar y ejecutar

```bash
cd backend/CinemaReservation.API

# Restaurar paquetes NuGet
dotnet restore

# Aplicar migraciones y crear la base de datos
dotnet ef database update

# Ejecutar la API en el puerto 5096
dotnet run --urls "http://localhost:5096"
```

> La API estará disponible en `http://localhost:5096`.

### Swagger UI

En modo desarrollo, puedes acceder a:

```
http://localhost:5096/swagger
```

---

## 🖥️ Frontend (React + Tailwind)

La carpeta del frontend está en `backend/client`.

### Pre-requisitos

- [Node.js LTS](https://nodejs.org/)
- npm (incluido con Node)

### Instalar dependencias y ejecutar

```bash
cd backend/client

# Instalar paquetes npm
npm install

# Iniciar en modo desarrollo
npm run start
```

> La aplicación React correrá en `http://localhost:3000` y consumirá la API en `http://localhost:5096`.

---

## 🚀 Tests

### Backend (xUnit)

El proyecto de tests está en `backend/CinemaReservationTests`. Para ejecutar:

```bash
cd backend/CinemaReservationTests

# Ejecutar tests con archivo de configuración
dotnet test --settings test.runsettings
```

> `test.runsettings` desactiva paralelización para evitar conflictos de base de datos.

---

## 📄 Notas finales

- Asegurarse de que el contenedor PostgreSQL esté corriendo antes de levantar la API.

¡Listo! Ahora puede ejecutar y probar toda la aplicación de reserva de butacas de cine.
