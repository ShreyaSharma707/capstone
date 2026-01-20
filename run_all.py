#!/usr/bin/env python3
"""
CoastalWatch Orchestrator
Launches and manages all services (backend, frontend, dashboard)
"""

import subprocess
import sys
import time
import signal
import os

# Track all spawned processes
processes = []

# ANSI color codes for terminal output
class Colors:
    """ANSI color codes for terminal output"""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    
    @staticmethod
    def is_supported():
        """Check if terminal supports colors"""
        # Windows 10+ supports ANSI colors
        if sys.platform == "win32":
            try:
                import ctypes
                kernel32 = ctypes.windll.kernel32
                kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
                return True
            except:
                return False
        return True

# Check color support
USE_COLORS = Colors.is_supported()

def colorize(text, color):
    """Add color to text if supported"""
    if USE_COLORS:
        return f"{color}{text}{Colors.ENDC}"
    return text

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully by terminating all services"""
    print()
    print(colorize("=" * 60, Colors.YELLOW))
    print(colorize("🛑 Shutting down all services...", Colors.YELLOW))
    print(colorize("=" * 60, Colors.YELLOW))
    print()
    
    shutdown_count = 0
    for p in processes:
        try:
            if p.poll() is None:  # Process is still running
                print(f"   Stopping process {colorize(str(p.pid), Colors.CYAN)}...")
                p.terminate()
                p.wait(timeout=5)
                shutdown_count += 1
        except subprocess.TimeoutExpired:
            print(f"   Force killing process {colorize(str(p.pid), Colors.RED)}...")
            p.kill()
            shutdown_count += 1
        except Exception as e:
            print(colorize(f"   Error terminating process: {e}", Colors.RED))
    
    print()
    print(colorize(f"✅ Successfully stopped {shutdown_count} service(s)", Colors.GREEN))
    print(colorize("=" * 60, Colors.GREEN))
    print()
    sys.exit(0)

def start_service(name, command, cwd=None):
    """
    Start a service and track its process
    
    Args:
        name: Display name of the service
        command: Command to execute (string or list)
        cwd: Working directory for the command
    
    Returns:
        subprocess.Popen object
    """
    print(f"🚀 Starting {colorize(name, Colors.CYAN)}...")
    
    try:
        # Handle Windows vs Unix command differences
        if sys.platform == "win32":
            # On Windows, use shell=True for string commands
            if isinstance(command, list):
                command = " ".join(command)
            process = subprocess.Popen(
                command,
                cwd=cwd,
                shell=True,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
            )
        else:
            # On Unix, prefer shell=False with list commands
            if isinstance(command, str):
                command = command.split()
            process = subprocess.Popen(
                command,
                cwd=cwd,
                shell=False
            )
        
        processes.append(process)
        print(f"✅ {colorize(name, Colors.GREEN)} started {colorize(f'(PID: {process.pid})', Colors.CYAN)}")
        return process
        
    except Exception as e:
        print(colorize(f"❌ Failed to start {name}: {e}", Colors.RED))
        return None

def main():
    """Main orchestrator function"""
    print()
    print(colorize("=" * 60, Colors.BLUE))
    print(colorize("🌊 CoastalWatch Integrated System", Colors.BOLD + Colors.BLUE))
    print(colorize("=" * 60, Colors.BLUE))
    print()
    
    # Register signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    if sys.platform != "win32":
        signal.signal(signal.SIGTERM, signal_handler)
    
    # Start backend service
    start_service("Backend API", "npm start", cwd="backend")
    time.sleep(2)  # Give backend time to initialize
    
    # Start frontend service
    start_service("Frontend UI", "npm run dev", cwd="frontend")
    time.sleep(2)  # Give frontend time to initialize
    
    # Start dashboard service
    start_service("Dashboard", [sys.executable, "app.py"], cwd="dashboard")
    time.sleep(1)  # Give dashboard time to initialize
    
    print()
    print(colorize("=" * 60, Colors.GREEN))
    print(colorize("✅ All services started successfully!", Colors.BOLD + Colors.GREEN))
    print(colorize("=" * 60, Colors.GREEN))
    print()
    print(colorize("📍 Service URLs:", Colors.BOLD))
    print(f"   {colorize('Dashboard:', Colors.CYAN)}    {colorize('http://127.0.0.1:5000', Colors.UNDERLINE)}")
    print(f"   {colorize('Backend API:', Colors.CYAN)}  {colorize('http://127.0.0.1:4000', Colors.UNDERLINE)}")
    print(f"   {colorize('Frontend UI:', Colors.CYAN)}  {colorize('http://127.0.0.1:5173', Colors.UNDERLINE)}")
    print()
    print(colorize("💡 Press Ctrl+C to stop all services", Colors.YELLOW))
    print(colorize("=" * 60, Colors.GREEN))
    print()
    
    # Keep script running and monitor processes
    try:
        while True:
            time.sleep(1)
            # Check if any process has died unexpectedly
            for i, p in enumerate(processes):
                if p.poll() is not None:
                    print(colorize(f"⚠️  Service process {p.pid} has stopped unexpectedly", Colors.YELLOW))
    except KeyboardInterrupt:
        signal_handler(None, None)

if __name__ == "__main__":
    main()
