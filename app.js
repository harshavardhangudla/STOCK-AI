class StockAIApp {
    constructor() {
        this.currentTab = 'dashboard';
        this.stockData = this.generateEnhancedStockData();
        this.newsData = this.generateNewsData();
        this.portfolioData = this.generatePortfolioData();
        this.mlModels = this.getMLModels();
        this.chatMessages = [];
        this.isTyping = false;
        this.charts = {}; // Store chart instances
        this.apiKey = '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';
        this.selectedCompany = null;
        this.selectedDate = null;
        
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApplication();
            });
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        this.setupEventListeners();
        this.renderDashboard();
        this.renderCompanies();
        this.renderNews();
        this.renderPortfolio();
        this.renderModelRankings();
        this.initializeCharts();
        this.initializeChatbot();
        this.setupPredictorTab();
        this.setupDatePicker();
    }

    generateEnhancedStockData() {
        const companiesData = [
            { symbol: "AAPL", name: "Apple Inc.", currentPrice: 175.43, sector: "Technology", marketCap: "2.75T", pe: 28.74, logo: "🍎" },
            { symbol: "MSFT", name: "Microsoft Corp.", currentPrice: 420.15, sector: "Technology", marketCap: "3.12T", pe: 34.21, logo: "🏢" },
            { symbol: "GOOGL", name: "Alphabet Inc.", currentPrice: 165.89, sector: "Technology", marketCap: "2.08T", pe: 25.43, logo: "🔍" },
            { symbol: "AMZN", name: "Amazon.com Inc.", currentPrice: 338.00, sector: "Technology", marketCap: "1.65T", pe: 55.12, logo: "📦" },
            { symbol: "TSLA", name: "Tesla Inc.", currentPrice: 248.50, sector: "Automotive", marketCap: "791.2B", pe: 65.32, logo: "🔋" },
            { symbol: "META", name: "Meta Platforms Inc.", currentPrice: 502.75, sector: "Technology", marketCap: "1.28T", pe: 22.89, logo: "📱" },
            { symbol: "NVDA", name: "NVIDIA Corp.", currentPrice: 875.25, sector: "Technology", marketCap: "2.15T", pe: 78.45, logo: "🎮" },
            { symbol: "NFLX", name: "Netflix Inc.", currentPrice: 645.30, sector: "Technology", marketCap: "287B", pe: 31.75, logo: "🎬" },
            { symbol: "JPM", name: "JPMorgan Chase & Co.", currentPrice: 195.85, sector: "Finance", marketCap: "571B", pe: 12.34, logo: "🏦" },
            { symbol: "JNJ", name: "Johnson & Johnson", currentPrice: 158.92, sector: "Healthcare", marketCap: "418B", pe: 16.78, logo: "💊" },
            { symbol: "V", name: "Visa Inc.", currentPrice: 278.45, sector: "Finance", marketCap: "598B", pe: 32.1, logo: "💳" },
            { symbol: "PG", name: "Procter & Gamble Co.", currentPrice: 155.67, sector: "Consumer Goods", marketCap: "368B", pe: 24.5, logo: "🧴" },
            { symbol: "UNH", name: "UnitedHealth Group Inc.", currentPrice: 567.32, sector: "Healthcare", marketCap: "531B", pe: 28.9, logo: "🏥" },
            { symbol: "HD", name: "Home Depot Inc.", currentPrice: 334.78, sector: "Retail", marketCap: "345B", pe: 19.8, logo: "🔨" },
            { symbol: "MA", name: "Mastercard Inc.", currentPrice: 412.33, sector: "Finance", marketCap: "398B", pe: 33.2, logo: "💰" },
            { symbol: "DIS", name: "Walt Disney Co.", currentPrice: 112.45, sector: "Entertainment", marketCap: "205B", pe: 45.6, logo: "🏰" },
            { symbol: "BAC", name: "Bank of America Corp.", currentPrice: 34.89, sector: "Finance", marketCap: "274B", pe: 11.7, logo: "🏛️" },
            { symbol: "ADBE", name: "Adobe Inc.", currentPrice: 598.76, sector: "Technology", marketCap: "278B", pe: 42.3, logo: "📐" },
            { symbol: "XOM", name: "Exxon Mobil Corp.", currentPrice: 115.23, sector: "Energy", marketCap: "456B", pe: 14.2, logo: "⛽" },
            { symbol: "WMT", name: "Walmart Inc.", currentPrice: 159.87, sector: "Retail", marketCap: "435B", pe: 26.8, logo: "🛒" },
            { symbol: "PFE", name: "Pfizer Inc.", currentPrice: 28.94, sector: "Healthcare", marketCap: "163B", pe: 15.4, logo: "💉" },
            { symbol: "KO", name: "Coca-Cola Co.", currentPrice: 61.45, sector: "Consumer Goods", marketCap: "265B", pe: 22.1, logo: "🥤" },
            { symbol: "INTC", name: "Intel Corp.", currentPrice: 43.67, sector: "Technology", marketCap: "178B", pe: 18.9, logo: "💻" },
            { symbol: "VZ", name: "Verizon Communications Inc.", currentPrice: 40.12, sector: "Telecom", marketCap: "168B", pe: 8.7, logo: "📡" },
            { symbol: "CRM", name: "Salesforce Inc.", currentPrice: 267.89, sector: "Technology", marketCap: "259B", pe: 58.4, logo: "☁️" }
        ];

        return companiesData.map(company => ({
            ...company,
            change: this.randomChange(-20, 20),
            changePercent: this.randomChange(-5, 5),
            volume: this.randomVolume(),
            high52w: company.currentPrice * (1 + Math.random() * 0.3),
            low52w: company.currentPrice * (1 - Math.random() * 0.3),
            dividend: this.randomDividend(),
            beta: this.randomBeta(),
            historicalPrices: this.generateHistoricalData(company.currentPrice, 365) // 1 year of data
        }));
    }

    generateHistoricalData(currentPrice, days) {
        const prices = {};
        let price = currentPrice * 0.85; // Start from 15% lower than current
        const today = new Date();
        
        for (let i = days; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Skip weekends for stock data
            if (date.getDay() === 0 || date.getDay() === 6) continue;
            
            const change = (Math.random() - 0.5) * 0.04; // ±2% daily change
            price *= (1 + change);
            
            const dateKey = date.toISOString().split('T')[0];
            prices[dateKey] = {
                price: parseFloat(price.toFixed(2)),
                volume: this.randomVolume(),
                high: price * (1 + Math.random() * 0.02),
                low: price * (1 - Math.random() * 0.02),
                open: price * (0.98 + Math.random() * 0.04)
            };
        }
        
        return prices;
    }

    getMLModels() {
        return [
            {
                id: "lstm",
                name: "LSTM Neural Network",
                description: "Deep learning model for sequential time series analysis with memory capabilities",
                strengths: "Complex pattern recognition, handles non-linear relationships",
                accuracy: 87.5,
                riskLevel: "Medium",
                confidence: "High"
            },
            {
                id: "randomforest",
                name: "Random Forest",
                description: "Ensemble method using multiple decision trees for robust predictions",
                strengths: "Handles overfitting well, works with mixed data types",
                accuracy: 82.3,
                riskLevel: "Low",
                confidence: "High"
            },
            {
                id: "arima",
                name: "ARIMA Model",
                description: "Statistical time series model using autoregression and moving averages",
                strengths: "Good for trend analysis, transparent methodology",
                accuracy: 78.9,
                riskLevel: "Low",
                confidence: "Medium"
            },
            {
                id: "xgboost",
                name: "XGBoost",
                description: "Gradient boosting framework optimized for structured data",
                strengths: "High accuracy, fast training, handles missing data",
                accuracy: 85.7,
                riskLevel: "Medium",
                confidence: "High"
            },
            {
                id: "prophet",
                name: "Prophet",
                description: "Facebook's time series forecasting with holiday and seasonality effects",
                strengths: "Handles seasonality well, robust to outliers",
                accuracy: 80.1,
                riskLevel: "Low",
                confidence: "Medium"
            }
        ];
    }

    setupPredictorTab() {
        // Populate company selector
        const companySelect = document.getElementById('predictorCompanySelect');
        if (companySelect) {
            companySelect.innerHTML = '<option value="">Choose a company...</option>' +
                this.stockData.map(stock => 
                    `<option value="${stock.symbol}">${stock.logo} ${stock.name} (${stock.symbol})</option>`
                ).join('');
        }

        // Setup prediction button
        const generateBtn = document.getElementById('generatePredictionBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generatePrediction();
            });
        }
    }

    setupDatePicker() {
        const datePicker = document.getElementById('predictionDatePicker');
        if (datePicker) {
            // Set max date to 1 year in the future
            const today = new Date();
            const maxDate = new Date(today);
            maxDate.setFullYear(maxDate.getFullYear() + 1);
            
            // Set min date to 2 years ago
            const minDate = new Date(today);
            minDate.setFullYear(minDate.getFullYear() - 2);
            
            datePicker.max = maxDate.toISOString().split('T')[0];
            datePicker.min = minDate.toISOString().split('T')[0];
            datePicker.value = today.toISOString().split('T')[0];
        }
    }

    generatePrediction() {
        const companySelect = document.getElementById('predictorCompanySelect');
        const datePicker = document.getElementById('predictionDatePicker');
        
        if (!companySelect.value || !datePicker.value) {
            alert('Please select both a company and a date.');
            return;
        }

        this.selectedCompany = this.stockData.find(s => s.symbol === companySelect.value);
        this.selectedDate = new Date(datePicker.value);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this.selectedDate.setHours(0, 0, 0, 0);

        // Show results container
        const resultsContainer = document.getElementById('predictionResults');
        if (resultsContainer) {
            resultsContainer.style.display = 'block';
        }

        if (this.selectedDate.getTime() === today.getTime()) {
            this.showCurrentPrice();
        } else if (this.selectedDate < today) {
            this.showHistoricalPrice();
        } else {
            this.showFuturePredictions();
        }
    }

    showCurrentPrice() {
        const priceCard = document.getElementById('priceDisplayCard');
        const modelRankingsCard = document.getElementById('modelRankingsCard');
        const futurePredictionsCard = document.getElementById('futurePredictionsCard');
        const consensusCard = document.getElementById('consensusCard');

        // Show only current price
        priceCard.style.display = 'block';
        modelRankingsCard.style.display = 'none';
        futurePredictionsCard.style.display = 'none';
        consensusCard.style.display = 'none';

        // Update price display
        document.getElementById('priceDisplayTitle').textContent = 'Current Live Price';
        document.getElementById('priceDisplayStatus').textContent = 'Live';
        document.getElementById('priceDisplayStatus').className = 'status status--success';
        
        document.getElementById('displayedPrice').textContent = `$${this.selectedCompany.currentPrice.toFixed(2)}`;
        
        const changeColor = this.selectedCompany.changePercent >= 0 ? 'positive' : 'negative';
        const changeSign = this.selectedCompany.changePercent >= 0 ? '+' : '';
        document.getElementById('displayedChange').textContent = 
            `${changeSign}$${this.selectedCompany.change.toFixed(2)} (${changeSign}${this.selectedCompany.changePercent.toFixed(2)}%)`;
        document.getElementById('displayedChange').className = `price-change ${changeColor}`;
        
        document.getElementById('displayedDate').textContent = 'Live Market Data';

        // Update chart for current trends
        this.updatePredictionChart('current');
    }

    showHistoricalPrice() {
        const priceCard = document.getElementById('priceDisplayCard');
        const modelRankingsCard = document.getElementById('modelRankingsCard');
        const futurePredictionsCard = document.getElementById('futurePredictionsCard');
        const consensusCard = document.getElementById('consensusCard');

        // Show price and model rankings
        priceCard.style.display = 'block';
        modelRankingsCard.style.display = 'block';
        futurePredictionsCard.style.display = 'none';
        consensusCard.style.display = 'none';

        const dateKey = this.selectedDate.toISOString().split('T')[0];
        const historicalData = this.selectedCompany.historicalPrices[dateKey];

        if (historicalData) {
            // Update price display
            document.getElementById('priceDisplayTitle').textContent = 'Historical Price';
            document.getElementById('priceDisplayStatus').textContent = 'Historical';
            document.getElementById('priceDisplayStatus').className = 'status status--info';
            
            document.getElementById('displayedPrice').textContent = `$${historicalData.price.toFixed(2)}`;
            document.getElementById('displayedChange').textContent = 'Historical Data';
            document.getElementById('displayedChange').className = 'price-change';
            document.getElementById('displayedDate').textContent = this.selectedDate.toLocaleDateString();

            // Show model accuracy rankings
            this.renderHistoricalModelRankings(historicalData.price);
            this.updatePredictionChart('historical', historicalData);
        } else {
            alert('No historical data available for this date (market was closed).');
        }
    }

    showFuturePredictions() {
        const priceCard = document.getElementById('priceDisplayCard');
        const modelRankingsCard = document.getElementById('modelRankingsCard');
        const futurePredictionsCard = document.getElementById('futurePredictionsCard');
        const consensusCard = document.getElementById('consensusCard');

        // Show predictions and consensus
        priceCard.style.display = 'none';
        modelRankingsCard.style.display = 'none';
        futurePredictionsCard.style.display = 'block';
        consensusCard.style.display = 'block';

        const daysInFuture = Math.ceil((this.selectedDate - new Date()) / (1000 * 60 * 60 * 24));
        const predictions = this.generateFuturePredictions(daysInFuture);
        
        this.renderFutureModelPredictions(predictions);
        this.renderConsensusAnalysis(predictions);
        this.updatePredictionChart('future', null, predictions);
    }

    generateFuturePredictions(days) {
        const basePrice = this.selectedCompany.currentPrice;
        const predictions = [];

        this.mlModels.forEach(model => {
            // Generate prediction based on model characteristics
            let volatility = 0.02; // Base 2% volatility
            let trendBias = 0;

            switch(model.id) {
                case 'lstm':
                    volatility = 0.025;
                    trendBias = 0.001; // Slight upward bias
                    break;
                case 'randomforest':
                    volatility = 0.018;
                    trendBias = 0.0005;
                    break;
                case 'arima':
                    volatility = 0.015;
                    trendBias = -0.0002; // Slight conservative bias
                    break;
                case 'xgboost':
                    volatility = 0.022;
                    trendBias = 0.0008;
                    break;
                case 'prophet':
                    volatility = 0.016;
                    trendBias = 0.0003;
                    break;
            }

            // Apply market factors and news sentiment
            const marketSentiment = 0.002; // Current bullish sentiment
            const sectorMultiplier = this.selectedCompany.sector === 'Technology' ? 1.1 : 1.0;
            
            let predictedPrice = basePrice;
            for (let i = 0; i < days; i++) {
                const dailyChange = (Math.random() - 0.5) * volatility + trendBias + marketSentiment;
                predictedPrice *= (1 + dailyChange);
            }

            predictedPrice *= sectorMultiplier;

            predictions.push({
                model: model,
                price: parseFloat(predictedPrice.toFixed(2)),
                confidence: this.calculateConfidence(model, days),
                riskLevel: this.calculateRiskLevel(model, days, volatility)
            });
        });

        return predictions.sort((a, b) => b.model.accuracy - a.model.accuracy);
    }

    calculateConfidence(model, days) {
        let baseConfidence = model.accuracy / 100;
        
        // Reduce confidence for longer predictions
        const daysFactor = Math.max(0.5, 1 - (days - 1) * 0.02);
        
        return Math.min(0.95, baseConfidence * daysFactor);
    }

    calculateRiskLevel(model, days, volatility) {
        const riskScore = volatility * 100 + (days * 0.5);
        
        if (riskScore < 2) return 'Low';
        if (riskScore < 4) return 'Medium';
        return 'High';
    }

    renderHistoricalModelRankings(actualPrice) {
        const container = document.getElementById('historicalModelRankings');
        if (!container) return;

        // Simulate how well each model would have predicted
        const rankings = this.mlModels.map(model => {
            const simulatedPrediction = actualPrice * (0.95 + Math.random() * 0.1); // ±5% simulation
            const accuracy = 100 - Math.abs((simulatedPrediction - actualPrice) / actualPrice * 100);
            
            return {
                ...model,
                simulatedAccuracy: Math.max(60, Math.min(98, accuracy)), // Keep within reasonable bounds
                error: Math.abs(simulatedPrediction - actualPrice)
            };
        }).sort((a, b) => b.simulatedAccuracy - a.simulatedAccuracy);

        container.innerHTML = rankings.map((model, index) => `
            <div class="model-prediction-item">
                <div>
                    <div class="model-name">${model.name}</div>
                    <div class="model-accuracy-score">Error: $${model.error.toFixed(2)}</div>
                </div>
                <div style="text-align: right;">
                    <div class="prediction-price">${model.simulatedAccuracy.toFixed(1)}%</div>
                    <span class="confidence-level confidence-${model.simulatedAccuracy > 85 ? 'high' : model.simulatedAccuracy > 75 ? 'medium' : 'low'}">
                        Rank #${index + 1}
                    </span>
                </div>
            </div>
        `).join('');
    }

    renderFutureModelPredictions(predictions) {
        const container = document.getElementById('futureModelPredictions');
        if (!container) return;

        container.innerHTML = predictions.map((prediction, index) => `
            <div class="model-prediction-item">
                <div>
                    <div class="model-name">${prediction.model.name}</div>
                    <div class="model-accuracy-score">Accuracy: ${prediction.model.accuracy}%</div>
                </div>
                <div style="text-align: right;">
                    <div class="prediction-price">$${prediction.price.toFixed(2)}</div>
                    <span class="confidence-level confidence-${prediction.confidence > 0.8 ? 'high' : prediction.confidence > 0.6 ? 'medium' : 'low'}">
                        ${(prediction.confidence * 100).toFixed(0)}% confident
                    </span>
                </div>
            </div>
        `).join('');
    }

    renderConsensusAnalysis(predictions) {
        const consensusPrice = predictions.reduce((sum, p) => sum + p.price, 0) / predictions.length;
        const prices = predictions.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        document.getElementById('consensusPrice').textContent = `$${consensusPrice.toFixed(2)}`;
        document.getElementById('consensusRange').textContent = `Range: $${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;

        // Generate risk factors
        const riskFactors = [
            "Market volatility may affect prediction accuracy",
            "Economic indicators and Fed policy changes",
            "Sector-specific news and developments",
            "Company earnings and guidance updates",
            "Global geopolitical events impact"
        ];

        const riskContainer = document.getElementById('riskFactorsList');
        if (riskContainer) {
            riskContainer.innerHTML = riskFactors.map(factor => `
                <div class="risk-factor-item">
                    <i class="fas fa-exclamation-triangle" style="color: var(--color-warning);"></i>
                    <span>${factor}</span>
                </div>
            `).join('');
        }
    }

    updatePredictionChart(type, historicalData = null, predictions = null) {
        const ctx = document.getElementById('enhancedPredictionChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.prediction) {
            this.charts.prediction.destroy();
        }

        let chartData = {};

        if (type === 'current') {
            // Show recent price trend
            const recentData = this.generateRecentPriceData(this.selectedCompany.currentPrice, 30);
            chartData = {
                labels: recentData.labels,
                datasets: [{
                    label: `${this.selectedCompany.symbol} Recent Trend`,
                    data: recentData.prices,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            };
        } else if (type === 'historical') {
            // Show historical context around the selected date
            const contextData = this.generateHistoricalContext(historicalData.price);
            chartData = {
                labels: contextData.labels,
                datasets: [{
                    label: 'Historical Price',
                    data: contextData.prices,
                    borderColor: '#5D878F',
                    backgroundColor: 'rgba(93, 135, 143, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Selected Date',
                    data: contextData.selectedPoint,
                    borderColor: '#DB4545',
                    backgroundColor: '#DB4545',
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    showLine: false
                }]
            };
        } else if (type === 'future') {
            // Show model predictions comparison
            const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
            const datasets = predictions.map((pred, index) => ({
                label: pred.model.name,
                data: [this.selectedCompany.currentPrice, pred.price],
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '20',
                tension: 0.4,
                pointRadius: 6
            }));

            chartData = {
                labels: ['Today', this.selectedDate.toLocaleDateString()],
                datasets: datasets
            };
        }

        this.charts.prediction = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }

    generateRecentPriceData(currentPrice, days) {
        const labels = [];
        const prices = [];
        let price = currentPrice * 0.95;

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            const change = (Math.random() - 0.5) * 0.03;
            price *= (1 + change);
            prices.push(parseFloat(price.toFixed(2)));
        }
        
        prices[prices.length - 1] = currentPrice; // Ensure it ends at current price
        return { labels, prices };
    }

    generateHistoricalContext(targetPrice) {
        const labels = [];
        const prices = [];
        const selectedPoint = [];

        for (let i = -15; i <= 15; i++) {
            const date = new Date(this.selectedDate);
            date.setDate(date.getDate() + i);
            
            if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends
            
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            if (i === 0) {
                prices.push(targetPrice);
                selectedPoint.push(targetPrice);
            } else {
                const variance = targetPrice * (0.95 + Math.random() * 0.1);
                prices.push(parseFloat(variance.toFixed(2)));
                selectedPoint.push(null);
            }
        }

        return { labels, prices, selectedPoint };
    }

    // Existing methods (preserved from original)
    randomPrice(min, max) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(2));
    }

    randomChange(min, max) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(2));
    }

    randomVolume() {
        return (Math.random() * 100 + 10).toFixed(1) + 'M';
    }

    randomDividend() {
        return Math.random() > 0.3 ? parseFloat((Math.random() * 5).toFixed(2)) : 0;
    }

    randomBeta() {
        return parseFloat((Math.random() * 2 + 0.5).toFixed(2));
    }

    generateNewsData() {
        const newsItems = [
            {
                title: "Tech Giants Report Strong Q4 Earnings Despite Market Volatility",
                summary: "Major technology companies including Apple, Microsoft, and Google parent Alphabet have exceeded analyst expectations in their latest quarterly reports, showing resilience in challenging market conditions.",
                category: "technology",
                sentiment: "positive",
                sentimentScore: 0.75,
                date: "2 hours ago",
                impact: "high"
            },
            {
                title: "Federal Reserve Signals Potential Interest Rate Changes in 2024",
                summary: "The Federal Reserve has indicated that monetary policy adjustments may be necessary to combat inflation while supporting economic growth, creating uncertainty in financial markets.",
                category: "finance",
                sentiment: "neutral",
                sentimentScore: 0.0,
                date: "4 hours ago",
                impact: "high"
            },
            {
                title: "AI Revolution Drives Semiconductor Stocks to New Highs",
                summary: "Artificial intelligence demand continues to fuel growth in the semiconductor sector, with NVIDIA and other chip manufacturers seeing unprecedented market valuations.",
                category: "technology",
                sentiment: "positive",
                sentimentScore: 0.85,
                date: "6 hours ago",
                impact: "medium"
            },
            {
                title: "Energy Sector Faces Headwinds from Renewable Transition",
                summary: "Traditional energy companies are navigating challenges as the global economy shifts toward renewable energy sources, impacting long-term investment strategies.",
                category: "market",
                sentiment: "negative",
                sentimentScore: -0.45,
                date: "8 hours ago",
                impact: "medium"
            },
            {
                title: "Healthcare Innovation Stocks Rally on Breakthrough Drug Approvals",
                summary: "Several pharmaceutical and biotech companies have gained significant market value following FDA approvals for innovative treatments in oncology and rare diseases.",
                category: "finance",
                sentiment: "positive",
                sentimentScore: 0.68,
                date: "12 hours ago",
                impact: "medium"
            },
            {
                title: "Retail Giants Prepare for Holiday Season Amid Economic Uncertainty",
                summary: "Major retailers are adjusting inventory and pricing strategies as consumer spending patterns shift in response to economic pressures and changing shopping behaviors.",
                category: "market",
                sentiment: "neutral",
                sentimentScore: -0.15,
                date: "1 day ago",
                impact: "low"
            }
        ];

        return newsItems;
    }

    generatePortfolioData() {
        return [
            { symbol: "AAPL", shares: 150, avgPrice: 145.30, currentPrice: 175.43 },
            { symbol: "MSFT", shares: 75, avgPrice: 380.50, currentPrice: 420.15 },
            { symbol: "GOOGL", shares: 100, avgPrice: 142.75, currentPrice: 165.89 },
            { symbol: "TSLA", shares: 50, avgPrice: 220.00, currentPrice: 248.50 },
            { symbol: "NVDA", shares: 80, avgPrice: 285.60, currentPrice: 875.25 }
        ];
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Settings modal
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showModal('settingsModal');
            });
        }

        const closeSettings = document.getElementById('closeSettings');
        if (closeSettings) {
            closeSettings.addEventListener('click', () => {
                this.hideModal('settingsModal');
            });
        }

        // Company search
        const companySearch = document.getElementById('companySearch');
        if (companySearch) {
            companySearch.addEventListener('input', (e) => {
                this.filterCompanies(e.target.value);
            });
        }

        // Technical stock selector
        const technicalStockSelect = document.getElementById('technicalStockSelect');
        if (technicalStockSelect) {
            technicalStockSelect.addEventListener('change', (e) => {
                this.updateTechnicalChart(e.target.value);
            });
        }

        // News filters
        document.querySelectorAll('.news-filters .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterNews(e.target.dataset.filter);
                document.querySelectorAll('.news-filters .btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Theme selector
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        }

        // Portfolio add holding
        const addHoldingBtn = document.getElementById('addHoldingBtn');
        if (addHoldingBtn) {
            addHoldingBtn.addEventListener('click', () => {
                this.showAddHoldingDialog();
            });
        }

        // Modal close on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Close company modal
        const closeCompanyModal = document.getElementById('closeCompanyModal');
        if (closeCompanyModal) {
            closeCompanyModal.addEventListener('click', () => {
                this.hideModal('companyModal');
            });
        }
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        this.currentTab = tabName;

        // Load tab-specific content
        setTimeout(() => {
            switch(tabName) {
                case 'technical':
                    this.updateTechnicalChart('AAPL');
                    break;
                case 'analysis':
                    this.renderAnalysisCharts();
                    break;
            }
        }, 100);
    }

    renderDashboard() {
        this.renderTrendingStocks();
        setTimeout(() => {
            this.renderPortfolioChart();
        }, 100);
    }

    renderTrendingStocks() {
        const container = document.getElementById('trendingStocks');
        if (!container) return;

        const topMovers = this.stockData
            .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
            .slice(0, 5);

        container.innerHTML = topMovers.map(stock => `
            <div class="trending-item">
                <div>
                    <div class="trending-symbol">${stock.symbol}</div>
                    <div class="trending-name">${stock.name}</div>
                </div>
                <div class="trending-price">
                    <div>$${stock.currentPrice}</div>
                    <div class="trending-change ${stock.changePercent >= 0 ? 'positive' : 'negative'}">
                        ${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent}%
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderCompanies() {
        const container = document.getElementById('companiesGrid');
        if (!container) return;
        
        container.innerHTML = this.stockData.map(stock => `
            <div class="company-card card" onclick="app.showCompanyDetails('${stock.symbol}')">
                <div class="company-header">
                    <div class="company-info">
                        <div class="company-symbol">${stock.logo} ${stock.symbol}</div>
                        <div class="company-name">${stock.name}</div>
                    </div>
                    <div class="company-price">
                        <div class="price-value">$${stock.currentPrice}</div>
                        <div class="price-change ${stock.changePercent >= 0 ? 'positive' : 'negative'}">
                            ${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent}%
                        </div>
                    </div>
                </div>
                <div class="company-metrics">
                    <div class="metric-item">
                        <span class="metric-label">Market Cap</span>
                        <span class="metric-value">${stock.marketCap}</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">P/E Ratio</span>
                        <span class="metric-value">${stock.pe}</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Volume</span>
                        <span class="metric-value">${stock.volume}</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Sector</span>
                        <span class="metric-value">${stock.sector}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterCompanies(searchTerm) {
        const companies = document.querySelectorAll('.company-card');
        companies.forEach(card => {
            const symbol = card.querySelector('.company-symbol').textContent;
            const name = card.querySelector('.company-name').textContent;
            const matches = symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           name.toLowerCase().includes(searchTerm.toLowerCase());
            card.style.display = matches ? 'block' : 'none';
        });
    }

    showCompanyDetails(symbol) {
        const stock = this.stockData.find(s => s.symbol === symbol);
        if (!stock) return;

        document.getElementById('companyModalTitle').textContent = `${stock.name} (${stock.symbol})`;
        document.getElementById('companyModalBody').innerHTML = `
            <div class="company-details">
                <div class="detail-section">
                    <h4>Price Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span>Current Price:</span>
                            <span>$${stock.currentPrice}</span>
                        </div>
                        <div class="detail-item">
                            <span>Change:</span>
                            <span class="${stock.changePercent >= 0 ? 'positive' : 'negative'}">
                                ${stock.changePercent >= 0 ? '+' : ''}$${stock.change} (${stock.changePercent}%)
                            </span>
                        </div>
                        <div class="detail-item">
                            <span>52W High:</span>
                            <span>$${stock.high52w.toFixed(2)}</span>
                        </div>
                        <div class="detail-item">
                            <span>52W Low:</span>
                            <span>$${stock.low52w.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>Fundamentals</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span>Market Cap:</span>
                            <span>${stock.marketCap}</span>
                        </div>
                        <div class="detail-item">
                            <span>P/E Ratio:</span>
                            <span>${stock.pe}</span>
                        </div>
                        <div class="detail-item">
                            <span>Volume:</span>
                            <span>${stock.volume}</span>
                        </div>
                        <div class="detail-item">
                            <span>Beta:</span>
                            <span>${stock.beta}</span>
                        </div>
                        <div class="detail-item">
                            <span>Dividend:</span>
                            <span>${stock.dividend > 0 ? '$' + stock.dividend : 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span>Sector:</span>
                            <span>${stock.sector}</span>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                .company-details { margin-top: var(--space-16); }
                .detail-section { margin-bottom: var(--space-24); }
                .detail-section h4 { margin-bottom: var(--space-12); color: var(--color-text); }
                .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-12); }
                .detail-item { display: flex; justify-content: space-between; padding: var(--space-8); background-color: var(--color-bg-1); border-radius: var(--radius-sm); }
                .detail-item span:first-child { color: var(--color-text-secondary); }
                .detail-item span:last-child { font-weight: var(--font-weight-medium); }
                .positive { color: var(--color-success); }
                .negative { color: var(--color-error); }
            </style>
        `;

        this.showModal('companyModal');
    }

    renderNews() {
        const container = document.getElementById('newsGrid');
        if (!container) return;
        
        container.innerHTML = this.newsData.map(news => `
            <div class="news-card card" data-category="${news.category}">
                <div class="card__body">
                    <div class="news-header-info">
                        <div class="news-category">${news.category}</div>
                        <div class="news-date">${news.date}</div>
                    </div>
                    <h3 class="news-title">${news.title}</h3>
                    <p class="news-summary">${news.summary}</p>
                    <div class="news-sentiment">
                        <div class="sentiment-indicator">
                            <i class="fas fa-chart-line"></i>
                            <span>Sentiment:</span>
                            <span class="sentiment-score ${news.sentiment}">${news.sentiment}</span>
                        </div>
                        <span class="status status--${news.impact === 'high' ? 'error' : news.impact === 'medium' ? 'warning' : 'info'}">${news.impact} impact</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterNews(category) {
        const newsCards = document.querySelectorAll('.news-card');
        newsCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    renderPortfolio() {
        const container = document.getElementById('holdingsTable');
        if (!container) return;
        
        container.innerHTML = `
            <table class="holdings-table-element">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Shares</th>
                        <th>Avg Price</th>
                        <th>Current Price</th>
                        <th>Market Value</th>
                        <th>Gain/Loss</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.portfolioData.map(holding => {
                        const marketValue = holding.shares * holding.currentPrice;
                        const totalCost = holding.shares * holding.avgPrice;
                        const gainLoss = marketValue - totalCost;
                        const gainLossPercent = (gainLoss / totalCost) * 100;
                        
                        return `
                            <tr>
                                <td><strong>${holding.symbol}</strong></td>
                                <td>${holding.shares}</td>
                                <td>$${holding.avgPrice.toFixed(2)}</td>
                                <td>$${holding.currentPrice.toFixed(2)}</td>
                                <td>$${marketValue.toLocaleString()}</td>
                                <td class="${gainLoss >= 0 ? 'positive' : 'negative'}">
                                    ${gainLoss >= 0 ? '+' : ''}$${gainLoss.toLocaleString()} 
                                    (${gainLossPercent >= 0 ? '+' : ''}${gainLossPercent.toFixed(2)}%)
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

    renderModelRankings() {
        const container = document.getElementById('modelRankings');
        if (!container) return;

        const sortedModels = [...this.mlModels].sort((a, b) => b.accuracy - a.accuracy);
        
        container.innerHTML = sortedModels.map((model, index) => `
            <div class="ranking-item">
                <div class="ranking-position">#${index + 1}</div>
                <div class="ranking-model">${model.name}</div>
                <div class="ranking-accuracy">${model.accuracy}%</div>
            </div>
        `).join('');
    }

    initializeCharts() {
        setTimeout(() => {
            this.renderPortfolioChart();
        }, 200);
    }

    renderPortfolioChart() {
        const ctx = document.getElementById('portfolioChart');
        if (!ctx) return;

        if (this.charts.portfolio) {
            this.charts.portfolio.destroy();
        }

        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Portfolio Value',
                data: [100000, 105000, 98000, 112000, 118000, 125750],
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };

        this.charts.portfolio = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    updateTechnicalChart(symbol) {
        const ctx = document.getElementById('technicalChart');
        if (!ctx) return;

        if (this.charts.technical) {
            this.charts.technical.destroy();
        }

        const stock = this.stockData.find(s => s.symbol === symbol);
        if (!stock) return;

        const prices = this.generateHistoricalPrices(stock.currentPrice, 30);
        const labels = Array.from({length: 30}, (_, i) => `Day ${i + 1}`);

        const data = {
            labels: labels,
            datasets: [{
                label: `${symbol} Price`,
                data: prices,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                tension: 0.3
            }]
        };

        this.charts.technical = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    }

    renderAnalysisCharts() {
        setTimeout(() => {
            this.renderCorrelationChart();
            this.renderVolatilityChart();
        }, 100);
    }

    renderCorrelationChart() {
        const ctx = document.getElementById('correlationChart');
        if (!ctx) return;

        if (this.charts.correlation) {
            this.charts.correlation.destroy();
        }

        const data = {
            labels: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'META'],
            datasets: [{
                label: 'Correlation with S&P 500',
                data: [0.85, 0.82, 0.79, 0.45, 0.73],
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                borderWidth: 0
            }]
        };

        this.charts.correlation = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1
                    }
                }
            }
        });
    }

    renderVolatilityChart() {
        const ctx = document.getElementById('volatilityChart');
        if (!ctx) return;

        if (this.charts.volatility) {
            this.charts.volatility.destroy();
        }

        const data = {
            labels: ['Technology', 'Finance', 'Healthcare', 'Energy', 'Retail'],
            datasets: [{
                label: 'Volatility Index',
                data: [0.25, 0.18, 0.15, 0.35, 0.22],
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                borderWidth: 0
            }]
        };

        this.charts.volatility = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    generateHistoricalPrices(currentPrice, days) {
        const prices = [];
        let price = currentPrice * 0.9;
        
        for (let i = 0; i < days; i++) {
            const change = (Math.random() - 0.5) * 0.04;
            price *= (1 + change);
            prices.push(parseFloat(price.toFixed(2)));
        }
        
        return prices;
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    setTheme(theme) {
        if (theme === 'auto') {
            document.documentElement.removeAttribute('data-color-scheme');
        } else {
            document.documentElement.setAttribute('data-color-scheme', theme);
        }
    }

    showAddHoldingDialog() {
        const symbol = prompt('Enter stock symbol:');
        const shares = prompt('Enter number of shares:');
        const price = prompt('Enter average price:');
        
        if (symbol && shares && price) {
            const stock = this.stockData.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
            if (stock) {
                this.portfolioData.push({
                    symbol: stock.symbol,
                    shares: parseInt(shares),
                    avgPrice: parseFloat(price),
                    currentPrice: stock.currentPrice
                });
                this.renderPortfolio();
            } else {
                alert('Stock not found');
            }
        }
    }

    // Enhanced Chatbot Integration
    initializeChatbot() {
        this.setupChatbotEventListeners();
    }

    setupChatbotEventListeners() {
        const chatButton = document.getElementById('chatButton');
        const chatInterface = document.getElementById('chatInterface');
        const chatMinimize = document.getElementById('chatMinimize');
        const chatClose = document.getElementById('chatClose');
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.getElementById('chatSend');

        if (chatButton) {
            chatButton.addEventListener('click', () => {
                this.toggleChat();
            });
        }

        if (chatMinimize) {
            chatMinimize.addEventListener('click', () => {
                this.minimizeChat();
            });
        }

        if (chatClose) {
            chatClose.addEventListener('click', () => {
                this.closeChat();
            });
        }

        if (chatSend) {
            chatSend.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Quick question buttons
        document.querySelectorAll('.quick-question-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.question;
                document.getElementById('chatInput').value = question;
                this.sendMessage();
            });
        });
    }

    toggleChat() {
        const chatInterface = document.getElementById('chatInterface');
        const chatButton = document.getElementById('chatButton');
        
        if (chatInterface && chatButton) {
            if (chatInterface.classList.contains('hidden')) {
                chatInterface.classList.remove('hidden');
                chatButton.style.display = 'none';
                const chatInput = document.getElementById('chatInput');
                if (chatInput) {
                    setTimeout(() => chatInput.focus(), 100);
                }
            } else {
                chatInterface.classList.add('hidden');
                chatButton.style.display = 'flex';
            }
        }
    }

    minimizeChat() {
        const chatInterface = document.getElementById('chatInterface');
        const chatButton = document.getElementById('chatButton');
        
        if (chatInterface && chatButton) {
            chatInterface.classList.add('hidden');
            chatButton.style.display = 'flex';
        }
    }

    closeChat() {
        this.minimizeChat();
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        if (!input) return;

        const message = input.value.trim();
        
        if (!message || this.isTyping) return;

        this.addMessage(message, 'user');
        input.value = '';
        
        this.showTyping();
        
        try {
            const response = await this.callPerplexityAPI(message);
            this.hideTyping();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.hideTyping();
            console.error('Chat API Error:', error);
            
            // Provide comprehensive fallback response based on context
            const fallbackResponse = this.generateFallbackResponse(message);
            this.addMessage(fallbackResponse, 'bot');
        }
    }

    generateFallbackResponse(message) {
        const messageLower = message.toLowerCase();
        
        // Stock-specific queries
        const stockSymbols = this.stockData.map(s => s.symbol.toLowerCase());
        const mentionedStock = stockSymbols.find(symbol => messageLower.includes(symbol));
        
        if (mentionedStock) {
            const stock = this.stockData.find(s => s.symbol.toLowerCase() === mentionedStock);
            return `Based on current data for ${stock.name} (${stock.symbol.toUpperCase()}):

**Current Analysis:**
- Price: $${stock.currentPrice} (${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent}%)
- Market Cap: ${stock.marketCap}
- P/E Ratio: ${stock.pe}
- Sector: ${stock.sector}

**Technical Outlook:** ${stock.changePercent > 2 ? 'Strong bullish momentum with potential for continued gains.' : stock.changePercent < -2 ? 'Bearish pressure, consider waiting for better entry points.' : 'Sideways trading, watch for breakout patterns.'}

**Risk Assessment:** ${stock.sector === 'Technology' ? 'Higher volatility expected due to tech sector dynamics.' : 'Moderate volatility based on sector characteristics.'}

Use our Smart Predictor tool for detailed ML-based forecasts and model comparisons.`;
        }
        
        // Market analysis queries
        if (messageLower.includes('market') || messageLower.includes('outlook') || messageLower.includes('trend')) {
            return `**Current Market Analysis:**

**Market Sentiment:** Generally bullish with technology sector leading gains. Key indices showing resilience despite global uncertainties.

**Sector Performance:**
- Technology: Outperforming with AI and semiconductor strength
- Healthcare: Stable performance driven by innovation
- Energy: Mixed signals due to renewable transition
- Finance: Benefiting from interest rate environment

**Key Factors to Watch:**
- Federal Reserve policy decisions
- Earnings season developments
- Geopolitical events and trade policies
- Consumer spending patterns

**Investment Strategy:** Diversify across sectors, focus on quality companies with strong fundamentals, and consider using our ML prediction models for timing decisions.`;
        }
        
        // Investment strategy queries
        if (messageLower.includes('invest') || messageLower.includes('strategy') || messageLower.includes('portfolio')) {
            return `**Investment Strategy Recommendations:**

**Diversification Framework:**
1. **Core Holdings (60-70%):** Large-cap dividend stocks and index funds
2. **Growth Component (20-30%):** Technology and innovation leaders
3. **Defensive Allocation (10-20%):** Healthcare, utilities, consumer staples

**Risk Management:**
- Position sizing: No single stock >5% of portfolio
- Stop-loss orders at -15% from entry
- Regular rebalancing quarterly

**Market Timing Tools:**
- Use our Smart Predictor for entry/exit timing
- Monitor technical indicators (RSI, MACD)
- Consider dollar-cost averaging for volatile markets

**Current Opportunities:** Focus on companies with strong earnings growth, reasonable valuations (P/E <30), and exposure to secular trends like AI, renewable energy, and demographic shifts.`;
        }
        
        // Default comprehensive response
        return `I'm your AI Stock Expert with deep market knowledge. While I'm temporarily unable to access live market feeds, I can provide comprehensive analysis based on the extensive data in our system.

**How I can help:**
🔍 **Stock Analysis:** Detailed fundamental and technical analysis
📊 **Market Insights:** Sector trends and economic impact assessment  
💡 **Investment Strategies:** Portfolio optimization and risk management
⚡ **Trading Guidance:** Entry/exit timing and position sizing
🎯 **Predictions:** ML-powered price forecasts using our 5-model system

**Try asking:**
- "What's your analysis of Apple's current valuation?"
- "Best tech stocks for long-term growth?"
- "How to hedge against market volatility?"
- "Dividend strategies for income investing"

I combine decades of market expertise with real-time data analysis to provide actionable investment insights. What specific area would you like to explore?`;
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'bot' ? 'brain' : 'user'}"></i>
            </div>
            <div class="message-content">
                ${this.formatMessageContent(content)}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.chatMessages.push({ content, sender, timestamp: new Date() });
    }

    formatMessageContent(content) {
        // Convert markdown-like formatting to HTML
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
        content = content.replace(/- (.*?)(?=\n|$)/g, '• $1');
        
        // Convert line breaks to paragraphs
        const paragraphs = content.split('\n\n');
        return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    }

    showTyping() {
        this.isTyping = true;
        const typingIndicator = document.getElementById('typingIndicator');
        const chatSend = document.getElementById('chatSend');
        
        if (typingIndicator) typingIndicator.classList.remove('hidden');
        if (chatSend) chatSend.disabled = true;
    }

    hideTyping() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typingIndicator');
        const chatSend = document.getElementById('chatSend');
        
        if (typingIndicator) typingIndicator.classList.add('hidden');
        if (chatSend) chatSend.disabled = false;
    }

    async callPerplexityAPI(userMessage) {
        const systemPrompt = `You are a world-class stock market expert and financial analyst with 20+ years of experience. You provide comprehensive, accurate, and actionable insights on all aspects of stock trading, investment strategies, market analysis, and financial planning.

Your expertise covers:
- Technical and fundamental analysis
- Market trends and economic indicators  
- Risk management and portfolio optimization
- Earnings analysis and company valuations
- Sector rotation and market timing
- Options trading and derivatives
- International markets and currencies
- Regulatory impacts and policy effects
- News interpretation and sentiment analysis

Always provide detailed, professional responses with specific examples and actionable advice. When discussing current events, use real-time data. When asked about specific stocks, provide comprehensive analysis including technical indicators, fundamentals, and market context. Format responses with clear sections and bullet points when appropriate.`;

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-sonar-large-128k-online',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 800,
                temperature: 0.7,
                top_p: 0.9,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}

// Initialize the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new StockAIApp();
    });
} else {
    window.app = new StockAIApp();
}