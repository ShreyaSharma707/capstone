import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fc from "fast-check";
import { API_BASE_URL, API_ENDPOINTS, apiCall } from "./api.js";

describe("API Configuration", () => {
  beforeEach(() => {
    // Clear any environment variables
    vi.unstubAllEnvs();
    localStorage.clear();
  });

  describe("Property Tests", () => {
    it("Property 5: API Configuration Consistency - For any API endpoint, the base URL should match the backend service URL", () => {
      // Feature: unified-dashboard-integration, Property 5: API Configuration Consistency
      // Validates: Requirements 5.1

      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(API_ENDPOINTS.auth.login),
            fc.constant(API_ENDPOINTS.auth.register),
            fc.constant(API_ENDPOINTS.auth.logout),
            fc.constant(API_ENDPOINTS.sensors),
            fc.constant(API_ENDPOINTS.alerts),
            fc.constant(API_ENDPOINTS.reports),
            fc.constant(API_ENDPOINTS.users),
            fc.constant(API_ENDPOINTS.health)
          ),
          (endpoint) => {
            // For any endpoint, when we construct the full URL, it should use the consistent base URL
            const fullUrl = `${API_BASE_URL}${endpoint}`;

            // The base URL should be consistent (either from env var or fallback)
            const expectedBaseUrl =
              import.meta.env.VITE_API_URL || "http://localhost:4000";

            // Verify the URL starts with the expected base URL
            expect(fullUrl.startsWith(expectedBaseUrl)).toBe(true);

            // Verify the endpoint is properly appended
            expect(fullUrl).toBe(`${expectedBaseUrl}${endpoint}`);

            // Verify the base URL matches our API_BASE_URL constant
            expect(API_BASE_URL).toBe(expectedBaseUrl);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Unit Tests", () => {
    it("should resolve API_BASE_URL correctly with environment variable", () => {
      // Test that API_BASE_URL uses environment variable when available
      expect(API_BASE_URL).toBe("http://localhost:4000");
    });

    it("should format API endpoints correctly", () => {
      // Test that all endpoints are properly formatted
      expect(API_ENDPOINTS.auth.login).toBe("/api/auth/login");
      expect(API_ENDPOINTS.auth.register).toBe("/api/auth/register");
      expect(API_ENDPOINTS.auth.logout).toBe("/api/auth/logout");
      expect(API_ENDPOINTS.sensors).toBe("/api/sensors");
      expect(API_ENDPOINTS.alerts).toBe("/api/alerts");
      expect(API_ENDPOINTS.reports).toBe("/api/reports");
      expect(API_ENDPOINTS.users).toBe("/api/users");
      expect(API_ENDPOINTS.health).toBe("/health");
    });

    it("should add authorization header when token exists", async () => {
      // Mock fetch
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
      global.fetch = mockFetch;

      // Set token in localStorage
      localStorage.setItem("token", "test-token");

      // Make API call
      await apiCall("/test-endpoint");

      // Verify fetch was called with authorization header
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4000/test-endpoint",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
            "Content-Type": "application/json",
          }),
        })
      );
    });

    it("should not add authorization header when token does not exist", async () => {
      // Mock fetch
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
      global.fetch = mockFetch;

      // Ensure no token in localStorage
      localStorage.removeItem("token");

      // Make API call
      await apiCall("/test-endpoint");

      // Verify fetch was called without authorization header
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4000/test-endpoint",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );

      // Verify authorization header is not present
      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers).not.toHaveProperty("Authorization");
    });

    it("should handle API call errors properly", async () => {
      // Mock fetch to return error response
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: "Not Found",
      });
      global.fetch = mockFetch;

      // Expect API call to throw error
      await expect(apiCall("/test-endpoint")).rejects.toThrow(
        "API call failed: Not Found"
      );
    });

    it("should handle network errors properly", async () => {
      // Mock fetch to throw network error
      const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
      global.fetch = mockFetch;

      // Expect API call to throw error
      await expect(apiCall("/test-endpoint")).rejects.toThrow("Network error");
    });
  });
});
