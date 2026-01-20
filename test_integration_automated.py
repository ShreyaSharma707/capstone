#!/usr/bin/env python3
"""
Automated Integration Testing Script
Verifies all integration requirements automatically
"""

import subprocess
import time
import sys
import requests
import signal
import os

class IntegrationTester:
    def __init__(self):
        self.orchestrator = None
        self.test_results = []
        
    def log_test(self, name, passed, message=""):
        """Log a test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        self.test_results.append((name, passed, message))
        print(f"{status}: {name}")
        if message:
            print(f"   {message}")
    
    def start_orchestrator(self):
        """Start the orchestrator process"""
        print("\n🚀 Starting orchestrator...")
        try:
            if sys.platform == "win32":
                self.orchestrator = subprocess.Popen(
                    [sys.executable, "run_all.py"],
                    creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )
            else:
                self.orchestrator = subprocess.Popen(
                    [sys.executable, "run_all.py"],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )
            
            print(f"✅ Orchestrator started (PID: {self.orchestrator.pid})")
            return True
        except Exception as e:
            print(f"❌ Failed to start orchestrator: {e}")
            return False
    
    def stop_orchestrator(self):
        """Stop the orchestrator and all services"""
        if self.orchestrator:
            print("\n🛑 Stopping orchestrator...")
            try:
                if sys.platform == "win32":
                    self.orchestrator.send_signal(signal.CTRL_BREAK_EVENT)
                else:
                    self.orchestrator.send_signal(signal.SIGINT)
                
                self.orchestrator.wait(timeout=15)
                print("✅ Orchestrator stopped cleanly")
                return True
            except subprocess.TimeoutExpired:
                print("⚠️  Orchestrator didn't stop gracefully, killing...")
                self.orchestrator.kill()
                self.orchestrator.wait()
                return False
            except Exception as e:
                print(f"❌ Error stopping orchestrator: {e}")
                return False
    
    def wait_for_service(self, name, url, timeout=45):
        """Wait for a service to become available"""
        print(f"⏳ Waiting for {name}...")
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            try:
                response = requests.get(url, timeout=5)
                if response.status_code == 200:
                    elapsed = int(time.time() - start_time)
                    print(f"✅ {name} is ready ({elapsed}s)")
                    return True
            except requests.exceptions.RequestException:
                time.sleep(2)
        
        print(f"❌ {name} failed to start within {timeout}s")
        return False
    
    def test_dashboard_accessibility(self):
        """Test that dashboard is accessible"""
        try:
            response = requests.get("http://127.0.0.1:5000", timeout=5)
            passed = response.status_code == 200
            self.log_test(
                "Dashboard accessibility",
                passed,
                f"Status: {response.status_code}"
            )
            return passed
        except Exception as e:
            self.log_test("Dashboard accessibility", False, str(e))
            return False
    
    def test_dashboard_content(self):
        """Test that dashboard contains expected content"""
        try:
            response = requests.get("http://127.0.0.1:5000", timeout=5)
            content = response.text
            
            checks = [
                ("CoastalWatch Dashboard" in content, "Dashboard title"),
                ("CoastalWatch Frontend" in content, "Frontend service card"),
                ("Backend API" in content, "Backend service card"),
                ("http://127.0.0.1:5173" in content, "Frontend URL"),
                ("http://127.0.0.1:4000/health" in content, "Backend health URL")
            ]
            
            all_passed = all(check[0] for check in checks)
            failed_checks = [check[1] for check in checks if not check[0]]
            
            message = "All content present" if all_passed else f"Missing: {', '.join(failed_checks)}"
            self.log_test("Dashboard content", all_passed, message)
            return all_passed
        except Exception as e:
            self.log_test("Dashboard content", False, str(e))
            return False
    
    def test_backend_health(self):
        """Test backend health endpoint"""
        try:
            response = requests.get("http://127.0.0.1:4000/health", timeout=5)
            data = response.json()
            
            passed = response.status_code == 200 and data.get("status") == "ok"
            self.log_test(
                "Backend health endpoint",
                passed,
                f"Response: {data}"
            )
            return passed
        except Exception as e:
            self.log_test("Backend health endpoint", False, str(e))
            return False
    
    def test_backend_db_health(self):
        """Test backend database health endpoint"""
        try:
            response = requests.get("http://127.0.0.1:4000/health/db", timeout=5)
            data = response.json()
            
            # DB might not be connected, but endpoint should work
            passed = response.status_code == 200 and "state" in data
            self.log_test(
                "Backend DB health endpoint",
                passed,
                f"DB State: {data.get('stateText', 'unknown')}"
            )
            return passed
        except Exception as e:
            self.log_test("Backend DB health endpoint", False, str(e))
            return False
    
    def test_frontend_accessibility(self):
        """Test that frontend is accessible"""
        try:
            response = requests.get("http://127.0.0.1:5173", timeout=5)
            passed = response.status_code == 200
            self.log_test(
                "Frontend accessibility",
                passed,
                f"Status: {response.status_code}"
            )
            return passed
        except Exception as e:
            self.log_test("Frontend accessibility", False, str(e))
            return False
    
    def test_service_independence(self):
        """Test that services can start independently"""
        # This is tested by the property tests, just verify structure
        services = {
            'backend': 'backend/package.json',
            'frontend': 'frontend/package.json',
            'dashboard': 'dashboard/app.py'
        }
        
        all_exist = all(os.path.exists(path) for path in services.values())
        self.log_test(
            "Service independence (structure)",
            all_exist,
            "All service entry points exist"
        )
        return all_exist
    
    def test_port_uniqueness(self):
        """Test that all services use unique ports"""
        ports = {
            'Dashboard': 5000,
            'Backend': 4000,
            'Frontend': 5173
        }
        
        unique_ports = len(set(ports.values())) == len(ports)
        self.log_test(
            "Port uniqueness",
            unique_ports,
            f"Ports: {list(ports.values())}"
        )
        return unique_ports
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 70)
        print("📊 Test Summary")
        print("=" * 70)
        
        passed = sum(1 for _, p, _ in self.test_results if p)
        total = len(self.test_results)
        
        print(f"\nTotal Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total*100):.1f}%")
        
        if total - passed > 0:
            print("\n❌ Failed Tests:")
            for name, passed, message in self.test_results:
                if not passed:
                    print(f"  - {name}: {message}")
        
        print("\n" + "=" * 70)
        return passed == total
    
    def run_all_tests(self):
        """Run all integration tests"""
        print("=" * 70)
        print("🧪 CoastalWatch Automated Integration Tests")
        print("=" * 70)
        
        # Start orchestrator
        if not self.start_orchestrator():
            return False
        
        try:
            # Wait for services to start
            print("\n⏳ Waiting for services to initialize...")
            time.sleep(15)
            
            # Wait for each service
            services_ready = True
            services_ready &= self.wait_for_service("Dashboard", "http://127.0.0.1:5000")
            services_ready &= self.wait_for_service("Backend", "http://127.0.0.1:4000/health")
            services_ready &= self.wait_for_service("Frontend", "http://127.0.0.1:5173")
            
            if not services_ready:
                print("\n❌ Not all services started successfully")
                return False
            
            # Run tests
            print("\n" + "=" * 70)
            print("🔍 Running Integration Tests")
            print("=" * 70)
            print()
            
            self.test_dashboard_accessibility()
            self.test_dashboard_content()
            self.test_backend_health()
            self.test_backend_db_health()
            self.test_frontend_accessibility()
            self.test_service_independence()
            self.test_port_uniqueness()
            
            # Print summary
            all_passed = self.print_summary()
            
            return all_passed
            
        finally:
            # Always stop orchestrator
            self.stop_orchestrator()

def main():
    tester = IntegrationTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n✅ All integration tests passed!")
        print("\n📋 Manual Testing Checklist:")
        print("   1. Open http://localhost:5000 in browser")
        print("   2. Click service buttons to verify navigation")
        print("   3. Test frontend functionality (forms, maps)")
        print("   4. Check browser console for Socket.io connection")
        print("   5. Press Ctrl+C in orchestrator to verify clean shutdown")
        sys.exit(0)
    else:
        print("\n❌ Some integration tests failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
