## ---- **Why this project exists**

Backend systems rarely fail because of algorithmic complexity.
More often, failures emerge when user-facing APIs are burdened with executing long-running or failure-prone tasks
synchronously.
As traffic grows or external dependencies degrade,
these systems exhibit predictable symptoms: elevated latency, cascading failures, and operational fragility.
In building a Node.js workflow with RabbitMQ, several practical lessons emerged that
highlight how asynchronous messaging can enforce clear responsibility boundaries, improve reliability, and simplify
operational reasoning.

```
Project structure
├── api/
│   ├── Dockerfile
│   ├── src/
│   └── package.json
│
├── worker/
│   ├── Dockerfile
│   ├── src/
│   └── package.json
│
├── docker-compose.yml
└── README.md
```