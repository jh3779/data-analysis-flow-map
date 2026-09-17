const cards=[...document.querySelectorAll('.card')];
const chips=[...document.querySelectorAll('.chip')];
const searchInput=document.getElementById('search');

document.querySelectorAll('.card-head').forEach(h=>{
 h.addEventListener('click',()=>h.parentElement.classList.toggle('open'));
});

document.querySelectorAll('.detail-toggle').forEach(btn=>{
 btn.addEventListener('click',()=>{
   const flow=btn.nextElementSibling;
   const isOpen=flow.classList.toggle('detail-open');
   btn.setAttribute('aria-pressed', String(isOpen));
   btn.textContent=detailToggleLabel(currentLang, isOpen);
 });
});

function filter(q){
 q=q.trim().toLowerCase();
 cards.forEach(c=>{
   const text=(c.innerText+' '+c.dataset.keywords).toLowerCase();
   c.classList.toggle('hidden', q && q!=='all' && !text.includes(q));
 });
}

searchInput.addEventListener('input',e=>{
 filter(e.target.value);
 chips.forEach(b=>b.classList.toggle('active', b.dataset.filter==='all' && e.target.value===''));
});

chips.forEach(b=>{
 b.addEventListener('click',()=>{
   const v=b.dataset.filter;
   searchInput.value=v==='all'?'':v;
   filter(v==='all'?'':v);
   chips.forEach(c=>c.classList.toggle('active', c===b));
   document.getElementById('algorithms').scrollIntoView();
 });
});

function jumpTo(el){
 const target=document.getElementById(el.dataset.jump);
 target.classList.add('open');
 target.scrollIntoView({behavior:'smooth',block:'center'});
}
document.querySelectorAll('.choice').forEach(c=>{
 c.addEventListener('click',()=>jumpTo(c));
 c.addEventListener('keydown',e=>{
   if(e.key==='Enter'||e.key===' '){
     e.preventDefault();
     jumpTo(c);
   }
 });
});
// .compare-link buttons live inside translated (innerHTML-swapped) containers,
// so they get re-created on every language switch. Delegate instead of binding
// directly, or a switch to English would silently drop the click handler.
document.addEventListener('click',e=>{
 const link=e.target.closest('.compare-link');
 if(link) jumpTo(link);
});

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduceMotion && 'IntersectionObserver' in window){
 const revealTargets=document.querySelectorAll('.panel, .card, .choice, .callout');
 revealTargets.forEach(el=>el.classList.add('reveal'));
 const io=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
     if(entry.isIntersecting){
       entry.target.classList.add('in-view');
       io.unobserve(entry.target);
     }
   });
 },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
 revealTargets.forEach(el=>io.observe(el));
}

/* ---------------------------------------------------------------------
   i18n: Korean is the DOM's default content. We cache each translatable
   element's original Korean innerHTML once, then swap to/from an English
   dictionary on toggle. This keeps a single Korean source of truth in the
   markup instead of duplicating every string twice in the HTML.
   ------------------------------------------------------------------- */
