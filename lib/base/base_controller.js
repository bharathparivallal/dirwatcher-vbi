module.exports = {
    list_sort: async (Model, limit, page, query, project, sort) => {
        let response_obj = {};
        try {
            let doc = null;
            const perPage = parseInt(limit > 0 ? limit : 10);
            const pageNo = parseInt(page > 0 ? page : 1);

            doc = await Model.find(query, project)
                .sort(sort)
                .skip(perPage * (pageNo - 1))
                .limit(perPage);
            const totalDoc = await Model.find(query).countDocuments().exec();
            if (!doc) {
                response_obj = {
                    status: false,
                    data: doc,
                };
            } else {
                response_obj = {
                    status: true,
                    totalDoc,
                    totalPages: Math.ceil(totalDoc / perPage),
                    currentPage: pageNo,
                    data: doc,
                };
            }
        } catch (error) {
            response_obj = {
                status: false,
                data: 'Error catch : ' + error,
            };
        }
        return response_obj;
    },

    get: async (Model, query, project, sort) => {
        let response_obj = null;
        try {
            const doc = await Model.findOne(query, project).sort(sort);
            if (!doc) {
                response_obj = {
                    status: false,
                    data: 'Not found',
                };
            } else {
                response_obj = {
                    status: true,
                    data: doc,
                };
            }
        } catch (error) {
            response_obj = {
                status: false,
                data: 'Error catch : ' + error,
            };
        }
        return response_obj;
    },

    get_sort_limit: async (Model, query, project, sort, limit) => {
        let response_obj = null;
        try {
            const doc = await Model.find(query, project).sort(sort).limit(limit);
            if (!doc) {
                response_obj = {
                    status: false,
                    data: [],
                };
            } else {
                response_obj = {
                    status: true,
                    data: doc,
                };
            }
        } catch (error) {
            response_obj = {
                status: false,
                data: 'Error catch : ' + error,
            };
        }
        return response_obj;
    },

    insert: async (Model, objects) => {
        let response_obj = null;
        try {
            const doc = await Model.create(objects);
            if (!doc) {
                response_obj = {
                    status: false,
                    data: 'adding error',
                };
            } else {
                response_obj = {
                    status: true,
                    data: 'Added successfully',
                    responses: doc,
                };
            }
        } catch (error) {
            let objs = error;
            if (error.name === 'MongoError' && error.code === 11000) {
                objs = {
                    message: 'Duplicate value',
                    field: error.keyValue,
                };
            } else {
                objs = 'Error catch : ' + error;
            }
            response_obj = {
                status: false,
                data: objs,
            };
        }
        return response_obj;
    },
};
