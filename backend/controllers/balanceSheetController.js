const Asset = require('../models/Asset');
const Liability = require('../models/Liability');

const generateBalanceSheet = async (req, res) => {
  try {
    const assets = await Asset.find();
    const liabilities = await Liability.find();

    const currentAssets = assets
      .filter(a => a.assetType === 'Current')
      .reduce((sum, a) => sum + Number(a.assetValue), 0);

    const nonCurrentAssets = assets
      .filter(a => a.assetType === 'Non-current')
      .reduce((sum, a) => sum + Number(a.assetValue), 0);

    const totalAssets = currentAssets + nonCurrentAssets;

    const currentLiabilities = liabilities
      .filter(l => l.liabilityType === 'Current')
      .reduce((sum, l) => sum + Number(l.liabilityAmount), 0);

    const nonCurrentLiabilities = liabilities
      .filter(l => l.liabilityType === 'Non-current')
      .reduce((sum, l) => sum + Number(l.liabilityAmount), 0);

    const totalLiabilities = currentLiabilities + nonCurrentLiabilities;

    const equity = totalAssets - totalLiabilities;

    res.status(200).json({
      currentAssets,
      nonCurrentAssets,
      totalAssets,
      currentLiabilities,
      nonCurrentLiabilities,
      totalLiabilities,
      equity
    });
  } catch (error) {
    console.error('Error generating balance sheet:', error);
    res.status(500).json({
      message: 'Failed to generate balance sheet',
      error: error.message
    });
  }
};

module.exports = { generateBalanceSheet };
