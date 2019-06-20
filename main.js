const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block{
    constructor(timestamp, transactions, previousHash =''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Nomber operation: " + this.nonce);
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor() {
        this.difficulty = 4;
        this.chain = [this.createGenesisBlock()];
        this.pendingTranactions = [];
        this.minigReward = 100;
    }

    createGenesisBlock(){
        return new Block("06/18/2019", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    minePandingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTranactions);
        block.mineBlock(this.difficulty);
        
        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTranactions = [
            new Transaction(null, miningRewardAddress, this.minigReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTranactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

// Ajout des blocs
let volaCoin = new Blockchain();

volaCoin.createTransaction(new Transaction('address1', 'address2', 100));
volaCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\nStarting the miner...');
volaCoin.minePandingTransactions('Ravo-address');

console.log('\nBalace of Ravo is ', volaCoin.getBalanceOfAddress('Ravo-address'));

console.log('\nStarting the miner again...');
volaCoin.minePandingTransactions('Ravo-address');

console.log('\nBalace of Ravo is ', volaCoin.getBalanceOfAddress('Ravo-address'));
