# 🌩️ CloudShipX – Localhost-Powered Website Deployment Platform

CloudShipX is a Vercel-inspired local deployment platform that simulates the experience of deploying and testing websites—directly on your own machine. It connects three independent services that work together to fetch code from GitHub, build React projects locally, and serve them dynamically on `127.0.0.1`.

---

## 🚀 How It Works

CloudShipX is composed of **three core microservices**, each responsible for a stage in the deployment lifecycle:

---

### 📦 1. `upload` – GitHub Fetch & Dispatch

- Accepts a **GitHub repository URL** (only public repos supported).
- Generates a **random project ID** to uniquely identify each upload.
- Uploads the code to an object store or internal service (simulating S3).
- Publishes an `uploaded` event/message via **Redis**.
- Hands off the project ID to the `deploy` service for the next stage.

---

### 🛠️ 2. `deploy` – Build Engine (React-only)

- Subscribes to messages from Redis (e.g., `uploaded` events).
- Clones the uploaded project.
- Builds the project locally using tools like `npm run build` (supports only **React** projects).
- Output is stored in a local `dist/` directory associated with the project ID.
- Marks the project as **ready** for serving.

**⚠️ Note:** Only React projects that build to static HTML/CSS/JS are currently supported.

---

### 🌐 3. `request-handler` – Serve the Built Project

 Acts as a reverse proxy/guard.
- Continuously listens for project availability ("Are you deployed yet?").
- Once built, you will get the URL generated.
- **You need to map the generated URL to your localhost (127.0.0.1) in your hosts file or access it directly via `localhost`.**
- Serves the static files from the `dist/` directory.

---
STRUCTURE OF PROJECT
cloudshipx/
|-- frontend/ #Frontned part created using shadcn for less complexity
├── vercel/ # Handles GitHub URL input and hands off to deploy
├── vercel-deploy/ # Builds React projects locally after upload
├── vercel-request-handler/ # Serves built files via localhost URLs
└── README.md
## 🧪 Local Setup 
- Clone the repo, take care of the build or dist folder it is typescript powered project so need to build first using tsc-b and then go inside build folder(it can be dist also) and run the index file
  ## 🙌 Contributing

Feel free to open issues or PRs to add features like:
- Custom domains (`project.localhost`)
- Live reload support
- Support for frameworks beyond React
- UI dashboard for deployments

---

## 📄 License

MIT License. Built for learning, exploring DevOps workflows, and simulating modern deployment systems locally.
