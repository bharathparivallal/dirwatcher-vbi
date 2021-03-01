const CronJob = require('cron').CronJob;
const controller = require('../watcher/controller');
const { get } = require('../base/base_controller');
const { WATCHER_SETTINGS } = require('./constants');
const setting = require('mongoose').model(WATCHER_SETTINGS);
const job = ({ cronTime, start, timeZone }) => {
    console.log('Service Start ', cronTime);
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

const cron_start = async ({ crons = [] }) => {
    const setting_data = await get(setting, {}, {}, { createdAt: -1 });
    if (setting_data.status)
        process.env.JobTime = '*/' + parseInt(setting_data.data.time_interval) + ' * * * * *';
    console.log(process.env.JobTime);
    crons.forEach((cron) => {
        const cronJob = services[cron]({
            cronTime: process.env.JobTime,
            start: true,
            timeZone: process.env.timeZone,
        });
        cronJob.start();
    });
};

const cron_stop = ({ crons = [] }) => {
    console.log('cron Stopping service');
    crons.forEach((cron, index) => {
        const cronJob = services[cron]({
            cronTime: process.env.JobTime,
            start: false,
            timeZone: process.env.timeZone,
        });
        cronJob.stop();
        delete services[index];
    });
};

module.exports = {
    cron_start,
    cron_stop,
};
