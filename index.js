import cron from 'node-cron';
import request from 'request';

const main = () => {
  if (typeof process.env.PVU_TOKEN === 'undefined') {
    console.warn('environment variable PVU_TOKEN needed, check .env.example');
    return;
  }
  cron.schedule('* * * * *', () => {
    request(
      'https://backend-farm.plantvsundead.com/farms?limit=10&offset=0',
      { json: true, headers: { Authorization: `Bearer Token: ${process.env.PVU_TOKEN}` } },
      (err, res, body) => {
        if (err) {
          console.error(err);
        }
        // handle success
        const { data, total } = body;
        const canHarvest = [];
        const needWater = [];
        const hasCrow = [];
        const hasSeed = [];

        for (const farmingPlant of data) {
          if (farmingPlant.totalHarvest > 0) {
            canHarvest.push(farmingPlant.plantId);
          }
          if (farmingPlant.needWater) {
            needWater.push(farmingPlant.plantId);
          }
          if (farmingPlant.hasCrow) {
            hasCrow.push(farmingPlant.plantId);
          }
          if (farmingPlant.hasSeed) {
            hasSeed.push(farmingPlant.plantId);
          }
        }
        console.log({
          canHarvest,
          needWater,
          hasCrow,
          hasSeed,
        });
      }
    );
  });
};

main();
