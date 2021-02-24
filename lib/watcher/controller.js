const fs = require('fs');
const { WATCHER_SETTINGS, WATCHERS } = require('../utility/constants');
const setting = require('mongoose').model(WATCHER_SETTINGS);
const watcher = require('mongoose').model(WATCHERS);
// const test_folder = '/home/digival-pbp/PBP/PBP/VBI/Dir';
// const test_folder = '/home/digival-pbp/PBP/PBP/VBI Assessment/Dir';
const directoryFiles = require('directory-tree');
const { get_sort_limit, insert, get_list, list_sort } = require('../base/base_controller');
const { response_function, list_all_response_function } = require('../utility/common');
// const matching_key = 'PBP';

exports.check_dir = async (req, res) => {
    try {
        const file_logs = [];
        const setting_data = await get_sort_limit(setting, {}, {}, { createdAt: -1 }, 1);
        if (setting_data.status) {
            const { dir_location, matching_keyword, _id } = setting_data.data[0];
            const dir_files = directoryFiles(dir_location);
            if (!dir_files) return res.send('Check Directory Location');
            const validating_files = dir_files.children.filter((i) => i.extension === '.txt');
            const log_datas = await get_list(watcher, {}, {}, { createdAt: -1 });
            let file_names = [];
            if (log_datas.status) {
                log_datas.data.forEach((element) => {
                    file_names = file_names.concat(element.log.map((i) => i.file_name));
                });
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
                        // console.log(file_data.name, ' ', index + 1, ' ', match);
                        match_occurrence.push({
                            line_no: index + 1,
                            occurrence: match,
                        });
                    }
                    // const match = line.match(setting_data.data[0].matching_keyword);
                    // if (match) console.log(file_data.name, ' ', index + 1, ' ', match);
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
            if (!logging.status)
                return res
                    .status(410)
                    .send(response_function(res, 410, false, 'Unable to Add log'));

            return res.status(200).send(response_function(res, 200, true, 'Log added'));
        }
    } catch (error) {
        console.error(error);
    }
};

exports.setting_set = async (req, res) => {
    try {
        const objs = {
            dir_location: req.body.location,
            time_interval: req.body.interval,
            matching_keyword: req.body.keyword,
        };
        const insert_setting = await insert(setting, objs);
        if (!insert_setting.status)
            return res
                .status(410)
                .send(response_function(res, 410, false, 'Unable to set Setting retry'));

        // After Setting Set need to Restart Cron Job with new setting
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
    }
};
