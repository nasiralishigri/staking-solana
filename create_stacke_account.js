
const {Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, StakeProgram, Authorized, Lockup, sendAndConfirmTransaction} = require('@solana/web3.js');
const main = async()=>{
    const connection = new Connection(clusterApiUrl('devnet'),'processed' );
    const wallet = Keypair.generate();
    const airdropSignature = await connection.requestAirdrop(wallet.publicKey, 1 *LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature);
    const balance  = await connection.getBalance(wallet.publicKey);
    // Creating Stacking Account
    const stakeAccount =  Keypair.generate();
    const minmumRent = await connection.getMinimumBalanceForRentExemption(StakeProgram.space);
    const amountUserWantToStack = 0.5* LAMPORTS_PER_SOL;
    const amountToStack = minmumRent + amountUserWantToStack;
    
    const createStackAccountTx = await StakeProgram.createAccount({
        authorized: new Authorized(wallet.publicKey, wallet.publicKey),
        fromPubkey: wallet.publicKey,
        lamports: amountToStack,
        lockup: new Lockup(0,0,wallet.publicKey),
        stakePubkey: stakeAccount.publicKey
    })
    const createStackAccountTxId = await sendAndConfirmTransaction(connection,createStackAccountTx,[wallet,stakeAccount])
console.log(`Stacke Account Created: ${createStackAccountTxId} `)
const stakeBalance = await connection.getBalance(stakeAccount.publicKey);
console.log(`Stake Account Balance is: ${stakeBalance/ LAMPORTS_PER_SOL} SOL`)
let stackeStatus = await connection.getStakeActivation(stakeAccount.publicKey)
console.log(`Stake Account Status: ${stackeStatus.state}`)
}

const runMain = async()=>{
    try{
   await main();
    }catch(error){
        console.error(error)
    }
}
runMain();