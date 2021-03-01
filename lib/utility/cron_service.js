const CronJob = require('cron').CronJob;
const controller = require('../watcher/controller');
const { get } = require('../base/base_controller');
const { WATCHER_SETTINGS } = require('./constants');
const setting = require('mongoose').model(WATCHER_SETTINGS);

function job({ cronTime, start, timeZone }) {
    return new CronJob(
        cronTime,
        () => {
            console.log('Running a task - ' + process.env.JobTime);
            controller.watcher_runner();
        },
        null,
        start,
        timeZone,
    );
}

let cronJobs;
const cron_start = async () => {
    console.log('Starting cron service');
    const setting_data = await get(setting, {}, {}, { createdAt: -1 });
    if (setting_data.status)
        process.env.JobTime = '*/' + parseInt(setting_data.data.time_interval) + ' * * * * *';
    cronJobs = job({
        cronTime: process.env.JobTime,
        start: true,
        timeZone: process.env.timeZone,
    });
};

const cron_stop = () => {
    console.log('Stopping cron service');
    cronJobs.stop();
};

module.exports = {
    cron_start,
    cron_stop,
};