const translations={en:{
 nav_sub:"Data analysis study guide",
 search_aria:"Search algorithms",
 search_placeholder:"Search: regression, PCA, clustering, time series...",
 hero_title:'From a question to an algorithm,<br>connected on one page',
 hero_desc:'A personal study map that starts from "what do I want to know?", helps you pick an analysis type, and shows how each algorithm flows through <b>input → preprocessing → training → evaluation → interpretation</b>.',
 chip_all:"All", chip_basic:"Basics/EDA", chip_stats:"Statistical tests", chip_reg:"Regression",
 chip_class:"Classification", chip_cluster:"Clustering", chip_dim:"Dim. reduction",
 chip_anomaly:"Anomaly detection", chip_time:"Time series", chip_index:"Composite index",

 s0_h2:"0. The common starting point for every analysis",
 s0_lead:"An algorithm is a tool in the middle, not the starting point.",
 node1:'<b>① Define the question</b><small>What do I want to know?</small>',
 node2:'<b>② Get the data</b><small>What observations does the answer need?</small>',
 node3:'<b>③ Understand the data</b><small>Rows · columns · units · sample · distribution</small>',
 node4:'<b>④ EDA/preprocessing</b><small>Check missingness, outliers, relationships</small>',
 node5:'<b>⑤ Choose a method</b><small>The algorithm that fits the question</small>',
 node6:'<b>⑥ Validate/interpret</b><small>Is the result trustworthy?</small>',

 s1_h2:"1. What kind of problem is it?",
 s1_lead:"Pick whichever question below is closest to yours.",
 choice_desc:'<strong>📊 Describe the current data</strong><span>Curious about the mean, distribution, group differences, or relationships → EDA / descriptive stats / correlation</span>',
 choice_corr:'<strong>🔗 Strength of the relationship between two variables</strong><span>Want to know how related two continuous variables are → Correlation analysis</span>',
 choice_ttest:'<strong>⚖️ Test the difference in means between groups</strong><span>t-test for 2 groups, ANOVA for 3+ groups → Hypothesis testing</span>',
 choice_chisq:'<strong>🔲 Association between categorical variables</strong><span>Want to know if two categorical variables are related → Chi-square</span>',
 choice_reg:'<strong>🔢 Predict a number</strong><span>Want to predict a continuous value like price, revenue, or demand → Regression</span>',
 choice_class:'<strong>🏷️ Predict a category</strong><span>Want to predict a category like normal/fraud, churn/retain → Classification</span>',
 choice_cluster:'<strong>🧩 Find groups</strong><span>Want to group similar items without labels → Clustering</span>',
 choice_pca:'<strong>🗜️ Compress variables</strong><span>Too many variables, want to find the key axes → PCA</span>',
 choice_anomaly:'<strong>🚨 Find unusual observations</strong><span>Detect data that deviates from the normal pattern → Anomaly detection</span>',
 choice_time:'<strong>⏱️ Analyze how things change over time</strong><span>Want to know the trend, seasonality, or future value → Time series</span>',
 choice_index:'<strong>🧮 Combine several indicators into one</strong><span>Want to build a risk score or index from several variables → Composite index</span>',

 s2_h2:"2. Statistical tests · algorithm internals",
 s2_lead:'Click a card to expand its flow. Click a card’s "Show step-by-step detail" to see the specific techniques typically used at that step.',
 detail_toggle_show:"Show step-by-step detail",
 detail_toggle_hide:"Hide step-by-step detail",

 desc_head:'<h3>EDA / Descriptive Stats</h3><span class="tag">Foundations · Understanding data</span>',
 desc_s1:'<div class="step-main"><em>Input</em> Raw data</div><ul class="step-detail"><li>Load the raw file (CSV/DB/API)</li><li>Cross-check against the data dictionary (codebook) and schema</li></ul>',
 desc_s2:'<div class="step-main">Check rows/columns · types · units</div><ul class="step-detail"><li>Cast dtypes (string → number/date, etc.)</li><li>Unify units (KRW/USD, m/km, etc.), separate categorical vs. continuous</li></ul>',
 desc_s3:'<div class="step-main">Check missing values · duplicates · outliers</div><ul class="step-detail"><li>Identify the missingness pattern (MCAR/MAR/MNAR)</li><li>Remove duplicate rows; screen extremes with IQR/Z-score</li></ul>',
 desc_s4:'<div class="step-main">Mean · median · std dev · quartiles</div><ul class="step-detail"><li>describe() per group; mode for categorical variables</li><li>Check skewness/kurtosis for distribution shape</li></ul>',
 desc_s5:'<div class="step-main">Histogram · box plot · scatter plot · group comparison</div><ul class="step-detail"><li>Correlation matrix / heatmap for relationships between variables</li><li>t-test · ANOVA to test differences between groups</li></ul>',
 desc_s6:'<div class="step-main"><em>Output</em> Data characteristics and the direction for further analysis</div><ul class="step-detail"><li>Summarize issues found; list candidate hypotheses</li><li>Narrow down suitable analysis methods</li></ul>',
 desc_pre:'<strong>Prerequisites</strong><p>No special statistical assumptions. Works on tabular data right away.</p>',
 desc_mid:'<strong>When?</strong><p>The first step of almost every analysis.</p>',
 desc_warn:'<strong>Watch out</strong><p>Don’t judge the whole distribution from the mean alone.</p>',

 reg_head:'<h3>Linear Regression</h3><span class="tag">Regression · Predicting numbers / explaining relationships</span>',
 reg_s1:'<div class="step-main"><em>Input</em> X predictors + continuous target y</div><ul class="step-detail"><li>Define features/target, check data types</li></ul>',
 reg_s2:'<div class="step-main">Check missing values, outliers, linearity, multicollinearity</div><ul class="step-detail"><li>Impute missing values (mean/median/model-based)</li><li>Check multicollinearity with VIF, linearity with scatter plots</li></ul>',
 reg_s3:'<div class="step-main">Train / test split</div><ul class="step-detail"><li>Hold-out split (e.g. 8:2), K-fold CV if needed</li></ul>',
 reg_s4:'<div class="step-main">Estimate coefficients β to minimize error</div><ul class="step-detail"><li>OLS (least squares), normal equation or gradient descent</li><li>Ridge (L2) / Lasso (L1) regularization to prevent overfitting</li></ul>',
 reg_s5:'<div class="step-main">MAE · RMSE · R² + residual diagnostics</div><ul class="step-detail"><li>Q-Q plot to check residual normality</li><li>Durbin-Watson to check autocorrelation</li></ul>',
 reg_s6:'<div class="step-main"><em>Output</em> Predictions + per-variable coefficient interpretation</div><ul class="step-detail"><li>Compare variable influence using standardized coefficients</li><li>Check confidence intervals for coefficients</li></ul>',
 reg_pre:'<strong>Prerequisites</strong><p>Linearity, normal/homoscedastic errors, and low multicollinearity are required.</p>',
 reg_mid:'<strong>Strengths</strong><p>Easy to interpret and a strong baseline.</p>',
 reg_warn:'<strong>Watch out</strong><p>A coefficient is not the same as a causal effect.</p>',
 reg_cmp:'<span class="compare-tag">Compare</span><button class="compare-link" data-jump="class">Logistic Regression</button> : go here if you want to predict a category. <button class="compare-link" data-jump="corr">Correlation</button> : if you only need the strength of the relationship, this is enough without prediction.',

 class_head:'<h3>Logistic Regression</h3><span class="tag">Classification · Probability-based</span>',
 class_s1:'<div class="step-main"><em>Input</em> X + categorical y</div><ul class="step-detail"><li>Define features and the binary/multi-class target</li></ul>',
 class_s2:'<div class="step-main">Preprocessing · scaling · check class balance</div><ul class="step-detail"><li>Standardize (StandardScaler), one-hot encode categoricals</li><li>Over/undersampling for imbalance (e.g. SMOTE)</li></ul>',
 class_s3:'<div class="step-main">Train / test split</div><ul class="step-detail"><li>Stratified split to preserve class ratio</li></ul>',
 class_s4:'<div class="step-main">Estimate the probability of each class</div><ul class="step-detail"><li>Sigmoid function converts the logit to a probability</li><li>Coefficients learned via maximum likelihood estimation (MLE)</li></ul>',
 class_s5:'<div class="step-main">Decide the class via a threshold</div><ul class="step-detail"><li>Default 0.5; adjust the threshold by cost/objective</li><li>Find the optimal point on the ROC curve</li></ul>',
 class_s6:'<div class="step-main">Evaluate with Precision · Recall · F1 · ROC-AUC</div><ul class="step-detail"><li>Confusion matrix analysis</li><li>Use a PR curve to complement imbalanced data</li></ul>',
 class_s7:'<div class="step-main"><em>Output</em> Class + predicted probability</div>',
 class_pre:'<strong>Prerequisites</strong><p>Linearity between the logit and predictors, independent observations, low multicollinearity.</p>',
 class_mid:'<strong>Strengths</strong><p>Probabilities and coefficients are relatively easy to interpret.</p>',
 class_warn:'<strong>Watch out</strong><p>Accuracy alone is risky on imbalanced data.</p>',
 class_cmp:'<span class="compare-tag">Compare</span><button class="compare-link" data-jump="reg">Linear Regression</button> : go here if you want to predict a number itself.',

 tree_head:'<h3>Decision Tree</h3><span class="tag">Classification/Regression · Rule-based</span>',
 tree_s1:'<div class="step-main"><em>Input</em> X + y</div>',
 tree_s2:'<div class="step-main">Search for the condition that splits the data best</div><ul class="step-detail"><li>Classification: Gini impurity · information gain (entropy)</li><li>Regression: MSE reduction after the split</li></ul>',
 tree_s3:'<div class="step-main">Recursively split nodes by the condition</div><ul class="step-detail"><li>Recursive binary splitting; find the best feature/threshold at each node</li></ul>',
 tree_s4:'<div class="step-main">Control complexity with stopping rules / pruning</div><ul class="step-detail"><li>Hyperparameters like max_depth, min_samples_leaf</li><li>Cost-complexity pruning (post-pruning)</li></ul>',
 tree_s5:'<div class="step-main">Classify or predict a numeric value</div><ul class="step-detail"><li>Return the majority class (classification) or the mean (regression) of the leaf</li></ul>',
 tree_s6:'<div class="step-main"><em>Evaluate</em> Test/CV performance + inspect the tree structure</div><ul class="step-detail"><li>Review split criteria by visualizing the tree</li><li>Check feature importance</li></ul>',
 tree_pre:'<strong>Prerequisites</strong><p>No particular distribution assumptions. Scaling is not needed either.</p>',
 tree_mid:'<strong>Strengths</strong><p>Easy to represent nonlinear relationships and interactions.</p>',
 tree_warn:'<strong>Watch out</strong><p>A single deep tree overfits easily.</p>',
 tree_cmp:'<span class="compare-tag">Compare</span><button class="compare-link" data-jump="rf">Random Forest</button> : if a single tree’s instability worries you, average many trees here instead.',

 rf_head:'<h3>Random Forest</h3><span class="tag">Classification/Regression · Bagging</span>',
 rf_s1:'<div class="step-main"><em>Input</em> X + y</div>',
 rf_s2:'<div class="step-main">Generate multiple bootstrap samples</div><ul class="step-detail"><li>Create N sample sets by sampling with replacement</li><li>Also pick a random feature subset per tree (max_features)</li></ul>',
 rf_s3:'<div class="step-main">Train a different decision tree on each sample</div><ul class="step-detail"><li>Grow deep without pruning to minimize correlation between trees</li></ul>',
 rf_s4:'<div class="step-main">Classification: majority vote / Regression: average</div><ul class="step-detail"><li>Aggregate the predictions of all trees</li></ul>',
 rf_s5:'<div class="step-main">Test/CV evaluation + check feature importance</div><ul class="step-detail"><li>Estimate performance without a separate validation set using OOB (out-of-bag) error</li></ul>',
 rf_s6:'<div class="step-main"><em>Output</em> More stable predictions than a single tree</div>',
 rf_pre:'<strong>Prerequisites</strong><p>Tree-based, so no scaling needed. Works best when trees are weakly correlated.</p>',
 rf_mid:'<strong>Strengths</strong><p>A stable baseline for complex tabular data.</p>',
 rf_warn:'<strong>Watch out</strong><p>Feature importance is not causation.</p>',
 rf_cmp:'<span class="compare-tag">Compare</span><button class="compare-link" data-jump="boost">Gradient Boosting</button> : if you’re willing to tune more to push performance further, go here.',

 boost_head:'<h3>Gradient Boosting</h3><span class="tag">XGBoost · LightGBM · CatBoost</span>',
 boost_s1:'<div class="step-main"><em>Input</em> X + y</div>',
 boost_s2:'<div class="step-main">Train the first weak model</div><ul class="step-detail"><li>Usually starts with a shallow tree (stump); initial prediction is the mean/log-odds</li></ul>',
 boost_s3:'<div class="step-main">Compute the current model’s error/residual</div><ul class="step-detail"><li>Compute the gradient (negative slope) of the loss function</li></ul>',
 boost_s4:'<div class="step-main">Add the next model to reduce the error</div><ul class="step-detail"><li>Train a new tree on the residual as the target</li><li>Control its contribution with the learning rate (shrinkage)</li></ul>',
 boost_s5:'<div class="step-main">Repeat this process sequentially</div><ul class="step-detail"><li>Repeat for n_estimators rounds, correcting the previous error each time</li></ul>',
 boost_s6:'<div class="step-main">CV · early stopping · tuning</div><ul class="step-detail"><li>Stop early based on validation loss</li><li>Grid-search learning_rate · max_depth · subsample</li></ul>',
 boost_s7:'<div class="step-main"><em>Output</em> A strong predictor built from many weak models</div>',
 boost_pre:'<strong>Prerequisites</strong><p>No scaling needed. Missing-value handling differs by library.</p>',
 boost_mid:'<strong>Strengths</strong><p>Very strong for predicting on tabular data.</p>',
 boost_warn:'<strong>Watch out</strong><p>Tuning and preventing data leakage both matter a lot.</p>',
 boost_cmp:'<span class="compare-tag">Compare</span><button class="compare-link" data-jump="rf">Random Forest</button> : if you want a stable baseline first without tuning, go here.',

 knn_head:'<h3>KNN</h3><span class="tag">Classification/Regression · Distance-based</span>',
 knn_s1:'<div class="step-main"><em>Input</em> X + y</div>',
 knn_s2:'<div class="step-main">Scale the variables</div><ul class="step-detail"><li>Standardization is essential (distance-based, sensitive to scale differences)</li><li>Revisit the distance definition after encoding categoricals</li></ul>',
 knn_s3:'<div class="step-main">Compute the distance from the new point to every training point</div><ul class="step-detail"><li>Choose Euclidean · Manhattan · cosine distance</li></ul>',
 knn_s4:'<div class="step-main">Pick the K nearest points</div><ul class="step-detail"><li>Small K: tends to overfit / large K: tends to underfit</li></ul>',
 knn_s5:'<div class="step-main">Classification: vote / Regression: average</div><ul class="step-detail"><li>Distance-weighted voting (weighted KNN) is also possible</li></ul>',
 knn_s6:'<div class="step-main"><em>Evaluate</em> Choose K via cross-validation</div><ul class="step-detail"><li>Plot CV error across K values to find the optimum</li></ul>',
 knn_pre:'<strong>Prerequisites</strong><p>Uniform variable scale is essential. Performance degrades sharply in high dimensions (the curse of dimensionality).</p>',
 knn_mid:'<strong>Strengths</strong><p>Intuitive, with no complex training step.</p>',
 knn_warn:'<strong>Watch out</strong><p>Very sensitive to scale and to the number of dimensions.</p>',
 knn_cmp:'<span class="compare-tag">Compare</span><button class="compare-link" data-jump="cluster">K-Means</button> : same letter K, but this one is unsupervised (clustering) while KNN is supervised (classification/regression) — different purposes.',

 cluster_head:'<h3>K-Means</h3><span class="tag">Clustering · Unsupervised learning</span>',
 cluster_s1:'<div class="step-main"><em>Input</em> X with no labels</div>',
 cluster_s2:'<div class="step-main">Scale + initialize K centroids</div><ul class="step-detail"><li>Standardization is essential</li><li>K-means++ spreads out initial centroids for stable convergence</li></ul>',
 cluster_s3:'<div class="step-main">Assign each point to its nearest centroid</div><ul class="step-detail"><li>Assign cluster labels by Euclidean distance</li></ul>',
 cluster_s4:'<div class="step-main">Move each centroid to its group’s mean</div><ul class="step-detail"><li>Recompute the centroid per cluster</li></ul>',
 cluster_s5:'<div class="step-main">Repeat assignment and update until convergence</div><ul class="step-detail"><li>Stop when centroid movement is below a threshold or max_iter is reached</li></ul>',
 cluster_s6:'<div class="step-main">Check cluster quality with Elbow / Silhouette</div><ul class="step-detail"><li>Find the elbow point in WCSS (within-cluster variance)</li><li>Check cluster separation with the silhouette score</li></ul>',
 cluster_s7:'<div class="step-main"><em>Output</em> K groups of data</div>',
 cluster_pre:'<strong>Prerequisites</strong><p>Assumes roughly spherical, similarly sized clusters. Needs scaling, and K must be chosen in advance.</p>',
 cluster_mid:'<strong>Strengths</strong><p>Fast and intuitive even on large datasets.</p>',
 cluster_warn:'<strong>Watch out</strong><p>K must be set, and it assumes roughly spherical clusters.</p>',
 cluster_cmp:'<span class="compare-tag">Compare</span><button class="compare-link" data-jump="dbscan">DBSCAN</button> : if you don’t want to fix K in advance and need arbitrarily shaped clusters, go here.',

 dbscan_head:'<h3>DBSCAN</h3><span class="tag">Clustering · Density-based</span>',
 dbscan_s1:'<div class="step-main"><em>Input</em> X with no labels</div>',
 dbscan_s2:'<div class="step-main">Check the distance scale / standardize</div>',
 dbscan_s3:'<div class="step-main">Count neighbors within radius eps</div><ul class="step-detail"><li>Estimate a suitable eps with a k-distance plot</li></ul>',
 dbscan_s4:'<div class="step-main">Expand clusters from sufficiently dense points</div><ul class="step-detail"><li>Expand density-connected regions from core points (at least min_samples neighbors)</li></ul>',
 dbscan_s5:'<div class="step-main">Points that belong to no cluster become noise</div><ul class="step-detail"><li>Distinguish border points from noise points</li></ul>',
 dbscan_s6:'<div class="step-main"><em>Output</em> Arbitrarily shaped clusters + outliers</div>',
 dbscan_pre:'<strong>Prerequisites</strong><p>Assumes fairly uniform density across clusters. Sensitive to the eps/min_samples settings.</p>',
 dbscan_mid:'<strong>Strengths</strong><p>Finds complex shapes without fixing K in advance.</p>',
 dbscan_warn:'<strong>Watch out</strong><p>Hard to configure when clusters have very different densities.</p>',
 dbscan_cmp:'<span class="compare-tag">Compare</span><button class="compare-link" data-jump="cluster">K-Means</button> : if you already know the number of clusters and want faster computation, go here.',

 pca_head:'<h3>PCA</h3><span class="tag">Dimensionality reduction · Compressing information</span>',
 pca_s1:'<div class="step-main"><em>Input</em> Several numeric variables X</div>',
 pca_s2:'<div class="step-main">Usually center/standardize</div><ul class="step-detail"><li>Center to mean 0</li><li>Standardize if scales differ a lot (avoids distorting variance-based direction)</li></ul>',
 pca_s3:'<div class="step-main">Find the directions of largest variance</div><ul class="step-detail"><li>Compute the covariance matrix, then eigendecomposition or SVD</li></ul>',
 pca_s4:'<div class="step-main">Produce orthogonal principal components (PCs)</div><ul class="step-detail"><li>Order PCs by descending eigenvalue</li><li>Each PC is a linear combination of the original variables</li></ul>',
 pca_s5:'<div class="step-main">Check explained variance</div><ul class="step-detail"><li>Decide how many PCs to keep from the cumulative explained-variance graph (scree plot)</li></ul>',
 pca_s6:'<div class="step-main">Transform the data using only the needed PCs</div><ul class="step-detail"><li>Project the original data onto the chosen PCs</li></ul>',
 pca_s7:'<div class="step-main"><em>Output</em> A smaller set of new variables</div>',
 pca_pre:'<strong>Prerequisites</strong><p>Assumes linear relationships between variables. Sensitive to scale, so standardization is usually needed.</p>',
 pca_mid:'<strong>Strengths</strong><p>Can compress many correlated variables.</p>',
 pca_warn:'<strong>Watch out</strong><p>PCs can be harder to interpret than the original variables.</p>',

 anomaly_head:'<h3>Isolation Forest</h3><span class="tag">Anomaly detection</span>',
 anomaly_s1:'<div class="step-main"><em>Input</em> X, mostly normal observations</div>',
 anomaly_s2:'<div class="step-main">Build many trees using random features and split points</div><ul class="step-detail"><li>Each iTree recursively splits on a random feature/threshold</li></ul>',
 anomaly_s3:'<div class="step-main">Measure the number of splits needed to isolate each observation</div><ul class="step-detail"><li>Compute the average path length</li></ul>',
 anomaly_s4:'<div class="step-main">Points isolated quickly get a higher anomaly score</div><ul class="step-detail"><li>A shorter path length raises the anomaly score</li></ul>',
 anomaly_s5:'<div class="step-main">Flag anomalies via a threshold/contamination</div><ul class="step-detail"><li>Set the contamination ratio, or set the score threshold directly</li></ul>',
 anomaly_s6:'<div class="step-main"><em>Output</em> Normal/anomaly + anomaly score</div>',
 anomaly_pre:'<strong>Prerequisites</strong><p>Assumes most data is normal (low contamination ratio). No particular distribution assumption.</p>',
 anomaly_mid:'<strong>Strengths</strong><p>Works even on high-dimensional data.</p>',
 anomaly_warn:'<strong>Watch out</strong><p>"Rare" and "a problem" are not the same thing.</p>',
 anomaly_cmp:'<span class="compare-tag">Compare</span><button class="compare-link" data-jump="dbscan">DBSCAN</button> : if you want to see cluster structure alongside outliers, not just anomalies, go here.',

 time_head:'<h3>Time Series Analysis / ARIMA family</h3><span class="tag">Time order · Forecasting</span>',
 time_s1:'<div class="step-main"><em>Input</em> Time-ordered data</div>',
 time_s2:'<div class="step-main">Check trend · seasonality · missing values · outliers</div><ul class="step-detail"><li>Separate trend/seasonality with time-series decomposition (e.g. STL)</li><li>Interpolate missing values (linear/time-weighted)</li></ul>',
 time_s3:'<div class="step-main">Time-ordered train / validation split</div><ul class="step-detail"><li>No random shuffling; use rolling/expanding window splits</li></ul>',
 time_s4:'<div class="step-main">Check stationarity/differencing/autocorrelation structure</div><ul class="step-detail"><li>Check stationarity with the ADF test; difference if needed</li><li>Read candidate (p, q) from ACF/PACF</li></ul>',
 time_s5:'<div class="step-main">Fit an ARIMA/SARIMA-family model</div><ul class="step-detail"><li>Estimate (p,d,q), or seasonal (P,D,Q,m) parameters</li><li>Fit coefficients via MLE</li></ul>',
 time_s6:'<div class="step-main">Forecast the future window + evaluate with MAE/RMSE, etc.</div><ul class="step-detail"><li>Walk-forward validation</li><li>Compute the prediction interval</li></ul>',
 time_s7:'<div class="step-main"><em>Output</em> Future values + forecast uncertainty</div>',
 time_pre:'<strong>Prerequisites</strong><p>Assumes stationarity (differencing needed if not). Needs an evenly spaced series with no gaps.</p>',
 time_mid:'<strong>Strengths</strong><p>Explicitly models time dependence and trend.</p>',
 time_warn:'<strong>Watch out</strong><p>A random shuffle split can leak future information.</p>',

 index_head:'<h3>Composite Index</h3><span class="tag">Composite index · Building risk/assessment indices</span>',
 index_s1:'<div class="step-main"><em>Question</em> What are we trying to express as a single index?</div>',
 index_s2:'<div class="step-main">Theoretical framework → select variables</div><ul class="step-detail"><li>Pick candidate sub-indicators through literature/expert review</li></ul>',
 index_s3:'<div class="step-main">Check data units · direction · spatial/temporal level</div><ul class="step-detail"><li>Flip the sign for inversely-directed indicators</li><li>Unify the level of geographic/temporal aggregation</li></ul>',
 index_s4:'<div class="step-main">Handle missing values + decide normalization (Raw/Z-score/Min-Max/Percentile, etc.)</div><ul class="step-detail"><li>Compare results across normalization methods</li><li>Interpolate missing values or exclude that sub-indicator</li></ul>',
 index_s5:'<div class="step-main">Decide weights → aggregate (Weighted Sum / Geometric Mean, etc.)</div><ul class="step-detail"><li>Equal weights / PCA-based weights / expert Delphi method, etc.</li></ul>',
 index_s6:'<div class="step-main">Sensitivity analysis across normalization, weights, and variable choice</div><ul class="step-detail"><li>Check rank volatility with Monte Carlo simulation</li></ul>',
 index_s7:'<div class="step-main"><em>Output</em> Index + ranking + uncertainty/limitations</div>',
 index_pre:'<strong>Prerequisites</strong><p>Sub-indicators need theoretical coherence. Results are sensitive to normalization/weight choices.</p>',
 index_mid:'<strong>Key idea</strong><p>The theoretical justification for variables and weights matters more than the "formula."</p>',
 index_warn:'<strong>Watch out</strong><p>Always check whether normalization choices flip the ranking.</p>',

 corr_head:'<h3>Correlation</h3><span class="tag">Statistical test · Strength of a relationship</span>',
 corr_s1:'<div class="step-main"><em>Input</em> Two continuous variables (X, Y)</div><ul class="step-detail"><li>Check the shape of the relationship (linear/nonlinear) with a scatter plot first</li></ul>',
 corr_s2:'<div class="step-main">Choose how to measure the strength of the relationship</div><ul class="step-detail"><li>Linear relationship, normality holds: Pearson</li><li>Nonlinear/rank-based/many outliers: Spearman</li></ul>',
 corr_s3:'<div class="step-main">Compute the correlation coefficient r (-1 to 1)</div><ul class="step-detail"><li>Larger absolute value = stronger relationship; the sign gives direction</li></ul>',
 corr_s4:'<div class="step-main">Test significance</div><ul class="step-detail"><li>Use the p-value to check whether the observed correlation could be chance</li><li>Larger samples make even small correlations easier to call significant</li></ul>',
 corr_s5:'<div class="step-main"><em>Output</em> The direction and strength of the relationship (not causation)</div>',
 corr_pre:'<strong>Prerequisites</strong><p>Continuous variables. Pearson assumes a linear relationship and normality (use Spearman if nonlinear/ranked).</p>',
 corr_mid:'<strong>Strengths</strong><p>Simple to compute and a fast way to screen relationships between variables.</p>',
 corr_warn:'<strong>Watch out</strong><p>Correlation is not causation. A single outlier can swing it heavily.</p>',
 corr_cmp:'<span class="compare-tag">Compare</span><button class="compare-link" data-jump="reg">Linear Regression</button> : if you need prediction/explanation beyond just the strength of the relationship, go here.',

 ttest_head:'<h3>t-test</h3><span class="tag">Statistical test · Comparing two group means</span>',
 ttest_s1:'<div class="step-main"><em>Input</em> A continuous variable + a 2-group label</div>',
 ttest_s2:'<div class="step-main">Set up hypotheses</div><ul class="step-detail"><li>H0 (null): the two group means are equal</li><li>H1 (alternative): the two group means differ</li></ul>',
 ttest_s3:'<div class="step-main">Check normality · equal variance</div><ul class="step-detail"><li>Shapiro-Wilk for normality, Levene’s test for equal variance</li></ul>',
 ttest_s4:'<div class="step-main">Compute the t statistic</div><ul class="step-detail"><li>Distinguish independent-samples vs. paired-samples</li><li>Use Welch’s t-test if equal variance is hard to assume</li></ul>',
 ttest_s5:'<div class="step-main">Decide using the p-value</div><ul class="step-detail"><li>Compare against the significance level (usually 0.05)</li></ul>',
 ttest_s6:'<div class="step-main"><em>Output</em> Whether the difference in group means is statistically significant</div>',
 ttest_pre:'<strong>Prerequisites</strong><p>Continuous dependent variable, normality (especially important for small samples), equal variance (or Welch correction).</p>',
 ttest_mid:'<strong>When?</strong><p>The first method to reach for when comparing two conditions, like an A/B test.</p>',
 ttest_warn:'<strong>Watch out</strong><p>Statistical significance doesn’t mean the effect size is large.</p>',
 ttest_cmp:'<span class="compare-tag">Compare</span><button class="compare-link" data-jump="anova">ANOVA</button> : if you’re comparing 3 or more groups, go here.',

 anova_head:'<h3>ANOVA</h3><span class="tag">Statistical test · Comparing 3+ group means</span>',
 anova_s1:'<div class="step-main"><em>Input</em> A continuous variable + 3 or more groups</div>',
 anova_s2:'<div class="step-main">Set up hypotheses</div><ul class="step-detail"><li>H0: all group means are equal</li></ul>',
 anova_s3:'<div class="step-main">Compare between-group and within-group variance</div><ul class="step-detail"><li>F statistic = between-group variance / within-group variance</li></ul>',
 anova_s4:'<div class="step-main">Decide using the p-value</div>',
 anova_s5:'<div class="step-main">If significant, run a post-hoc test</div><ul class="step-detail"><li>Use Tukey HSD, etc. to see specifically which groups differ</li></ul>',
 anova_s6:'<div class="step-main"><em>Output</em> At least one group differs (a post-hoc test is needed to see which)</div>',
 anova_pre:'<strong>Prerequisites</strong><p>Continuous dependent variable, normality, equal variance (Levene’s test), independence between groups.</p>',
 anova_mid:'<strong>When?</strong><p>When you want to compare 3 or more groups at once.</p>',
 anova_warn:'<strong>Watch out</strong><p>ANOVA alone only tells you "something differs," not where.</p>',
 anova_cmp:'<span class="compare-tag">Compare</span><button class="compare-link" data-jump="ttest">t-test</button> : if you’re only comparing 2 groups, this is simpler.',

 chisq_head:'<h3>Chi-square test</h3><span class="tag">Statistical test · Association between categorical variables</span>',
 chisq_s1:'<div class="step-main"><em>Input</em> Two categorical variables</div>',
 chisq_s2:'<div class="step-main">Build the contingency table</div>',
 chisq_s3:'<div class="step-main">Compute expected frequencies</div><ul class="step-detail"><li>The frequency expected per cell if the two variables were independent</li></ul>',
 chisq_s4:'<div class="step-main">Compute the chi-square statistic</div><ul class="step-detail"><li>Σ (observed − expected)² / expected</li></ul>',
 chisq_s5:'<div class="step-main">Decide using the p-value</div>',
 chisq_s6:'<div class="step-main"><em>Output</em> Whether the two categorical variables are associated</div>',
 chisq_pre:'<strong>Prerequisites</strong><p>Categorical variables; expected frequency of 5+ per cell is recommended; independent observations.</p>',
 chisq_mid:'<strong>When?</strong><p>When you want to see association between two categorical variables, like gender × purchase.</p>',
 chisq_warn:'<strong>Watch out</strong><p>Finding an association is different from knowing its direction and size.</p>',

 s3_h2:"3. Quick comparison table",
 tbl_head:'<th>Purpose</th><th>Representative method</th><th>Target y</th><th>Scale sensitivity</th><th>Key evaluation</th>',
 tbl_r1:'<td>Understand data</td><td>EDA / descriptive stats</td><td>Not required</td><td>Varies by method</td><td>Distribution · quality · interpretation</td>',
 tbl_r2:'<td>Relationship strength</td><td>Correlation (Pearson/Spearman)</td><td>None</td><td>Low for Spearman</td><td>Correlation r + p-value</td>',
 tbl_r3:'<td>Group-difference test</td><td>t-test (2 groups) / ANOVA (3+)</td><td>Continuous</td><td>None</td><td>p-value + post-hoc test</td>',
 tbl_r4:'<td>Categorical association</td><td>Chi-square</td><td>Categorical</td><td>None</td><td>Chi-square statistic + p-value</td>',
 tbl_r5:'<td>Predict a number</td><td>Linear / RF / Boosting</td><td>Continuous</td><td>Varies by model</td><td>MAE · RMSE · R²</td>',
 tbl_r6:'<td>Predict a category</td><td>Logistic / Tree / RF / Boosting</td><td>Categorical</td><td>Varies by model</td><td>Precision · Recall · F1 · AUC</td>',
 tbl_r7:'<td>Discover groups</td><td>K-Means / DBSCAN</td><td>None</td><td>Usually matters</td><td>Silhouette + interpretability</td>',
 tbl_r8:'<td>Dimensionality reduction</td><td>PCA</td><td>None</td><td>Matters</td><td>Explained variance</td>',
 tbl_r9:'<td>Anomaly detection</td><td>IQR / Isolation Forest</td><td>Optional</td><td>Varies by method</td><td>Validation against real anomalies</td>',
 tbl_r10:'<td>Forecast over time</td><td>ARIMA / SARIMA, etc.</td><td>Time-ordered value</td><td>Varies by method</td><td>Time-ordered validation MAE/RMSE</td>',
 tbl_r11:'<td>A single index</td><td>Composite Index</td><td>Usually none</td><td>Very important</td><td>Sensitivity · robustness · interpretation</td>',

 callout:'<b>A sentence to remember while studying</b><br>Before asking "which algorithm is best," ask <b>"what is my question, and do this algorithm’s assumptions fit my data?"</b>',

 s4_h2:"4. Official reference material",
 s4_lead:"It also helps to check the official decision-flow diagrams when choosing an algorithm.",
 ref1:'<strong>scikit-learn: Choosing the right estimator</strong><p><a href="https://scikit-learn.org/dev/machine_learning_map.html" target="_blank">Open the official estimator-selection flowchart ↗</a></p>',
 ref2:'<strong>SAS: Machine Learning Algorithm Guide</strong><p><a href="https://www.sas.com/ko_kr/solutions/ai-mic/blog/machine-learning-algorithm-cheat-sheet.html" target="_blank">Open the algorithm cheat-sheet guide ↗</a></p>',

 footer:'<b>Tip:</b> Type an algorithm name or goal into the search box. With cards expanded, use your browser’s <span class="kbd">Print</span> → Save as PDF to keep this as a personal cheat sheet.',

 page_title:"Data Analysis Algorithm Flow Map",
}};

