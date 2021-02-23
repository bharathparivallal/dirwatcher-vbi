module.exports = {
    get: async (Model, query, project) => {
        let response_obj = null;
        try {
            const doc = await Model.findOne(query, project);
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

    get_sort_limt: async (Model, query, project, sort, limit) => {
        let response_obj = null;
        try {
            const doc = await Model.find(query, project).sort(sort).limit(limit);
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
                // console.log(doc);
            }
        } catch (error) {
            let objs = error;
            // console.log(error);
            // console.log(error.name);
            // console.log(error.code);
            // console.log(error.keyValue);
            // console.log(error.message);
            // console.log(error.name === 'MongoError' && error.code === 11000);
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

    update: async (Model, object_id, objects) => {
        let response_obj = null;
        try {
            // console.log(object_id, objects);
            const doc = await Model.updateOne({ _id: object_id }, { $set: objects });
            // console.log(doc);
            if (!doc) {
                response_obj = {
                    status: false,
                    data: 'Updating error',
                };
            } else {
                if (doc.nModified > 0) {
                    response_obj = {
                        status: true,
                        data: 'Updating successfully',
                        responses: doc,
                    };
                } else {
                    response_obj = {
                        status: false,
                        data: 'Updating error check parsing data',
                    };
                }
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

    update_condition: async (Model, cond, objects) => {
        let response_obj = null;
        try {
            // console.log(object_id, objects);
            const doc = await Model.updateOne(cond, objects);
            // console.log(doc);
            if (!doc) {
                response_obj = {
                    status: false,
                    data: 'Updating error',
                };
            } else {
                if (doc.nModified > 0) {
                    response_obj = {
                        status: true,
                        data: 'Updating successfully',
                        responses: doc,
                    };
                } else {
                    response_obj = {
                        status: false,
                        data: 'Updating error check parsing data',
                    };
                }
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

    update_condition_array_filter: async (Model, cond, objects, filter) => {
        let response_obj = null;
        try {
            // console.log(object_id, objects);
            const doc = await Model.updateOne(cond, objects, filter);
            // console.log(doc);
            if (!doc) {
                response_obj = {
                    status: false,
                    data: 'Updating error',
                };
            } else {
                if (doc.nModified > 0) {
                    response_obj = {
                        status: true,
                        data: 'Updating successfully',
                        responses: doc,
                    };
                } else {
                    response_obj = {
                        status: false,
                        data: 'Updating error check parsing data',
                    };
                }
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

    update_many: async (Model, object_id, objects) => {
        let response_obj = null;
        try {
            // console.log(object_id, objects);
            const doc = await Model.updateMany({ _id: object_id }, objects);
            // console.log(doc);
            if (!doc) {
                response_obj = {
                    status: false,
                    data: 'Updating error',
                };
            } else {
                if (doc.nModified > 0) {
                    response_obj = {
                        status: true,
                        data: 'Updating successfully',
                        responses: doc,
                    };
                } else {
                    response_obj = {
                        status: false,
                        data: 'Updating error check parsing data',
                    };
                }
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

    update_many_with_array_filter: async (Model, query, object, array_filter) => {
        let response_obj = null;
        try {
            // console.log(object_id, objects);
            const doc = await Model.updateMany(query, object, array_filter);
            // console.log(doc);
            if (!doc) {
                response_obj = {
                    status: false,
                    data: 'Updating error',
                };
            } else {
                if (doc.nModified > 0) {
                    response_obj = {
                        status: true,
                        data: 'Updating successfully',
                        responses: doc,
                    };
                } else {
                    response_obj = {
                        status: false,
                        data: 'Updating error check parsing data',
                    };
                }
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

    update_push_pull: async (Model, object_id, objects) => {
        let response_obj = null;
        try {
            const doc = await Model.updateOne({ _id: object_id }, objects);
            if (!doc) {
                response_obj = {
                    status: false,
                    data: 'IDs pushed error',
                };
            } else {
                if (doc.nModified > 0) {
                    response_obj = {
                        status: true,
                        data: 'IDs Pushed/Pulled successfully',
                    };
                } else {
                    response_obj = {
                        status: false,
                        data: 'IDs Pushed/Pulled error check parsing data',
                    };
                }
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

    update_push_pull_many: async (Model, object_id, objects) => {
        let response_obj = null;
        try {
            const doc = await Model.updateMany(object_id, objects);
            if (!doc) {
                response_obj = {
                    status: false,
                    data: 'IDs pushed error',
                };
            } else {
                if (doc.nModified > 0) {
                    response_obj = {
                        status: true,
                        data: 'IDs Pushed/Pulled successfully',
                    };
                } else {
                    response_obj = {
                        status: false,
                        data: 'IDs Pushed/Pulled error check parsing data',
                    };
                }
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

    delete: async (Model, object_id) => {
        let response_obj = null;
        try {
            const doc = await Model.updateOne({ _id: object_id }, { $set: { isDeleted: true } });
            if (!doc) {
                response_obj = {
                    status: false,
                    data: 'Delete error',
                };
            } else {
                if (doc.nModified > 0) {
                    response_obj = {
                        status: true,
                        data: 'Deleted successfully',
                    };
                } else {
                    response_obj = {
                        status: false,
                        data: 'Delete error check parsing data',
                    };
                }
            }
        } catch (error) {
            response_obj = {
                status: false,
                data: 'Error catch : ' + error,
            };
        }
        return response_obj;
    },

    get_list: async (Model, query, project) => {
        let response_obj = null;
        try {
            // console.log(query, project);
            // console.log(query[0].$match.title);
            const doc = await Model.find(query, project);
            // console.log(doc);
            if (doc.length === 0) {
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

    get_list_sort: async (Model, query, project, sorts) => {
        let response_obj = null;
        try {
            // console.log(query, project);
            // console.log(query[0].$match.title);
            const doc = await Model.find(query, project).sort(sorts);
            // console.log(doc);
            if (doc.length === 0) {
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

    bulk_write: async (Model, objects) => {
        let response_obj = null;
        try {
            const doc = await Model.bulkWrite(objects);
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
                // console.log(doc);
            }
        } catch (error) {
            let objs = error;
            // console.log(error);
            // console.log(error.name);
            // console.log(error.code);
            // console.log(error.keyValue);
            // console.log(error.message);
            // console.log(error.name === 'MongoError' && error.code === 11000);
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
