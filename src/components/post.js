import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Components
import MyButton from "../util/myButton";
import DeletePost from "./deletePost";

// Redux
import { connect } from "react-redux";
import dataActions from "../redux/actions/dataActions";

// MUI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
// Icons
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteFilled from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20
  },
  image: {
    minWidth: 200,
    objectFit: "cover"
  },
  content: {
    padding: 25
  }
};

const post = props => {
  dayjs.extend(relativeTime);
  const {
    classes,
    post: {
      userImage,
      body,
      userHandle,
      id,
      createdAt,
      approveCount,
      commentCount
    },
    approves,
    authenticated,
    currentUserHandle,
    toggleApprovePost
  } = props;

  const approvedByUser =
    approves && approves.find(approvement => approvement.postId === id)
      ? true
      : false;

  const toggleApprove = () => {
    toggleApprovePost(id, !approvedByUser);
  };

  const approveButton = !authenticated ? (
    <MyButton tip="Approve">
      <Link to="/login" />
      <FavoriteBorder color="primary" />
    </MyButton>
  ) : approvedByUser ? (
    <MyButton tip="Disapprove post" onClick={toggleApprove}>
      <FavoriteFilled color="primary" />
    </MyButton>
  ) : (
    <MyButton tip="Approve post" onClick={toggleApprove}>
      <FavoriteBorder color="primary" />
    </MyButton>
  );

  const deleteButton =
    authenticated && userHandle === currentUserHandle ? (
      <DeletePost postId={id} />
    ) : null;

  return (
    <Card className={classes.card}>
      <CardMedia
        image={userImage}
        title="Profile image"
        className={classes.image}
      />
      <CardContent className={classes.content}>
        <Typography
          variant="h5"
          component={Link}
          to={`/users/${userHandle}`}
          color="primary"
        >
          {userHandle}
        </Typography>
        {deleteButton}
        <Typography variant="body2" color="textSecondary">
          {dayjs(createdAt).fromNow()}
        </Typography>
        <Typography variant="body1">{body}</Typography>
        {approveButton}
        <span>{approveCount}</span>
        <MyButton tip="Comments">
          <ChatIcon color="primary" />
        </MyButton>
        <span>{commentCount}</span>
      </CardContent>
    </Card>
  );
};

post.propTypes = {
  toggleApprovePost: PropTypes.func.isRequired,
  approves: PropTypes.array.isRequired,
  authenticated: PropTypes.bool.isRequired,
  currentUserHandle: PropTypes.string,
  post: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  approves: state.user.approves,
  authenticated: state.user.authenticated,
  currentUserHandle: state.user.credentials.handle
});

const mapDispatch = {
  toggleApprovePost: dataActions.toggleApprovePost
};

export default connect(mapStateToProps, mapDispatch)(withStyles(styles)(post));
