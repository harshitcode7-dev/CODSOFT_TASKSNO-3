@echo off
echo Setting up MarketHub Database...
echo.

echo Setting PostgreSQL password...
set PGPASSWORD=password00

echo.
echo Creating database markethub...
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE markethub;"

echo.
echo Running schema...
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d markethub -f "D:\career-hub\markethub\database\schema.sql"

echo.
echo Running seed data...
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d markethub -f "D:\career-hub\markethub\database\seed.sql"

echo.
echo Database setup complete!
echo.
pause
