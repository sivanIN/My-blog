import express from "express";
import bodyParse from "body-parser"
import {MongoClient} from "mongodb"
import path from'path'
 const app=express();
  
 app.use(bodyParse.json());

//  const articleaInfo={
//      'learn-react':{
//          upvotes:0,
//          comments:[]
//      },
//      'learn-node':{
//         upvotes:0,
//         comments:[]
//     },
//     'my-thoughts-on-resumes':{
//         upvotes:0,
//         comments:[]
//     },
//  }

app.use(express.static(path.join(__dirname,'/build')));

const withDB=async(operations,res)=>{
    
    const client= await MongoClient.connect('mongodb+srv://userone:userone@ayyan.spinx.mongodb.net/my-blog?retryWrites=true&w=majority')  ;
    const db=client.db('my-blog')

  await  operations(db)

    client.close();
}

//  app.get('/hello',(req,res)=>res.send("hello"));

//  app.get('/hello/:name',(req,res)=>res.send(`${req.params.name}`))   // simple call

//  app.get('/api/articles/:name/upvotes',(req,res)=>
//  {
//      var articleName=req.params.name
//      articleaInfo[articleName].upvotes=+1;
//      res.status(200).send(`${articleaInfo[articleName].upvotes}`)

//  }
//  )

//mongodb pvotes call

// app.get('/api/articles/:name/upvotes',async(req,res)=>
//  {
//      var articleName=req.params.name
//     const client= await MongoClient.connect('mongodb+srv://userone:userone@ayyan.spinx.mongodb.net/my-blog?retryWrites=true&w=majority')  ;
//     const db=client.db('my-blog')
//     const articleaInfo= await db.collection('articles').findOne({name:articleName});
//     await db.collection('articles').updateOne({name:articleName},
//         {
//           '$set':{
//               upvotes:articleaInfo.upvotes +1
//           } , 
//         });

//         const updatedinfo = await db.collection('articles').findOne({name:articleName});

//         res.status(200).json(updatedinfo)

//         client.close();
    

//  })

app.post('/api/articles/:name/upvotes',async(req,res)=>
 {

    withDB(async(db)=>{

        var articleName=req.params.name
    
        const articleaInfo= await db.collection('articles').findOne({name:articleName});
        await db.collection('articles').updateOne({name:articleName},
            {
              '$set':{
                  upvotes:articleaInfo.upvotes +1
              } , 
            });
    
            const updatedinfo = await db.collection('articles').findOne({name:articleName});
    
            res.status(200).json(updatedinfo)

    },res)
   

      
    

 })



 //mongodb call

// app.get('/api/articles/:name',async (req,res)=>{
//     var articleName=req.params.name;
//     const client= await MongoClient.connect('mongodb+srv://userone:userone@ayyan.spinx.mongodb.net/my-blog?retryWrites=true&w=majority')  ;
//     const db=client.db('my-blog')
//     const articleaInfo= await db.collection('articles').findOne({name:articleName})
//     res.status(200).json(articleaInfo);
//     client.close();
// })

app.get('/api/articles/:name',async (req,res)=>{

    withDB(async(db)=>{
        var articleName=req.params.name;
        const articleaInfo= await db.collection('articles').findOne({name:articleName})
        res.status(200).json(articleaInfo);
    },res)
    
  
})


//  app.post('/api/articles/:name/comments',(req,res)=>{
//      const {username,text}=req.body;
//      var articleName=req.params.name
//      articleaInfo[articleName].comments.push({username,text});
//      res.status(200).send(articleaInfo[articleName])
//  })

app.post('/api/articles/:name/comments',(req,res)=>{
    const {username,text}=req.body;
    var articleName=req.params.name;

    withDB(async(db)=>{

       
    
        const articleaInfo= await db.collection('articles').findOne({name:articleName});
        await db.collection('articles').updateOne({name:articleName},
            {
              '$set':{
                  comments:articleaInfo.comments.concat({username,text})
              } , 
            });
    
            const updatedinfo = await db.collection('articles').findOne({name:articleName});
    
            res.status(200).json(updatedinfo)

    },res)
    
})

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname+'/build/index.html'))
})


 app.listen(8000,()=>console.log("listening to port 8000"))