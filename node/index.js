require('dotenv').config();

const mongoose = require('mongoose');

async function main() 
{

        const uri = process.env.MONGODB_URL;

        await mongoose.connect(uri,
        {
                useNewUrlParser: true,
                useUnifiedTopology: true
        });

        const kittySchema = new mongoose.Schema({
            name: { type: String, required: true, minlength: 3 }
        });


        kittySchema.methods.speak = function () 
        {
            const greeting = this.name ? `Meow! My name is ${this.name}` : "I don't have a name";
            console.log(greeting);
        };
        
        const Kitten = mongoose.model('Kitten', kittySchema);

        const silence = new Kitten({ name: 'Silence' });


        await silence.save();

        silence.speak();
      

        const kittens = await Kitten.find();

        console.log('All kittens:', kittens);


        const updatedKitten = await Kitten.findByIdAndUpdate
        (
            silence._id,
            { name: 'Whiskers' },
            { new: true }
        );

        console.log('Updated kitten:', updatedKitten);

        await Kitten.findByIdAndDelete(silence._id);
        console.log('Kitten deleted');

        mongoose.connection.close();
  
}

main().catch(err => console.log(err));

 

