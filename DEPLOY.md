# 배포 가이드

## 1. 일반 서버 배포 (Node.js 필요)

### 요구사항
- Node.js 18+ 설치 필요
- npm 또는 yarn

### 배포 단계
```bash
# 1. 서버에 코드 업로드
git clone <repository-url>
cd reserchhub---participant-management-system

# 2. 의존성 설치
npm install

# 3. 프로덕션 빌드 및 실행
npm start
```

## 2. Docker 배포 (Node.js 설치 불필요)

### 요구사항
- Docker만 설치하면 됨

### 배포 단계
```bash
# 1. Docker 이미지 빌드
docker build -t research-hub .

# 2. 컨테이너 실행
docker run -p 3000:3000 -v $(pwd)/data:/app/data research-hub
```

## 3. 클라우드 배포

### AWS EC2
```bash
# 1. EC2 인스턴스 생성 (Ubuntu)
# 2. Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. 프로젝트 배포
git clone <repository-url>
cd reserchhub---participant-management-system
npm install
npm start
```

### Heroku
```bash
# 1. Heroku CLI 설치
# 2. 앱 생성 및 배포
heroku create your-app-name
git push heroku main
```

## 4. 환경 변수
- `PORT`: 서버 포트 (기본값: 3000)
- `NODE_ENV`: production 설정

## 5. 데이터 지속성
- `data/mockUsers.json` 파일이 사용자 데이터 저장
- 서버 재시작 시에도 데이터 유지
- 백업 권장