

class message {
    constructor(speakerId, speaker,content,createdAt){
        self.speakerId = speakerId;
        self.speaker = speaker;
        self.content = content;
        self.createdAt = createdAt;
    }

    toString(){
        console.log(self);
    }
}

let build = (speakerId,speaker,content,createdAt)=>{
    return new Promise(((resolve, reject) => {
        resolve(new message(speakerId,speaker,content,createdAt))
    }))
};

module.exports = {
    build,
    message
};