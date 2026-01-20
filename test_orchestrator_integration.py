#!/usr/bin/env python3
"""
Simple orchestrator integration test
Tests that run_all.py can start all services and they respond
"""

import subprocess
import time
import sys
import requests
import signal

def main():
    print("="*70)
    print("🧪 Orchestrator Integration Test")
    print("="*70)
    print()
    
    orchestrator = None
    
    try:
        # Start orchestrator
        print("🚀 Starting orchestrator (run_all.py)...")
        if sys.platform == "win32":
            orchestrator = subprocess.Popen(
                [sys.executable, "run_all.py"],
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
            )
        else:
            orchestrator = subprocess.Popen([sys.executable, "run_all.py"])
        
        print(f"✅ Orchestrator started (PID: {orchestrator.pid})")
        
        # Wait for services to initialize
        print("\n⏳ Waiting 25 seconds for services to start...")
        time.sleep(25)
        
        # Test each service
        print("\n" + "="*70)
        print("🔍 Testing Services")
        print("="*70)
        print()
        
        services = {
            "Dashboard": "http://127.0.0.1:5000",
            "Backend API": "http://127.0.0.1:4000/health",
            "Frontend UI": "http://127.0.0.1:5173"
        }
        
        results = {}
        
        for name, url in services.items():
            print(f"Testing {name}...")
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    print(f"✅ {name} is accessible (status: {response.status_code})")
                    results[name] = True
                else:
                    print(f"❌ {name} returned status: {response.status_code}")
                    results[name] = False
            except Exception as e:
                print(f"❌ {name} is not accessible: {e}")
                results[name] = False
        
        # Print summary
        print("\n" + "="*70)
        print("📊 Test Results")
        print("="*70)
        print()
        
        for service, passed in results.items():
            status = "✅ PASS" if passed else "❌ FAIL"
            print(f"{status}: {service}")
        
        all_passed = all(results.values())
        
        if all_passed:
            print("\n✅ All services started successfully via orchestrator!")
            print("\n📋 Manual Testing Instructions:")
            print("   1. Open http://localhost:5000 in your browser")
            print("   2. Verify dashboard page loads with service cards")
            print("   3. Click 'CoastalWatch Frontend' button")
            print("   4. Verify frontend opens in new tab")
            print("   5. Click 'Backend API' button")
            print("   6. Verify health endpoint shows {\"status\":\"ok\"}")
            print("   7. Test frontend navigation and functionality")
            print("   8. Check browser console for Socket.io connection")
            print("   9. Return here and press Enter when done")
            print()
            input("Press Enter to stop all services...")
        else:
            print("\n❌ Some services failed to start")
        
        # Stop orchestrator
        print("\n🛑 Stopping orchestrator...")
        if sys.platform == "win32":
            orchestrator.send_signal(signal.CTRL_BREAK_EVENT)
        else:
            orchestrator.send_signal(signal.SIGINT)
        
        orchestrator.wait(timeout=15)
        print("✅ Orchestrator stopped cleanly")
        
        return all_passed
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
        if orchestrator:
            print("🛑 Stopping orchestrator...")
            try:
                if sys.platform == "win32":
                    orchestrator.send_signal(signal.CTRL_BREAK_EVENT)
                else:
                    orchestrator.send_signal(signal.SIGINT)
                orchestrator.wait(timeout=15)
            except:
                orchestrator.kill()
        return False
        
    except Exception as e:
        print(f"\n❌ Error during test: {e}")
        if orchestrator:
            print("🛑 Stopping orchestrator...")
            try:
                orchestrator.terminate()
                orchestrator.wait(timeout=10)
            except:
                orchestrator.kill()
        return False

if __name__ == "__main__":
    success = main()
    print("\n" + "="*70)
    if success:
        print("✅ Integration test completed successfully!")
    else:
        print("❌ Integration test failed")
    print("="*70)
    sys.exit(0 if success else 1)
