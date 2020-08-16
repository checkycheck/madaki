const Post = require('../models/postModel').Post;
const Play = require('../models/playModel').Play;
const {isEmpty} = require('../config/customFunctions');

module.exports = {
    index: async (req, res)=>{
        
       
        const posts = await Post.find().sort({_id:-1});
        const plays = await Play.find();

    res.render('default/index', {posts: posts, plays: plays});

    },

    videoGet: async (req, res) =>{
        const plays = await Play.find().sort({_id:-1});

        res.render('default/video', {plays: plays})
    },




    getPosts:  (req, res) =>{
      
            res.render('admin/posts/index', {posts: posts});
    },


    

    indexPost: async (req, res) =>{

       

        // check for new file
        let fileName = '';

        if(!isEmpty(req.files)){
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir+filename, (err) => {
                if(err)
                    throw err;
            });
        }
        

       const  newPost = new Post({
            name: req.body.name,
            location: req.body.location,
            file: `/uploads/${filename}`,
            number: req.body.number,
            description: req.body.description,
            creationDate: req.body.creationDate
        });

        


       await newPost.save().then(post => {
            console.log('POSTS',post);
            req.flash('success-message', 'report created successfully, thank you for your time.');
            res.redirect('/');
        });

    },


    galleryGet: async (req, res) =>{
        const posts = await Post.find().sort({_id:-1});
        res.render('default/gallery', {posts: posts});
    },

    contactGet: (req, res) =>{
        res.render('default/contact');
    },

    serviceGet: (req, res) =>{
        res.render('default/service');
    },

    aboutGet: (req, res) =>{
        res.render('default/about');
    },

    loginGet: (req, res) =>{
        res.render('default/login', {message: req.flash('error') });
    },


    logoutGet: (req, res) =>{
        req.logout();
        req.flash("success", "See you later!")
        res.redirect("/");
    }
    
}