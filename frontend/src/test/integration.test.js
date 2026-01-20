import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { apiCall, API_ENDPOINTS, API_BASE_URL } from "../config/api";
import {
  initializeSocket,
  getSocket,
  disconnectSocket,
} from "../config/socket";

// Mock fetch for API tests
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock socket.io-client for socket tests
vi.mock("socket.io-client", () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn(),
    connected: true,
  })),
}));

describe("Frontend-Backend Integration Tests", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    disconnectSocket();
  });

  describe("API Communication", () => {
    it("should successfully make API calls when backend is running", async () => {
      // Mock successful API response
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true, data: [] }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await apiCall(API_ENDPOINTS.reports);

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}${API_ENDPOINTS.reports}`,
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
      expect(result).toEqual({ success: true, data: [] });
    });

    it("should include authorization header when token exists", async () => {
      const testToken = "test-jwt-token";
      localStorage.setItem("token", testToken);

      const mockResponse = {
        ok: true,
        json: async () => ({ success: true }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      await apiCall(API_ENDPOINTS.reports);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: `Bearer ${testToken}`,
          }),
        })
      );
    });

    it("should handle API errors when backend is unavailable", async () => {
      // Mock network error
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(apiCall(API_ENDPOINTS.reports)).rejects.toThrow(
        "Network error"
      );
    });

    it("should handle HTTP error responses", async () => {
      // Mock HTTP error response
      const mockResponse = {
        ok: false,
        statusText: "Internal Server Error",
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(apiCall(API_ENDPOINTS.reports)).rejects.toThrow(
        "API call failed: Internal Server Error"
      );
    });

    it("should make POST requests with correct data", async () => {
      const testData = {
        type: "Oil Spill",
        description: "Test report",
        location: "Test location",
      };

      const mockResponse = {
        ok: true,
        json: async () => ({ success: true, id: 123 }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      await apiCall(API_ENDPOINTS.reports, {
        method: "POST",
        body: JSON.stringify(testData),
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}${API_ENDPOINTS.reports}`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(testData),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });
  });

  describe("Socket.io Communication", () => {
    it("should initialize socket connection", () => {
      const socket = initializeSocket();

      expect(socket).toBeDefined();
      expect(getSocket()).toBe(socket);
    });

    it("should return same socket instance on multiple calls", () => {
      const socket1 = initializeSocket();
      const socket2 = initializeSocket();

      expect(socket1).toBe(socket2);
    });

    it("should disconnect socket properly", () => {
      const socket = initializeSocket();
      const disconnectSpy = vi.spyOn(socket, "disconnect");

      disconnectSocket();

      expect(disconnectSpy).toHaveBeenCalled();
      expect(getSocket()).toBeNull();
    });

    it("should set up event listeners on socket", () => {
      const socket = initializeSocket();
      const onSpy = vi.spyOn(socket, "on");

      // The socket should have event listeners set up
      expect(onSpy).toHaveBeenCalledWith("connect", expect.any(Function));
      expect(onSpy).toHaveBeenCalledWith("disconnect", expect.any(Function));
      expect(onSpy).toHaveBeenCalledWith("connection", expect.any(Function));
    });
  });

  describe("Error Handling", () => {
    it("should handle network failures gracefully", async () => {
      // Mock network failure
      mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));

      try {
        await apiCall(API_ENDPOINTS.health);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toBe("Failed to fetch");
      }
    });

    it("should handle malformed JSON responses", async () => {
      const mockResponse = {
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(apiCall(API_ENDPOINTS.reports)).rejects.toThrow(
        "Invalid JSON"
      );
    });

    it("should handle 404 responses", async () => {
      const mockResponse = {
        ok: false,
        statusText: "Not Found",
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(apiCall("/api/nonexistent")).rejects.toThrow(
        "API call failed: Not Found"
      );
    });

    it("should handle 500 responses", async () => {
      const mockResponse = {
        ok: false,
        statusText: "Internal Server Error",
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(apiCall(API_ENDPOINTS.reports)).rejects.toThrow(
        "API call failed: Internal Server Error"
      );
    });
  });

  describe("Configuration Validation", () => {
    it("should use correct API base URL", () => {
      expect(API_BASE_URL).toBe("http://localhost:4000");
    });

    it("should have all required API endpoints defined", () => {
      expect(API_ENDPOINTS.auth.login).toBe("/api/auth/login");
      expect(API_ENDPOINTS.auth.register).toBe("/api/auth/register");
      expect(API_ENDPOINTS.auth.logout).toBe("/api/auth/logout");
      expect(API_ENDPOINTS.sensors).toBe("/api/sensors");
      expect(API_ENDPOINTS.alerts).toBe("/api/alerts");
      expect(API_ENDPOINTS.reports).toBe("/api/reports");
      expect(API_ENDPOINTS.users).toBe("/api/users");
      expect(API_ENDPOINTS.health).toBe("/health");
    });

    it("should construct correct URLs for API calls", async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true }),
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      await apiCall(API_ENDPOINTS.alerts);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:4000/api/alerts",
        expect.any(Object)
      );
    });
  });
});
