import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import dataActions from "../../redux/actions/dataActions";

// Components
import MyButton from "../../util/myButton";

// MUI
import FavoriteFilled from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

const approveButton = props => {
  const {
    postId,
    authenticated,
    toggleApprovePost,
    approveCount,
    approves
  } = props;

  const approvedByUser =
    approves && approves.find(approvement => approvement.postId === postId)
      ? true
      : false;

  const approveButton = !authenticated ? (
    <Link to="/login">
      <MyButton tip="Approve">
        <FavoriteBorder color="primary" />
      </MyButton>
    </Link>
  ) : approvedByUser ? (
    <MyButton
      tip="Disapprove post"
      onClick={() => toggleApprovePost(postId, !approvedByUser)}
    >
      <FavoriteFilled color="primary" />
    </MyButton>
  ) : (
    <MyButton
      tip="Approve post"
      onClick={() => toggleApprovePost(postId, !approvedByUser)}
    >
      <FavoriteBorder color="primary" />
    </MyButton>
  );

  return (
    <>
      {approveButton}
      <span>{approveCount}</span>
    </>
  );
};

approveButton.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  postId: PropTypes.string.isRequired,
  toggleApprovePost: PropTypes.func.isRequired,
  approves: PropTypes.array.isRequired,
  approveCount: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  approves: state.user.approves
});

const mapDispatch = {
  toggleApprovePost: dataActions.toggleApprovePost
};

export default connect(mapStateToProps, mapDispatch)(approveButton);
