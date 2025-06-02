#!/bin/bash

#export PATH=/home/orin/.local/bin:$PATH
export PYTHONPATH=/usr/local/lib/python3.10/site-packages/:$PYTHONPATH

# Thêm các đường dẫn cần thiết vào PATH
export PATH=/usr/local/cuda/bin:$PATH

# Đóng cổng 8000 (nếu có)
#fuser -k 8000/tcp > /dev/null 2>&1
# Hoặc sử dụng lsof:
# lsof -ti :8000 | xargs kill -9 > /dev/null 2>&1

# Function to check if a port is open
is_port_open() {
  local port=$1
  if nc -z localhost "$port" > /dev/null 2>&1; then
    return 0  # Port is open
  else
    return 1  # Port is not open
  fi
}

# Activate the virtual environment
#source /home/hung/miniconda3/bin/activate UAV

# Navigate to the backend directory
cd /home/orin/hungbx/code_may_tram_01-11-2024_Thermal_V2_deploy

# Start or check the Django server
if ! is_port_open 8000; then
  #uvicorn Powerline_UAV_Server.asgi:application --port 8000 &
  uvicorn Powerline_UAV_Server.asgi:application --port 8000 > log/all_output.log 2>&1 &
  while ! is_port_open 8000; do
    sleep 1
  done
  echo "Port 8000 opened successfully." # Thông báo cổng được mở thành công
else
  echo "Port 8000 already exists." # Thông báo cổng đã tồn tại
fi

# Close the terminal after the services stop
echo "Backend server started successfully."
exit 0
