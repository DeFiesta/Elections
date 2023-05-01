pragma solidity ^0.8.0;


contract Voting {
    
    struct Voter {
        address voterAddress;
        string voterName;
        uint256 voterId;
        bool hasVoted;
        string encryptedBallot;
    }

    struct Candidate {
        address candidateAddress;
        string CandidateName;
        uint256 CandidateId;
        uint256 voteCount;
    }

    Voter[] public voters;
    Candidate[] public candidates; 


    bool public votingEnded = false;
    mapping (uint256 => uint256) voterIndex;
    mapping (uint256 => uint256) candidateIndex;
    mapping (address => Voter) public votersInfos;


    address public owner;


    constructor() {
        owner = msg.sender;
    }


    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }

    event Error(string message);

    event LogCandidateAdded(address indexed candidateAddress, string candidateName, uint256 candidateId);
    event LogVoterAdded(address indexed voterAddress, string voterName, uint256 voterId);


    function registerVoter(address _voterAddress, string memory _voterName, uint256 _voterId) public onlyOwner {
        Voter memory newVoter = Voter({
            voterAddress: _voterAddress,
            voterName: _voterName,
            voterId: _voterId,
            hasVoted: false,
            encryptedBallot: ""
        });

        voters.push(newVoter);
        uint256 newIndex = voters.length;
        voterIndex[_voterId] = newIndex; // Update this line
        votersInfos[_voterAddress] = newVoter;
        emit LogVoterAdded(_voterAddress, _voterName, _voterId);
    }



    function castVote(uint256 candidateId) public {
        Voter storage voter = votersInfos[msg.sender];
        if (voter.hasVoted) {
            emit Error("This voter has already voted");
            return;
        }
        if (candidateIndex[candidateId] == 0) {
            emit Error("Invalid candidate ID");
            return;
        }
        voter.hasVoted = true;
        candidates[candidateIndex[candidateId] - 1].voteCount += 1;
        voters[voterIndex[voter.voterId] - 1] = voter; // Update the voter in the voters array
    }



    function addCandidate(address _candidateAddress, string memory _candidateName, uint256 _candidateId) public onlyOwner {
        Candidate memory newCandidate = Candidate({
            candidateAddress: _candidateAddress,
            CandidateName: _candidateName,
            CandidateId: _candidateId,
            voteCount: 0
            });
        candidates.push(newCandidate);
        uint256 index = candidates.length;
        candidateIndex[_candidateId] = index;
        emit LogCandidateAdded(_candidateAddress, _candidateName, _candidateId);

    }

    function getCandidate(uint256 _candidateId) public view returns (address, string memory, uint256, uint256) {
        uint256 index = candidateIndex[_candidateId];
        require(index != 0, "Candidate not found");
        index = index - 1; // Adjust the index to account for the off-by-one error
        Candidate memory candidate = candidates[index];
        return (candidate.candidateAddress, candidate.CandidateName, candidate.CandidateId, candidate.voteCount);
    }



    function getVoter(uint256 _voterId) public view returns (address, string memory, uint256, bool, string memory) {
        require(voterIndex[_voterId] != 0, "Voter not found");
        uint256 index = voterIndex[_voterId] - 1; // Keep this line
        Voter memory voter = voters[index];
        return (voter.voterAddress, voter.voterName, voter.voterId, voter.hasVoted, voter.encryptedBallot);
    }

    function getAllCandidates() public view returns (address[] memory candidateAddresses, string[] memory names, uint[] memory voteCounts) {
        uint candidatesCount = candidates.length;

        // Initialize arrays to store candidate information
        candidateAddresses = new address[](candidatesCount);
        names = new string[](candidatesCount);
        voteCounts = new uint[](candidatesCount);

        // Iterate through candidates and store their information in the arrays
        for (uint i = 0; i < candidatesCount; i++) {
            Candidate memory candidate = candidates[i];
            candidateAddresses[i] = candidate.candidateAddress;
            names[i] = candidate.CandidateName;
            voteCounts[i] = candidate.voteCount;
        }

        return (candidateAddresses, names, voteCounts);
    }


}