function detailToggleLabel(lang,isOpen){
 if(lang==='en'){
   return isOpen ? translations.en.detail_toggle_hide : translations.en.detail_toggle_show;
 }
 return isOpen ? '단계별 세부 로직 숨기기' : '단계별 세부 로직 보기';
}

const i18nEls=[...document.querySelectorAll('[data-i18n]')];
const koCache=new Map(i18nEls.map(el=>[el, el.innerHTML]));
const placeholderEls=[...document.querySelectorAll('[data-i18n-placeholder]')];
const koPlaceholder=new Map(placeholderEls.map(el=>[el, el.getAttribute('placeholder')]));
const ariaEls=[...document.querySelectorAll('[data-i18n-aria]')];
const koAria=new Map(ariaEls.map(el=>[el, el.getAttribute('aria-label')]));
const langBtns=[...document.querySelectorAll('.lang-btn')];
const titleEl=document.querySelector('title');
const koTitle=titleEl.textContent;
const metaDesc=document.getElementById('metaDesc');
const koMetaDesc=metaDesc?metaDesc.getAttribute('content'):null;

let currentLang='ko';
try{ currentLang=localStorage.getItem('dfm_lang')||'ko'; }catch(e){}

function applyLang(lang){
 currentLang=lang;
 document.documentElement.lang=lang;
 i18nEls.forEach(el=>{
   const key=el.dataset.i18n;
   el.innerHTML = lang==='en' ? (translations.en[key] ?? koCache.get(el)) : koCache.get(el);
 });
 placeholderEls.forEach(el=>{
   const key=el.dataset.i18nPlaceholder;
   el.setAttribute('placeholder', lang==='en' ? (translations.en[key] ?? koPlaceholder.get(el)) : koPlaceholder.get(el));
 });
 ariaEls.forEach(el=>{
   const key=el.dataset.i18nAria;
   el.setAttribute('aria-label', lang==='en' ? (translations.en[key] ?? koAria.get(el)) : koAria.get(el));
 });
 document.querySelectorAll('.detail-toggle').forEach(btn=>{
   const flow=btn.nextElementSibling;
   btn.textContent=detailToggleLabel(lang, flow.classList.contains('detail-open'));
 });
 titleEl.textContent = lang==='en' ? translations.en.page_title : koTitle;
 if(metaDesc) metaDesc.setAttribute('content', lang==='en' ? translations.en.s0_lead : koMetaDesc);
 langBtns.forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
 try{ localStorage.setItem('dfm_lang', lang); }catch(e){}
}

langBtns.forEach(b=>{
 b.addEventListener('click',()=>applyLang(b.dataset.lang));
});

applyLang(currentLang);
