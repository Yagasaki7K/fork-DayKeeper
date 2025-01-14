const { serverError } = require('../../constants/index')
const getUser = require('../services/user/getUser')
const getUserPosts = require('../services/user/getUserPosts')
const updateUser = require("../services/user/updateUser")
const reseteProfilePicture = require('../services/user/resetProfilePicture')
const deleteUser = require('../services/user/deleteUser')
const followUser = require("../services/user/followUser")
const respondFollowRequest = require("../services/user/respondFollowRequest")
const removeFollower = require('../services/user/removeFollower')
const reportUser = require('../services/user/reportUser')
const getFollowing = require('../services/user/getFollowing')
const getFollowers = require('../services/user/getFollowers')
const blockUser = require('../services/user/blockUser')

// getUserByName
const getUserController = async(req, res) => {
  try {
    const { code, message, user } = await getUser({ ...req.params, loggedUserId: req.id})

    return res.status(code).json({ message, user })
  } catch (error) {
    return res.status(500).json({ message: serverError(String(error)) })
  }
}

const getUserPostsController = async (req, res)=>{
  const page = Number(req.query.page) || 1
  const maxPageSize = req.query.maxPageSize ? ( Number(req.query.maxPageSize) <= 100 ? Number(req.query.maxPageSize) : 100) : 1
  const order = req.query.order || 'relevant'
  const { name } = req.params
  
  try{
    const response = await getUserPosts({
      name,
      order,
      maxPageSize,
      page,
      id: req.id
    })

    return res.status(200).json(response)
  }catch(error){
    return res.status(500).json({ message: serverError(String(error)) })
  }
}

// updateUser
const updateUserController = async(req, res) => {
  try{
    const { code, message, user } = await updateUser({ ...req.body, file: req.file, loggedUserId: req.id })

    return res.status(code).json({ message, user })
  } catch (error){
    return res.status(500).json({ message: serverError(String(error)) })
  }
}

// reseteProfilePicture
const reseteProfilePictureController = async(req, res)=>{
  try{
    const { code, message } = await reseteProfilePicture({ loggedUserId: req.id })

    return res.status(code).json({ message })
  } catch (error){
    return res.status(500).json({ message: `${error}` })
  }
}

// deleteUser
const deleteUserController = async (req, res) => {
  try {
    const { code, message, data } = await deleteUser({ loggedUserId: req.id }) 

    return res.status(code).json({ message, data })
  } catch (error) {
    return res.status(500).json({ message: `${error}` })
  }
}

// followUser
const followUserController = async (req, res) => {
  try {
    const { code, message } = await followUser({ loggedUserId: req.id, ...req.params })

    return res.status(code).json({ message })
  } catch (error) {
    return res.status(500).json({ message: `${error}` })
  }
}

// respondFollowRequest (private users only)
const respondFollowRequestController = async(req, res)=>{
  const response = req.query.response == 'true'
  const loggedUserId = req.id
  
  try{
    const { code, message } = await respondFollowRequest({ ...req.params, response, loggedUserId })

    return res.status(code).json({ message })
  }catch(error){
    return res.status(500).json({ message: `${error}` })
  }
}

// removeFollower (private users only)
const removeFollowerController = async(req, res)=>{
  try{
    const { code, message } = await removeFollower({ ...req.params, loggedUserId: req.id })

    return res.status(code).json({ message })
  }catch(error){
    return res.status(500).json({ message: `${error}` })
  }
}

// report User
const reportUserController = async(req, res)=>{
  try{
    const { code, message, reason, user } = await reportUser({
      ...req.params,
      loggedUserId: req.id,
      reason: req.body.reason || ''
    })

    return res.status(code).json({ message, reason, user })
  }catch(error){
    return res.status(500).json({ message: `${error}` })
  }
}

// getFollowing
const getFollowingController = async(req, res)=>{
  try{
    const { code, users } = await getFollowing({ ...req.params })

    return res.status(code).json({ users })
  } catch (error) {
    return res.status(500).json({ message: `${error}` })
  }
}

// getFollowers
const getFollowersController = async(req, res)=>{
  try{
    const { code, users } = await getFollowers({ ...req.params })

    return res.status(code).json({ users })
  } catch (error) {
    return res.status(500).json({ message: `${error}` })
  }
}

// blockUser
const blockUserController = async(req, res)=>{
  try{
    const { code, message } = await blockUser({ ...req.params, loggedUserId: req.id })

    return res.status(code).json({ message })
  }catch (error) {
    return res.status(500).json({ message: `${error}` })
  }
}

module.exports = {
  getUser: getUserController,
  getUserPosts: getUserPostsController,
  updateUser: updateUserController,
  reseteProfilePicture: reseteProfilePictureController,
  deleteUser: deleteUserController,
  followUser: followUserController,
  getFollowing: getFollowingController,
  getFollowers: getFollowersController,
  respondFollowRequest: respondFollowRequestController,
  removeFollower: removeFollowerController,
  blockUser: blockUserController,
  reportUser: reportUserController
}