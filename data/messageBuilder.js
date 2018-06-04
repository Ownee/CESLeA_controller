

class MessageData {
    constructor(speakerId, speaker,content,createdAt){
        this.speakerId = speakerId;
        this.speaker = speaker;
        this.content = content;
        this.createdAt = createdAt;
    }

    toString(){
        console.log(this);
    }
}


let build = (speakerId,speaker,content,createdAt)=>{
    return new MessageData(speakerId,speaker,content,createdAt)
};

module.exports = {
    build,
    MessageData
};