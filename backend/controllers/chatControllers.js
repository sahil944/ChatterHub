const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const accessChat = expressAsyncHandler(async(req, res) => {
    const  { userId } = req.body;

    if(!userId){
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}},
        ]
    }).populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path:"latestMessage.sender",
        select: "name pic email",
    });

    if(isChat.length>0){
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: (await User.findOne({_id: userId},{name:1, _id:0}))['name'],
            isGroupChat: false,
            users: [req.user._id, userId],
        }

        try {
            const createNewChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id: createNewChat._id}).populate(
                "users","-password"
            );
            res.status(200).send(fullChat);
        }catch(error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const fetchChats = expressAsyncHandler(async(req, res) => {
    try {
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
            .populate("users","-password")
            .populate("groupAdmin","-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1})
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });

                res.status(200).send(results);
            });
    }catch(error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const createGroupChat = expressAsyncHandler(async (req, res) => {
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({message: "Please fill all the fields"});
    }
    var users = JSON.parse(req.body.users);
    
    if(users.length < 2){
        return res.status(400).send({message: "More than 2 users are required to forma group chat"});
    }

    users.push(req.user);

    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
            .populate("users","-password")
            .populate("groupAdmin","-password");

        res.status(200).json(fullGroupChat);
    }catch(error){
        res.status(400);
        throw new Error(error.message);
    }
});

const renameGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedchat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName },
        { new: true }
    ).populate("users","-password")
    .populate("groupAdmin","-password");

    if(!updatedchat){
        res.status(400);
        throw new Error("Chat not found");
    } else {
        res.json(updatedchat);
    }
});

const addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const addUser = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId} },
        { new: true }
    ).populate("users","-password")
    .populate("groupAdmin","-password");

    if(!addUser){
        res.status(400);
        throw new Error("Chat not found");
    } else {
        res.json(addUser);
    }
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const removeUser = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId} },
        { new: true }
    ).populate("users","-password")
    .populate("groupAdmin","-password");

    if(!removeUser){
        res.status(400);
        throw new Error("Chat not found");
    } else {
        res.json(removeUser);
    }
});

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup };