#!/bin/bash

# Build and deploy todo app to Kubernetes with PostgreSQL

echo "🚀 Starting minikube if not running..."
minikube status > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "🔄 Starting minikube..."
    minikube start
    echo "⏳ Waiting for minikube to be ready..."
    minikube status
fi

echo "🔧 Configuring Docker to use minikube..."
eval $(minikube docker-env)

echo "🚀 Building Docker images..."

# Build backend image
echo "📦 Building backend image..."
docker build -t todo-backend:latest ./backend

# Build frontend image  
echo "📦 Building frontend image..."
docker build -t todo-frontend:latest ./frontend

echo "🔧 Applying Kubernetes configurations..."

# Check if YAML files exist, if not create them inline
if [ ! -f "backend-k8s.yaml" ]; then
    echo "📝 Creating backend-k8s.yaml..."
    cat > backend-k8s.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-backend
  labels:
    app: todo-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: todo-backend
  template:
    metadata:
      labels:
        app: todo-backend
    spec:
      containers:
      - name: todo-backend
        image: todo-backend:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 5000
        env:
        - name: PORT
          value: "5000"
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          value: "host.minikube.internal"
        - name: DB_PORT
          value: "5432"
        - name: DB_NAME
          value: "todoapp"
        - name: DB_USER
          value: "postgres"
        - name: DB_PASSWORD
          value: "postgres8991"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: todo-backend-service
  labels:
    app: todo-backend
spec:
  selector:
    app: todo-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
  type: ClusterIP
EOF
fi

if [ ! -f "frontend-k8s.yaml" ]; then
    echo "📝 Creating frontend-k8s.yaml..."
    cat > frontend-k8s.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-frontend
  labels:
    app: todo-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: todo-frontend
  template:
    metadata:
      labels:
        app: todo-frontend
    spec:
      containers:
      - name: todo-frontend
        image: todo-frontend:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3000
        env:
        - name: REACT_APP_API_URL
          value: "http://todo-backend-service/api"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: todo-frontend-service
  labels:
    app: todo-frontend
spec:
  selector:
    app: todo-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
EOF
fi

# Apply backend deployment
kubectl apply -f backend-k8s.yaml

# Apply frontend deployment
kubectl apply -f frontend-k8s.yaml

echo "⏳ Waiting for deployments to be ready..."

# Wait for backend deployment
kubectl rollout status deployment/todo-backend

# Wait for frontend deployment
kubectl rollout status deployment/todo-frontend

echo "✅ Deployment complete!"

echo "📋 Getting service information..."
kubectl get pods,svc -l app=todo-backend
kubectl get pods,svc -l app=todo-frontend

echo "🗃️ Database Setup Required:"
echo "Make sure PostgreSQL is running on your host machine:"
echo "1. Install PostgreSQL: sudo apt install postgresql postgresql-contrib"
echo "2. Setup database:"
echo "   sudo -u postgres psql -c \"CREATE DATABASE todoapp;\""
echo "   sudo -u postgres psql -d todoapp -c \"CREATE TABLE todos (id SERIAL PRIMARY KEY, text VARCHAR(255) NOT NULL, completed BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP); INSERT INTO todos (text, completed) VALUES ('Learn Node.js', false), ('Build a todo app', false), ('Deploy to production', false);\""
echo "3. Configure PostgreSQL (edit /etc/postgresql/*/main/postgresql.conf):"
echo "   listen_addresses = '*'"
echo "4. Configure client access (edit /etc/postgresql/*/main/pg_hba.conf):"
echo "   host    all             all             192.168.49.0/24         md5"
echo "5. Restart PostgreSQL: sudo systemctl restart postgresql"
echo ""
echo "🌐 To access the application:"
echo "Frontend: kubectl port-forward svc/todo-frontend-service 3000:80"
echo "Backend: kubectl port-forward svc/todo-backend-service 5000:80"

echo "🔍 To check logs:"
echo "Backend: kubectl logs -l app=todo-backend"
echo "Frontend: kubectl logs -l app=todo-frontend"

echo "🧪 To test database connection:"
echo "kubectl exec -it \$(kubectl get pod -l app=todo-backend -o jsonpath='{.items[0].metadata.name}') -- node -e \"const {Pool} = require('pg'); const pool = new Pool({user: 'postgres', host: 'host.minikube.internal', database: 'todoapp', password: 'postgres8991', port: 5432}); pool.query('SELECT * FROM todos').then(res => {console.log('✅ Database connected!'); console.log('Todos:', res.rows);}).catch(err => console.log('❌ Error:', err.message)).finally(() => process.exit(0));\""

echo "⏳ Waiting for deployments to be ready..."

# Wait for backend deployment
kubectl rollout status deployment/todo-backend

# Wait for frontend deployment
kubectl rollout status deployment/todo-frontend

echo "✅ Deployment complete!"

echo "📋 Getting service information..."
kubectl get pods,svc -l app=todo-backend
kubectl get pods,svc -l app=todo-frontend

echo "🌐 To access the application:"
echo "Frontend: kubectl port-forward svc/todo-frontend-service 3000:80"
echo "Backend: kubectl port-forward svc/todo-backend-service 5000:80"

echo "🔍 To check logs:"
echo "Backend: kubectl logs -l app=todo-backend"
echo "Frontend: kubectl logs -l app=todo-frontend"