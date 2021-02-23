const fs = require('fs');
const { WATCHER_SETTINGS } = require('../utility/constants');
const setting = require('mongoose').model(WATCHER_SETTINGS);
// const test_folder = '/home/digival-pbp/PBP/PBP/VBI/Dir';
const test_folder = '/home/digival-pbp/PBP/PBP/VBI Assessment/Dir';
const directoryFiles = require('directory-tree');
const base_controller = require('../base/base_controller');
const { response_function } = require('../utility/common');
// const { base } = require('../models/watcher_log');
const matching_key = 'PBP';

exports.check_dir = async (req, res) => {
    try {
        const dir_files = directoryFiles(test_folder);
        if (!dir_files) return res.send('Check Directory Location');
        const validating_files = dir_files.children.filter((i) => i.extension === '.txt');
        for (file_data of validating_files) {
            const data = fs.readFileSync(file_data.path, 'UTF-8');
            const lines = data.split(/\r?\n/);
            lines.forEach((line, index) => {
                const match = line.match(matching_key);
                if (match) console.log(file_data.name, ' ', index + 1, ' ', match);
            });
        }
        return res.send(validating_files);
    } catch (error) {
        console.error(error);
    }
};

exports.setting_set = async (req, res) => {
    try {
        const objs = {
            dir_location: req.body.location,
            time_interval: req.body.interval,
            keyword: req.body.keyword,
        };
        console.log(objs);
        const insert_setting = await base_controller.insert(setting, objs);
        if (!insert_setting.status)
            return res
                .status(410)
                .send(response_function(res, 410, false, 'Unable to set Setting retry'));

        // After Setting Set need to Restart Cron Job with new setting
        return res.status(410).send(response_function(res, 200, true, 'Setting added'));
    } catch (error) {
        console.error(error);
    }
};
