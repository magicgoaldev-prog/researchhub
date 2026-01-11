# AWS 배포 가이드

## 1. EC2 배포 (가장 간단)

### 단계별 배포
```bash
# 1. EC2 인스턴스 생성 (Ubuntu 22.04)
# 2. 보안 그룹: HTTP(80), HTTPS(443), SSH(22) 포트 열기

# 3. EC2 접속 후 Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y nginx

# 4. 프로젝트 배포
git clone <your-repo-url>
cd reserchhub---participant-management-system
npm install
# devDependencies 포함하여 설치
npm install
# 또는 명시적으로 dev dependencies 설치
npm install --include=dev
npm run build

# 5. PM2로 서버 실행
sudo npm install -g pm2
# pm2 start server.js --name "research-hub"
NODE_ENV=production PORT=3000 pm2 start server.js --name research-hub
pm2 startup
pm2 save

# 6. Nginx 설정
sudo nano /etc/nginx/sites-available/research-hub
```

### Nginx 설정 파일
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 2. Elastic Beanstalk 배포 (추천)

### 준비 작업
```bash
# EB CLI 설치
pip install awsebcli

# 프로젝트 초기화
eb init
eb create research-hub-prod
```

## 3. Docker + ECS 배포

### 단계
```bash
# 1. Docker 이미지 빌드
docker build -t research-hub .

# 2. ECR에 푸시
aws ecr create-repository --repository-name research-hub
docker tag research-hub:latest <account-id>.dkr.ecr.<region>.amazonaws.com/research-hub:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/research-hub:latest

# 3. ECS 서비스 생성
```

## 4. 비용 최적화 옵션

### 프리티어 활용
- **EC2 t2.micro**: 월 750시간 무료
- **RDS t2.micro**: 월 750시간 무료 (DB 필요시)
- **S3**: 5GB 무료

### 예상 비용 (프리티어 이후)
- EC2 t3.micro: ~$10/월
- 도메인: ~$12/년
- SSL 인증서: Let's Encrypt (무료)

## 5. 도메인 및 SSL

### Route 53 + Let's Encrypt
```bash
# Certbot 설치
sudo apt install certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com
```

## 권장 배포 방법: **Elastic Beanstalk**
- 가장 간단하고 관리 용이
- 자동 스케일링 지원
- 로드 밸런서 자동 설정
- 무료 티어 지원