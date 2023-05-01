const { solidity } = require("@nomicfoundation/hardhat-toolbox");
const chai = require("chai");
const expect = chai.expect;
const { utils } = require('ethers');


describe("Voting", function () {
  let voting;
  let owner;
  let voter;
  let candidate;

  before(async function () {
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.deployed();

    owner = await ethers.getSigners();
    voter = await ethers.getSigner(1);
    candidate = await ethers.getSigner(2);
  });

  describe("registerVoter", function () {
    it("should register a new voter", async function () {
      const voterAddress = voter.address;
      const voterName = "Alice";
      const voterId = 123;

      const registerVoterTx = await voting.connect(owner[0]).registerVoter(voterAddress, voterName, voterId);
      await registerVoterTx.wait(); 

      const result = await voting.getVoter(voterId);

      expect(result[0]).to.equal(voterAddress);
      expect(result[1]).to.equal(voterName);
      expect(result[2]).to.equal(voterId);
      expect(result[3]).to.equal(false);
      expect(result[4]).to.equal("");
    });
  });

  describe("registerCandidate", function () {
    it("should register a new candidate", async function () {
      const candidateAddress = candidate.address;
      const candidateName = "Macron";
      const candidateId = 456;
      const candidateVoteCount = 0;

      const registerCandidateTx = await voting.connect(owner[0]).addCandidate(candidateAddress, candidateName, candidateId);
      await registerCandidateTx.wait(); 

      const result = await voting.getCandidate(candidateId);

      expect(result[0]).to.equal(candidateAddress);
      expect(result[1]).to.equal(candidateName);
      expect(result[2]).to.equal(candidateId);
      expect(result[3]).to.equal(candidateVoteCount);
    });

  });

  describe("castVote", function () {
    it("should successfully cast a vote for a candidate", async function () {
      // Register voter
      const voterAddress = voter.address;
      const voterName = "Alice";
      const voterId = 123;
      await voting.connect(owner[0]).registerVoter(voterAddress, voterName, voterId);

      // Register candidate
      const candidateAddress = candidate.address;
      const candidateName = "Macron";
      const candidateId = 456; // Changed from 123 to 456
      await voting.connect(owner[0]).addCandidate(candidateAddress, candidateName, candidateId);

      // Cast vote
      const castVoteTx = await voting.connect(voter).castVote(candidateId);
      await castVoteTx.wait();

      // Check if vote count has increased
      const updatedCandidate = await voting.getCandidate(candidateId);
      expect(updatedCandidate[3].toNumber()).to.equal(1);

      // Check if voter hasVoted is set to true
      const updatedVoter = await voting.getVoter(voterId);
      expect(updatedVoter[3]).to.be.true;
    });
  });

});
