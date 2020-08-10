cd backend
docker build -t frontend-app:latest .
cd ..
cd frontend
docker build -t chat-service:latest .
kubectl config current-context