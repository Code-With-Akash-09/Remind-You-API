import { paginationQuery } from "../general.js";

const getTaskState = async (uid, statusId, page, limit) => {

    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let matchStage = {}

    if (statusId === "current") {
        matchStage = {
            startDate: {
                $gte: today,
                $lt: tomorrow
            }
        }
    } else if (statusId === "upcoming") {
        matchStage = {
            startDate: {
                $gte: tomorrow
            }
        }
    } else if (statusId === "backlog") {
        matchStage = {
            startDate: {
                $lt: today
            }
        }
    }

    let pipeline = [
        {
            $match: {
                uid: uid,
                ...matchStage
            }
        },
        {
            $sort: { createdAt: -1 },
        },
        ...(await paginationQuery(page, limit)),
    ]
    return pipeline
}

const getSearch = async (uid, query) => {
    if (!query || query.trim() === '') {
        return [
            {
                $match: {
                    uid: uid
                }
            },
            {
                $sort: { createdAt: -1 },
            }
        ];
    }

    let pipeline = [
        {
            $match: {
                uid: uid,
                label: { $regex: query, $options: "i" }
            }
        },
        {
            $sort: { createdAt: -1 },
        }
    ];

    return pipeline;
};

export {
    getSearch as getSearchQuery,
    getTaskState as getTaskStateQuery
};

