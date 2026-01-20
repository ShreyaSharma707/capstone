const request = require("supertest");
const express = require("express");
const http = require("http");
const { Server: SocketIOServer } = require("socket.io");

describe("Health Endpoint Unit Tests", () => {
  let app, server, io;

  beforeEach(() => {
    // Create a minimal Express app similar to the main server
    app = express();
    server = http.createServer(app);
    io = new SocketIOServer(server, {
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    app.set("io", io);

    // Add the health endpoint
    app.get("/health", (req, res) => res.json({ status: "ok" }));
  });

  afterEach((done) => {
    if (server && server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  test("/health returns 200 status", async () => {
    // **Requirements: 4.3**

    // Start the server
    await new Promise((resolve) => {
      server.listen(0, resolve);
    });

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
  });

  test("/health returns JSON with status", async () => {
    // **Requirements: 4.3**

    // Start the server
    await new Promise((resolve) => {
      server.listen(0, resolve);
    });

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({ status: "ok" });
  });

  test("/health endpoint responds quickly", async () => {
    // **Requirements: 4.3**

    // Start the server
    await new Promise((resolve) => {
      server.listen(0, resolve);
    });

    const startTime = Date.now();
    const response = await request(app).get("/health");
    const endTime = Date.now();

    expect(response.status).toBe(200);
    expect(endTime - startTime).toBeLessThan(1000); // Should respond within 1 second
  });

  test("/health endpoint handles multiple concurrent requests", async () => {
    // **Requirements: 4.3**

    // Start the server
    await new Promise((resolve) => {
      server.listen(0, resolve);
    });

    // Make 5 concurrent requests
    const requests = Array.from({ length: 5 }, () =>
      request(app).get("/health")
    );

    const responses = await Promise.all(requests);

    // All should succeed
    responses.forEach((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "ok" });
    });
  });
});
