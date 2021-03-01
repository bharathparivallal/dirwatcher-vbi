const fs = require('fs');
const { WATCHER_SETTINGS, WATCHERS } = require('../utility/constants');
const setting = require('mongoose').model(WATCHER_SETTINGS);
const watcher = require('mongoose').model(WATCHERS);
const directoryFiles = require('directory-tree');
const { get_sort_limit, insert, list_sort, get } = require('../base/base_controller');
const { response_function, list_all_response_function } = require('../utility/common');
const { cron_start, cron_stop } = require('../utility/cron_service');

exports.setting_set = async (req, res) => {
    try {
        cron_stop();
        const dir_files = directoryFiles(req.body.location);
        if (!dir_files)
            return res.status(404).send(response_function(res, 404, false, 'Directory Not Found'));
        const objs = {
            dir_location: req.body.location,
            time_interval: req.body.interval,
            matching_keyword: req.body.keyword,
        };
        process.env.JobTime = '*/' + parseInt(req.body.interval) + ' * * * * *';
        const insert_setting = await insert(setting, objs);
        if (!insert_setting.status)
            return res
                .status(410)
                .send(response_function(res, 410, false, 'Unable to set Setting retry'));
        // After Setting Set need to Restart Cron Job with new setting
        cron_start();
        return res.status(200).send(response_function(res, 200, true, 'Setting added'));
    } catch (error) {
        console.error(error);
    }
};

exports.watcher_logs = async (req, res) => {
    try {
        const log_list = await list_sort(
            watcher,
            req.query.limit,
            req.query.pageNo,
            {},
            {},
            {
                createdAt: -1,
            },
        );
        if (!log_list.status)
            return res
                .status(410)
                .send(response_function(res, 410, false, 'Unable to Fetch Watcher Logs'));
        return res
            .status(200)
            .send(
                list_all_response_function(
                    res,
                    200,
                    true,
                    'Watcher Log',
                    log_list.totalDoc,
                    log_list.totalPages,
                    log_list.currentPage,
                    log_list.data,
                ),
            );
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send(response_function(res, 500, false, 'App Rebooting', error.toString()));
    }
};

exports.watcher_runner = async () => {
    try {
        const file_logs = [];
        const setting_data = await get_sort_limit(setting, {}, {}, { createdAt: -1 }, 1);
        if (setting_data.status && setting_data.data.length !== 0) {
            const { dir_location, matching_keyword, _id } = setting_data.data[0];
            const dir_files = directoryFiles(dir_location);
            if (!dir_files) {
                console.log('Check Directory Location');
                return 'Check Directory Location';
            }
            const validating_files = dir_files.children.filter((i) => i.extension === '.txt');
            const log_datas = await get(watcher, {}, {}, { createdAt: -1 });
            let file_names = [];
            if (log_datas.status) {
                file_names = log_datas.data.log.map((i) => i.file_name);
            }
            file_names = [...new Set(file_names)];
            for (file_data of validating_files) {
                const match_occurrence = [];
                const data = fs.readFileSync(file_data.path, 'UTF-8');
                const lines = data.split(/\r?\n/);
                let file_status = 'new';
                lines.forEach((line, index) => {
                    const match = line.split(matching_keyword).length - 1;
                    if (match !== 0) {
                        match_occurrence.push({
                            line_no: index + 1,
                            occurrence: match,
                        });
                    }
                });
                const arr_index = file_names.findIndex(
                    (i) => i.toString() === file_data.name.toString(),
                );
                if (arr_index !== -1) {
                    file_status = 'old';
                    file_names.splice(arr_index, 1);
                }
                file_logs.push({
                    file_name: file_data.name,
                    changes: match_occurrence,
                    file_status,
                });
            }
            file_names.forEach((element) => {
                file_logs.push({
                    file_name: element,
                    file_status: 'removed',
                });
            });
            const logs = {
                _setting_id: _id,
                log: file_logs,
            };
            const logging = await insert(watcher, logs);
            if (!logging.status) {
                console.log('Unable to Add log');
                return response_function(null, 410, false, 'Unable to Add log');
            }
            console.log('Log added');
            return response_function(null, 200, true, 'Log added');
        }
    } catch (error) {
        console.error(error);
        return response_function(null, 500, false, 'App Rebooting', error.toString());
    }
};
