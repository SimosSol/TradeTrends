const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const url = require('url');
const http = require("http").createServer(app);
const io = require('socket.io')(http)

const verify = require("./routes/verifyToken")
const authRoutes = require('./routes/authRoutes')

const Watchlist = require('./models/Watchlist');
const Post = require('./models/Post');
const User = require('./models/User');
const Pictures = require('./models/Pictures');
const Notification = require('./models/Notification');

app.use(express.static('public'))
app.use(cookieParser());
app.use(express.json());
app.use(authRoutes)

app.set('view engine', 'ejs');

const dotenv = require("dotenv"); 
dotenv.config();

const uri = process.env.DB_CONNECT;
 
// Connecting to the database
mongoose.connect(uri).then(() => {
    console.log("Connected to mongodb")
});

async function fetchPosts(user) {
    try {
        let result = await Post.find({"type":{ $ne: "c"}});
        return result;
    } catch{
        console.log('Error while retrieving posts')
    } 
    
}

async function fetchComments(id) {
    try {
        let result = await Post.find({postid: id, "type":"c"});
        return result;
    } catch{
        console.log('Error while retrieving comments')
    } 
    
}

async function fetchLikes(user) {
    try {
        let result = await User.findOne({"name": user});
        return result.likedposts;
    } catch{
        console.log('Error while retrieving posts')
    } 
}

async function fetchNotifications(user) {
    try {
        let result = await Notification.find({"user": user});
        return result;
    } catch{
        console.log('Error while retrieving notifications')
    } 
}

async function increaseCommentsCount(id) {
    try {
        let n = await Post.findOne({_id: id});
        let count = parseInt(n.type) + 1;
        await Post.findOneAndUpdate({_id: id}, {
            type: count
        });
    } catch{
        console.log('Error while retrieving posts')
    } 
    
}

let connectedUsersSockets = new Map();
let ReverseconnectedUsersSockets = new Map();

