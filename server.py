#!/usr/bin/env python3
"""
Eye Hospital — Local Development & Mock API Server
Provides static file serving and appointment booking REST API.
Zero dependencies — uses Python standard library.
"""

import http.server
import socketserver
import json
import os
import sys
import uuid
from datetime import datetime

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
APPOINTMENTS_FILE = os.path.join(DIRECTORY, "appointments.json")

class EyeHospitalHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # API to view appointments for staff/admin
        if self.path == "/api/appointments":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            
            if os.path.exists(APPOINTMENTS_FILE):
                with open(APPOINTMENTS_FILE, "r", encoding="utf-8") as f:
                    data = f.read()
                self.wfile.write(data.encode("utf-8"))
            else:
                self.wfile.write(b"[]")
            return

        # Serve static files as normal
        return super().do_GET()

    def do_POST(self):
        # Appointment Booking API Endpoint
        if self.path == "/api/appointments":
            content_length = int(self.headers.get("Content-Length", 0))
            post_body = self.rfile.read(content_length)

            try:
                payload = json.loads(post_body.decode("utf-8"))
            except Exception as e:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Invalid JSON format"}).encode("utf-8"))
                return

            # Server-side validation
            required = ["fullName", "phoneNumber", "emailAddress", "serviceSelect", "appointmentDate", "appointmentTime"]
            missing = [k for k in required if not payload.get(k)]
            if missing:
                self.send_response(422)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": f"Missing fields: {', '.join(missing)}"}).encode("utf-8"))
                return

            # Generate appointment confirmation
            appointment_id = f"EYE-{datetime.now().strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"
            record = {
                "id": appointment_id,
                "created_at": datetime.now().isoformat(),
                "patient": {
                    "name": payload.get("fullName"),
                    "phone": payload.get("phoneNumber"),
                    "email": payload.get("emailAddress")
                },
                "appointment": {
                    "service": payload.get("serviceSelect"),
                    "doctor": payload.get("doctorSelect", "Any Available Specialist"),
                    "visit_type": payload.get("visitType", "First Time Visit"),
                    "date": payload.get("appointmentDate"),
                    "time": payload.get("appointmentTime")
                },
                "status": "Confirmed"
            }

            # Save to JSON file
            appointments = []
            if os.path.exists(APPOINTMENTS_FILE):
                try:
                    with open(APPOINTMENTS_FILE, "r", encoding="utf-8") as f:
                        appointments = json.load(f)
                except Exception:
                    appointments = []

            appointments.append(record)
            with open(APPOINTMENTS_FILE, "w", encoding="utf-8") as f:
                json.dump(appointments, f, indent=2)

            # Send response
            self.send_response(201)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            response = {
                "status": "success",
                "message": "Appointment booked successfully",
                "appointmentId": appointment_id,
                "data": record
            }
            self.wfile.write(json.dumps(response).encode("utf-8"))
            return

        # Fallback 404
        self.send_response(404)
        self.end_headers()

    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

def main():
    port = PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    server_address = ("", port)
    with socketserver.TCPServer(server_address, EyeHospitalHandler) as httpd:
        print("=" * 60)
        print(f" Eye Hospital Web Server running at: http://localhost:{port}/")
        print(f" Static files served from: {DIRECTORY}")
        print(f" REST API endpoint available at: http://localhost:{port}/api/appointments")
        print(" Press Ctrl+C to stop the server")
        print("=" * 60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully...")

if __name__ == "__main__":
    main()

