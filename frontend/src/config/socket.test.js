import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock socket.io-client
const mockSocket = {
  on: vi.fn(),
  disconnect: vi.fn(),
  connected: false,
};

const mockIo = vi.fn(() => mockSocket);

vi.mock("socket.io-client", () => ({
  io: mockIo,
}));

// Import after mocking
const { initializeSocket, getSocket, disconnectSocket } =
  await import("./socket.js");

describe("Socket.io Configuration", () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    mockSocket.on.mockClear();
    mockSocket.disconnect.mockClear();
    mockIo.mockClear();

    // Reset socket state by calling disconnectSocket
    disconnectSocket();
  });

  describe("Unit Tests", () => {
    it("should initialize socket with correct URL", () => {
      const socket = initializeSocket();

      // Verify io was called with correct URL and options
      expect(mockIo).toHaveBeenCalledWith("http://localhost:4000", {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      // Verify socket is returned
      expect(socket).toBe(mockSocket);
    });

    it("should apply reconnection settings correctly", () => {
      initializeSocket();

      // Verify reconnection settings are applied
      expect(mockIo).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
        })
      );
    });

    it("should set up connection event handlers", () => {
      initializeSocket();

      // Verify event handlers are set up
      expect(mockSocket.on).toHaveBeenCalledWith(
        "connect",
        expect.any(Function)
      );
      expect(mockSocket.on).toHaveBeenCalledWith(
        "disconnect",
        expect.any(Function)
      );
      expect(mockSocket.on).toHaveBeenCalledWith(
        "connection",
        expect.any(Function)
      );
    });

    it("should return existing socket on subsequent calls", () => {
      const socket1 = initializeSocket();
      const socket2 = initializeSocket();

      // Should only call io once
      expect(mockIo).toHaveBeenCalledTimes(1);

      // Should return same socket instance
      expect(socket1).toBe(socket2);
      expect(socket1).toBe(mockSocket);
    });

    it("should return socket instance with getSocket", () => {
      initializeSocket();
      const socket = getSocket();

      expect(socket).toBe(mockSocket);
    });

    it("should return null when socket not initialized", () => {
      const socket = getSocket();
      expect(socket).toBeNull();
    });

    it("should disconnect and clean up properly", () => {
      initializeSocket();

      // Verify socket exists
      expect(getSocket()).toBe(mockSocket);

      // Disconnect
      disconnectSocket();

      // Verify disconnect was called
      expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);

      // Verify socket is null after disconnect
      expect(getSocket()).toBeNull();
    });

    it("should handle disconnect when socket is null", () => {
      // Call disconnect without initializing socket
      disconnectSocket();

      // Should not throw error and disconnect should not be called
      expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });

    it("should log connection events", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      initializeSocket();

      // Get the connect handler and call it
      const connectHandler = mockSocket.on.mock.calls.find(
        (call) => call[0] === "connect"
      )[1];
      connectHandler();

      // Get the disconnect handler and call it
      const disconnectHandler = mockSocket.on.mock.calls.find(
        (call) => call[0] === "disconnect"
      )[1];
      disconnectHandler();

      // Get the connection handler and call it
      const connectionHandler = mockSocket.on.mock.calls.find(
        (call) => call[0] === "connection"
      )[1];
      connectionHandler({ message: "test" });

      // Verify console logs
      expect(consoleSpy).toHaveBeenCalledWith("Connected to backend socket");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Disconnected from backend socket"
      );
      expect(consoleSpy).toHaveBeenCalledWith("Socket connection message:", {
        message: "test",
      });

      consoleSpy.mockRestore();
    });
  });
});
