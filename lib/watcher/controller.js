const fs = require('fs');
const test_folder = '/home/digival-pbp/PBP/PBP/VBI Assessment/Dir';
const directoryFiles = require('directory-tree');
const matching_key = 'PBP';
exports.check_dir = async (req, res) => {
    try {
        const dir_files = directoryFiles(test_folder);
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
