# Karvia Business - Deployment Guide

## Overview

Karvia Business is a comprehensive B2B OKR management platform designed for third-party deployment. This guide covers all deployment options from development to production.

## Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0
- **MongoDB**: >= 5.0
- **Redis**: >= 6.0 (optional but recommended)
- **Docker**: >= 20.10 (for containerized deployment)
- **Kubernetes**: >= 1.21 (for K8s deployment)

### Environment Setup

1. **Clone and configure**:
   ```bash
   git clone <repository-url>
   cd karvia_business
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Install dependencies**:
   ```bash
   npm run setup
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

## Deployment Options

### 1. Docker Deployment (Recommended)

#### Single Command Deploy
```bash
# Build and start all services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Production Configuration
```bash
# Copy production environment
cp .env.production .env

# Deploy with production profile
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 2. Kubernetes Deployment

#### Prerequisites
```bash
# Install kubectl and helm
kubectl version --client
helm version
```

#### Deploy to Kubernetes
```bash
# Create namespace
kubectl apply -f kubernetes/namespace.yaml

# Create secrets (update with your values)
kubectl create secret generic karvia-secrets \
  --from-literal=mongodb-uri="mongodb://username:password@mongodb:27017/karvia_business" \
  --from-literal=redis-url="redis://redis:6379" \
  --from-literal=jwt-secret="your-jwt-secret" \
  --from-literal=openai-api-key="your-openai-key" \
  -n karvia-business

# Deploy application
kubectl apply -f kubernetes/

# Check deployment
kubectl get pods -n karvia-business
```

### 3. Manual Installation

#### System Requirements
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm mongodb-server redis-server nginx

# CentOS/RHEL
sudo yum install nodejs npm mongodb-server redis nginx
```

#### Application Setup
```bash
# Install application
npm install --production

# Setup database
npm run db:setup

# Start services
npm run start:production
```

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `development` |
| `PORT` | Main server port | No | `5000` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `REDIS_URL` | Redis connection string | No | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |
| `FRONTEND_URL` | Frontend URL | No | `http://localhost:3000` |

### Database Configuration

#### MongoDB Setup
```javascript
// Connection string format
MONGODB_URI=mongodb://username:password@host:port/karvia_business

// Replica set (recommended for production)
MONGODB_URI=mongodb://user:pass@host1:27017,host2:27017,host3:27017/karvia_business?replicaSet=rs0
```

#### Redis Configuration
```bash
# Basic connection
REDIS_URL=redis://localhost:6379

# With authentication
REDIS_URL=redis://username:password@host:6379

# Redis Cluster
REDIS_CLUSTER_NODES=redis://node1:6379,redis://node2:6379,redis://node3:6379
```

### SSL/TLS Configuration

#### Let's Encrypt (Recommended)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Custom Certificates
```bash
# Place certificates
sudo mkdir -p /etc/nginx/ssl
sudo cp your-cert.pem /etc/nginx/ssl/cert.pem
sudo cp your-key.pem /etc/nginx/ssl/key.pem
sudo chmod 600 /etc/nginx/ssl/key.pem
```

## Scaling and Performance

### Horizontal Scaling

#### Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Scale services
docker service scale karvia_karvia-app=3
docker service scale karvia_karvia-engines=2
```

#### Kubernetes Scaling
```bash
# Scale deployment
kubectl scale deployment karvia-business-app --replicas=5 -n karvia-business

# Horizontal Pod Autoscaler
kubectl autoscale deployment karvia-business-app \
  --cpu-percent=70 --min=2 --max=10 -n karvia-business
```

### Performance Tuning

#### Application Optimization
```javascript
// server/config/performance.js
module.exports = {
  // Connection pooling
  mongodb: {
    maxPoolSize: 100,
    minPoolSize: 5,
    maxIdleTimeMS: 30000
  },

  // Redis optimization
  redis: {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    connectTimeout: 10000
  },

  // Express settings
  express: {
    'trust proxy': true,
    'x-powered-by': false
  }
};
```

#### Database Optimization
```javascript
// MongoDB indexes (auto-created on startup)
db.businesses.createIndex({ "ownerId": 1 })
db.objectives.createIndex({ "businessId": 1, "status": 1 })
db.goals.createIndex({ "objectiveId": 1, "assignedTo": 1 })
db.users.createIndex({ "email": 1 }, { unique: true })
```

### Load Balancing

#### Nginx Configuration
```nginx
upstream karvia_app {
    least_conn;
    server app1.example.com:5000 weight=3;
    server app2.example.com:5000 weight=3;
    server app3.example.com:5000 weight=2;
}

