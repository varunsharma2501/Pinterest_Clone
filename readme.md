 *****************************MODELS********************************************
Model 1: users
    1.fields are 
        -fullname :String
        -username :String
        -password :String
        -email    :String
        -posts    :an array containing object ids of all post objects stored in our database which are linked with the current user
        -dp       :String for image url
    2.export this user as User

Model 2: posts
    1.fields are
        -post_text  :String
        -created_at :Date
        -user       :contains id of user who is author of the post
        -likes      :contains ids of all the users who like the post
    2.exported as Post

*****************************ROUTES***************************
1.imported userModel and postModel
2.Routes are 
    -"/"  :show home page
    -"/createUser" : create a user in database
    -"/createPost" : create a post in database
    -"/allUserPosts" :shows all post of the current user


    **************PASSPORT SESSION ********************
    1.secret key:heyvarun