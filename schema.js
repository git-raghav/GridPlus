//schema validation using Joi, validates the data before it is sent to the database, reducing db lookups
const Joi = require("joi");

module.exports.meterSchema = Joi.object({
    meter: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        current: Joi.number().min(0).max(20).required(),
        voltage: Joi.number().min(200).max(280).required(),
        powerFactor: Joi.number().min(0).max(1).required(),
        alertCount: Joi.number().required(),
        createdAt: Joi.date().default(Date.now).required(),
        status: Joi.string().required(),
        location: Joi.string().min(2).max(100).required(),
        temperature: Joi.number().min(-20).max(100).required(),
        load: Joi.number().required(),
    }).required(),
});

module.exports.alertSchema = Joi.object({
    alert: Joi.object({
        meterName: Joi.string().required(),
        current: Joi.number().optional(),
        voltage: Joi.number().optional(),
        powerFactor: Joi.number().optional(),
        temperature: Joi.number().optional(),
        load: Joi.number().optional(),
        triggeredAt: Joi.date().default(Date.now).required(),
        reason: Joi.string().required(),
    }).required(),
});