upstream karvia_engines {
    ip_hash;
    server engines1.example.com:8081;
    server engines2.example.com:8081;
}
```

## Monitoring and Logging

### Health Checks

#### Application Health
```bash
# Main server health
curl http://localhost:5000/health

# Engine health
curl http://localhost:8081/health  # IAM
curl http://localhost:8082/health  # Assessment
curl http://localhost:8083/health  # Planner
# ... all engines
```

#### Monitoring Setup
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
```

### Log Management

#### Log Locations
```bash
# Application logs
./logs/app.log          # Main application
./logs/iam.log          # IAM engine
./logs/assessment.log   # Assessment engine
./logs/nginx.log        # Nginx access/error

# Docker logs
docker-compose logs karvia-app
docker-compose logs karvia-engines
```

#### Log Rotation
```bash
# Setup logrotate
sudo vim /etc/logrotate.d/karvia-business

/path/to/karvia/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    copytruncate
    notifempty
}
```

## Backup and Recovery

### Database Backup

#### Automated MongoDB Backup
```bash
#!/bin/bash
# backup-mongodb.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
DB_NAME="karvia_business"

mkdir -p $BACKUP_DIR

# Create backup
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/$DATE"

# Compress backup
tar -czf "$BACKUP_DIR/karvia_backup_$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE"

# Remove uncompressed backup
rm -rf "$BACKUP_DIR/$DATE"

# Keep only last 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

#### Database Restore
```bash
# Extract backup
tar -xzf karvia_backup_20231201_120000.tar.gz

# Restore database
mongorestore --uri="$MONGODB_URI" --drop ./20231201_120000
```

### File System Backup
```bash
# Backup application files
tar -czf karvia_app_backup.tar.gz \
  --exclude=node_modules \
  --exclude=logs \
  --exclude=.git \
  /path/to/karvia_business

# Backup uploads and configurations
tar -czf karvia_data_backup.tar.gz \
  ./uploads \
  ./config \
  ./.env
```

## Security

### Security Checklist

- [ ] **Environment Variables**: No secrets in code
- [ ] **SSL/TLS**: HTTPS enforced
- [ ] **Database**: Authentication enabled
- [ ] **Redis**: Password protected
- [ ] **Firewall**: Only necessary ports open
- [ ] **Updates**: Regular security updates
- [ ] **Backups**: Encrypted and tested
- [ ] **Monitoring**: Security event logging

### Firewall Configuration
```bash
# Ubuntu/Debian (ufw)
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 27017/tcp  # MongoDB (internal only)
sudo ufw deny 6379/tcp   # Redis (internal only)

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### Security Headers
```nginx
# Security headers in nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

## Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
npm run logs

# Check dependencies
npm run doctor

# Check environment
npm run env:check
```

#### Database Connection Issues
```bash
# Test MongoDB connection
mongo $MONGODB_URI --eval "db.adminCommand('ismaster')"

# Check MongoDB status
sudo systemctl status mongodb
sudo systemctl restart mongodb
```

#### Performance Issues
```bash
# Check system resources
htop
iostat -x 1
free -h

# Check application metrics
curl http://localhost:5000/metrics
```

### Performance Monitoring
```bash
# Application performance
curl http://localhost:5000/api/health/detailed

# Database performance
mongo $MONGODB_URI --eval "db.serverStatus()"

# Engine status
for port in {8081..8089}; do
  curl -s http://localhost:$port/health
done
```

## Support

### Documentation
- **API Documentation**: `/docs/api/`
- **User Guide**: `/docs/user-guide/`
- **Admin Guide**: `/docs/admin-guide/`

### Getting Help
- **Issues**: GitHub Issues
- **Documentation**: Built-in help system
- **Community**: Discord/Slack channels

### Professional Support
- **Installation Support**: Available for enterprise clients
- **Custom Deployment**: Consultation available
- **Training**: User and admin training sessions

---

**Last Updated**: $(date)
**Version**: 1.0.0