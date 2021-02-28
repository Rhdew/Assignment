const mongoose  = require('mongoose')

const candidateSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique:true
    },
    testScore : {
        firstRound : {
            type: Number,
        },
        secondRound : {
            type: Number,
        },
        thirdRound : {
            type: Number,
        }
    },
    totalMarks:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model('test',candidateSchema);