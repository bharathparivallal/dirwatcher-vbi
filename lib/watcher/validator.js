// const middleware = exports;
const Joi = require('joi');
const common_files = require('../utility/common');

exports.add_reviewer = (req, res, next) => {
    const schema = Joi.object()
        .keys({
            body: Joi.object()
                .keys({
                    location: Joi.string()
                        .required()
                        .error((error) => {
                            return error;
                        }),
                    interval: Joi.number()
                        .required()
                        .error((error) => {
                            return error;
                        }),
                    keyword: Joi.string()
                        .required()
                        .error((error) => {
                            return error;
                        }),
                })
                .unknown(true),
        })
        .unknown(true);
    Joi.validate(req, schema, function (err) {
        if (err) {
            return common_files.com_response(
                res,
                422,
                false,
                'validation error',
                err.details[0].message,
            );
        }
        return next();
    });
};
