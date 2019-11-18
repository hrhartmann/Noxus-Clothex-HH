import React from 'react';
import PropTypes from 'prop-types';

export default function Publication(props) {
    const { origin } = window.location
    const deletePath = `${origin}/publications/${props.id}`
    const newfavoritePublicationPath = `${origin}/favoritepublications/${props.id}/newFavoritePublication`
    const editPublicationPath = `${origin}/publications/${props.id}/edit/`
    const getUserProfilePath = `${origin}/users/${props.userId}/show`
    const publicationsShowPath = `${origin}/publications/${props.id}/show`
    if (props.userBool !== "false"){
        return (
            <div className="datos">
                <div className="publicationDiv">
                    <h1>{props.title}</h1>
                    <h3>{props.productName}</h3>
                    <p>{props.description}</p>
                    <div className="publicationPicture">
                        <p>Image</p>
                    </div>
                    <div className="publicationInfo">
                        <a href={getUserProfilePath}>{props.userName}</a>
                        <p>{props.createdAt}</p>
                        <a className='show-pub' href={publicationsShowPath}>Show</a>            
                    </div>
                </div>
            </div>     
        );
    } else {
        if (props.currentUserId === props.userId || props.currentUserCategory === "Admin"){
            return (
            <div className="datos">
                <div className="publicationDiv">
                    <h1>{props.title}</h1>
                    <h3>{props.productName}</h3>
                    <p>{props.description}</p>
                    <div className="publicationPicture">
                        <p>Image</p>
                    </div>
                    <div className="publicationInfo">
                        <a href={getUserProfilePath}>{props.userName}</a>
                        <p>{props.createdAt}</p>
                        <a className='show-pub' href={publicationsShowPath}>Show</a>
                        <a href={newfavoritePublicationPath}>Star</a>
                        <a href={editPublicationPath}>Edit</a>                 
                    </div>
                    <form action={deletePath} method="POST">
                        <input type="hidden" name="_method" value="delete"/>
                        <input type = "submit" value="Delete"/>
                    </form>
                </div>
            </div>    
            );
        } else {
            return(
                <div className="datos">
                    <div className="publicationDiv">
                        <h1>{props.title}</h1>
                        <h3>{props.productName}</h3>
                        <p>{props.description}</p>
                        <div className="publicationPicture">
                            <p>Image</p>
                        </div>
                        <div className="publicationInfo">
                            <a href={getUserProfilePath}>{props.userName}</a>
                            <p>{props.createdAt}</p>
                            <a className='show-pub' href={publicationsShowPath}>Show</a>
                            <a href={newfavoritePublicationPath}>Star</a>                
                        </div>
                    </div>
                </div>
            )  
        }
    }
}

Publication.propTypes = {
  title: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userBool: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  currentUserCategory: PropTypes.string.isRequired,
};