import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import FriendInvitationToggle from "../Friends/FriendInvitationToggle";
import ImageHandler from "../../components/ImageHandler";
import FriendActions from "../../actions/FriendActions";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

export default class FriendInvitationDisplayForList extends Component {
  static propTypes = {
    key: PropTypes.string,
    children: PropTypes.array,  // A list of the tags in FriendDisplayForList when called (e.g. from FriendInvitationList)
    invitationsSentByMe: PropTypes.bool,
    voter_we_vote_id: PropTypes.string,
    voter_photo_url: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    voter_twitter_followers_count: PropTypes.number
  };

  handleIgnore (voter_we_vote_id) {
    FriendActions.ignoreFriendInvite(voter_we_vote_id);
    this.setState({
      friend_invitations_list: this.state.friend_invitations_list.filter( (friend) => {
        return friend.voter_we_vote_id !== voter_we_vote_id;
      })
    });
  }

  render () {
    const {
      twitter_followers_count,
      voter_we_vote_id,
      voter_photo_url,
    } = this.props;

    let voter_display_name = this.props.voter_display_name ? this.props.voter_display_name : "";
    let twitterDescription = this.props.voter_twitter_description ? this.props.voter_twitter_description : "";
    // If the voter_display_name is in the voter_twitter_description, remove it
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(voter_display_name, twitterDescription);

    // TwitterHandle-based link
    var voterGuideLink = this.props.voter_twitter_handle ? "/" + this.props.voter_twitter_handle : "/voterguide/" + voter_we_vote_id;

    return <div className="position-item card-child card-child--not-followed">
      <div className="card-child__avatar">
        <Link to={voterGuideLink} className="no-underline">
          <ImageHandler sizeClassName="icon-lg " imageUrl={voter_photo_url} kind_of_ballot_item="CANDIDATE" />
        </Link>
      </div>
      <div className="card-child__media-object-content">
        <div className="card-child__content">
          <Link to={voterGuideLink}>
            <h4 className="card-child__display-name">{voter_display_name}</h4>
          </Link>
          { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> :
            null}
        </div>
        <div className="card-child__additional">
          <div className="card-child__follow-buttons">
            { this.props.invitationsSentByMe ?
              null :
              <span>
                <FriendInvitationToggle other_voter_we_vote_id={voter_we_vote_id}/>
                < button className="btn btn-default btn-sm"
                  onClick={this.handleIgnore.bind(this, voter_we_vote_id)}>
                  Ignore
                </button>
              </span>
            }
          </div>
          {twitter_followers_count ?
            <span className="twitter-followers__badge">
              <span className="fa fa-twitter twitter-followers__icon" />
              {numberWithCommas(twitter_followers_count)}
            </span> :
            null}
        </div>
      </div>
    </div>;
  }
}
