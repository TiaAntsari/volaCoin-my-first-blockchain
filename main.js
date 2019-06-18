const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash =''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, "06/18/2019", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            // console.log("*****"+i);
            if(currentBlock.hash !== currentBlock.calculateHash()){
               /*  console.log("1 - currentBlock.hash !== currentBlock.calculateHash()!!");
                console.log(currentBlock.hash);
                console.log(currentBlock.calculateHash()); */

                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                /* console.log("2 - currentBlock.previousHash !== previousBlock.hash!!");
                console.log(currentBlock.previousHash);
                console.log(previousBlock.hash); */

                return false;
            }
        }
        return true;
    }
}

// Ajout des blocs
let volaCoin = new Blockchain();
volaCoin.addBlock(new Block(1,"06/20/2019",{ montant: 5}));
volaCoin.addBlock(new Block(2, "06/21/2019", { montant: 17 }));

/* console.log("CHINE1******************************************");
console.log(JSON.stringify(volaCoin, null, 4)); */

// Affichage
console.log("Est-ce la chaine valide? " );
console.log(volaCoin.isChainValid()?"oui":"non");

// Modification de donnée
volaCoin.chain[1].data = {montant : 100};
volaCoin.chain[1].hash = volaCoin.chain[1].calculateHash();

/* console.log("CHINE2******************************************");
console.log(JSON.stringify(volaCoin, null, 4)); */

console.log("Est-ce la chaine valide? ");
console.log(volaCoin.isChainValid() ? "oui" : "non");

