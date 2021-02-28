const candidateSchema = require('./models/index')
const express = require('express'); 
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();

mongoose.connect('mongodb://localhost:27017/test').then(()=>{
    console.log('jfnjk')
}).catch((error)=>{
    console.log(error)
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/getData/:email',async(req,res)=>{
    try{
        const email = req.params.email
        console.log(email);
        const testScore = await candidateSchema.findOne({
            email
        },{
            testScore:1
        })
        console.log(testScore);
        res.send({
            response:'successfully data got',
            data: testScore
        })
    }
    catch(error){
        console.log(error)
    }
})

app.get('/getMaxScore',async (req,res)=>{
    try{
        const topper = await candidateSchema.find({}).sort({totalMarks:-1}).limit(1)
        const data  = await candidateSchema.find()
        const firstScore=[]
        const secondScore=[]
        const thirdScore=[]
         data.filter((res)=> res.testScore.firstRound?firstScore.push(res.testScore.firstRound) : '' )
         data.filter((res)=> res.testScore.secondRound?secondScore.push(res.testScore.secondRound) : '' )
         data.filter((res)=> res.testScore.thridRound?thirdScore.push(res.testScore.thridRound) : '' )
        const avgFirstRound = firstScore.reduce((a,b)=>a+b,0)/firstScore.length
        const avgSecondRound = secondScore.reduce((a,b)=>a+b,0)/secondScore.length

        const avgThirdRound = thirdScore.reduce((a,b)=>a+b,0)/thirdScore.length

        res.send({
            avgFirstRound,
            avgSecondRound,
            avgThirdRound,
            thirdScore
        })
        console.log(data)
    }
    catch(error){
        error:error,
        console.log(error)
    }

})

app.post('/register',async(req,res)=>{
    console.log(req.body);
    try{
        let name = req.body.name;
        let email = req.body.email;
        
    console.log(name , email);
    const response =   await candidateSchema.create({
        name,
        email,
    })
    console.log(response);
    res.send({
        response:'successfully data saved',
        data: response
    })
}
catch(error){
    console.log(error)
    res.send({
        error:error,
    })
}
})

function validation(value){
  return  value>0&&value<11?true:false
}

app.post('/setScores/:email',async (req,res)=>{
    try{
        let firstScore = req.body.firstScore;
        let secondScore = req.body.secondScore;
        let thirdScore = req.body.thirdScore;

        if(validation(firstScore)&&validation(secondScore)&&validation(thirdScore))
        {
            let email = req.params.email;
            let totalMarks = parseInt(firstScore)+parseInt(secondScore)+parseInt(thirdScore);
    
            const result = await candidateSchema.findOneAndUpdate({email},{$set:{
                testScore:{
                    firstScore,
                    secondScore,
                    thirdScore
                },
                totalMarks,
            }},{new:true})
            console.log(result)
            res.send({
                msg:'data successfully updated',
                result
            })
        }
        else
        {
            res.json({err:1,message:'Not a Valid Number'})
        }
        

       
    }
    catch(error){
        console.log(error);
    }
    
})

app.listen(3000,()=>{
    console.log('connected ');
});