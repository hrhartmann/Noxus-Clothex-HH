import React from 'react';
import PropTypes from 'prop-types';

export default function Trade(props) {
    const { origin } = window.location
    const deletePath = `${origin}/trades/${props.id}`
    const getReceiverProfilePath = `${origin}/users/${props.tradeReceiverId}/show`
    const getMakerProfilePath = `${origin}/users/${props.tradeMakerId}/show`
    const acceptTradePath = `${origin}/trades/${props.id}/accepted`
    const rejectTradePath = `${origin}/trades/${props.id}/rejected`
    const goToChatPath = `${origin}/chats${props.chatExist}/${props.id}`
    if (props.currentUserId === props.tradeMakerId || props.currentUserCategory === "Admin"){
        return (
        <div className="tradeBox">
            <div>
                <h5>Publication object:</h5>
                <h4>{props.objectRequestedName}</h4>
                <h5>Object offered:</h5>
                <h4>{props.objectOfferedName}</h4>
                <form action={deletePath} method="POST">
                    <input type="hidden" name="_method" value="delete"/>
                    <input type = "submit" value="Cancel"/>
                </form>
            </div>
            <div>
                <h3>Made to:</h3>
                <a href={getReceiverProfilePath}>{props.tradeReceiverName}</a>
                <h3>Made by:</h3>
                <a href={getMakerProfilePath}>{props.tradeMakerName}</a>
                <hr/>
                <a href={goToChatPath}>Chat</a>
            </div>
        </div>
        );
    } else if (props.currentUserId === props.tradeReceiverId){
        return(
        <div className="tradeBox">
            <div>
                <h5>Publication object:</h5>
                <h4>{props.objectRequestedName}</h4>
                <h5>Object offered:</h5>
                <h4>{props.objectOfferedName}</h4>
                <a href={acceptTradePath}>Accept</a>
                <hr/>
                <a href={rejectTradePath}>Reject</a>
            </div>
            <div>
                <h3>Made to:</h3>
                <a href={getReceiverProfilePath}>{props.tradeReceiverName}</a>
                <h3>Made by:</h3>
                <a href={getMakerProfilePath}>{props.tradeMakerName}</a>
                <hr/>
                <a href={goToChatPath}>Chat</a>
            </div>
        </div>
        )  
    }
}

Trade.propTypes = {
  tradeReceiverName: PropTypes.string.isRequired,
  tradeReceiverId: PropTypes.string.isRequired,
  tradeMakerName: PropTypes.string.isRequired,
  tradeMakerId: PropTypes.string.isRequired,
  objectRequestedName: PropTypes.string.isRequired,
  objectOfferedName: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  userBool: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  currentUserCategory: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  chatExist: PropTypes.string.isRequired,
};