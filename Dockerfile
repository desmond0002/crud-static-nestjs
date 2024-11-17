# Используем официальный образ Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и pnpm-lock.yaml для установки зависимостей
COPY package.json pnpm-lock.yaml ./

# Устанавливаем pnpm и зависимости проекта
RUN npm install -g pnpm && pnpm install

# Копируем остальные файлы проекта
COPY . .

# Компилируем TypeScript в JavaScript
RUN pnpm run build

# Копируем скрипт и делаем его исполняемым
# COPY ./init.sh /init.sh
# RUN chmod +x /init.sh

# Открываем порт 3000 для доступа к приложению
EXPOSE 3000

# Устанавливаем entrypoint для выполнения инициализации при старте
# ENTRYPOINT ["/init.sh"]

# Запускаем приложение
CMD ["pnpm", "run", "start:prod"]
