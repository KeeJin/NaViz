# NaViz

Web visualiser for robot navigation

## How to run setup

1. Start the server

```bash
cd docker/
docker compose up
```

2. Start up tailwind

```bash
cd NaViz/
npx tailwindcss -i ./src/App.css -o output.css --watch
```

3. Start up frontend

```bash
cd NaViz/
npm run dev
```
