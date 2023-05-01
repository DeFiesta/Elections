import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useRef } from 'react';

import '../index.css';

import close from '../assets/close.svg';

const Candidate = ({ candidates, providers, account, voting, contractOwner, togglePopAdd }) => {
    const candidateNameRef = useRef();
    const candidateAddressRef = useRef();
    const candidateIdRef = useRef();

    const addCandidate = async (candidateAddress, candidateName, candidateId) => {
      if (!account) {
        alert('Please connect your account first');
        return;
      }

      if (!voting) {
        alert('Voting contract not loaded');
        return;
      }

      if (account !== contractOwner) {
        alert('Only the contract owner can add candidates');
        console.log(contractOwner)
        return;
      }

      try {
        const signer = providers.getSigner();
        const votingWithSigner = voting.connect(signer);
        const nonce = await providers.getTransactionCount(account);

        const normalizedCandidateAddress = ethers.utils.getAddress(candidateAddress);

        const tx = await votingWithSigner.addCandidate(normalizedCandidateAddress, candidateName, candidateId, { nonce });
        await tx.wait();

        alert('Candidate added successfully');
        window.location.reload();
      } catch (error) {
        console.error('Error adding candidate:', error);
        alert('Error adding candidate. Please try again.');
      }
    };


    const handleSubmit = async (event) => {
      event.preventDefault();
      const candidateName = candidateNameRef.current.value.trim();
      const candidateAddress = candidateAddressRef.current.value.trim();
      const candidateId = candidateIdRef.current.value.trim();

      if (candidateName) {
        await addCandidate(candidateAddress, candidateName, candidateId);
        candidateNameRef.current.value = '';
        togglePopAdd();
      }
    };


	return (

		<div className="home">
            <div className='home__details'>
                <div className="home__image">

					<div className="pop-up">
						<form onSubmit={handleSubmit}>
						    <div>
                  <input
  					          ref={candidateNameRef}
  					          type="text"
  					          placeholder="Enter candidate name"
  					          required
  						    />
                </div>
						    <div>
						        <input
						          ref={candidateAddressRef}
						          type="text"
						          placeholder="Enter candidate address"
						          required
						        />
					        </div>
                  <div>
                    <input
                      ref={candidateIdRef}
                      type="text"
                      placeholder="Enter candidate ID"
                      required
                    />
                  </div>
					        <div className="cards">
						    	<button className="home__buy" type="submit">Add Candidate</button>
						    </div>
						</form>
					</div>
                </div>

             	<button onClick={togglePopAdd} className="home__close">
                	<img src={close} alt="Close" />
            	</button>
            </div>


		</div>
	);

};
export default Candidate;