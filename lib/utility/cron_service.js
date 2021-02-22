// const CronJob = require('cron').CronJob;

// const {
//     logger,
//     cronAssessmentBundle,
//     cronItemRequestExpiry,
//     cronExamScheduleReminder,
// } = require('../config');

// const timeZoneSA = 'Asia/Riyadh';

// const cronInitAssessmentBundle = ({
//     cronTime = cronAssessmentBundle,
//     start = false,
//     timeZone = timeZoneSA,
// }) => {
//     return new CronJob({
//         cronTime,
//         onTick: () => {
//             logger.info(new Date(), 'cronInitAssessmentBundle started at:');
//             initAssessmentBundle({ initBy: 'cron' })
//                 .then((resp) => {
//                     logger.info(
//                         resp,
//                         'cronService -> cronInitAssessmentBundle -> initAssessmentBundle -> resp:',
//                     );
//                 })
//                 .catch((err) => {
//                     logger.error(
//                         err,
//                         'cronService -> cronInitAssessmentBundle -> initAssessmentBundle -> err:',
//                     );
//                 });
//         },
//         onComplete: () => {
//             logger.info('cronInitAssessmentBundle completed');
//         },
//         start,
//         timeZone,
//     });
// };

// // update item status as expired when due date is passed
// const cronInitItemRequestExpiry = ({
//     cronTime = cronItemRequestExpiry,
//     start = false,
//     timeZone = timeZoneSA,
// }) => {
//     return new CronJob({
//         cronTime,
//         onTick: () => {
//             logger.info(new Date(), 'cronInitItemRequestExpiry started at:');
//             updateRequestStatusAsExpiredIfDueDatePassed()
//                 .then((resp) => {
//                     logger.info(
//                         resp,
//                         'cronService -> cronInitItemRequestExpiry -> initItemRequestExpiry -> resp:',
//                     );
//                 })
//                 .catch((err) => {
//                     logger.error(
//                         err,
//                         'cronService -> cronInitItemRequestExpiry -> initItemRequestExpiry -> err:',
//                     );
//                 });
//         },
//         onComplete: () => {
//             logger.info(new Date(), 'cronInitItemRequestExpiry completed');
//         },
//         start,
//         timeZone,
//     });
// };

// // send reminder to invigilator a day before the exam scheduled date
// const cronInitExamScheduleReminder = ({
//     cronTime = cronExamScheduleReminder,
//     start = false,
//     timeZone = timeZoneSA,
// }) => {
//     return new CronJob({
//         cronTime,
//         onTick: () => {
//             logger.info(new Date(), 'cronInitExamScheduleReminder started at:');
//             getExamCourseBeforeExamScheduledDate()
//                 .then((resp) => {
//                     logger.info(
//                         resp,
//                         'cronService -> cronInitExamScheduleReminder -> initExamScheduleReminder -> resp:',
//                     );
//                 })
//                 .catch((err) => {
//                     logger.error(
//                         err,
//                         'cronService -> cronInitExamScheduleReminder -> initExamScheduleReminder -> err:',
//                     );
//                 });
//         },
//         onComplete: () => {
//             logger.info(new Date(), 'cronInitExamScheduleReminder completed');
//         },
//         start,
//         timeZone,
//     });
// };

// const cronJobs = {
//     cronInitAssessmentBundle,
//     cronInitItemRequestExpiry,
//     cronInitExamScheduleReminder,
// };

// const cronInit = ({ crons = [] }) => {
//     crons.forEach((cron) => {
//         const cronJob = cronJobs[cron]({});
//         cronJob.start();
//     });
// };

// module.exports = {
//     ...cronJobs,
//     cronInit,
// };
