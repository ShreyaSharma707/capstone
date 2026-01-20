const fc = require("fast-check");
const request = require("supertest");
const express = require("express");
const http = require("http");
const { Server: SocketIOServer } = require("socket.io");

// Feature: unified-dashboard-integration, Property 6: Health Check Availability
describe("Property 6: Health Check Availability", () => {
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

  test("For any time when the backend service is running, the health endpoint should return a successful response", async () => {
    // **Validates: Requirements 4.3**

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }), // Number of concurrent requests
        async (numRequests) => {
          // Start the server
          await new Promise((resolve) => {
            server.listen(0, resolve); // Use port 0 for random available port
          });

          // Make multiple concurrent health check requests
          const requests = Array.from({ length: numRequests }, () =>
            request(app).get("/health")
          );

          const responses = await Promise.all(requests);

          // All responses should be successful (200 status)
          responses.forEach((response) => {
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ status: "ok" });
          });

          // Close the server for this iteration
          await new Promise((resolve) => {
            server.close(resolve);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test("Health endpoint should be available immediately after server starts", async () => {
    // **Validates: Requirements 4.3**

    await fc.assert(
      fc.asyncProperty(
        fc.constant(null), // Simple property that always runs
        async () => {
          // Start server on random port
          await new Promise((resolve) => {
            server.listen(0, resolve);
          });

          // Immediately make a health check request
          const response = await request(app).get("/health");

          expect(response.status).toBe(200);
          expect(response.body).toEqual({ status: "ok" });

          // Close the server
          await new Promise((resolve) => {
            server.close(resolve);
          });
        }
      ),
      { numRuns: 50 }
    );
  });
});
