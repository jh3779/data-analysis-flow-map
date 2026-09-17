# Data Analysis Flow Map

데이터 분석 문제에서 알고리즘까지 한 장으로 연결해서 보는 개인 학습용 지도입니다. "무엇을 알고 싶은가?"라는 질문에서 시작해 분석 유형을 고르고, 각 알고리즘이 **입력 → 전처리 → 학습 → 평가 → 해석**으로 어떻게 흘러가는지 정리했습니다.

🔗 **바로 보기**: https://jh3779.github.io/data-analysis-flow-map/

## 구성

- `index.html` — 페이지 마크업
- `style.css` — 스타일
- `script.js` — 검색/필터/카드 토글 로직

## 내용

1. **모든 분석의 공통 시작점** — 질문 정의부터 검증/해석까지 6단계 공통 흐름
2. **어떤 문제인가?** — 8가지 질문 유형(설명/예측/분류/군집/압축/이상탐지/시계열/복합지수)에서 알맞은 방법으로 바로 이동
3. **알고리즘별 내부 흐름** — EDA, 선형/로지스틱 회귀, Decision Tree, Random Forest, Gradient Boosting, KNN, K-Means, DBSCAN, PCA, Isolation Forest, 시계열(ARIMA 계열), Composite Index 등 13종의 입력→평가 미니 플로우
4. **빠른 비교표** — 목적별 대표 방법과 핵심 평가지표 요약

검색창에 알고리즘 이름이나 목적을 입력하면 해당 카드만 필터링됩니다. 카드를 펼친 상태로 브라우저 인쇄 → PDF 저장을 하면 개인 치트시트로도 쓸 수 있습니다.

## 참고 자료

- [scikit-learn — Choosing the right estimator](https://scikit-learn.org/dev/machine_learning_map.html)
- [SAS — Machine Learning Algorithm Cheat Sheet](https://www.sas.com/ko_kr/solutions/ai-mic/blog/machine-learning-algorithm-cheat-sheet.html)
