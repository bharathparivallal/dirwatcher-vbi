const CronJob = require('cron').CronJob;
const controller = require('../watcher/controller');
const job = ({ cronTime, start, timeZone }) => {
    return new CronJob({
        cronTime,
        onTick: () => {
            controller.watcher_runner();
            console.log('running a task every ' + process.env.JobTime);
        },
        onComplete: () => {
            console.log('task completed');
        },
        start,
        timeZone,
    });
};

const services = {
    job,
};

const cronStart = ({ crons = [] }) => {
    crons.forEach((cron) => {
        const cronJob = services[cron]({
            cronTime: process.env.JobTime,
            start: true,
            timeZone: process.env.timeZone,
        });
        cronJob.start();
    });
};

const cronStop = ({ crons = [] }) => {
    crons.forEach((cron, index) => {
        const cronJob = services[cron]({
            cronTime: '*/1 * * * * *',
            start: false,
            timeZone: process.env.timeZone,
        });
        cronJob.stop();
        delete services[index];
    });
};

module.exports = {
    cronStart,
    cronStop,
};
