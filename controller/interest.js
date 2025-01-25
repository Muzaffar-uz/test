const calculateProfit = require('./calculator');

exports.interest =  async (req, res) => {
    try {
        const { initialAmount, duration, currency, reinvest, } = data;
        const data = req.body;


        let annualRate;
        let totalProfit = 0; // Jami foyda
        // Valyutaga qarab foiz stavkasini belgilash
        if (currency == 'USD' && reinvest === "reinvest") {
            annualRate = 12; 
    
        }else if (currency == "USD") {
            annualRate = 7;
        } else if (currency == 'SUM' && reinvest === "reinvest") {
            if (duration === 12) {
                annualRate = 24;
            } else if (duration === 18) {
                annualRate = 26;
            } else if (duration === 24) {
                annualRate = 30;
            }   
        } else if (currency == 'SUM') {
           
            if (duration === 12) {
                annualRate = 22;
            } else if (duration === 18) {
                annualRate = 24;
            } else if (duration === 24) {
                annualRate = 30;
            } 
        }
        console.log(`Annual Rate: ${annualRate}%`);
        const monthlyRate = annualRate / 12
        if (reinvest) {
            // Oylik foydani reinvest qilish
            let amount = initialAmount;
            for (let i = 0; i < duration; i++) {
                const profit = amount * (monthlyRate / 100); // Oylik foyda
                totalProfit += profit; // Jami foyda
                amount += profit; // Reinvest qilingan summa
            }
        } else {
            // Faqat oylik foyda (reinvestsiz)
            totalProfit = initialAmount * (monthlyRate / 100) * duration;
        }
        return {
            totalProfit: Math.round(totalProfit), // Umumiy foyda
            percentage: Math.round((totalProfit / initialAmount) * 100), // Foyda foizi
        };

    } catch (error) {
        // Xatolikni ushlash va javob qaytarish
        console.error('Error calculating profit:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};