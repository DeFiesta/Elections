import { ethers } from 'ethers';
import { toUtf8String } from '@ethersproject/strings';
import { useEffect, useState } from 'react';
import { useRef } from 'react';

import close from '../assets/close.svg';

const Vote = ({ candidates, providers, account, voting, contractOwner, togglePopCast }) => {
  const [voterName, setVoterName] = useState('');
  const [voterId, setVoterId] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegisterVoter = async () => {
    
    if (!account) {
      alert('Please connect your account first');
      return;
    }

    if (!voting) {
      alert('Voting contract not initialized');
      return;
    }

    try {
      const signer = providers.getSigner();
      const votingWithSigner = voting.connect(signer);

      const tx = await votingWithSigner.registerVoter(account, voterName, voterId, {
        gasLimit: 1000000
      });

      const receipt = await tx.wait();

      console.log(receipt)

      alert('Voter added successfully');
      window.location.reload();

      setErrorMessage('');
    } catch (error) {
      console.error('Error registering voter:', error);
      if (error?.receipt?.logs?.length) {
        const errorMessage = toUtf8String(error.receipt.logs[0].data);
        console.error('Revert reason:', errorMessage);
        setErrorMessage(`Error registering voter. Reason: ${errorMessage}`);
      } else {
        setErrorMessage('Error registering voter. Please try again.');
      }

    }
  };

  const handleCastVote = async () => {
        
      if (!account) {
        alert('Please connect your account first');
        return;
      }

      try {
          const candidateId = candidates.find(candidate => candidate.name === selectedCandidate)?.id;
          console.log(candidateId)
          if (!candidateId) {
              throw new Error('Invalid candidate selected');
          }
          
          const signer = providers.getSigner();
          const votingWithSigner = voting.connect(signer);

          const tx = await votingWithSigner.castVote(candidateId, {gasLimit: 1000000});
          await tx.wait();

          alert('Your vote has been successfully taken into account');
          window.location.reload();


          setErrorMessage('');
      } catch (error) {
          console.error('Error casting vote:', error);
          setErrorMessage('Error casting vote. Please try again.');
      }
  };




  return (
    <div className="home">
      <div className='home__details'>
        <div className="home__image">
          <div className="pop-up">
            <div>
              <h3>Cast Your Vote</h3>
              <div>
                <label>Voter Name:</label>
                <input type="text" id="voterName" value={voterName} onChange={(e) => setVoterName(e.target.value)} />
              </div>
              <div>
                <label htmlFor="candidate">Select a candidate:</label>
                <select id="candidate" value={selectedCandidate} onChange={(e) => setSelectedCandidate(e.target.value)}>
                  <option value="">--Select Candidate--</option>
                  {candidates.map(candidate => (
                    <option key={candidate.id} value={candidate.name}>{candidate.name}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleCastVote}>Cast Vote</button>
              <hr />
              <div>
                <h3>Register as a Voter</h3>
                <div>
                  <label>Voter Name:</label>
                  <input type="text" id="voterName" value={voterName} onChange={(e) => setVoterName(e.target.value)} />
                  <label>Voter ID:</label>
                  <input type="text" id="voterId" value={voterId} onChange={(e) => setVoterId(e.target.value)} />
                </div>
                <button onClick={handleRegisterVoter}>Register Voter</button>
              </div>
              <div className="error-message">{errorMessage}</div>
            </div>
          </div>
        </div>
        <button onClick={togglePopCast} className="home__close">
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default Vote;
