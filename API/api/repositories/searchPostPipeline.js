const searchPostPipeline = (searchQuery, mainUser, todayDate) => [
  {
    $lookup: {
      from: 'users',
      let: { userId: { $toObjectId: '$user' } },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$_id', '$$userId'] }
          }
        },
        {
          $project: {
            password: 0,
            ban_history: 0,
            reports: 0,
            follow_requests: 0,
            blocked_users: 0,
            verified_email: 0,
            roles: 0,
            banned: 0
          }
        }
      ],
      as: 'user_info'
    }
  },
  {
    $match: {
      $and: [
        { 'user': { $nin: mainUser.blocked_users } },
        { 'user_info.banned': { $ne: "true" } },
        {
          $or: [
            { title: { $regex: new RegExp(searchQuery, 'i') } },
            { 'user_info.name': { $regex: new RegExp(searchQuery, 'i') } }
          ]
        },
        {
          $or: [
            { 'user_info.private': false },
            { 
              $and: [
                { 'user_info.private': true },
                { 'user_info.followers': mainUser._id }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    $addFields: {
      relevance: { $sum: ['$reactions', '$comments'] },
      isToday: { $eq: ['$title', todayDate] }
    }
  },
  {
    $project: {
      _id: 1,
      title: 1,
      data: 1,
      user: 1,
      files: 1,
      created_at: 1,
      reactions: 1,
      comments: { $size: '$comments' },
      user_info: { $arrayElemAt: ['$user_info', 0] }
    }
  }
]

module.exports = searchPostPipeline