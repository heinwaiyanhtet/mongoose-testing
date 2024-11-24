require('dotenv').config();
const mongoose = require('mongoose');

const { Schema } = mongoose;


async function main() 
{

        const uri = process.env.MONGODB_URL;

        /// connect to mongoose
        await mongoose.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        // building schmeas

        // comment schema
        const commentSchema = new mongoose.Schema
        (
            {
              body: String,
              date: { type: Date, default: Date.now }
            },
            { _id: false } 
        );

        // blog schema
        const blogSchema = new mongoose.Schema
        ({
            title: { type: String, required: true },
            author: { type: String, required: true },
            body: String,
            comments: [commentSchema],
            date: { type: Date, default: Date.now },
            hidden: { type: Boolean, default: false },
            meta: {
              votes: { type: Number, default: 0 },
              favs: { type: Number, default: 0 }
            }
          });


        // virtual property
        blogSchema.virtual('summary').get(function () 
        {
            return `${this.title} by ${this.author}`;
        });


        // Virtual: Compute a summary for the blog
        blogSchema.methods.incrementVotes = function () 
        {
            this.meta.votes += 1;
            return this.save();
        };

        // Static Method: Find by Author
        blogSchema.statics.findByAuthor = function (author) {
            return this.find({ author });
        };


        blogSchema.pre('save', function (next) {
            console.log(`Saving blog: ${this.title}`);
            next();
        });
        
        // Middleware: Post-save hook
        blogSchema.post('save', function (doc) {
            console.log(`Blog saved: ${doc.title}`);
        });

        const Blog = mongoose.model('Blog', blogSchema);

        const blog = new Blog({
            title: 'Learning Mongoose',
            author: 'John Doe',
            body: 'This is an example of using Mongoose effectively.',
            comments: [{ body: 'Great post!' }],
            meta: { votes: 5, favs: 2 }
        });

        await blog.save();
        console.log('Blog Summary:', blog.summary);


        await blog.incrementVotes();
        console.log('Updated Votes:', blog.meta.votes);

        // Use Static Method
        const blogsByAuthor = await Blog.findByAuthor('John Doe');
        console.log('Blogs by John Doe:', blogsByAuthor);

        // Query All Blogs
        const allBlogs = await Blog.find();
        console.log('All Blogs:', allBlogs);

        // Delete a Blog
        await Blog.findByIdAndDelete(blog._id);
        console.log('Deleted the blog.');
}

main().catch(err => console.log(err));

 

