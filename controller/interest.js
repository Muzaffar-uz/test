const calculateProfit = require('./calculator');

exports.interest = ('/calculate', async (req, res) => {
    try {
        const data = req.body;

        // Kiritilgan ma'lumotlarni tekshirish
        if (!data.initialAmount || !data.duration || !data.currency) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        // Hisob-kitobni amalga oshirish
        const result = calculateProfit(data);

        // Javobni qaytarish
        res.json(result);
    } catch (error) {
        // Xatolikni ushlash va javob qaytarish
        console.error('Error calculating profit:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});