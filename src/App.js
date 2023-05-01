  import { useEffect, useState } from 'react'
  import { ethers } from 'ethers'
  import { useRef } from 'react';

  // Components
  import Navigation from './components/Navigation'
  import Candidates from './components/Candidates'
  import Candidate from './components/Candidate'
  import Vote from './components/Vote'

  // ABIs
  import Voting from './abis/Voting.json'

  // Config
  import config from './config.json'

  function App() {

    const [account, setAccount] = useState(null)
    const [providers, setProvider] = useState(null)

    const [voting, setVoting] = useState(null)
    const [candidates, setCandidates] = useState([])

    const [contractOwner, setContractOwner] = useState(null);
    const [toggleAdd, setToggleAdd] = useState(false);
    const [toggleCast, setToggleCast] = useState(false);

    const [candidate, setCandidate] = useState({});

    const candidateNameRef = useRef();
    const candidateAddressRef = useRef();



    const loadBlockchainData = async () => {
      
      if (!window.ethereum) {
        alert('Please install MetaMask or another Ethereum wallet extension to use this app.');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const network = await provider.getNetwork();

      const voting = new ethers.Contract(config[network.chainId].Voting.address, Voting.abi, provider);
      setVoting(voting);

      try {
        const contractOwner = await voting.owner();
        setContractOwner(contractOwner);
      } catch (error) {
        console.error('Error fetching contract owner:', error);
        alert('Error fetching contract owner. Please make sure the contract is deployed correctly.');
      }

      const [candidateAddresses, candidateNames, candidateIds, candidateVoteCounts] = await voting.getAllCandidates();
      const candidateArray = candidateAddresses.map((candidateAddress, index) => {
        return {
          address: candidateAddress,
          name: candidateNames[index],
          id: candidateIds[index],
          voteCount: candidateVoteCounts[index],
        };
      });
      setCandidates(candidateArray);

      window.ethereum.on('accountsChanged', async () => {
        window.location.reload();
      });
    };






    const togglePopAdd = (candidate) => {
      setCandidate(candidate);
      toggleAdd ? setToggleAdd(false) : setToggleAdd(true);
    };

    const togglePopCast = () => {
      toggleCast ? setToggleCast(false) : setToggleCast(true);
    };



    useEffect(() => {
      loadBlockchainData()
    }, [])



    return (
      <div>
        <Navigation account = {account} setAccount = {setAccount} />

          <div className='home__overview'>
              <Candidates candidates = {candidates} provider = {providers} account = {account} voting = {voting} />
          </div>

          <div className='home__image'>
                <div className='cards' onClick={() => togglePopCast(candidates)}>
                  <div className='home__owned'>
                    cast a vote
                  </div>
                </div>

          </div>

        {toggleCast && (
          <Vote 
            candidates = {candidates} 
            providers = {providers} 
            account = {account} 
            voting = {voting} 
            contractOwner = {contractOwner}
            togglePopCast = {togglePopCast} />
        )}

          <div className='home__image'>
                <div className='cards' onClick={() => togglePopAdd(candidates)}>
                  <div className='home__contact'>
                    Add a candidate
                  </div>
                </div>

          </div>

        {toggleAdd && (
          <Candidate 
            candidates = {candidates} 
            providers = {providers} 
            account = {account} 
            voting = {voting} 
            contractOwner = {contractOwner}
            togglePopAdd = {togglePopAdd} />
        )}

      </div>
    );
  }

  export default App;
