@echo off
echo Testing Slider API...
echo.

echo 1. Testing /api/public/sliders endpoint:
curl -X GET "http://192.168.1.8:8000/api/public/sliders" -H "Accept: application/json" -v

echo.
echo.
echo 2. Testing /api/home-settings endpoint:
curl -X GET "http://192.168.1.8:8000/api/home-settings" -H "Accept: application/json" -v

pause
