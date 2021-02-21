// const constant = require('../utility/constants');
// const country = require('mongoose').model(constant.COUNTRY);
// const institution = require('mongoose').model(constant.INSTITUTION);
// const base_control = require('../base/base_controller');
// const common_files = require('../utility/common');
// const ObjectId = require('mongodb').ObjectID;

exports.list = async (req, res) => {
  const query = { isDeleted: false };
  const project = { _id: 1, name: 1, code: 1, currency: 1, isDeleted: 1, isActive: 1 };
  const doc = await base_control.list(country, req.query.limit, req.query.pageNo, query, project);
  if (doc.status) {
    common_files.list_all_response(
      res,
      200,
      true,
      'Country List',
      doc.totalDoc,
      doc.totalPages,
      doc.currentPage,
      country_formate.country(doc.data),
    );
  } else {
    common_files.com_response(res, 500, false, 'Error', doc.data);
  }
};
