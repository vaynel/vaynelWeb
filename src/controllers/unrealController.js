const TestData = require('../models/testData')
const { v4: uuidv4 } = require('uuid');

exports.generateData = async(req,res)=>{

    try {
        // TestData 테이블의 현재 레코드 수를 가져옵니다.
        const recordCount = await TestData.count();

        let data = [];
        for (let i = recordCount; i < recordCount + 5; i++) {
            let item = {
                id: uuidv4(),
                prod_id: `prodId_${i}`,
                prod_name: `Product Name ${i}`,
                image: `Image_${i}.png`,
                info: `Info about Product ${i}`
            };
            data.push(item);

            try {
                await TestData.create(item);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to save data to the database' });
                return;
            }
        }
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to count data from the database' });
    }
}