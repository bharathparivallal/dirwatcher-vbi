
/**
 * Returning LMS Data
 * @returns {Promise<Assigned Role Get>}
 */
function lms_data() {
    let data = {
        "name": "Leave Management",
        "_id": "5ff8355bbb30e4097a9cae97",
        "pages": [
            {
                "name": "Approve Leave",
                "_id": "5ff8355bbb30e42b5d9caef9",
                "url": "",
                "actions": [
                    {
                        "name": "View",
                        "_id": "5ff8355bbb30e4b3289caefa"
                    }
                ],
                "tabs": [
                    {
                        "name": "Permission",
                        "_id": "5ff8355bbb30e441d29caefb",
                        "url": "",
                        "actions": [
                            {
                                "name": "View",
                                "_id": "5ff8355bbb30e453729caefc"
                            },
                            {
                                "name": "Export",
                                "_id": "5ff8355bbb30e4e35c9caefd"
                            },
                            {
                                "name": "Review Pending",
                                "_id": "5ff8355bbb30e43b199caefe"
                            },
                            {
                                "name": "Reviewed",
                                "_id": "5ff8355bbb30e4a1589caeff"
                            },
                            {
                                "name": "Rejected",
                                "_id": "5ff8355bbb30e4425b9caf00"
                            },
                            {
                                "name": "Action",
                                "_id": "5ff8355bbb30e4ff149caf01"
                            },
                            {
                                "name": "Profile View",
                                "_id": "5ff8355bbb30e44fb49caf02"
                            }
                        ],
                        "subTabs": [
                            {
                                "name": "Review",
                                "_id": "5ff8355bbb30e4291e9caf03",
                                "url": "",
                                "actions": [
                                    {
                                        "name": "Reject",
                                        "_id": "5ff8355bbb30e4e9a49caf04"
                                    },
                                    {
                                        "name": "Complete Review",
                                        "_id": "5ff8355bbb30e449319caf05"
                                    },
                                    {
                                        "name": "Comment",
                                        "_id": "5ff8355bbb30e4c5339caf06"
                                    },
                                    {
                                        "name": "Subsitute Staff",
                                        "_id": "5ff8355bbb30e4d4199caf07"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "Leave",
                        "_id": "5ff8355bbb30e45d5d9caf09",
                        "url": "",
                        "actions": [
                            {
                                "name": "Export",
                                "_id": "5ff8355bbb30e432499caf0a"
                            },
                            {
                                "name": "Review Pending",
                                "_id": "5ff8355bbb30e45a559caf0b"
                            },
                            {
                                "name": "Reviewed",
                                "_id": "5ff8355bbb30e470e99caf0c"
                            },
                            {
                                "name": "Rejected",
                                "_id": "5ff8355bbb30e4f5919caf0d"
                            },
                            {
                                "name": "Action",
                                "_id": "5ff8355bbb30e4bdd49caf0e"
                            },
                            {
                                "name": "Profile View",
                                "_id": "5ff8355bbb30e4f7219caf0f"
                            }
                        ],
                        "subTabs": [
                            {
                                "name": "Review",
                                "_id": "5ff8355bbb30e41d679caf10",
                                "url": "",
                                "actions": [
                                    {
                                        "name": "Reject",
                                        "_id": "5ff8355bbb30e440069caf11"
                                    },
                                    {
                                        "name": "Complete Review",
                                        "_id": "5ff8355bbb30e4232f9caf12"
                                    },
                                    {
                                        "name": "Comment",
                                        "_id": "5ff8355bbb30e497c49caf13"
                                    },
                                    {
                                        "name": "Subsitute Staff",
                                        "_id": "5ff8355bbb30e4682f9caf14"
                                    },
                                    {
                                        "name": "Payment",
                                        "_id": "5ff8355bbb30e49ec49caf15"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "On Duty",
                        "_id": "5ff8355bbb30e478979caf16",
                        "url": "",
                        "actions": [
                            {
                                "name": "Export",
                                "_id": "5ff8355bbb30e4f6a99caf17"
                            },
                            {
                                "name": "Review Pending",
                                "_id": "5ff8355bbb30e4d9669caf18"
                            },
                            {
                                "name": "Reviewed",
                                "_id": "5ff8355bbb30e40f279caf19"
                            },
                            {
                                "name": "Rejected",
                                "_id": "5ff8355bbb30e421589caf1a"
                            },
                            {
                                "name": "Action",
                                "_id": "5ff8355bbb30e4f0069caf1b"
                            },
                            {
                                "name": "Profile View",
                                "_id": "5ff8355bbb30e4a5869caf1c"
                            }
                        ],
                        "subTabs": [
                            {
                                "name": "Review",
                                "_id": "5ff8355bbb30e4d9609caf1d",
                                "url": "",
                                "actions": [
                                    {
                                        "name": "Reject",
                                        "_id": "5ff8355bbb30e46bc59caf1e"
                                    },
                                    {
                                        "name": "Complete Review",
                                        "_id": "5ff8355bbb30e444139caf1f"
                                    },
                                    {
                                        "name": "Comment",
                                        "_id": "5ff8355bbb30e468bb9caf20"
                                    },
                                    {
                                        "name": "Subsitute Staff",
                                        "_id": "5ff8355bbb30e42d929caf21"
                                    },
                                    {
                                        "name": "Payment",
                                        "_id": "5ff8355bbb30e4ffe29caf22"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
    return data;
}



module.exports = {
    lms_data
}