require('dotenv').config();
const mongoose = require('mongoose');

        const internationalizedStringSchema = new mongoose.Schema({
            en: String,
            es: String
        });

        const ingredientSchema = new mongoose.Schema({
            name:{
                type : internationalizedStringSchema,
                get: function (value) {
                    return value[this.$locals.language || 'en']; 
                }
            }
        });

        const recipeSchema = new mongoose.Schema({
            name : String,
            ingredients : [{type:mongoose.Schema.Types.ObjectId,ref:'Ingredient'}],
        });

        const parentSchema = new mongoose.Schema({
            child: { type: mongoose.Schema.Types.ObjectId, ref: 'Child' },
            otherChild: { type: mongoose.Schema.Types.ObjectId, ref: 'Child' },
        });

        const childSchema = new mongoose.Schema({
            name: String,
        });

        const Ingredient = mongoose.model('Ingredient',ingredientSchema);
        const Recipe = mongoose.model('Recipe',recipeSchema);
        const Parent = mongoose.model('Parent',parentSchema);
        const Child = mongoose.model('Child',childSchema);


async function main()
{
        const uri = process.env.MONGODB_URL;

        await mongoose.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });


        await mongoose.connection.dropDatabase();
        
        const egg = await Ingredient.create({name:{en:'Egg',es:'Huevo'}});

        const milk = await Ingredient.create({name:{en:'Milk', es:'Leche'}});
        
        const receipe = await Recipe.create({
            name:'Breakfast',
            ingredients:[egg._id, milk._id]
        });

        const child1 = await Child.create({name:'John'});

        const child2 = await Child.create({name:'Jane'});

        const parent = await Parent.create({
            child: child1._id,
            otherChild: child2._id,
        });

        // populate with `transform` for internationalization
        const receipes = await Recipe.find().populate({
            path:'ingredients',
            transform:(doc) => {
                if(doc){
                    doc.$locals = {language:'es'}
                }
                return doc;
            }
        });

        console.log('Populated Recipe with Internationalization:');

        console.log(receipes[0].ingredients.map((ingredient) => ingredient.name));

        
        // Populate and flatten child documents
        const PopulatedParent = await Parent.findOne().populate([
            {
                path: 'child',
                transform: (doc) => (doc ? doc.name : 'Default Child'),
            },
            {
                path: 'otherChild',
                transform: (doc) => (doc ? doc.name : 'Another Default'),
            },
        ]);


        console.log('Populated Parent with Flattened Children:');

        console.log({
            child: PopulatedParent.child, 
            otherChild: PopulatedParent.otherChild, 
        });

        const missingParent = await Parent.create({ child: null });

        const populatedMissingParent = await Parent.findById(missingParent._id).populate({
            path: 'child',
            transform: (doc, id) => {
                if (doc) {
                    return doc.name;
                }
                return id ? `Missing Child ID: ${id}` : 'No Child Reference';
            },
        });
        
        console.log('Populated Parent with Missing Child Reference:');
        console.log(populatedMissingParent.child); // Should print the missing child's ID
        
          // Close the connection
        await mongoose.connection.close();

        


}

main().catch((err) => {
   
    console.log(err);
    mongoose.connection.close();

})


