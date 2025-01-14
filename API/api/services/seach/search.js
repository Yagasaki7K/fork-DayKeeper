const User = require('../../models/User')
const getDataWithPages = require('../getDataWithPages')
const { searchPostPipeline, searchUserPipeline } = require('../../repositories')

const {
    errors: { notFound },
    success: { fetched }
} = require('../../../constants/index')

const search = async (props) => {
    const page = Number(props.page) || 1
    const maxPageSize = props.maxPageSize ? ( Number(props.maxPageSize) <= 100 ? Number(props.maxPageSize): 100)
    : 3

    const searchQuery = props.q || ''
    const order = props.order || 'relevant'
    const following = props.following
    const type = props.type || 'Post'

    const loggedUserId = props.id

    try {
        const mainUser = await User.findById(loggedUserId)
        mainUser.following = await User.distinct('_id', { followers: loggedUserId })
        if(!mainUser || !mainUser.following)
            return notFound('User')

        const response = await getDataWithPages({
            type,
            pipeline: type == 'Post' ?
                searchPostPipeline(searchQuery, mainUser) :
                searchUserPipeline(searchQuery, mainUser),
            order,
            following,
            page,
            maxPageSize
        }, mainUser)

        return fetched(`data`, { response })
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = search