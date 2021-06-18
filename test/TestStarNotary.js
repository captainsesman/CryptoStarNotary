const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    // 1. create a Star with different tokenId
    let _tokenId = 202;
    let starOwner = accounts[2];    
    let instance = await StarNotary.deployed();
    await instance.createStar("Basic Coin", _tokenId, { from: starOwner }); 
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    let name = "NairaStar";
    let symbol = "NGS";
    assert.equal(await instance.name.call(), name);
    assert.equal(await instance.symbol.call(), symbol);
});

it('lets 2 users exchange stars', async () => {
    let instance = await StarNotary.deployed();
    // 1. create 2 Stars with different tokenId
    let _tokenId1 = 23;
    let _tokenId2 = 24;
    let starOwner1 = accounts[2];
    let starOwner2 = accounts[3];
    await instance.createStar("First Star", _tokenId1, { from: starOwner1 });
    await instance.createStar("Second Star", _tokenId2, { from: starOwner2 });
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    await instance.exchangeStars(_tokenId1, _tokenId2, {from:starOwner2});    
    // 3. Verify that the owners changed
    assert.equal(await instance.ownerOf(_tokenId1), starOwner2);
    assert.equal(await instance.ownerOf(_tokenId2), starOwner1);
});

it('lets a user transfer a star', async() => {
    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed();
    let _tokenId = 30;
    let starOwner1 = accounts[3]
    let starOwner2 = accounts[2];
    await instance.createStar("Colons Star", _tokenId, { from: starOwner1 });      
    await instance.transferStar(starOwner2, _tokenId, { from: starOwner1 });
    
    assert.equal(await instance.ownerOf(_tokenId), starOwner2);
    
    // 2. use the transferStar function implemented in the Smart Contract
    // 3. Verify the star owner changed.
});

it('lookUptokenIdToStarInfo test', async() => {
    // 1. create a Star with different tokenId
    
    let instance = await StarNotary.deployed();
    let _tokenId = 50;
    let starOwner1 = accounts[5]    
    await instance.createStar("Main Star", _tokenId, { from: starOwner1 });   
    assert.equal(await instance.lookUptokenIdToStarInfo.call(_tokenId), "Main Star");
    
    // 2. Call your method lookUptokenIdToStarInfo
    // 3. Verify if you Star name is the same
});