io.on('connection', socket => {
    connectedUsersSockets.set(socket.handshake.query.name, socket.id);
    ReverseconnectedUsersSockets.set(socket.id, socket.handshake.query.name);

    socket.on('newpost', async data => {
        let pst;
        let n;
        if (data.type == "c") {
            increaseCommentsCount(data.postid);
        }
        if (data.type == "repost") {
            try {
                let p = await Post.findOne({_id: data.postid});
                let count = parseInt(p.reposts) + 1;
                await Post.findOneAndUpdate({_id: data.postid}, {
                    reposts: count
                });
                pst = new Post({
                    username: data.username,
                    content: " ",
                    imgURL: " ",
                    verified: " ",
                    likes: " ",
                    reposts: " ",
                    sentiment: " ",
                    type: "repost",
                    postid: data.postid,
                    date: Date()
                });
                //Repost notification
                n = new Notification({
                    user: p.username,
                    name: data.username,
                    postid: data.postid,
                    type: "repost",
                    date: Date()
                });
                await n.save();
            } catch{
                console.log('Error')
            }
        }
        else {
            pst = new Post({
                username: data.username,
                content: data.content,
                imgURL: data.url,
                verified: data.verified,
                likes: data.likes,
                reposts: data.reposts,
                sentiment: data.sentiment,
                type: data.type,
                postid: data.postid,
                date: Date()
            });
        }
        //Saving post to database
        try{
            await pst.save();
            let d = "Your post is now live!";
            if (data.type == "c") {
                d = "Your comment is now live!"
            }
            if (data.type == "repost") {
                d = "Your repost is now live!"
            }
            socket.emit('postsaved', {
                msg: d
            });
            if (data.type == "c") {
                //Sending notification when someone comments on a users post
                let p = await Post.findOne({_id: data.postid});
                n = new Notification({
                    user: p.username,
                    name: data.username,
                    postid: data.postid,
                    type: "comment",
                    date: Date()
                });
                await n.save();
            }
        }catch(err){
            console.log('Error while saving post')
            socket.emit('postsaved', {
                msg: "An error occurred while saving post"
            });
        }
        if (data.type != "c") {
            connectedUsersSockets.forEach(function(value, key) {
                socket.to(value).emit('newposts');
            })
        }
        if (data.type == "c" || data.type == "repost") {
            //sending notification
            socket.to(connectedUsersSockets.get(n.user)).emit('notification', n)
        }
    })

    //Requesting posts
    socket.on('feedrequest', async data => {
        let posts = await fetchPosts(data.user);
        let likes = await fetchLikes(data.user);
        let profilepics = await Pictures.find({});
        let nots = await fetchNotifications(data.user);
        socket.emit('posts', {
            posts: posts,
            likes: likes,
            profilepics: profilepics,
            notifications: nots
        });
    })

    //Requesting comments
    socket.on('getcomments', async data => {
        let comments = await fetchComments(data.id);
        let likes = await fetchLikes(data.user);
        let profilepics = await Pictures.find({});
        socket.emit('comments', {
            comments: comments,
            likes: likes,
            profilepics: profilepics
        });
    })

    //Requesting profile info
    socket.on('getProfileinfo', async data => {
        try {
            let result = await User.findOne({"name": data.user});
            let mainUser = await User.findOne({"name": data.mainuser});
            let posts = await fetchPosts(data.user);
            let profilepics = await Pictures.find({});
            socket.emit('profile', {
                info: result,
                posts: posts,
                user: data.user,
                mainuser: mainUser,
                profilepics: profilepics
            });
        } catch{
            console.log('Error while retrieving posts')
            socket.emit('profile', {
                info: "error"
            });
        } 
    })

    //Updating profile picture
    socket.on('newProfilePic', async data => {

        Pictures.findById('6627b1fc05baafe8dd2b3c4e')
        .then(document => {
            if (!document) {
                // Handle case where document with given ID is not found
                console.error('Document not found');
                return;
            }

            // Check if the key already exists in the map field
            if (document.pictures.hasOwnProperty(data.username)) {
                document.pictures[data.username] = data.url;
            } else {
                // Key does not exist, add it with its value
                document.pictures.set(data.username, data.url);
            }
            // Save the updated document
            return document.save();
        })
        .then(updatedDocument => {
            socket.emit('newPP', {
                info: "Profile picture successfully updated!"
            });
        })
        .catch(error => {
            console.log('Error while updating picture')
            socket.emit('newPP', {
                info: "There was an error while updating profile picture"
            });
        });
    })

    //Follow/Unfollow actions
    socket.on('follow', async data => {
        try {
            if (data.action == "follow") {
                User.updateOne(
                    {name: data.user},
                    { $push: { follows: data.name } }
                ).then(() => {
                })
                .catch(() => {
                    console.log("error")
                })
                User.updateOne(
                    {name: data.name},
                    { $push: { followers: data.user } }
                ).then(() => {
                })
                .catch(() => {
                    console.log("error")
                })
                let n = new Notification({
                    user: data.name,
                    name: data.user,
                    postid: " ",
                    type: "follow",
                    date: Date()
                });
                await n.save();
                socket.to(connectedUsersSockets.get(data.name)).emit('notification', n)
            }
            else {
                User.updateOne(
                    {name: data.user},
                    { $pull: { follows: data.name } }
                ).then(() => {
                })
                .catch(() => {
                    console.log("error")
                })
                User.updateOne(
                    {name: data.name},
                    { $pull: { followers: data.user } }
                ).then(() => {
                })
                .catch(() => {
                    console.log("error")
                })
            }
            socket.emit('followResult', {
                info: "You have now "+data.action+"ed "+data.name,
                type: data.type
            });
        } catch{
            console.log('Error while updating followers')
            socket.emit('followResult', {
                info: "An error occured while trying to "+data.action+" this user"
            });
        } 
    })

    //Updating number of likes
    socket.on('updateLikes', async data => {
        await Post.findOneAndUpdate({_id: data.id}, {
            likes: data.amount
        });
        if (data.add == "y") {
            try{
                User.updateOne(
                    {name: data.user},
                    { $push: { likedposts: data.id } }
                ).then(() => {
                })
                .catch(() => {
                    console.log("error")
                })
                let n = new Notification({
                    user: data.name,
                    name: data.user,
                    postid: data.id,
                    type: "like",
                    date: Date()
                });
                await n.save();
                socket.to(connectedUsersSockets.get(data.name)).emit('notification', n)
            }catch(err){
                console.log(err);
            }
        }
        else {
            try{
                User.updateOne(
                    {name: data.user},
                    { $pull: { likedposts: data.id } }
                ).then(() => {
                })
                .catch(() => {
                    console.log("error")
                })
            }catch(err){
                console.log(err);
            }
        }
    })

    //Deleting notification
    socket.on('deleteNotification', async data => {
        await Notification.deleteOne({_id: data.id})
        .then(() => {
        })
        .catch(() => {
            console.log("error")
        })
    })

    //Deleting notification
    socket.on('getpost', async data => {
        try {
            let post = await Post.findOne({"_id": data.id});
            let likes = await fetchLikes(data.user);
            let profilepics = await Pictures.find({});
            let liked = false;
            let ppurl = profilepics[0].pictures[post.username];
            if (likes.includes(post._id)) liked = true;
            socket.emit('post', {
                post: post,
                info: 'ok',
                liked: liked,
                ppurl: ppurl
            });
            if (post.type != '0' && post.type != 'c' && post.type != 'repost') {
                let comments = await fetchComments(data.id);
                socket.emit('comments', {
                    comments: comments,
                    likes: likes,
                    profilepics: profilepics
                });
            }
            else {
                socket.emit('comments', {
                    comments: "none"
                });
            }
        } catch{
            console.log('Error while retrieving post')
            socket.emit('post', {
                info: "An error occured while retrieving the post"
            });
        }
    })

    socket.on('disconnect', () => {
        connectedUsersSockets.delete(ReverseconnectedUsersSockets.get(socket.id))
        ReverseconnectedUsersSockets.delete(socket.id)
    })
})


