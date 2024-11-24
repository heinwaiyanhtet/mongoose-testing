require('dotenv').config();
const mongoose = require('mongoose');

const { Schema } = mongoose;


const uri = process.env.MONGODB_URL;

/// connect to mongoose



async function main() 
{


        mongoose.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        
        const personSchema = new mongoose.Schema({
            name:String,
            age: Number,
            stories:[{type:Schema.Types.ObjectId,ref:'Story'}]
        })
        

        const storySchema = new mongoose.Schema({
            title: String,
            author: {type:Schema.Types.ObjectId,ref:'Person'},
            fans:[{type:Schema.Types.ObjectId,ref:'Person'}]
        })
        
        
        
        const Person = mongoose.model('Person',personSchema);
            
        const Story = mongoose.model('Story',storySchema);

        await Person.deleteMany({});

        await Story.deleteMany({});






        const author = new Person({
            name: 'Ian Fleming',
            age: 30,
        });

        await author.save();





        const story = new Story({
            title: 'Casino Royale',
            author: author._id,
        });

        await story.save();




        author.stories.push(story._id);
        await author.save();



        const populatedStory = await Story.findOne({title: 'Casino Royale'})
                                          .populate('author')
                                          .exec();

        console.log('Populated Story:', populatedStory);





        const populatedAuthor = await Person.findOne({name: 'Ian Fleming'})
                                            .populate('stories')
                                            .exec();

        console.log('Populated Author:', populatedAuthor);


        const fan1 = new Person({name:"Sean",age:34});
        const fan2 = new Person({name:"George",age:34});
        await fan1.save();
        await fan2.save();


        story.fans.push(fan1,fan2);
        await story.save();

        const storyWithFans = await Story.findOne({title: 'Casino Royale'})
                                          .populate('fans')
                                          .exec();

        console.log('Story with Fans:', storyWithFans);

        mongoose.connection.close();

        
       
}

main().catch(err => console.log(err));

 

