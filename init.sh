#!/bin/bash
echo "init.sh!!!!!!!!!"
# Создаем директорию uploads, если она не существует
if [ ! -d "/app/dist/uploads" ]; then
  mkdir -p /app/dist/uploads
  echo "Папка /app/dist/uploads создана"
fi

# Копируем файлы в uploads, если папка пуста
if [ ! "$(ls -A /app/dist/uploads)" ]; then
  echo "Копирование файлов в /app/dist/uploads"
  cp /app/init-data.json /app/dist/init-data.json
  cp -r /app/uploads/* /app/dist/uploads 2>/dev/null || true
else
  echo "Папка /app/dist/uploads уже содержит файлы. Пропускаем копирование."
fi

# Запуск приложения
exec "$@"
