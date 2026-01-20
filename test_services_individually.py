#!/usr/bin/env python3
"""
Test starting each service individually
"""

import subprocess
import time
import sys
import requests
import signal

def test_service(name, command, cwd, url, timeout=30):
    """Test starting a single service"""
    print(f"\n{'='*70}")
    print(f"🧪 Testing {name}")
    print(f"{'='*70}")
    print(f"Command: {' '.join(command) if isinstance(command, list) else command}")
    print(f"Working Directory: {cwd}")
    print(f"Health Check URL: {url}")
    print()
    
    try:
        # Start the service
        print(f"🚀 Starting {name}...")
        if sys.platform == "win32":
            if isinstance(command, list):
                cmd = " ".join(command)
            else:
                cmd = command
            process = subprocess.Popen(
                cmd,
                cwd=cwd,
                shell=True,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
            )
        else:
            process = subprocess.Popen(
                command,
                cwd=cwd,
                shell=False
            )
        
        print(f"✅ {name} process started (PID: {process.pid})")
        
        # Wait for service to be ready
        print(f"⏳ Waiting for {name} to be ready...")
        start_time = time.time()
        ready = False
        
        while time.time() - start_time < timeout:
            try:
                response = requests.get(url, timeout=5)
                if response.status_code == 200:
                    elapsed = int(time.time() - start_time)
                    print(f"✅ {name} is ready! ({elapsed}s)")
                    print(f"   Status Code: {response.status_code}")
                    ready = True
                    break
            except requests.exceptions.RequestException as e:
                elapsed = int(time.time() - start_time)
                print(f"   Waiting... ({elapsed}s)")
                time.sleep(3)
        
        if not ready:
            print(f"❌ {name} did not become ready within {timeout}s")
        
        # Stop the service
        print(f"\n🛑 Stopping {name}...")
        try:
            if sys.platform == "win32":
                process.send_signal(signal.CTRL_BREAK_EVENT)
            else:
                process.send_signal(signal.SIGINT)
            
            process.wait(timeout=10)
            print(f"✅ {name} stopped cleanly")
        except subprocess.TimeoutExpired:
            print(f"⚠️  {name} didn't stop gracefully, killing...")
            process.kill()
            process.wait()
        
        return ready
        
    except Exception as e:
        print(f"❌ Error testing {name}: {e}")
        return False

def main():
    print("="*70)
    print("🧪 Individual Service Testing")
    print("="*70)
    print()
    print("This will test each service independently to verify:")
    print("- Service can start without other services")
    print("- Service responds to health checks")
    print("- Service can stop cleanly")
    print()
    
    results = {}
    
    # Test Dashboard
    results['Dashboard'] = test_service(
        "Dashboard",
        [sys.executable, "app.py"],
        "dashboard",
        "http://127.0.0.1:5000",
        timeout=15
    )
    
    time.sleep(2)
    
    # Test Backend
    results['Backend'] = test_service(
        "Backend API",
        "npm start",
        "backend",
        "http://127.0.0.1:4000/health",
        timeout=45
    )
    
    time.sleep(2)
    
    # Test Frontend
    results['Frontend'] = test_service(
        "Frontend UI",
        "npm run dev",
        "frontend",
        "http://127.0.0.1:5173",
        timeout=30
    )
    
    # Print summary
    print("\n" + "="*70)
    print("📊 Individual Service Test Summary")
    print("="*70)
    print()
    
    for service, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {service}")
    
    all_passed = all(results.values())
    print()
    if all_passed:
        print("✅ All services can start independently!")
    else:
        print("❌ Some services failed to start")
    
    print("="*70)
    return all_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
