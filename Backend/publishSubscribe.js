const redis=require('redis');
const CHANNELS={
    TEST:'TEST',
    BLOCKCHAIN:'BLOCKCHAIN'
}
class PubSub{
    constructor({blockchain}){
        this.blockchain=blockchain;
        this.publisher=redis.createClient();
        this.subscriber=redis.createClient();

       this.subscriber.subscribe(CHANNELS.TEST);
       this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);

        this.subscriber.on('message',(channel,message)=>this.handleMessage(channel,message));

       
    }
    handleMessage(channel,message){
        console.log(`Message revived.Channel : ${channel} , Message : ${message}`);
        const parse=JSON.parse(message);
        if(channel===CHANNELS.BLOCKCHAIN){
            this.blockchain.replaceChain(parse);
        }
    }
    publish({channel,message}){
        this.publisher.publish(channel,message);
    }
    broadcast(){
        this.publish({
            channel:CHANNELS.BLOCKCHAIN,
            message:JSON.stringify(this.blockchain.chain)
        })
    }


}

// const checkPubSub=new PubSub();

// setTimeout(() => {
//     checkPubSub.publisher.publish(CHANNELS.TEST,'Hello World');
// }, 1000);
module.exports=PubSub