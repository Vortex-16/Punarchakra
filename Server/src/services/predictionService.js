const BinFillHistory = require('../models/BinFillHistory');
const Bin = require('../models/Bin');

/**
 * Calculate linear regression for fill level prediction
 * Returns slope and intercept for the equation: fillLevel = slope * time + intercept
 */
function linearRegression(dataPoints) {
    if (dataPoints.length < 2) return null;

    const n = dataPoints.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    dataPoints.forEach(point => {
        const x = point.x; // time in milliseconds
        const y = point.y; // fill level
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared for confidence
    const yMean = sumY / n;
    let ssTotal = 0, ssResidual = 0;
    dataPoints.forEach(point => {
        const yPredicted = slope * point.x + intercept;
        ssTotal += Math.pow(point.y - yMean, 2);
        ssResidual += Math.pow(point.y - yPredicted, 2);
    });
    const rSquared = 1 - (ssResidual / ssTotal);

    return { slope, intercept, rSquared, dataPointCount: n };
}

/**
 * Predict when a bin will reach 100% capacity
 */
async function predictFillTime(binId, daysOfHistory = 14) {
    try {
        // Get current bin status
        const bin = await Bin.findById(binId);
        if (!bin) return null;

        // Get historical data
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOfHistory);

        const history = await BinFillHistory.find({
            binId: binId,
            timestamp: { $gte: cutoffDate }
        }).sort({ timestamp: 1 });

        if (history.length < 2) {
            // Not enough data for prediction
            return {
                binId,
                currentFillLevel: bin.fillLevel,
                predictedFullDate: null,
                fillRate: null,
                daysUntilFull: null,
                hoursUntilFull: null,
                confidence: 'insufficient_data',
                message: 'Not enough historical data for prediction'
            };
        }

        // Prepare data points for regression
        const dataPoints = history.map(record => ({
            x: record.timestamp.getTime(),
            y: record.fillLevel
        }));

        // Add current point if not already included
        const lastHistoryTime = history[history.length - 1].timestamp.getTime();
        const now = Date.now();
        if (now - lastHistoryTime > 3600000) { // More than 1 hour difference
            dataPoints.push({
                x: now,
                y: bin.fillLevel
            });
        }

        const regression = linearRegression(dataPoints);
        if (!regression || regression.slope <= 0) {
            // No positive trend or regression failed
            return {
                binId,
                currentFillLevel: bin.fillLevel,
                predictedFullDate: null,
                fillRate: 0,
                daysUntilFull: null,
                hoursUntilFull: null,
                confidence: 'stable',
                message: 'Fill level is stable or decreasing'
            };
        }

        // Calculate when bin will reach 100%
        // 100 = slope * timeAtFull + intercept
        // timeAtFull = (100 - intercept) / slope
        const timeAtFull = (100 - regression.intercept) / regression.slope;
        const predictedFullDate = new Date(timeAtFull);
        const millisecondsUntilFull = timeAtFull - now;
        const hoursUntilFull = millisecondsUntilFull / (1000 * 60 * 60);
        const daysUntilFull = hoursUntilFull / 24;

        // Calculate fill rate (percentage per day)
        const fillRatePerMs = regression.slope;
        const fillRatePerDay = fillRatePerMs * (1000 * 60 * 60 * 24);

        // Determine confidence based on R-squared
        let confidence;
        if (regression.rSquared > 0.8) confidence = 'high';
        else if (regression.rSquared > 0.5) confidence = 'medium';
        else confidence = 'low';

        // If prediction is in the past or too far in future, mark as low confidence
        if (daysUntilFull < 0 || daysUntilFull > 365) {
            confidence = 'low';
        }

        return {
            binId,
            currentFillLevel: bin.fillLevel,
            predictedFullDate: daysUntilFull > 0 && daysUntilFull < 365 ? predictedFullDate : null,
            fillRate: Math.round(fillRatePerDay * 100) / 100,
            daysUntilFull: daysUntilFull > 0 ? Math.round(daysUntilFull * 10) / 10 : null,
            hoursUntilFull: hoursUntilFull > 0 ? Math.round(hoursUntilFull * 10) / 10 : null,
            confidence,
            rSquared: Math.round(regression.rSquared * 100) / 100,
            dataPoints: regression.dataPointCount
        };
    } catch (error) {
        console.error('Error predicting fill time:', error);
        return null;
    }
}

/**
 * Get predictions for all bins
 */
async function predictAllBins(daysOfHistory = 14) {
    try {
        const bins = await Bin.find({});
        const predictions = await Promise.all(
            bins.map(bin => predictFillTime(bin._id, daysOfHistory))
        );
        return predictions.filter(p => p !== null);
    } catch (error) {
        console.error('Error predicting all bins:', error);
        return [];
    }
}

/**
 * Get collection priority list
 * Returns bins sorted by urgency
 */
async function getCollectionPriority() {
    const predictions = await predictAllBins();
    
    // Filter bins that need attention
    const urgentBins = predictions.filter(p => {
        if (!p.hoursUntilFull) return false;
        return p.hoursUntilFull < 48; // Less than 48 hours
    }).sort((a, b) => (a.hoursUntilFull || Infinity) - (b.hoursUntilFull || Infinity));

    const soonBins = predictions.filter(p => {
        if (!p.hoursUntilFull) return false;
        return p.hoursUntilFull >= 48 && p.hoursUntilFull < 168; // 48 hours to 7 days
    }).sort((a, b) => (a.hoursUntilFull || Infinity) - (b.hoursUntilFull || Infinity));

    const stableBins = predictions.filter(p => {
        if (!p.hoursUntilFull) return true;
        return p.hoursUntilFull >= 168; // More than 7 days
    }).sort((a, b) => (a.hoursUntilFull || Infinity) - (b.hoursUntilFull || Infinity));

    return {
        urgent: urgentBins,
        soon: soonBins,
        stable: stableBins,
        totalBins: predictions.length
    };
}

/**
 * Record a fill level change
 */
async function recordFillLevel(binId, fillLevel, source = 'manual') {
    try {
        const record = await BinFillHistory.create({
            binId,
            fillLevel,
            source,
            timestamp: new Date()
        });
        return record;
    } catch (error) {
        console.error('Error recording fill level:', error);
        return null;
    }
}

module.exports = {
    predictFillTime,
    predictAllBins,
    getCollectionPriority,
    recordFillLevel
};
