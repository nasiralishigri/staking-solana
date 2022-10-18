
const {Connection, clusterApiUrl} = require('@solana/web3.js');
const main = async()=>{
    const connection = new Connection(clusterApiUrl('devnet'),'processed' );
    const {current, delinquent} =  await connection.getVoteAccounts();
    console.log("All Validators:", current.concat(delinquent).length)
    console.log("Current Validator:", current.length)
    console.log("Specific Validator:", current[0])
  
}

const runMain = async()=>{
    try{
   await main();
    }catch(error){
        console.error(error)
    }
}
runMain();