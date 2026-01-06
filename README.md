# Asynchronous Processing with Node.js and RabbitMQ

This project demonstrates how to design a **resilient, high-throughput asynchronous system** using **Node.js** and *
*RabbitMQ**,
modeled around a **sportsbook API** receiving thousands of requests per second.

The goal is to show how user-facing APIs can remain fast and reliable by offloading long-running or failure-prone work
to background workers via a message broker.

---

## Why This Project Exists

Synchronous APIs break down under load when they are responsible for:

* Heavy computation
* External service calls
* Retrying failed operations
* Handling unpredictable traffic spikes

This repository explores how **asynchronous messaging** creates clear responsibility boundaries between:

* **Intent** (API layer)
* **Coordination** (RabbitMQ)
* **Execution** (workers)

The result is a system that scales predictably, fails gracefully, and remains observable.

---

## Use Case: Sportsbook API at High Throughput

The reference use case is a sportsbook platform with multiple microservices:

* Thousands of even requests arrive per second
* Events, markets, boosts and selections updates
* Failures must not block or degrade the public APIs

### Flow:

1. API receives a request
2. Request is validated and published as a message
3. RabbitMQ buffers and routes the message
4. Workers process request asynchronously
5. Messages are acknowledged, retried, or dead-lettered (`ack` or `nack`)

---

## Architecture Overview

**Components:**

* **API Service (Node.js)**
  Accepts requests and publishes messages
* **RabbitMQ Broker**
  Handles routing, buffering, retries, and dead-lettering
* **Worker Services (Node.js)**
  Execute background processing asynchronously

Each component has an independent lifecycle and scaling strategy.

```
Client → API → Exchange → Queue → Worker
                         ↓
                       DLQ
```

---

## Key Concepts Demonstrated

### Asynchronous Responsibility Boundaries

* APIs never perform long-running work
* Workers own execution and failure handling
* Brokers coordinate, but never infer success

### Message Acknowledgement

* Messages are only removed after explicit `ack`
* Failed messages can be `nack`ed and retried or dead-lettered

### Dead Letter Queues (DLQ)

* Irrecoverable or expired messages are routed to a DLQ
* DLQ consumers can inspect, retry, or discard messages safely

### TTL (Time-To-Live)

* Messages can expire at the queue or message level
* Useful for time-sensitive operations (e.g. Selected markets, events and odd updates)

### At-Least-Once Delivery

* Duplicate delivery is expected
* Consumers must be idempotent
* Correctness lives at the consumer boundary

### Channel & Connection Management

* Single shared connection per service
* Channels are lightweight, scoped execution contexts

---

## Project Structure

```
├── api/ publishes messages to RabbitMQ
│   ├── Dockerfile
│   ├── src/
│   └── package.json
│
├── worker/ consumes and processes messages
│   ├── Dockerfile
│   ├── src/
│   └── package.json
│
├── rabbitmq/ exchange, queue, DLQ setup
│
├── docker-compose.yml
└── README.md
```

---

## Running the Project

### Prerequisites

* Docker & Docker Compose

### Start Services

```bash
docker-compose up
```

This starts:

* RabbitMQ
* API service
* Worker service(s)

---

## Observability & Failure Handling

The system is intentionally designed to surface failure:

* Messages remain visible until acknowledged
* DLQs capture permanent failures
* Queue depth reflects system pressure
* Workers can crash without message loss

This makes it easy to reason about load, retries, and bottlenecks.

---

## What This Project Is (and Isn’t)

✅ **This is:**

* A realistic async architecture example
* Suitable for high-throughput APIs
* Focused on correctness and failure handling

❌ **This is not:**

* A CRUD application
* A low-latency synchronous system
* An attempt at exactly-once delivery

---

## Key Takeaways

* Message brokers don’t execute logic, consumers do
* Failure paths are as important as success paths
* Exactly-once delivery is an illusion; idempotency is mandatory
* Asynchronous systems trade simplicity for resilience and scale
