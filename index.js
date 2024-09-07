const express = require("express");
const app = express();
const cors = require('cors');
const {MongoClient, ObjectId} = require('mongodb');

const port = 3000;

const URL = "mongodb+srv://kamalesh:user2024@test1.2tbir.mongodb.net/?retryWrites=true&w=majority&appName=Test1";

//middleware
app.use(cors({
    origin:"http://localhost:5173",
    
}));

app.use(express.json());

//Display All users
app.get("/users",async(req,res)=>{
  try {    
    // 1. Connect the DataBase server
  const connection = await MongoClient.connect(URL);
  // 2. Select the database
  const db = connection.db("test1");
  // 3. Select the collection
  const collection = db.collection("Students")

  const students = await collection.find({}).toArray();
    
  await connection.close();
  res.json(students);
    
  } catch (error) {
    res.status(500).json({
        message: "Internal Server Error"})
  }
});

//Display a single user
app.get("/user/:id",async(req,res) =>{

    // 1. Connect the DataBase server
    const connection = await MongoClient.connect(URL);

    //2. Select the database
    const db = connection.db("test1");

    //3. Select the collection
    const collection = db.collection("Students")

    //4. Do the operation

    const student = await collection.findOne({_id: new ObjectId(req.params.id)});

    await connection.close();

    if(student){
        res.json(student)
    }else{
        res.status(404).json({message:"user not found"})
    }
  /* wihtout DB connection
    let user = users.find(obj => obj.id == req.params.id);
    if(user){
        return res.json(user)
    } else{
        return res.json({message : "User not found"})
    }    */ 
})

// to edit we need Id, Data

app.put("/user/:id",async(req,res)=>{
   try {
     // 1. Connect the DataBase server
     const connection = await MongoClient.connect(URL);

     //2. Select the database
     const db = connection.db("test1");
 
     //3. Select the collection
     const collection = db.collection("Students")
 
     //4. Do the operation(but we should omit _id bcz its not editable)
    /*
     let omitId = Object.keys(req.body);
     let filter = {};
     omitId.forEach(key => {
         if(key != "_id"){
             filter[key] = req.body[key]
         }
     });

     ---> and pass {$set: filter} in findOneAndUpdate
     */
    
     delete req.body._id;
    
     const student = await collection.findOneAndUpdate(
         {_id: new ObjectId(req.params.id)},
         {$set: req.body}
     );
 
     //5. Close the connection
     await connection.close(); 
 
     if(student){
         res.json(student);
     }else{
         res.status(404).json({message:"User not found"})
     }
    
   } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
   }

    /** Without DB connection
     * //find the user by ID
    let index =users.findIndex(obj => obj.id == req.params.id);
    if(!users[index]){
        res.json({message : "User not found"})
    }
    // change the data
    users[index] = {...req.body, id: parseInt(req.params.id)};
    // return the updated data
    res.json({message : "User updated successfully"})
     */
})

// to delete we need Id
app.delete("/user/:id",async(req,res)=>{

    // 1. Connect the DataBase server
    const connection = await MongoClient.connect(URL);
    //2. Select the database
    const db = connection.db("test1");
    //3. Select the collection
    const collection = db.collection("Students")
    //4. Do the operation
    await collection.findOneAndDelete({_id:new ObjectId(req.params.id)});
    await connection.close();
    res.json({message : "User deleted successfully"});


   /** without DB connection
    *  //find the user by ID
    let index =users.findIndex(obj => obj.id == req.params.id);
    if(!users[index]){
        res.json({message : "User not found"})
    }
    // change the data
    users.splice(index,1);
    // return the updated data
    res.json({message : "User deleted successfully"})
    */
})

app.post("/user",async (req,res)=>{

    /**
     * 1. Connect the DataBase server
     * 2. Select the database
     * 3. Select the collection
     * 4. Do the Operations (Insert, Update, Delete, Read)
     * 5. Close the connection
     * * */

    try {
        // 1. Connect the DataBase server
    const connection = await MongoClient.connect(URL);

    // 2. Select the database
    const db = connection.db("test1");

    // 3. Select the collection
    const collection = db.collection("Students")

    if(!req.body.name){
        res.status(400).json({
            message : "Name is required"
        });
    }else{
        // 4. Do the Operations (Insert, Update, Delete, Read)
    await collection.insertOne(req.body);

    // 5. Close the connection
    await connection.close();

    res.json({message : "User created successfully"})

    }     
    } catch (error) {
        res.status(500).json({
            message : "Something went wrong"
        })       
    }

    /** Without DB Connection
    //id = users.length +1;
    //users.push({...req.body, id});
    //res.json({message : "User created successfully"})

    */
})

app.listen(port,(err)=>{
    console.log(`server is running on port ${port}`)
});