//Seeting up routes
app.get('/', (req, res) => {
    res.render('login')
})

app.get('/index', verify, (req, res) => {
    res.render('index')
})

app.get('/news', (req, res) => {
    fetch('https://data.alpaca.markets/v1beta1/news', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Apca-Api-Key-Id': 'PKP8SY1YXAG14AIPOHJ9',
            'Apca-Api-Secret-Key': 'ULmtitLaF2lTfWtFmc2qjHJsIzUmiugTdcR1mLg5'
        }
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => {
            res.send(data.news);
        })
        .catch(error => {
        console.error('Error fetching data:', error);
    });
})

app.get('/logout', (req, res) => {
    res.cookie('jwt', '', { expires: new Date(0), httpOnly: true });
    res.redirect('/login');
})

app.post('/createwatchlist', async (req, res) => {
    let watchlist;
    if (req.body.ticker == "") {
        watchlist = new Watchlist({
            user: req.body.user,
            name: req.body.name,
            tickers: []
        });
    }
    else {
        watchlist = new Watchlist({
            user: req.body.user,
            name: req.body.name,
            tickers: [req.body.ticker]
        });
    }
    try{
        const savedwl = await watchlist.save();
        res.status(200).send(savedwl);
    }catch(err){
        res.status(400).send(err);
    }
})

app.post('/addtowatchlist', async (req, res) => {

    //Checking if the ticker already exists
    let tickerExists;
    try {
        tickerExists = await Watchlist.findOne({"_id": req.body.id})
    } catch{
        return res.status(500).send('Internal server error');
    } 
    if (tickerExists.tickers.includes(req.body.ticker)) return res.status(200).send('Ticker has already been added to this watchlist');

    Watchlist.findByIdAndUpdate(
        req.body.id,
        { $push: { tickers: req.body.ticker } },
        { new: true } // To return the updated document
    )
    .then(() => {
        res.status(200).send('Added to watchlist')
    })
    .catch(error => {
        console.error(error); // Handle errors
    });
})

app.get('/getwatchlists', async (req, res) => {
    let watchlists;
    let parsedUrl = url.parse(req.url, true);
    let user = parsedUrl.query.user;
    try {
        watchlists = await Watchlist.find({"user":user});
    } catch{
        console.log('Error')
    }    
    try{
        res.status(200).send(watchlists);
    }catch(err){
        res.status(400).send(err);
    }
})

app.get('/getwatchlist', async (req, res) => {
    let watchlist;
    let parsedUrl = url.parse(req.url, true);
    let id = parsedUrl.query.id;
    try {
        watchlist = await Watchlist.find({"_id":id});
    } catch{
        console.log('Error')
    }    
    try{
        res.status(200).send(watchlist);
    }catch(err){
        res.status(400).send(err);
    }
})

app.post('/deletewatchlist', async (req, res) => {

    Watchlist.deleteOne({ _id: req.body.id })
    .then(() => {
        res.status(200).send('Watchlist deleted successfully');
    })
    .catch(() => {
        res.status(500)
    });
})

app.post('/deleteticker', async (req, res) => {

    Watchlist.updateOne(
        { _id: req.body.id },
        { $pull: { tickers: req.body.ticker } }
    )
    .then(() => {
        res.status(200).send('Ticker removed successfully');
    })
    .catch(() => {
        res.status(500)
    })
})


http.listen(process.env.PORT, () => console.log("Server has started on port " + process.env.PORT))
