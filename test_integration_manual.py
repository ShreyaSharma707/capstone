#!/usr/bin/env python3
"""
Manual Integration Testing Script
Tests the complete integration of all services
"""

import subprocess
import time
import sys
import requests
import signal

def test_service_health(name, url, timeout=30):
    """Test if a service is healthy by checking its endpoint"""
    print(f"\n🔍 Testing {name} at {url}...")
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {name} is healthy (status: {response.status_code})")
                return True
        except requests.exceptions.RequestException as e:
            print(f"⏳ Waiting for {name}... ({int(time.time() - start_time)}s)")
            time.sleep(2)
    
    print(f"❌ {name} failed to start within {timeout}s")
    return False

def main():
    print("=" * 70)
    print("🧪 CoastalWatch Integration Testing")
    print("=" * 70)
    print()
    print("This script will:")
    print("1. Start all services using run_all.py")
    print("2. Verify each service is accessible")
    print("3. Test service endpoints")
    print("4. Provide manual testing instructions")
    print()
    input("Press Enter to start the integration test...")
    
    # Start the orchestrator
    print("\n🚀 Starting orchestrator (run_all.py)...")
    print("=" * 70)
    
    try:
        # Start run_all.py in a subprocess
        if sys.platform == "win32":
            orchestrator = subprocess.Popen(
                [sys.executable, "run_all.py"],
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
            )
        else:
            orchestrator = subprocess.Popen([sys.executable, "run_all.py"])
        
        print(f"✅ Orchestrator started (PID: {orchestrator.pid})")
        
        # Wait for services to start
        print("\n⏳ Waiting for services to initialize (15 seconds)...")
        time.sleep(15)
        
        # Test each service
        print("\n" + "=" * 70)
        print("🔍 Testing Service Health")
        print("=" * 70)
        
        services = {
            "Dashboard": "http://127.0.0.1:5000",
            "Backend API": "http://127.0.0.1:4000/health",
            "Frontend UI": "http://127.0.0.1:5173"
        }
        
        all_healthy = True
        for name, url in services.items():
            if not test_service_health(name, url):
                all_healthy = False
        
        if all_healthy:
            print("\n" + "=" * 70)
            print("✅ All services are running!")
            print("=" * 70)
            print()
            print("📋 Manual Testing Checklist:")
            print()
            print("1. ✓ Dashboard (http://localhost:5000)")
            print("   - Open in browser")
            print("   - Verify page loads with service cards")
            print("   - Click 'CoastalWatch Frontend' button")
            print("   - Verify frontend opens in new tab")
            print("   - Click 'Backend API' button")
            print("   - Verify health endpoint shows {\"status\":\"ok\"}")
            print()
            print("2. ✓ Frontend (http://localhost:5173)")
            print("   - Verify navigation works")
            print("   - Test forms (if any)")
            print("   - Test map functionality")
            print("   - Check browser console for errors")
            print()
            print("3. ✓ Backend API (http://localhost:4000)")
            print("   - Health endpoint returns 200")
            print("   - API endpoints are accessible")
            print()
            print("4. ✓ Socket.io Real-time Updates")
            print("   - Check browser console for socket connection")
            print("   - Look for 'Connected to backend socket' message")
            print()
            print("=" * 70)
            print()
            print("When you're done testing, press Ctrl+C to stop all services")
            print()
            
            # Keep running until user stops
            try:
                orchestrator.wait()
            except KeyboardInterrupt:
                print("\n\n🛑 Stopping all services...")
                if sys.platform == "win32":
                    orchestrator.send_signal(signal.CTRL_BREAK_EVENT)
                else:
                    orchestrator.send_signal(signal.SIGINT)
                orchestrator.wait(timeout=10)
                print("✅ All services stopped cleanly")
        else:
            print("\n❌ Some services failed to start")
            print("Stopping orchestrator...")
            orchestrator.terminate()
            orchestrator.wait(timeout=10)
            sys.exit(1)
            
    except Exception as e:
        print(f"\n❌ Error during integration test: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
